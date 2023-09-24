// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {ERC721OwnershipHook} from "../ERC721OwnershipHook.sol";

import {BaseHook} from "../../lib/v4-periphery/contracts/BaseHook.sol";
import {IPoolManager} from "../../lib/v4-core/contracts/interfaces/IPoolManager.sol";
import {Hooks} from "../../lib/v4-core/contracts/libraries/Hooks.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract ERC721OwnershipHookImpl is ERC721OwnershipHook {
    constructor(
        IPoolManager poolManager,
        IERC721 nftAddress,
        ERC721OwnershipHook addressToEtch
    ) ERC721OwnershipHook(poolManager, nftAddress) {
        Hooks.validateHookAddress(addressToEtch, getHooksCalls());
    }

    // make this a no-op in testing
    function validateHookAddress(BaseHook _this) internal pure override {}
}
