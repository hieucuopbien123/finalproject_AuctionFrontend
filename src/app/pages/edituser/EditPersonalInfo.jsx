import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import React from "react";
import RoundImage from "src/app/components/roundimage";
import { RiGlobalLine } from "react-icons/ri";
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { useRef } from "react";
import { useState } from "react";
import { editUser } from "src/api/user";
import { useAccount } from "wagmi";
import { walletClient } from "src/api/contracts/callconfig";
import { useEffect } from "react";
import useUserBasicInfo from "src/hooks/reactquery/useUserBasicInfo";
import { FailToLoad } from "src/app/components/error";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EditPersonalInfo = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const account = useAccount();
  const [preview, setPreview] = useState("");
  const [avatarSending, setAvatarSending] = useState(null);
  const [username, setUsername] = useState(null);
  const [description, setDescription] = useState(null);
  const [web, setWeb] = useState(null);
  const [x, setX] = useState(null);
  const [discord, setDiscord] = useState(null);
  const [tele, setTele] = useState(null);
  const [insta, setInsta] = useState(null);
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useUserBasicInfo({userAddress: account.address});

  useEffect(() => {
    if(data) {
      if(data?.imageurl) {
        setPreview(`${import.meta.env.VITE_API_SERVER}/uploads/${data?.imageurl}`);
      }
      setUsername(data.username);
      setDescription(data.description);
      setWeb(data.website);
      setX(data.twitter);
      setDiscord(data.discord);
      setTele(data.tele);
      setInsta(data.insta);
    }
  }, [data]);

  if(isError) {
    return <FailToLoad size="3rem" className="fontSmallSize" title={`Error: ${error.message}`}/>
  }
  if(isLoading) {
    return (
      <>
        Loading...
      </>
    )
  }
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file));
      setAvatarSending(event.target.files[0]);
    }
  };
  const submit = async () => {
    if(account.address){
      const sig = await walletClient.signMessage({ 
        account,
        message: `Confirm edit user info`,
      });
      await editUser({username, sig, description, avatar: avatarSending, web, x, discord, tele, insta});
      toast.success("Update user info successfully!!");
      queryClient.invalidateQueries({ queryKey: ["user", account.address] });
    }
  }
  return (
    <>
      <Box>
        <Typography fontFamily={"Poppins"} fontWeight="bold" className="fontSuperSize">Edit Personal Information</Typography>
        <Box py={1}/>
        <Box>
          <Typography fontWeight="bold">Profile picture</Typography>
          <Typography fontFamily={"Poppins"} sx={{opacity: 0.7}} className="fontSmallSize" fontWeight="light">{account?.address}</Typography>
          <Box py={1}/>
          <Box display="flex" gap="30px">
            <RoundImage url={preview}/>
            <Box display="flex" flexDirection="column" gap="20px" alignItems="flex-end">
              <Typography maxWidth="270px">Support PNG、JPG、GIF、AVIF,  400 x 400 recommended, max size 1M</Typography>
              <Button variant="contained" sx={{px: 5}} onClick={handleButtonClick}>Select file</Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box py={2}/>
      <Box>
        <Typography fontWeight={"bold"}>User Name</Typography>
        <Box pt={0.5}/>
        <TextField size="small" fullWidth onChange={(e) => setUsername(e.target.value)} value={username}/>
      </Box>
      <Box py={2}/>
      <Box>
        <Typography fontWeight={"bold"}>Description</Typography>
        <Box pt={0.5}/>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Box>
      <Box py={2}/>
      <Box>
        <Typography fontWeight={"bold"}>Add Links</Typography>
        <Box pt={0.5}/>
        <Box sx={{border: "1px solid #494949", borderTopRightRadius: "10px", borderBottom: "none", borderTopLeftRadius: "10px"}}>
          <TextField size="small" fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">
                <Box pr={0.5} display="flex">
                  <RiGlobalLine className="bigTextSize"/>
                </Box>
              </InputAdornment>,
            }}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent !important"
              }
            }}
            placeholder="Your website"
            value={web}
            onChange={(e) => setWeb(e.target.value)}
          />
        </Box>
        <Box sx={{border: "1px solid #494949", borderBottom: "none"}}>
          <TextField size="small" fullWidth
            InputProps={{
              startAdornment: <InputAdornment sx={{mr: 1}} position="start">
                <Box pr={0.5} display="flex">
                  <FaXTwitter className="bigTextSize"/>
                </Box>
              </InputAdornment>,
            }}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent !important"
              }
            }}
            placeholder="https://x.com/"
            value={`https://x.com/${x ? x : ""}`}
            onChange={(e) => setX(e.target.value.substring(14))}
          />
        </Box>
        <Box sx={{border: "1px solid #494949", borderBottom: "none"}}>
          <TextField size="small" fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">
                <Box pr={0.5} display="flex">
                  <FaDiscord className="bigTextSize"/>
                </Box>
              </InputAdornment>,
            }}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent !important"
              }
            }}
            placeholder="https://discord.gg/"
            value={`https://discord.gg/${discord ? discord : ""}`}
            onChange={(e) => setDiscord(e.target.value.substring(19))}
          />
        </Box>
        <Box sx={{border: "1px solid #494949", borderBottom: "none"}}>
          <TextField size="small" fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">
                <Box pr={0.5} display="flex">
                  <FaTelegramPlane className="bigTextSize"/>
                </Box>
              </InputAdornment>,
            }}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent !important"
              }
            }}
            placeholder="https://t.me/"
            value={`https://t.me/${tele ? tele : ""}`}
            onChange={(e) => setTele(e.target.value.substring(13))}
          />
        </Box>
        <Box sx={{border: "1px solid #494949", borderBottomRightRadius: "10px", borderBottomLeftRadius: "10px"}}>
          <TextField size="small" fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">
                <Box pr={0.5} display="flex">
                  <FaInstagram className="bigTextSize"/>
                </Box>
              </InputAdornment>,
            }}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent !important"
              }
            }}
            placeholder="https://www.instagram.com/"
            value={`https://www.instagram.com/${insta ? insta : ""}`}
            onChange={(e) => setInsta(e.target.value.substring(26))}
          />
        </Box>
      </Box>
      <Box py={1}></Box>
      <Box display="flex" gap="10px">
        <Button variant="contained" size="large" sx={{fontWeight: "bold"}} onClick={submit}>Submit changes</Button>
        <Button variant="outlined" size="large" onClick={() => {
          if(account.address) {
            navigate(`/userdetail/${account.address}`);
          }
        }}>Go to profiles</Button>
      </Box>
    </>
  )
}

export default EditPersonalInfo;