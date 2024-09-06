import { addresses } from "./addresses";
import { getBalance } from '@wagmi/core'
import { config } from "./callconfig";

const getSupportedTokens = [
  {
    address: "0x0000000000000000000000000000000000000000",
    symbol: "ETH",
    image: "http://127.0.0.1:5173/ETH.webp",
  },
  {
    address: addresses.ERC20MockContract,
    symbol: "TEST",
    image: "http://127.0.0.1:5173/default.png",
  }
]

const getTokenName = (address) => {
  switch(address.toLowerCase()) {
    case "0x00000000":
    case "0x0000000000000000000000000000000000000000": 
      return {
        symbol: "ETH"
      };
    case addresses.ERC20MockContract.toLowerCase(): 
      return {
        symbol: "TEST"
      }
    default: {
      return {
        symbol: "???"
      };
    }
  }
}

const getBalanceOfAddress = async (address) => {
  return await getBalance(config, {
    address: address,
  });
}

export {
  getTokenName,
  getSupportedTokens,
  getBalanceOfAddress,
}