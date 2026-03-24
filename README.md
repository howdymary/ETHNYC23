# MEV Victim Reparations

> Built at ETH NYC 2023

A system that identifies victims of MEV (Maximal Extractable Value) attacks on Ethereum and issues reparation tokens granting access to protected liquidity pools.

## How It Works

1. **Identify** -- Scan on-chain data via Axiom to detect wallets that were victims of sandwich attacks on ETH Goerli
2. **Prove** -- Generate zero-knowledge proofs via Axiom circuits that verify a transaction was frontrun based on gas price, transaction ordering, and swap gains
3. **Compensate** -- Issue ERC-721 tokens to verified victims via autonomous airdrop
4. **Protect** -- Token holders gain access to a token-gated Uniswap v4 pool on Scroll with custom hooks that prevent further MEV extraction

## Architecture

- **Axiom Circuit** -- Validates three sequential transactions in a block to prove a sandwich attack occurred
- **Hyperlane Warp Route** -- Permissionless bridging of the ERC-721 to Scroll Sepolia
- **Uniswap v4 Hook** -- Custom hook that restricts pool access to verified MEV victims
- **Unlock Protocol** -- Good Actor Nouns NFT for qualifying addresses

## Tech Stack

- Python (MEV analysis and victim identification)
- Solidity (ERC-721 contract and Uniswap v4 hooks)
- Axiom v2 (zero-knowledge proofs)
- Scroll L2 / Hyperlane
- Uniswap v4

## Links

- [Design Deck](https://app.pitch.com/app/player/c8d9c39c-6e49-4a21-be66-50decda3e35e/f4bd41d9-fbff-420e-954b-50e8e66e0595)
- [Code Walkthrough](https://youtu.be/sPZaCm08IHY)
- [Hyperlane Deployment on Scroll](https://sepolia.scrollscan.dev/address/0xbF57d398b7a166E255c0Bf83f6e9C322d12FB00a)
- [NFT Contract](https://goerli.etherscan.io/address/0x2f8fc6507ace624dfb4649b8db61c4e48e2f1713)

## License

MIT
