# ETHNYC23

## About
This project identifies victims of MEV attacks on ETH Goerli and grants these victims a rebate when they provide liquidity to a Uniswap v4 pool on Scroll. Ultimately, this project incentivizes better behavior on Scroll based on a user's historical on chain data on ETH Goerli.

### Autonomous Airdrop
This project allows users to autonomously claim an airdrop of an example ERC20 token. Users utilize a data-fetching layer on top of Axiom to autonomously prove that their transaction matches some parameters before submitting a Query.

Users prove that their transaction was victim in an MEV attack. Three sequential transactions from a single block: current, previous, and next transaction. The following conditions must be satisfied:

- Previous transaction index < current transanction index < next transaction index
- Gas price limit of previous transaction > Gas price limit current transaction
- There must be a gain in swap between previous and next transaction
- The transactions are in the same block

### Hyperlane Deployment on Scroll
This project deployed a Hyperlane Warp Route on Scroll, allowing permissionless bridging of the ERC20 asset to Scroll Sepolia. 

To establish a warp route, this project deployed HypERC20 contracts to Scroll Sepolia. 

### Uniswap v4 + Hook Launch on Scroll
This uses Scroll's Quiknode RPC.

### Good Actor Nouns NFT 
This project created a lock on Unlock Protocol to create a Nouns NFT for qualifying addresses as proven by Axiom. This NFT is to signal that holders are good actors.
