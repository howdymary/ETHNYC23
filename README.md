# ETHNYC23

## About

# Autonomous Airdrop
This project allows users to autonomously claim an airdrop of an example ERC20 token. Users utilize a data-fetching layer on top of Axiom to autonomously prove that their transaction matches some parameters before submitting a Query.

Users prove that their transaction was victim in an MEV attack. Three sequential transactions from a single block: current, previous, and next transaction. The following conditions must be satisfied:

Previous transaction index < current transanction index < next transaction index
Gas price limit of previous transaction > Gas price limit current transaction
There must be a gain in swap between previous and next transaction
The transactions are in the same block

# Hyperlane Deployment on Scroll
This project deployed a Hyperlane Warp Route on Scroll, allowing permissionless bridging of the ERC20 asset to Scroll Sepolia. 

To establish a warp route, this project deployed HypERC20 contracts to Scroll Sepolia. 
