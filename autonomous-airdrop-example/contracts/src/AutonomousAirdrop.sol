// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import { AxiomV2Client } from './AxiomV2Client.sol';
import { IERC20 } from '@openzeppelin-contracts/token/ERC20/IERC20.sol';
import { Ownable } from '@openzeppelin-contracts/access/Ownable.sol';
import "forge-std/console.sol";

contract AutonomousAirdrop is AxiomV2Client, Ownable {
    event ClaimAirdrop(
        address indexed user,
        bytes32 indexed queryHash,
        uint256 numTokens,
        bytes32[] axiomResults
    );
    event ClaimAirdropError(
        address indexed user,
        string error
    );
    event AxiomCallbackQuerySchemaUpdated(bytes32 axiomCallbackQuerySchema);
    event AirdropTokenAddressUpdated(address token);

    uint64 public callbackSourceChainId;
    bytes32 public axiomCallbackQuerySchema;
    mapping(address => bool) public querySubmitted;
    mapping(address => bool) public hasClaimed;

    IERC20 public token;

    constructor(
        address _axiomV2QueryAddress,
        uint64 _callbackSourceChainId,
        bytes32 _axiomCallbackQuerySchema
    ) AxiomV2Client(_axiomV2QueryAddress) {
        callbackSourceChainId = _callbackSourceChainId;
        axiomCallbackQuerySchema = _axiomCallbackQuerySchema;
    }

    function updateCallbackQuerySchema(
        bytes32 _axiomCallbackQuerySchema
    ) public onlyOwner {
        axiomCallbackQuerySchema = _axiomCallbackQuerySchema;
        emit AxiomCallbackQuerySchemaUpdated(_axiomCallbackQuerySchema);
    }

    function updateAirdropToken(address _token) public onlyOwner {
        token = IERC20(_token);
        emit AirdropTokenAddressUpdated(_token);
    }

    function _axiomV2Callback(
        uint64 sourceChainId,
        address callerAddr,
        bytes32 querySchema,
        bytes32 queryHash,
        bytes32[] calldata axiomResults,
        bytes calldata callbackExtraData
    ) internal virtual override {
        require(!hasClaimed[callerAddr], "Autonomous Airdrop: User has already claimed this airdrop");

        // Parse results
        bytes32 results = axiomResults[0];

        // Validate the results

        require(results == "1", "Autonomous Airdrop: Valid, this person has been a victim");

        // Transfer tokens to user
        hasClaimed[callerAddr] = true;
        uint256 numTokens = 100 * 10**18;
        token.transfer(callerAddr, numTokens);

        emit ClaimAirdrop(
            callerAddr,
            queryHash,
            numTokens,
            axiomResults
        );
    }

    function _validateAxiomV2Call(
        uint64 sourceChainId,
        address callerAddr,
        bytes32 querySchema
    ) internal virtual override {
        require(sourceChainId == callbackSourceChainId, "AxiomV2: caller sourceChainId mismatch");
        require(querySchema == axiomCallbackQuerySchema, "AxiomV2: query schema mismatch");
    }
}
