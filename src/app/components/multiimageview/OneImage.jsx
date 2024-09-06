import React from "react";

const OneImage = ({src, ...props}) => {
  // const [image, setImage] = useState(src);
  return (
    <img 
      width={"100%"}
      height="100%"
      src={src}
      style={{
        objectFit: 'cover',
        aspectRatio: "1/1",
        backgroundColor: "#777e90",
        ...props
      }}
      loading="lazy"
      // onError={() => setImage("/default.png")}
    />
  )
}

export default OneImage;