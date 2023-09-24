# Contracts for AxiomV2 Autonomous Airdrop to MEV Victims

## Setup

Rename `env.example` to `.env` and fill out the parameters.

## Deploy

Run `./script/deploy_goerli.sh` to deploy to Goerli testnet (please ensure you have some Goerli testnet ETH before deploying).

## About
This project allows users to autonomously claim an airdrop of an example ERC20 token. Users utilize a data-fetching layer on top of Axiom to autonomously prove that their transaction matches some parameters before submitting a Query. 

Users prove that their transaction was victim in an MEV attack. Three sequential transactions from a single block: current, previous, and next transaction. The following conditions must be satisfied:
- Previous transaction index < current transanction index < next transaction index
- Gas price limit of previous transaction > Gas price limit current transaction
- There must be a gain in swap between previous and next transaction
- The transactions are in the same block

### Credit
Example is based on @ytham's example of the autonomous airdrop that was created for the ETH Global NYC hackathon. The written Axiom circuit (parameters) is original.
