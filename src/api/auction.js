import axios from "axios";
import { isValidParams, sleep } from "src/utils";
import { formatEther } from "viem";
import { getBiddedAmount } from "./contracts/interaction/VickreyAuctionBase";

const getAuctionDetail = (detail) => {
  if(detail.nftInfo) {
    for(let i = 0; i < detail.nftInfo.length; i++){
      if(detail.nftInfo[i].nftCount == "0") {
        detail.nftInfo[i].nftCount = "1"
      }
    }
  }
  if(detail.auctionType == "0") {
    return {
      highestBid: BigInt(detail.currentBid),
      highestBidder: detail.currentBidder,
      auctionAddress: detail.id,
      paymentToken: detail.paymentToken,
      startTime: parseInt(detail.startTime),
      endTime: parseInt(detail.endTime),
      auctionCreator: detail.auctionCreator.id,
      startingPrice: BigInt(detail.startingPrice),
      auctionType: detail.auctionType,
      nftInfo: detail.nftInfo,
      status: detail.status,
      bidStep: detail.bidStep,
      heartNum: detail.heartNum
    };
  } else if(detail.auctionType == "1") {
    return {
      auctionCreator: detail.auctionCreator.id,
      startingPrice: BigInt(detail.startingPrice),
      startTime: parseInt(detail.startTime),
      endTime: parseInt(detail.endTime),
      revealDuration: parseInt(detail.stepDuration),
      topBidder: detail.currentBidder,
      topBid: BigInt(detail.currentBid),
      sndBid: BigInt(detail.sndBid),
      auctionAddress: detail.id,
      bidCount: detail.bidCount?.count ?? 0,
      auctionType: detail.auctionType,
      nftInfo: detail.nftInfo,
      status: detail.status,
      heartNum: detail.heartNum
    }
  } else if(detail.auctionType == "2") {
    return {
      auctionCreator: detail.auctionCreator.id,
      startingPrice: BigInt(detail.startingPrice),
      minimumPrice: BigInt(detail.minimumPrice),
      numberOfStep: detail.bidStep,
      stepDuration: detail.stepDuration,
      paymentToken: detail.paymentToken,
      auctionAddress: detail.id,
      startTime: parseInt(detail.startTime),
      auctionType: detail.auctionType,
      nftInfo: detail.nftInfo,
      timestamp: detail.timestamp,
      status: detail.status,
      heartNum: detail.heartNum
    }
  } else if(detail.auctionType == "3") {
    return {
      auctionCreator: detail.auctionCreator.id,
      startingPrice: BigInt(detail.startingPrice),
      startTime: parseInt(detail.startTime),
      endTime: parseInt(detail.endTime),
      revealDuration: parseInt(detail.stepDuration),
      topBidder: detail.currentBidder,
      topBid: BigInt(detail.currentBid),
      sndBid: BigInt(detail.sndBid),
      auctionAddress: detail.id,
      bidCount: detail.bidCount?.count ?? 0,
      auctionType: detail.auctionType,
      nftInfo: detail.nftInfo,
      status: detail.status,
      heartNum: detail.heartNum
    }
  } else if(detail.auctionType == "4") {
    return {
      auctionCreator: detail.auctionCreator.id,
      startingPrice: BigInt(detail.startingPrice),
      startTime: parseInt(detail.startTime),
      endTime: parseInt(detail.endTime),
      revealDuration: parseInt(detail.stepDuration),
      topBidder: detail.currentBidder,
      topBid: BigInt(detail.currentBid),
      auctionAddress: detail.id,
      auctionType: detail.auctionType,
      nftInfo: detail.nftInfo,
      paymentToken: detail.paymentToken,
      bidStep: detail.bidStep,
      revealStep: detail.revealStep,
      status: detail.status,
      heartNum: detail.heartNum
    }
  }
}

const getAuctions = async (
  { auctionType, first = 50, skip = 0, orderBy = "timestamp", orderDirection = "desc", userAddress, collectionAddresses, searchTerms = "", status }
) => {
  let response = [];
  if(isValidParams(searchTerms)) {
    response = (await axios.get(
      `${import.meta.env.VITE_API_SERVER}/v1/auction/ongoing`, {
        params: {
          auctionType,
          first: first,
          skip: skip,
          orderBy: orderBy,
          orderDirection: orderDirection,
          userAddress,
          collectionAddresses,
          searchTerms,
          status
        },
      }
    )).data;
  }
  console.log("getAuctions::", response);
  return {
    data: response?.map(r => getAuctionDetail(r)),
    skip: skip + first,
    first: first,
  }
}

const getOneAuction = async ({ auctionAddress }) => {
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/auction/oneauction`, {
      params: {
        auctionAddress
      },
    }
  )).data;
  console.log("getOneAuction::", response);
  return getAuctionDetail(response);
}

const getBiddedAuction = async ({ 
  auctionType, first = 50, skip = 0, orderBy = "timestamp", orderDirection = "desc", 
  userAddress, collectionAddress, searchTerms = "", status
}) => {
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/auction/bidded`, {
      params: {
        auctionType,
        first: first,
        skip: skip,
        orderBy: orderBy,
        orderDirection: orderDirection,
        userAddress,
        collectionAddress,
        searchTerms,
        status
      },
    }
  )).data;
  console.log("getBiddedAuction::", response);

  return {
    data: response?.map(r => getAuctionDetail(r)),
    skip: skip + first,
    first: first,
  }
}

const getAuctionCollections = async (
  { auctionType, first = 50, skip = 0 }
) => {
  let processedAuctionType;
  if(processedAuctionType < 100) {
    processedAuctionType == auctionType;
  }
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/auction/auctioncollection`, {
      params: {
        auctionType: processedAuctionType,
        first,
        skip
      },
    }
  )).data;
  console.log("getAuctionCollections::", response);
  return {
    data: response,
    skip: skip + first,
    first
  };
}

const getAuctionsStats = async ({ auctionType }) => {
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/auction/stats`, {
      params: {
        auctionType: auctionType
      },
    }
  )).data;
  console.log("getAuctionsStats::", response);
  let auctionVols = 0;
  if(!!response?.volume) {
    auctionVols = response?.volume.reduce((acc, cur) => acc + BigInt(cur.amount), 0n).toString();
  }
  return {
    data: {
      ...response,
      auctionVols: formatEther(auctionVols),
    }
  };
}

const getAuctionCreators = async (
  { auctionType, first = 50, skip = 0 }
) => {
  let processedAuctionType;
  if(processedAuctionType < 100) {
    processedAuctionType == auctionType;
  }
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/auction/auctioncreator`, {
      params: {
        auctionType: processedAuctionType,
        first: first,
        skip: skip
      },
    }
  )).data;
  console.log("getAuctionCreators::", response);
  return {
    data: response,
    skip: skip + first,
    first: first
  };
}

const updateBidAuction = async ({ userAddress, auctionAddress, auctionType, sig }) => {
  const response = (await axios.post(
    `${import.meta.env.VITE_API_SERVER}/v1/auction/bidauction`, {
      userAddress, auctionAddress, auctionType, sig
    }
  ));
  console.log("updateBidAuction::", response);
  return response;
}

const getOneAuctionTrades = async ({auctionAddress, first = 10, skip = 0}) => {
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/auction/oneauctiontrade`, {
      params: {
        auctionAddress,
        first,
        skip
      },
    }
  )).data;
  console.log("getoneAuctionTrades::", response);
  return {
    data: response,
    skip: skip + first,
    first
  };
}

const getProofs = async ({auctionAddress}) => {
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/auction/batchProof`, {
      params: {
        auctionAddress
      },
    }
  )).data;
  console.log("getProofs::", response);

  let finalRes = [];
  try{
    for(let i = 0; i < response.length; i++){
      await sleep(1000); // Prevent etherscan ratelimit free tier
      const ele = response[i].proof.trim().split("_");
      if(ele.length != 4) {
        continue;
      }
      const bidder = ele[1];
      const bid = ele[2];
      const salt = ele[3];
      if(!bidder || !salt || !bid){
        continue;
      }
      const create2Address = response[i].create2Address;
      const tx = (await axios.get(`https://api-sepolia.etherscan.io/api?module=account&action=txlistinternal&address=${create2Address}&startblock=0&endblock=99999999&page=1&offset=0&sort=des&apikey=${import.meta.env.VITE_ETHERSCAN_APIKEY}`)).data;
      if(tx.result.find(r => r.from.toLowerCase() == auctionAddress.toLowerCase() || r.to.toLowerCase() == auctionAddress.toLowerCase())) {
        try{
          await axios.delete(`${import.meta.env.VITE_API_SERVER}/v1/auction/batchProof`, {
            data: { id: response[i]._id }
          });
        }catch (e) {
          console.log(e.message);
        }
        continue;
      }
      const biddedAmount = await getBiddedAmount({create2Address: create2Address, auctionAddress: auctionAddress, _bid: bid});
      finalRes.push({
        biddedAmount,
        userAddress: bidder,
        proof: response[i].proof,
        id: response[i]._id
      });
    }
  } catch(ex) {
    console.log(ex);
  }
  return finalRes;
}

const postProofs = async ({proof}) => {
  const response = (await axios.post(
    `${import.meta.env.VITE_API_SERVER}/v1/auction/batchProof`, {
      proof
    }
  ));
  console.log("postProofs::", response);
  return response;
}

const postAuctionHeart = async ({auctionAddress, userAddress, heart}) => {
  const response = (await axios.post(
    `${import.meta.env.VITE_API_SERVER}/v1/auction/heart`, {
      auctionAddress, userAddress, heart
    }
  )).data;
  console.log("postAuctionHeart::", response);
  return response
}

const checkAuctionHeart = async ({auctionAddress, userAddress}) => {
  if(!userAddress) return false;
  const response = (await axios.get(
    `${import.meta.env.VITE_API_SERVER}/v1/auction/heart`, {
      params: {
        auctionAddress, userAddress
      }
    }
  )).data;
  console.log("checkAuctionHeart::", response);
  return response;
}

export {
  getAuctions,
  getAuctionsStats,
  getAuctionCollections,
  getAuctionCreators,
  updateBidAuction,
  getBiddedAuction,
  getOneAuction,
  getOneAuctionTrades,
  getProofs,
  postProofs,
  postAuctionHeart,
  checkAuctionHeart
}