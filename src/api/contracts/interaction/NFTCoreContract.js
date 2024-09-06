import { config } from '../callconfig';
import { readContract } from '@wagmi/core';
import erc721abi from "src/api/contracts/abi/NFTCoreABI.json";

const ERC1155InterfaceId = "0xd9b67a26";
const ERC721InterfaceId = "0x80ac58cd";

const check1155Type = async ({ nftAddress }) => {
  const data = await readContract(config, {
    address: nftAddress,
    abi: erc721abi,
    functionName: 'supportsInterface',
    args: [ERC1155InterfaceId]
  });
  return data;
}

const check721Type = async ({ nftAddress }) => {
  const data = await readContract(config, {
    address: nftAddress,
    abi: erc721abi,
    functionName: 'supportsInterface',
    args: [ERC721InterfaceId]
  });
  return data;
}

const getApprovedForAll721 = async ({ nftAddress, ownerAddress, targetAddress }) => {
  const data = await readContract(config, {
    address: nftAddress,
    abi: erc721abi,
    functionName: 'isApprovedForAll',
    args: [ownerAddress, targetAddress]
  });
  return data;
}

export {
  check1155Type,
  getApprovedForAll721,
  check721Type
}

