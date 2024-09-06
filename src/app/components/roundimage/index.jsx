import { Box } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";

const RoundImage = ({url}) => {
  const [image, setImage] = useState(url);
  useEffect(() => {
    setImage(url);
  }, [url]);
  return (
    <Box sx={{
      maxWidth: "128px",
      aspectRatio: "1/1",
      minWidth: "96px",
      width: "25%"
    }}>
      <img
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "50%",
        }}
        src={image || "https://storage.nfte.ai/asset/avatar/bg25.png?x-oss-process=image/resize,m_fill,w_300,h_300"}
        onError={() => setImage("https://storage.nfte.ai/asset/avatar/bg25.png?x-oss-process=image/resize,m_fill,w_300,h_300")}
      />
    </Box>
  )
}

export default RoundImage;