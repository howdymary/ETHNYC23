# ETHNYC23

## About
This project identifies victims of MEV attacks on ETH Goerli and grants these victims a rebate when they provide liquidity to a Uniswap v4 pool on Scroll. Ultimately, this project incentivizes better behavior on Scroll based on a user's historical on chain data on ETH Goerli.

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

### Autonomous Airdrop
This project allows users to autonomously claim an airdrop of an example ERC20 token. Users utilize a data-fetching layer on top of Axiom to autonomously prove that their transaction matches some parameters before submitting a Query.

### Hyperlane Deployment on Scroll
This project deployed a Hyperlane Warp Route on Scroll, allowing permissionless bridging of the ERC20 asset to Scroll Sepolia. 

To establish a warp route, this project deployed HypERC20 contracts to Scroll Sepolia. 

### Uniswap v4 + Hook Launch on Scroll
This uses Scroll's Quiknode RPC.

### Good Actor Nouns NFT 
This project created a lock on Unlock Protocol to create a Nouns NFT for qualifying addresses as proven by Axiom. This NFT is to signal that holders are good actors.
