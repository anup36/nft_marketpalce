// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT721 is ERC721, ERC721Burnable, Ownable {
    
    using Counters for Counters.Counter;
    
    Counters.Counter public _tokenCounter;
 
    mapping (uint256 => NFT) private _nfts;
    mapping (address => bool) public _mintApprovals;
    bool public mintEnabled;
    bool public approvedMintEnabled;
    IERC20 public usdtInstance;
    IERC20 public usdcInstance;
    IERC20 public chainLinkInstance;
    
    string private baseURI;
    
    struct NFT {
        string uri;
        address creator;
    }
    
    event NFTCreated(uint256 tokenId, string uri, address creator, string name, string description);
    event NFTBurnt(uint256 tokenId);
    
    event Deposited(uint256 value, address payer);
    
    constructor(address usdt, address usdc, address chainlink) ERC721("NFT","NFT") {
        mintEnabled = false;
        approvedMintEnabled = false;
        usdtInstance = IERC20(usdt);
        usdcInstance = IERC20(usdc);
        chainLinkInstance = IERC20(chainlink);
    }
    
    function _baseURI() internal view override virtual returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _newBaseURI) external virtual onlyOwner {
        baseURI = _newBaseURI;
    }
    
    function setMinting(bool isEnable) external onlyOwner {
        mintEnabled = isEnable;
    }
    
    function setApprovedMinting(bool isEnable) external onlyOwner {
        approvedMintEnabled = isEnable;
    }
    
    function approveMinter(address minter, bool value) external onlyOwner {
        _mintApprovals[minter] = value;
    }
    
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");

        string memory _tokenURI = _nfts[tokenId].uri;
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        return super.tokenURI(tokenId);
    }


    function getNft(uint256 tokenId) external view returns( NFT memory) 
    {
        return _nfts[tokenId];
    }
    
    function getCreator(uint256 tokenId) external view returns (address)
    {
        return _nfts[tokenId].creator;
    }
     
    function getCurrentCount() external view returns(uint256)
    {
        return _tokenCounter.current();
    }
     
     
    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);
        delete _nfts[tokenId];
    }
    
    
    function mintNFT(address to, string memory uri, string memory name, string memory description) external returns (uint256) {
        
        require(mintEnabled || approvedMintEnabled || msg.sender == owner(), "MINT: minting is paused.");
        require(mintEnabled || _mintApprovals[msg.sender] || msg.sender == owner(), "MINT: only approved minters can mint.");
        
        _tokenCounter.increment();

        uint256 tokenId = _tokenCounter.current();        
        _mint(to, tokenId);
        
        NFT memory newNFT = NFT(uri, to);
        
        _nfts[tokenId] = newNFT;
        
        emit NFTCreated(tokenId, uri, to, name, description);
        
        return tokenId;
    }

    // function payment(address user, uint256 _amount, uint256 coinType) payable external {
    //     if(coinType == 0){
    //         emit Deposited(msg.value, msg.sender);
    //     } else if(coinType == 1){
    //         usdtInstance.transferFrom(user, address(this), _amount);
    //     } else if(coinType == 2){
    //         usdcInstance.transferFrom(user, address(this), _amount);
    //     } else if(coinType == 3){
    //         chainLinkInstance.transferFrom(user, address(this), _amount);
    //     }
    // }
}