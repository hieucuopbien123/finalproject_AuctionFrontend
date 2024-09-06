import { multicall } from '@wagmi/core';
import { config } from '../callconfig';

import auctionFactoryABI from "src/api/contracts/abi/AuctionFactoryABI.json";
import { addresses } from '../addresses';
const AuctionFactoryContract = {
  address: addresses.AuctionFactory,
  abi: auctionFactoryABI
}

const getAuctionConfig = async () => {
  const auctionConfig = await multicall(config, {
    batchSize: 1_024, 
    contracts: [
      {
        ...AuctionFactoryContract,
        functionName: 'vickreyAdminParams',
        args: []
      },
      {
        ...AuctionFactoryContract,
        functionName: 'englishAdminParams',
        args: []
      },
    ]
  });
  return {
    vickreyAdminParams: {
      mininumBidDuration: parseInt(auctionConfig?.[0]?.result?.[0] ?? 0),
      minimumRevealDuration: parseInt(auctionConfig?.[0]?.result?.[1] ?? 0),
      VICKREY_UTILITIES: auctionConfig?.[0]?.result?.[2] ?? "0x0000000000000000000000000000000000000000"
    }, 
    englishAdminParams: {
      minimumRemainingTime: parseInt(auctionConfig?.[1]?.result?.[0] ?? 0),
      feePercent: parseInt(auctionConfig?.[1]?.result?.[1] ?? 0)/100,
      bidStepPercent: parseInt(auctionConfig?.[1]?.result?.[2] ?? 0)/100,
    }
  };
}

export {
  getAuctionConfig
}
