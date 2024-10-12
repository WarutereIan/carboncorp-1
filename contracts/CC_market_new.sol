// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CC_CertificateToken.sol";

contract CCMarketPlace is Ownable, ERC20 {
    IERC20 public immutable asset;
    IERC20 public immutable otherToken;
    CC_CertificateToken public Certificate;

    uint public assetReserve;
    uint public otherTokenReserve;

    uint private constant PRECISION = 1e18;
    uint private constant FEE_DENOMINATOR = 1000;
    uint private constant FEE_NUMERATOR = 10; // 1% fee

    constructor(
        IERC20 asset_,
        IERC20 otherToken_
    ) Ownable(msg.sender) ERC20("Carbon Corps Liquidity Token", "CCLT") {
        asset = asset_;
        otherToken = otherToken_;
        Certificate = new CC_CertificateToken();
    }

    function swapCC(uint _amountIn) external returns (uint amountOut) {
        require(_amountIn > 0, "amountIn = 0");
        require(asset.balanceOf(msg.sender) >= _amountIn, "Insufficient balance");
        require(asset.allowance(msg.sender, address(this)) >= _amountIn, "Insufficient allowance");

        uint amountInWithFee = (_amountIn * (FEE_DENOMINATOR - FEE_NUMERATOR)) / FEE_DENOMINATOR;

        amountOut = (otherTokenReserve * amountInWithFee) / (assetReserve + amountInWithFee);

        require(amountOut > 0, "Insufficient output amount");
        require(otherToken.balanceOf(address(this)) >= amountOut, "Insufficient liquidity");

        asset.transferFrom(msg.sender, address(this), _amountIn);
        otherToken.transfer(msg.sender, amountOut);

        _updateReserves(
            asset.balanceOf(address(this)),
            otherToken.balanceOf(address(this))
        );
    }

    function swapOtherToken(uint _amountIn) external returns (uint amountOut) {
        require(_amountIn > 0, "amountIn = 0");
        require(otherToken.balanceOf(msg.sender) >= _amountIn, "Insufficient balance");
        require(otherToken.allowance(msg.sender, address(this)) >= _amountIn, "Insufficient allowance");

        uint amountInWithFee = (_amountIn * (FEE_DENOMINATOR - FEE_NUMERATOR)) / FEE_DENOMINATOR;

        amountOut = (assetReserve * amountInWithFee) / (otherTokenReserve + amountInWithFee);

        require(amountOut > 0, "Insufficient output amount");
        require(asset.balanceOf(address(this)) >= amountOut, "Insufficient liquidity");

        otherToken.transferFrom(msg.sender, address(this), _amountIn);
        asset.transfer(msg.sender, amountOut);

        Certificate.mint(msg.sender, amountOut);

        _updateReserves(
            asset.balanceOf(address(this)),
            otherToken.balanceOf(address(this))
        );
    }

    function addLiquidity(uint _assetAmount, uint _otherTokenAmount) external returns (uint shares) {
        require(_assetAmount > 0 && _otherTokenAmount > 0, "Amount must be greater than 0");
        require(asset.balanceOf(msg.sender) >= _assetAmount, "Insufficient asset balance");
        require(otherToken.balanceOf(msg.sender) >= _otherTokenAmount, "Insufficient otherToken balance");
        require(asset.allowance(msg.sender, address(this)) >= _assetAmount, "Insufficient asset allowance");
        require(otherToken.allowance(msg.sender, address(this)) >= _otherTokenAmount, "Insufficient otherToken allowance");

        uint totalSupply = totalSupply();
        if (totalSupply == 0) {
            shares = _sqrt(_assetAmount * _otherTokenAmount);
        } else {
            uint assetShare = (_assetAmount * totalSupply) / assetReserve;
            uint otherTokenShare = (_otherTokenAmount * totalSupply) / otherTokenReserve;
            shares = _min(assetShare, otherTokenShare);
        }

        require(shares > 0, "shares = 0");

        asset.transferFrom(msg.sender, address(this), _assetAmount);
        otherToken.transferFrom(msg.sender, address(this), _otherTokenAmount);

        _mint(msg.sender, shares);

        _updateReserves(
            asset.balanceOf(address(this)),
            otherToken.balanceOf(address(this))
        );
    }

    function removeLiquidity(uint _shares) external returns (uint _assetAmount, uint _otherTokenAmount) {
        require(_shares > 0, "Cannot redeem 0 shares");
        require(balanceOf(msg.sender) >= _shares, "Insufficient shares");

        uint totalSupply = totalSupply();
        _assetAmount = (_shares * assetReserve) / totalSupply;
        _otherTokenAmount = (_shares * otherTokenReserve) / totalSupply;

        require(_assetAmount > 0 && _otherTokenAmount > 0, "Cannot redeem for zero underlying assets & otherTokens");

        _burn(msg.sender, _shares);

        asset.transfer(msg.sender, _assetAmount);
        otherToken.transfer(msg.sender, _otherTokenAmount);

        _updateReserves(
            asset.balanceOf(address(this)),
            otherToken.balanceOf(address(this))
        );
    }

    function getPoolRatio() public view returns (uint256 ratio) {
        require(otherTokenReserve > 0, "Pool is empty");
        ratio = (assetReserve * PRECISION) / otherTokenReserve;
    }

    function getDepositRatio(uint256 assetAmount) public view returns (uint256 otherTokenAmount) {
        require(assetReserve > 0, "Asset reserve is empty");
        otherTokenAmount = (assetAmount * otherTokenReserve) / assetReserve;
    }

    function getAssetPrice() public view returns (uint) {
        require(assetReserve > 0 && otherTokenReserve > 0, "Liquidity too low");
        return (otherTokenReserve * PRECISION) / assetReserve;
    }

    function getOtherTokenPrice() public view returns (uint) {
        require(assetReserve > 0 && otherTokenReserve > 0, "Liquidity too low");
        return (assetReserve * PRECISION) / otherTokenReserve;
    }

    function estimateAssetToOtherToken(uint assetAmount) public view returns (uint) {
        require(assetAmount > 0, "Invalid input amount");
        require(assetReserve > 0 && otherTokenReserve > 0, "Liquidity too low");
        
        uint amountWithFee = assetAmount * (FEE_DENOMINATOR - FEE_NUMERATOR) / FEE_DENOMINATOR;
        return (otherTokenReserve * amountWithFee) / (assetReserve + amountWithFee);
    }

    function estimateOtherTokenToAsset(uint otherTokenAmount) public view returns (uint) {
        require(otherTokenAmount > 0, "Invalid input amount");
        require(assetReserve > 0 && otherTokenReserve > 0, "Liquidity too low");
        
        uint amountWithFee = otherTokenAmount * (FEE_DENOMINATOR - FEE_NUMERATOR) / FEE_DENOMINATOR;
        return (assetReserve * amountWithFee) / (otherTokenReserve + amountWithFee);
    }

    function _updateReserves(uint _assetReserve, uint _otherTokenReserve) private {
        assetReserve = _assetReserve;
        otherTokenReserve = _otherTokenReserve;
    }

    function _sqrt(uint y) private pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function _min(uint x, uint y) private pure returns (uint) {
        return x <= y ? x : y;
    }
}