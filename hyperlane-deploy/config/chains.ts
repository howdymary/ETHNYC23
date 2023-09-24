import { ChainMap, ChainMetadata, ProtocolType } from '@hyperlane-xyz/sdk';

// import { chainMetadata } from '@hyperlane-xyz/sdk';
// A map of chain names to ChainMetadata
export const chains: ChainMap<ChainMetadata> = {
  // ----------- Add your chains here -----------------
  scrollsepolia: {
    name: 'scrollsepolia',
    protocol: ProtocolType.Ethereum,
    // scroll default chain id
    chainId: 534351,
    // Used to configure a Warp Route to bridge scroll ETH
    // to scroll in CI tests.
    nativeToken: {
      name: 'ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [
      {
        http: 'https://scroll-public.scroll-testnet.quiknode.pro',
      },
    ],
    // You can set overrides for transaction fields here
    // transactionOverrides: {
    //   gasLimit: 1000000
    // },
  },
  // anvil2: {
  //   name: 'anvil2',
  //   protocol: ProtocolType.Ethereum,
  //   chainId: 31338,
  //   rpcUrls: [
  //     {
  //       http: 'http://127.0.0.1:8555',
  //     },
  //   ],
  // },
  // --------------------------------------------------
  // You can also override the default chain metadata (completely)
  // ethereum: {
  //   ...chainMetadata.ethereum,
  //   publicRpcUrls: [
  //     {
  //       http: 'my.custom.rpc.url',
  //     }
  //   ],
  // }
};
