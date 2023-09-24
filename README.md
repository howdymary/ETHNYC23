# ETHNYC23

## About
This project identifies victims of MEV attacks on ETH Goerli and grants these victims an ERC-721 token that qualifies the holder to access a token gated Uniswap v4 pool on Scroll. Ultimately, this project incentivizes better behavior on Scroll based on a user's historical on chain data on ETH Goerli.

Design: https://app.pitch.com/app/player/c8d9c39c-6e49-4a21-be66-50decda3e35e/f4bd41d9-fbff-420e-954b-50e8e66e0595

### Using a Subgraph for an Axiom Query
This project used a subgraph of ETH Goerli transactions specifically from a pool of transactions that have previously occurred (pool is wrapped BTC to USDC). This subgraph gets individual transactions from that specific aforementioned pool and aggregates transactions from the pool. It then analyzes these transactions for a potential MEV (sandwich attacks). The subgraph is sorted through by pool and block height.

### Axiom Circuit
Users prove that their transaction was victim in a frontrunning MEV attack. Three sequential transactions from a single block: current, previous, and next transaction. The following conditions must be satisfied:

- Previous transaction index < current transanction index < next transaction index
- Gas price limit of previous transaction > Gas price limit current transaction
- There must be a gain in swap between previous and next transaction
- The transactions are in the same block

Inputs are transaction hash, respective log index
Receive the gas price limit for each tx, index for the transaction on the block, block number, receipt from each tx.
Use this to validate that the victim is being frontran. 

A later iteration of this circuit would be to iterate through pairs. The end result is a proof that the wallet address is a victim of an MEV attack. This proof is then tied back to a callback address using the Axiom v2 client contract that is the wallet address of the victim.

Code Walkthrough: https://youtu.be/sPZaCm08IHY

### Autonomous Airdrop
If given more time, this project allows users to autonomously claim an airdrop of an ERC-721 token. Users utilize a data-fetching layer on top of Axiom to autonomously prove that their transaction matches the parameters outlined above before submitting a query.

### Hyperlane Deployment on Scroll
This project deployed a Hyperlane Warp Route on Scroll, allowing permissionless bridging of the ERC721 asset to Scroll Sepolia. 

To establish a warp route, this project deployed HypERC20 contracts to Scroll Sepolia.

Hyperlane Deployment: https://sepolia.scrollscan.dev/address/0xbF57d398b7a166E255c0Bf83f6e9C322d12FB00a

### Uniswap v4 + Hook Launch on Scroll
This project would launch a Uniswap v4 on Scroll with a custom hook that disallows participation on the DEX without the ERC-721 that can only be minted by wallet addresses that were cryptographically proven to be victims of MEV attacks (MEVictim).

This uses Scroll's Quiknode RPC.

If given more time, this project would design custom swap fee rebates for holders of the ERC-721 (MEVictim). 

### Good Actor Nouns NFT 
This project created a lock on Unlock Protocol to create a Nouns NFT (ERC721) for qualifying addresses as proven by Axiom. This NFT is to signal that holders are good actors.

NFT Contract Address: https://goerli.etherscan.io/address/0x2f8fc6507ace624dfb4649b8db61c4e48e2f1713
