// SPDX-License-Identifier: MIT
pragma solidity 0.8.2;

import {LibDiamond} from "../../shared/libraries/LibDiamond.sol";
import {LibMeta} from "../../shared/libraries/LibMeta.sol";

struct BSCB20Di {
    string name;
    address owner;
}

struct AppStorage {
     uint32[] tokenIds;
    mapping(uint256 => uint256) tokenIdIndexes;
    mapping(address => mapping(address => bool)) operators;
    mapping(uint256 => address) approved;
    mapping(address => mapping(address => uint256)) allowances;
    mapping(address => uint256) balances;
    mapping(address => uint256) approvedContractIndexes;
    bytes32[1000] emptyMapSlots;
    address[] approvedContracts;
    address contractOwner;
    address childChainManager;
    uint96 totalSupply;
    string name;
    string symbol;
    string itemsBaseUri;
    bytes32 domainSeparator;
}

library LibAppStorage {
    function diamondStorage() internal pure returns (AppStorage storage ds) {
        assembly {
            ds.slot := 0
        }
    }

    function abs(int256 x) internal pure returns (uint256) {
        return uint256(x >= 0 ? x : -x);
    }
}


// struct ERC1155Listing {
//     uint256 listingId;
//     address seller;
//     address erc1155TokenAddress;
//     uint256 erc1155TypeId;
//     uint256 category; // 0 is wearable, 1 is badge, 2 is consumable, 3 is tickets
//     uint256 quantity;
//     uint256 priceInWei;
//     uint256 timeCreated;
//     uint256 timeLastPurchased;
//     uint256 sourceListingId;
//     bool sold;
//     bool cancelled;
// }

// struct ERC721Listing {
//     uint256 listingId;
//     address seller;
//     address erc721TokenAddress;
//     uint256 erc721TokenId;
//     uint256 category; // 0 is closed portal, 1 is vrf pending, 2 is open portal, 3 is Aavegotchi
//     uint256 priceInWei;
//     uint256 timeCreated;
//     uint256 timePurchased;
//     bool cancelled;
// }

// struct ListingListItem {
//     uint256 parentListingId;
//     uint256 listingId;
//     uint256 childListingId;
// }


contract Modifiers {
    AppStorage internal s;

    // modifier onlyUnlocked(uint256 _tokenId) {
    //     require(s.aavegotchis[_tokenId].locked == false, "LibAppStorage: Only callable on unlocked Aavegotchis");
    //     _;
    // }

    modifier onlyOwner {
        LibDiamond.enforceIsContractOwner();
        _;
    }

    // modifier onlyDao {
    //     address sender = LibMeta.msgSender();
    //     require(sender == s.dao, "Only DAO can call this function");
    //     _;
    // }

    // modifier onlyDaoOrOwner {
    //     address sender = LibMeta.msgSender();
    //     require(sender == s.dao || sender == LibDiamond.contractOwner(), "LibAppStorage: Do not have access");
    //     _;
    // }
  }