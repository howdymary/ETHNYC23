// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import {Hooks} from "@uniswap/v4-core/contracts/libraries/Hooks.sol";
import {IPoolManager} from "@uniswap/v4-core/contracts/interfaces/IPoolManager.sol";
import {ERC721OwnershipHook} from "../src/ERC721OwnershipHook.sol";
import {HookMiner} from "../test/utils/HookMiner.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract ERC721OwnershipHookScript is Script {
    address constant _CREATE2_DEPLOYER = address(0x4e59b44847b379578588920cA78FbF26c0B4956C);

    function setUp() public {}

    function run() public {
        IPoolManager manager = IPoolManager(payable(0xA449635FaAA6b5a45a568fCe217Bb7921c992285));
        IERC721 nftContract = IERC721(payable(0xC948c12e664445DB942AA7B043114643073e3e35));
        // hook contracts must have specific flags encoded in the address
        uint160 flags = uint160(
            Hooks.BEFORE_SWAP_FLAG
        );

        // Mine a salt that will produce a hook address with the correct flags
        (address hookAddress, bytes32 salt) = HookMiner.find(_CREATE2_DEPLOYER, flags, 1000, type(ERC721OwnershipHook).creationCode, abi.encode(address(manager)));

        // Deploy the hook using CREATE2
        vm.broadcast();
        ERC721OwnershipHook ownershipHook = new ERC721OwnershipHook{salt: salt}(manager, nftContract);
        require(address(ownershipHook) == hookAddress, "ERC721OwnershipHookScript: hook address mismatch");
    }
}