// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import {Hooks} from "@uniswap/v4-core/contracts/libraries/Hooks.sol";
import {IPoolManager} from "@uniswap/v4-core/contracts/interfaces/IPoolManager.sol";
import {ERC721OwnershipHook} from "../src/ERC721OwnershipHook.sol";
import {HookMiner} from "../test/utils/HookMiner.sol";

contract ERC721OwnershipHookScript is Script {
    address constant CREATE2_DEPLOYER = address(0x4e59b44847b379578588920cA78FbF26c0B4956C);
    address constant NFT_CONTRACT = address(0x4B8c70cF3e595D963cD4A33627d4Ba2718fD706F);

    function setUp() public {}

    function run() public {
        IPoolManager manager = IPoolManager(payable(0x4B8c70cF3e595D963cD4A33627d4Ba2718fD706F));

        // hook contracts must have specific flags encoded in the address
        uint160 flags = uint160(
            Hooks.BEFORE_SWAP_FLAG
        );

        // Mine a salt that will produce a hook address with the correct flags
        (address hookAddress, bytes32 salt) = HookMiner.find(CREATE2_DEPLOYER, flags, 1000, type(ERC721OwnershipHook).creationCode, abi.encode(address(manager)));

        // Deploy the hook using CREATE2
        vm.broadcast();
        ERC721OwnershipHook ownershipHook = new ERC721OwnershipHook{salt: salt}(manager, NFT_CONTRACT);
        require(address(ownershipHook) == hookAddress, "ERC721OwnershipHookScript: hook address mismatch");
    }
}