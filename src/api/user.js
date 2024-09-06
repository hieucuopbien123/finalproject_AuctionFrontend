import axios from "axios"
import { formatEther } from "viem";

// Development test in ngrok: axios.defaults.headers.common["ngrok-skip-browser-warning"] = 69420;

const getUserInfo = async ({ userAddress }) => {
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/user`, {
      params: {
        address: userAddress
      },
    }
  )).data;
  console.log("getUserInfo::", response);
  let userAuctionStats = {
    biddedVolume: 0,
    biddedTime: 0,
    createdAuction: 0,
    createdAuctionVolume: 0,
  };
  let biddedVols = [];
  let createdVols = [];
  if(!!response.data.stats) {
    for(let i = 0; i < response.data.stats.length; i++) {
      const stat = response.data.stats[i];
      if(stat.statType == "1"){
        userAuctionStats.biddedTime += stat.auctionCount;
        biddedVols = biddedVols.concat(stat.volume);
      } else if(stat.statType == "2"){
        userAuctionStats.createdAuction += stat.auctionCount;
        createdVols = createdVols.concat(stat.volume);
      }
    }
  }
  // Test: No API to get price for Sepolia, let every token = 1 USD
  let paymentToken = biddedVols.concat(createdVols).filter((item, index, self) => self.indexOf(item) === index);
  userAuctionStats.biddedVolume = formatEther(biddedVols.reduce((acc, cur) => acc + BigInt(cur.amount), 0n).toString());
  userAuctionStats.createdAuctionVolume = formatEther(createdVols.reduce((acc, cur) => acc + BigInt(cur.amount), 0n).toString());

  const processedData = {
    username: response.data.username,
    imageurl: response.data.imageurl,
    description: response.data.description,
    isKyced: response.data.isKyced ?? false,
    website: response.data.website,
    ownedNFTs: response.data.nfts ?? 0,
    ownedCollection: response.data.collections ?? 0,
    biddedCollectionCount: response.data.biddedCollectionCount ?? 0,
    ownedCollectionCount: response.data.ownedCollectionCount ?? 0,
    discord: response.data.discord,
    tele: response.data.tele,
    insta: response.data.insta,
    twitter: response.data.twitter,
    ...userAuctionStats,
  }
  return processedData;
}

const getUserNFTs = async ({ userAddress, pageSize = 25, cursor = null, collectionAddress }) => {
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/user/usernfts`, {
      params: {
        address: userAddress,
        limit: pageSize,
        cursor,
        collections: collectionAddress?.map(c => c?.address)?.join(",")
      },
    }
  )).data;
  console.log("getUserNFTs::", response);
  return {
    page: response.data.page ?? 1,
    pageSize: pageSize,
    cursor: response.data.cursor,
    data: response.data.result
  };
}

const editUser = async ({ username, sig, description, avatar, web, x, discord, tele, insta }) => {
  const uploadData = new FormData();
  uploadData.append("image", avatar);
  uploadData.append("username", username);
  uploadData.append("description", description);
  uploadData.append("web", web);
  uploadData.append("x", x);
  uploadData.append("discord", discord);
  uploadData.append("tele", tele);
  uploadData.append("insta", insta);
  uploadData.append("sig", sig);
  const response = (await axios.post(
    `${import.meta.env.VITE_API_SERVER}/v1/user`, uploadData
  ));
  console.log("editUser::", response);
  return {};
}

const getUserCollections = async ({ userAddress, pageSize = 20, cursor = null }) => {
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/user/usercollections`, {
      params: {
        address: userAddress,
        limit: pageSize,
        cursor
      },
    }
  )).data;
  console.log("getUserCollections::", response);
  return {
    page: response.data.page ?? 1,
    pageSize: pageSize,
    cursor: response.data.cursor,
    data: response.data.result
  };
}

const getUserOwnedCollections = async ({ userAddress, first = 20, skip = 0 }) => {
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/user/userownedauctioncollections`, {
      params: {
        userAddress,
        first,
        skip
      },
    }
  )).data;
  console.log("getUserOwnedCollections::", response);
  return {
    data: response,
    skip: skip + first,
    first
  };
}

const getUserBiddedCollections = async ({ userAddress, first = 50, skip = 0 }) => {
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/user/userbiddedauctioncollections`, {
      params: {
        userAddress,
        first,
        skip
      },
    }
  )).data;
  console.log("getUserBiddedCollections::", response);
  return {
    data: response,
    skip: skip + first,
    first
  };
}

const getUserActivities = async ({ userAddress, first = 20, skip = 0 }) => {
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/user/useractivities`, {
      params: {
        userAddress,
        first,
        skip
      },
    }
  )).data;
  console.log("getUserActivities::", response);
  return {
    data: response,
    skip: skip + first,
    first
  };
}

export {
  getUserInfo,
  getUserCollections,
  getUserNFTs,
  getUserOwnedCollections,
  getUserBiddedCollections,
  getUserActivities,
  editUser
}