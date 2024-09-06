import { useCallback } from "react";
import auctionFactoryABI from "src/api/contracts/abi/AuctionFactoryABI.json";
import nftCoreABI from "src/api/contracts/abi/NFTCoreABI.json";
import nft1155ABI from "src/api/contracts/abi/NFT1155.json";
import { addresses } from "src/api/contracts/addresses";
import { encodeAbiParameters, encodeFunctionData } from "viem";
import { useAccount } from "wagmi";
import { check1155Type } from "src/api/contracts/interaction/NFTCoreContract";
import { allSameValue } from "src/utils";

const useTransferNFT = ({ writeContract, data, nftAmount }) => {
  const account = useAccount();

  const transfer721 = useCallback((param, auctionType) => {
    const dataFactory = encodeFunctionData({
      abi: auctionFactoryABI,
      functionName: 'innerCreateAuction',
      args: [auctionType, param]
    });
    writeContract({
      abi: nftCoreABI,
      address: data[0].token_address,
      functionName: 'safeTransferFrom',
      args: [account.address, addresses.AuctionFactory, data[0].token_id, dataFactory]
    });
  }, [writeContract, data, account.address]);

  const transfer1155 = useCallback((param, auctionType) => {
    const listAmount = data.map(d => nftAmount?.[`${d.token_address.toLowerCase()}_${d.token_id}`] ?? d.amount);
    const dataFactory = encodeFunctionData({
      abi: auctionFactoryABI,
      functionName: 'innerCreateAuction',
      args: [auctionType, param]
    });
    writeContract({
      abi: nft1155ABI,
      address: data[0].token_address,
      functionName: 'safeBatchTransferFrom',
      args: [account.address, addresses.AuctionFactory, data.map(d => d.token_id), listAmount, dataFactory]
    });
  }, [account.address, data, nftAmount, writeContract]);

  const transferNFT = useCallback(async (param, auctionType) => {
    if(data.length == 1) {
      // 1NFT
      if(data[0].contract_type == "ERC1155" || data.some(d => parseInt(d.amount) > 1)) {
        transfer1155(param, auctionType);
      } else if(data[0].contract_type == "ERC721") {
        transfer721(param, auctionType);
      } else {
        if(await check1155Type(data[0].token_address)) {
          transfer1155(param, auctionType);
        } else {
          transfer721(param, auctionType);
        }
      }
    } else {
      const isMulti1155SameContract = allSameValue(data, 'token_address');
      if(isMulti1155SameContract) {
        // erc11155 multinft same contract
        transfer1155(param, auctionType);
      } else {
        // Mix type
        const tempData = data.map(d => {
          if(d.contractType == 0) {
            d.amount = "0"
          }
          return d;
        });
        const listAmount = tempData.map(d => nftAmount?.[`${d.token_address.toLowerCase()}_${d.token_id}`] ?? d.amount);
        const _databytes = encodeAbiParameters(
          [
            { type: 'uint8' },
            { type: 'bytes' },
          ],
          [
            auctionType,
            param
          ]
        );
        writeContract({
          abi: auctionFactoryABI,
          address: addresses.AuctionFactory,
          functionName: 'createBulkAuction',
          args: [data.map(d => d.token_address), data.map(d => d.token_id), listAmount, _databytes, true]
        });
      }
    }
    
  }, [data, transfer721, transfer1155, writeContract, nftAmount]);

  return { transferNFT }; 
}

export default useTransferNFT; 