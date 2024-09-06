import { config } from '../callconfig';
import { readContract } from '@wagmi/core';
import nft1155ABI from "src/api/contracts/abi/NFT1155.json";

const getApprovedForAll1155 = async ({ nftAddress, ownerAddress, targetAddress }) => {
  const data = await readContract(config, {
    address: nftAddress,
    abi: nft1155ABI,
    functionName: 'isApprovedForAll',
    args: [ownerAddress, targetAddress]
  });
  return data;
}

export {
  getApprovedForAll1155
}

