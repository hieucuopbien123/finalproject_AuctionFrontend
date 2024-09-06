import { config } from '../callconfig';
import { readContract } from '@wagmi/core';

import sealedBidAuctionV1ABI from "src/api/contracts/abi/SealedBidAuctionV1BaseABI.json";

const getBidAddress = async ({auctionAddress, bidder, bid, subSalt}) => {
  const data = await readContract(config, {
    address: auctionAddress,
    abi: sealedBidAuctionV1ABI,
    functionName: 'getBidDepositAddr',
    args: [bidder, bid, subSalt]
  });
  return {
    address: data[1],
    salt: data[0],
  }
}

export {
  getBidAddress
}

