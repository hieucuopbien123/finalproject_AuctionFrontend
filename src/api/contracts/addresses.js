const getAddresses = (chainId) => {
  switch(chainId.toString()){
    case "11155111":
      return {
        ERC20MockContract: '0x4Bd0F909Ba85D52f98f1495fBa75f262A4aDdD40',
        WETH: '0x9f35F3e94896e62c00f2471Ce3566725fd976566',
        Multicall3: '0x2a26c8eAa08C712F3474D7d37d740A5E4e9f38f9',
        VickreyUtilities: '0x02B562D3E0399d3f7909023d5702E9421F4548B2', // 0x191A1B3F574eC1aA34D1FE643846d48908F00Aec
        DutchAuction: '0x0256D9606600f46FD97e578F85eE77a166E18541',
        EnglishAuction: '0xB655842adc2Ec116F1FCaDE73b171AFdD9D82b0f',
        SealedBidAuctionV1: '0x8f706E90C918FC1C605bE5592D48176C73F3472a',
        SealedBidAuctionV2: '0xa9B5532fBC29a056d3FBD02F122Ca6f943FA1bdF',
        VickreyAuction: '0x9BA3B92bcbd0b0F3A0c224cbc2208333a1CDdE73',
        AuctionFactory: '0x38B59C35b6f7e94A0bE04190Af7d744bff0a869D'
      };
    default:
      return null;
  }
}

const addresses = getAddresses(import.meta.env.VITE_CHAIN_ID);

export {
  addresses
}
