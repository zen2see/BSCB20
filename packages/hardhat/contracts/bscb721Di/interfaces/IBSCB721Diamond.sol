// SPDX-License-Identifier: MIT
pragma solidity 0.8.2;


interface IERC721 {
   
    function balanceOf(address _owner) external view returns (uint256);

    function ownerOf(uint256 _tokenId) external view returns (address);


    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes calldata data
    ) external;

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external;

   
    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external;
    
    function approve(address _approved, uint256 _tokenId) external;

    function setApprovalForAll(address _operator, bool _approved) external;

    function getApproved(uint256 _tokenId) external view returns (address);

    function isApprovedForAll(address _owner, address _operator) external view returns (bool);

    function increaseAllowance(address _spender, uint256 _value) external returns (bool success);

    function decreaseAllowance(address _spender, uint256 _value) external returns (bool success);

    function allowance(address _owner, address _spender) external view returns (uint256 remaining);

    function mint() external;
}