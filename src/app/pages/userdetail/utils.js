import { getImage } from "src/utils";

const getBackupNFTName = ({data}) => {
  const metadata = JSON.parse(data.metadata);
  if(!!metadata && metadata?.name) {
    return metadata.name;
  }
  //TODO: Get từ token_uri nữa là đủ
  return "";
}

const getNFTName = (nft) => {
  if(nft?.name) {
    return nft?.name;
  } else if(nft?.normalized_metadata?.name){
    return nft?.normalized_metadata?.name;
  }
}

const getImgSrc = ({data}) => {
  return {
    type: "nft",
    src: getImage(data?.normalized_metadata?.image)
  }
}

const getBackupNFTImage = async ({data}) => {
  const metadata = JSON.parse(data.metadata);
  if(!!metadata && metadata.image) {
    return {
      type: "bu",
      src: getImage(metadata.image)
    }
  }
  if(!!data.token_uri && data.token_uri.startsWith("http")) {
    const response = await (await fetch(data.token_uri)).json();
    if(response.image) {
      return {
        type: "bu",
        src: getImage(response.image)
      }
    }
  }
  if(!!data.collection_logo) {
    return {
      type: "collection",
      src: getImage(data.collection_logo)
    }
  }
  return {
    type: "nft",
    src: "https://cdn.x2y2.io/frontend/xZ/fHpX8VqL4JmdJf/280.png"
  };
}

export {
  getImgSrc,
  getBackupNFTImage,
  getBackupNFTName,
  getNFTName
}