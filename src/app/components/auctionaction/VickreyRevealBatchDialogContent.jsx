import { Box, Button, Checkbox, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import React from "react";
import useAuctionProof from "src/hooks/reactquery/useAuctionProof";
import { Empty } from "../empty";
import { FailToLoad } from "../error";
import { useState } from "react";
import { useRef } from "react";
import { postProofs } from "src/api/auction";
import { useQueryClient } from "@tanstack/react-query";
import { getTokenName } from "src/api/contracts";
import { formatEther, keccak256 } from "viem";
import { formatAddress } from "src/utils";
import vickreyAuctionBaseABI from "src/api/contracts/abi/VickreyAuctionBaseABI.json";
import { toUtf8Bytes } from "ethers";
import { getProof } from "src/api/contracts/interaction/VickreyAuctionBase";
import { useAccount, useChainId } from "wagmi";
import toast from "react-hot-toast";
import CustomTooltip from "../tooltip";
import { useNavigate } from "react-router-dom";
import { GetProof } from "lib-auction";

function sortArrayByFieldDescending(arr, field) {
  return arr.sort((a, b) => b[field] - a[field]);
}

const VickreyRevealBatchDialogContent = ({data, writeContract, isLoadingX}) => {
  const chainId = useChainId();
  const account = useAccount();
  const [selected, setSelected] = React.useState([]);
  const { data: proofData, isError, isLoading, error, isRefetching } = useAuctionProof({auctionAddress: data.auctionAddress});
  const [proof, setProof] = useState("");
  const navigate = useNavigate();
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);
  const queryClient = useQueryClient();
  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const fileInputRef = useRef(null);
  const handleLoadFile = () => {
    fileInputRef.current.click();
  };
  const getFile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setProof(e.target.result);
    };
    reader.readAsText(file);
    event.target.value = null;
  }

  const postProof = async () => {
    try{
      setIsLoading2(true);
      const ele = proof.trim().split("_");
      if(ele.length != 4) {
        throw new Error("Wrong proof");
      }
      const auctionAddress = ele[0];
      const bidder = ele[1];
      const bid = ele[2];
      const salt = ele[3];
      if(ele.length != 4) {
        throw new Error("Wrong proof");
      }
      if(!bidder || !salt || !bid){
        throw new Error("Wrong input");
      }
      await postProofs({proof});
      queryClient.invalidateQueries({queryKey: ["auctionProof", auctionAddress]});
    } catch(e) {
      toast.error("Error::" + e?.response?.data?.error?.slice(0, 50));
    } finally {
      setIsLoading2(false);
    }
  }

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const revealBatch = async () => {
    let allProof = [];

    setIsLoading3(true);
    try{
      for(let i = 0; i < selected.length; i++) {
        const currentProof = proofData.find(item => item["id"].toLowerCase() == selected[i].toLowerCase());
        if(currentProof) {
          const ele = currentProof.proof.trim().split("_");
          if(ele.length != 4) {
            toast.error("Wrong proof");
            return;
          }
          const auctionAddress = ele[0];
          const bidder = ele[1];
          const bid = ele[2];
          const salt = ele[3];
          if(ele.length != 4) {
            toast.error("Wrong proof");
            return;
          }
          if(!bidder || !salt || !bid){
            toast.error("Wrong input");
            return;
          }
          if(auctionAddress != data.auctionAddress) {
            toast.error("This proof is not for this auction");
            return;
          }
          const subSalt = keccak256(toUtf8Bytes(salt));
          allProof.push({
            bidder,
            bid,
            subSalt,
            biddedAmount: currentProof.biddedAmount
          })
        }
      }
      allProof = sortArrayByFieldDescending(allProof, 'biddedAmount');
      if(data.topBidder == "0x0000000000000000000000000000000000000000") {
        let getProof = new GetProof();
        writeContract({
          abi: vickreyAuctionBaseABI,
          address: data.auctionAddress,
          functionName: 'revealBatch',
          args: [allProof.map(a => a.bidder), allProof.map(a => a.bid), allProof.map(a => a.subSalt), 0, getProof.emptyProof(), {
            expectedRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
            key: "0x00",
            proof: ["0x00"],
            keyIndex: 0,
            proofIndex: 0,
            expectedValue: "0x00"
          }]
        });
      } else {
        const proof = await getProof({bidder: allProof[0].bidder, bid: allProof[0].bid, subSalt: allProof[0].subSalt, chainId, auctionAddress: data.auctionAddress});
        writeContract({
          abi: vickreyAuctionBaseABI,
          address: data.auctionAddress,
          functionName: 'revealBatch',
          args: [allProof.map(a => a.bidder), allProof.map(a => a.bid), allProof.map(a => a.subSalt), proof.balance, proof.header, proof.accountProof]
        });
      }
    } catch (e) {
      toast.error(e?.message?.slice(0, 50));
    } finally {
      setIsLoading3(false);
    }
  }

  if(isError) {
    return <FailToLoad size="3rem" className="fontSmallSize" title={`Error: ${error.message}`}/>
  }

  return (
    <>
      <Box>
        {
          (isLoading || isRefetching) ? 
              <Box style={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "250px"}} py={4}>
                <div className="smallloading"></div>
              </Box>
            : 
          ((proofData?.length ?? 0) <= 0) ? 
          <Box>
            <Empty title={"There is no proof posted!"}/>
          </Box> : (
            <>
              <TableContainer component={Paper} sx={{height: "250px"}}>
                <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>User address</TableCell>
                      <TableCell align="right">Bidded amount</TableCell>
                      <TableCell align="right">Proof</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {
                    proofData.map((row) => {
                      const isItemSelected = isSelected(row.id);
                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row.id)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                          sx={{ cursor: "pointer", '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell>
                            <Checkbox size="small"
                              color="primary"
                              checked={isItemSelected}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <CustomTooltip text={row.userAddress}>
                              <Box onClick={() => {
                                if(row.userAddress && row.userAddress != "0x0000000000000000000000000000000000000000")
                                  navigate(`/userdetail/${row.userAddress}`)
                              }} sx={{cursor: "pointer"}}>
                                {row.userAddress.toLowerCase() == account?.address?.toLowerCase() ? "You" : formatAddress(row.userAddress, 3)}
                              </Box>
                            </CustomTooltip>
                          </TableCell>
                          <TableCell align="right">{formatEther(row.biddedAmount.toString())} {getTokenName("0x0000000000000000000000000000000000000000").symbol}</TableCell>
                          <TableCell align="right">{formatAddress(row.proof, 9)}</TableCell>
                        </TableRow>
                      )
                    })
                  }
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )
        }
        <Box py={1}/>
        <Box display="flex" gap="10px">
          <TextField
            id="outlined-multiline-static"
            label="Proof"
            multiline
            sx={{flexGrow: 1}}
            rows={4}
            value={proof}
            onChange={(e) => setProof(e.target.value)}
          />
          <Box display={"flex"} flexDirection={"column"} justifyContent={"space-between"}>  
            <Box>
              <Button variant="outlined" onClick={handleLoadFile} size="small" className="fontNomSize" fullWidth>
                Upload File
              </Button>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={getFile} />
            </Box>
            <Box display={"flex"} gap="20px" alignItems={"center"} minWidth="129px">
              <Button className="fontNomSize" variant="contained" fontFamily="Poppins" 
                onClick={() => postProof()} disabled={isLoadingX || isLoading2 || !proof.trim()} fullWidth size="small"
              >
                {isLoading2 ? <CircularProgress style={{color: "#9e9fa6"}} size={"25px"}/> : "Post this proof" }
              </Button>
            </Box>
            <Box display={"flex"} gap="20px" alignItems={"center"}>
              <Button variant="contained" fontFamily="Poppins" size="small" className="fontNomSize"
                onClick={() => revealBatch()} fullWidth disabled={isLoading3 || isLoadingX || selected.length <= 0}
              >
                {(isLoading3 || isLoadingX) ? <CircularProgress style={{color: "#9e9fa6"}} size={"25px"}/> : (
                  "Reveal batch"
                ) }
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default VickreyRevealBatchDialogContent;