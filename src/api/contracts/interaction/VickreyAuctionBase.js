import { config } from '../callconfig';
import { readContract } from '@wagmi/core';
import { getBlock } from '@wagmi/core'

import vickreyAuctionABI from "src/api/contracts/abi/VickreyAuctionBaseABI.json";
import { GetProof } from 'lib-auction';
import toast from 'react-hot-toast';
import { getBalanceOfAddress } from '..';
import vickreyUtilitiesABI from "src/api/contracts/abi/VickreyUtilitiesABI.json";
import { addresses } from '../addresses';
import { ethers } from 'ethers';
import { rlp } from 'ethereumjs-util';

const getBidAddress = async ({auctionAddress, bidder, bid, subSalt}) => {
  const data = await readContract(config, {
    address: auctionAddress,
    abi: vickreyAuctionABI,
    functionName: 'getBidDepositAddr',
    args: [bidder, bid, subSalt]
  });
  return {
    address: data[1],
    salt: data[0],
  }
}

const getRevealBlockNum = async ({auctionAddress}) => {
  const blockNum = await readContract(config, {
    address: auctionAddress,
    abi: vickreyAuctionABI,
    functionName: 'revealBlockNum'
  });
  return blockNum;
}

const getProof = async ({bidder, bid, subSalt, chainId, auctionAddress}) => {
  const revealBlockNumber = await getRevealBlockNum({auctionAddress});
  if(revealBlockNumber == 0n) {
    toast.error("Invalid params revealBlockNumber");
    return null;
  }
  const create2Address = await getBidAddress({
    auctionAddress: auctionAddress, 
    bidder, 
    bid,
    subSalt
  });
  const proof = await getProofx(chainId, revealBlockNumber, create2Address.address);
  if(!proof) {
    toast.error("Cannot construct proof!");
    return null;
  }
  if(proof.balance == "0") {
    toast.error("This proof contains no ETH");
    return null;
  }
  return proof;
}

function buffer2hex(buffer) {
  return "0x" + buffer.toString("hex");
}

function expandkey(hexvalue) {
  if (hexvalue.substring(0, 2) === "0x") hexvalue = hexvalue.substring(2);
  return [...new Array(hexvalue.length).keys()].map((i) => "0" + hexvalue[i]).join("");
}

const getProofx = async (chainId, revealBlockNumber, create2Address) => {
  const paramConfig = config.chains.find(chain => chain.id === chainId);
  if(!paramConfig) {
    return null;
  }
  const blockHash = (await getBlock(config, {
    blockNumber: revealBlockNumber 
  })).hash;

  const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA}`);
  const balanceCreate2 = await provider.getBalance(create2Address, revealBlockNumber);

  let getProof = new GetProof(paramConfig.rpcUrls.default.http[0], chainId);
  const proof = await getProof.accountProof(create2Address, blockHash);
  const accountProof = [...proof.accountProof].map((node) => node.map((elem) => buffer2hex(elem)));
  const header = await readContract(config, {
    address: addresses.VickreyUtilities,
    abi: vickreyUtilitiesABI,
    functionName: 'toBlockHeader',
    args: [proof.header.toHex()]
  });
  return {
    header: JSON.parse(JSON.stringify(header, (key, value) =>
      typeof value === 'bigint'
        ? value.toString()
        : value
    )),
    accountProof: {
      expectedRoot: header.stateRoot,
      key: "0x" + expandkey(ethers.solidityPackedKeccak256(["address"], [create2Address])),
      proof: accountProof.map((node) => buffer2hex(rlp.encode(node))),
      keyIndex: 0,
      proofIndex: 0,
      expectedValue: accountProof[accountProof.length - 1][1],
    },
    balance: balanceCreate2.toString(),
  }
}

const getBiddedAmount = async ({create2Address, auctionAddress, _bid}) => {
  const data = await getRevealBlockNum({auctionAddress});
  let create2Balance = 0n;
  if(data == 0n){
    create2Balance = (await getBalanceOfAddress(create2Address?.address ?? create2Address)).value;
  } else {
    const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA}`);
    create2Balance = await provider.getBalance(create2Address?.address ?? create2Address, parseInt(data));
  }
  const bid = BigInt(_bid);
  return create2Balance < bid ? create2Balance : bid;
}

export {
  getBidAddress,
  getRevealBlockNum,
  getProof,
  getBiddedAmount,
}

