import axios from "axios";

const getCollectionList = async (
  { first = 50, skip = 0 }
) => {
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/nft/collectionlist`, {
      params: {
        first: first,
        skip: skip
      },
    }
  )).data;
  console.log("getCollectionList::", response);
  for(let i = 0; i < response.length; i++){
    let auctionCount = 0;
    let auctionVol = 0n;
    response[i].auctionStat?.map(a => {
      auctionCount += a.auctionCount;
      auctionVol += a.volume.reduce((sum, item) => sum + BigInt(item.amount), 0n);
    });
    response[i].auctionCount = auctionCount;
    response[i].auctionVol = auctionVol;
  }
  return {
    data: response
  };
}

const getCollectionDetail = async (
  { address }
) => {
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/nft/collectiondetail`, {
      params: {
        address
      },
    }
  )).data;
  console.log("getCollectionDetail::", response);
  const result = response[0];
  const auctionInfo = {};
  for(let i = 0; i < result?.auctionStat?.length ?? 0; i++) {
    const type = Math.floor(result.auctionStat[i].auctionType / 2).toString();
    if(auctionInfo?.[type]?.auctionCount == null) {
      auctionInfo[type] = {};
      auctionInfo[type].auctionCount = 0;
    }
    auctionInfo[type].auctionCount += result.auctionStat[i].auctionCount;
    let auctionVol = 0n;
    if(result.auctionStat[i].volume) auctionVol += result.auctionStat[i].volume.reduce((sum, item) => sum + BigInt(item.amount), 0n);
    if(!auctionInfo?.[type]?.auctionVol) {
      auctionInfo[type].auctionVol = 0n;
    }
    auctionInfo[type].auctionVol += auctionVol;
  }
  return {
    data: {
      ...result,
      auctionInfo,
      description: "The brief introduction has not been filled in yet"
    }
  };
}

const getCollectionNFTs = async ({pageSize = 25, cursor = null, collectionAddress}) => {
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/nft/getnftbycollection`, {
      params: {
        collectionAddress,
        limit: pageSize,
        cursor,
      },
    }
  )).data;
  console.log("getCollectionNFTs::", response);
  return {
    page: response.data.page ?? 1,
    pageSize: pageSize,
    cursor: response.data.cursor,
    data: response.data.result
  };
}

const getNFTDetail = async ({nftaddress, nftId}) => {
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/nft/getnftdetail`, {
      params: {
        nftaddress,
        nftId
      },
    }
  )).data;
  console.log("getNFTDetail::", response);
  return response.data;
}

const getNFTDetailAuctionHistory = async ({nftaddress, nftId, first = 10, skip = 0}) => {
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/nft/getnftauctionhistory`, {
      params: {
        nftaddress,
        nftId,
        first,
        skip
      },
    }
  )).data;
  console.log("getNFTDetailAuctionHistory::", response);
  return {
    data: response.data,
    skip: skip + first,
    first: first,
  }
}

const getNFTDetailTransfer = async ({nftaddress, nftId, cursor = null, pageSize = 10}) => {
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/nft/getnftdetailtransfer`, {
      params: {
        nftaddress,
        nftId,
        cursor,
        limit: pageSize
      },
    }
  )).data;
  console.log("getNFTDetailTransfer::", response);
  return {
    data: response.data,
    cursor: response.data.cursor,
    first: pageSize,
  }
}

const getNFTDetailTrades = async ({collectionAddress, nftId, first = 10, skip = 0}) => {
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/nft/getnftdetailtrade`, {
      params: {
        collectionAddress,
        nftId,
        first,
        skip
      },
    }
  )).data;
  console.log("getNFTDetailTrades::", response);
  return {
    data: response,
    skip: skip + first,
    first: first,
  }
}

const getNFTOwners = async ({collectionAddress, nftId, first = 10, cursor = null}) => {
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/nft/getnftdetailowners`, {
      params: {
        collectionAddress,
        nftId,
        cursor,
        limit: first
      },
    }
  )).data;
  console.log("getNFTOwners::", response);
  let result = [];
  for (const key in response.data) {
    if (response.data.hasOwnProperty(key)) {
      result.push(response.data[key]);
    }
  }
  return {
    data: result,
    cursor: response.cursor,
    first: first,
  }
}

const search = async ({searchTerms}) => {
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/nft/search`, {
      params: {
        search: searchTerms
      },
    }
  )).data;
  console.log("search::", response);
  return {
    data: response
  }
}

const resyncMetadata = async ({collectionAddress}) => {
  const response = (await axios.post(
    `${import.meta.env.VITE_API_SERVER}/v1/nft/resyncmetadata`, {
      address: collectionAddress
    }
  )).data;
  console.log("resyncMetadata::", response);
  return {
    data: response
  }
}

const postNFTHeart = async ({collectionAddress, userAddress, nftId, heart}) => {
  const response = (await axios.post(
    `${import.meta.env.VITE_API_SERVER}/v1/nft/heart`, {
      collectionAddress, userAddress, nftId, heart
    }
  )).data;
  console.log("postNFTHeart::", response);
  return response
}

const checkNFTHeart = async ({collectionAddress, userAddress, nftId}) => {
  if(!userAddress) return false;
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/nft/heart`, {
      params: {
        collectionAddress, userAddress, nftId
      }
    }
  )).data;
  console.log("checkNFTHeart::", response);
  return response;
}

export {
  getCollectionList,
  getCollectionDetail,
  getCollectionNFTs,
  getNFTDetail,
  getNFTDetailAuctionHistory,
  getNFTDetailTransfer,
  getNFTDetailTrades,
  getNFTOwners,
  search,
  resyncMetadata,
  postNFTHeart,
  checkNFTHeart
}