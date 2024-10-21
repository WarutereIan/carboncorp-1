
# CarbonCorp DEX Pool Protocol 

## Overview

The Carbon Corps DEX (Decentralized Exchange) is a smart contract that facilitates the exchange between two types of tokens: "CC" (Carbon Credit) tokens and an "other" ERC20 token (stablecoin e.g USDC). It uses an automated market maker (AMM) model with a constant product formula (x * y = k) to determine exchange rates. The protocol allows users to provide liquidity, earn fees, swap tokens, and offset carbon by converting their stablecoin tokens into verifiable carbon offset certificates.

## Key Components

1. CC Token: The primary token being traded, representing verified carbon credits
2. Other Token: The secondary token for trading (ERC20 stablecoin e.g USDC)
3. CCLT (CarbonCorp Liquidity Token): An ERC20 token representing liquidity provider shares
4. CC Certificate: An ERC720 token minted when users swap other tokens for CC tokens


## Token Mechanics

### CC Token Minting and Burning

1.  CC tokens are minted through a separate process:
    -   Carbon offsets are verified for a specific user through an external process.
    -   An oracle invokes the minting function after verification.
    -   CC tokens are then issued directly to the user who achieved the carbon offset.
2.  CC tokens are burned when users offset carbon:
    -   When a user offsets carbon using the secondary stablecoin tokens, the equivalent amount of CC tokens are burned.
    -   A CC Certificate (ERC720) is issued to the user, representing the carbon offset.

This process ensures that each CC token and CC Certificate represents a verified carbon credit, maintaining the integrity and value of the carbon offsets traded on the DEX.

## Core Functions

### Swapping Tokens

#### 1. swapCC (CC Token to Other Token)

```solidity
function swapCC(uint _amountIn) external returns (uint amountOut)
```

**Arithmetic:**
1. Calculate fee: `amountInWithFee = _amountIn * (FEE_DENOMINATOR - FEE_NUMERATOR) / FEE_DENOMINATOR`
2. Calculate output: `amountOut = (otherTokenReserve * amountInWithFee) / (ccTokenReserve + amountInWithFee)`

This function uses the constant product formula (x * y = k) to determine the output amount. The fee is deducted from the input amount before calculating the swap.

#### 2. swapOtherToken (Other Token to CC Token)

```solidity
function swapOtherToken(uint _amountIn) external returns (uint amountOut)
```

**Arithmetic:**
1. Calculate fee: `amountInWithFee = _amountIn * (FEE_DENOMINATOR - FEE_NUMERATOR) / FEE_DENOMINATOR`
2. Calculate output: `amountOut = (ccTokenReserve * amountInWithFee) / (otherTokenReserve + amountInWithFee)`

Similar to `swapCC`, this function allows users to buy CC tokens with other tokens.
### Carbon Offsetting

## 3. offsetCarbon



`function  offsetCarbon(uint _amountIn)  external  returns  (uint amountOffset)`

**Arithmetic:**

1.  Calculate fee: `amountInWithFee = _amountIn * (FEE_DENOMINATOR - FEE_NUMERATOR) / FEE_DENOMINATOR`
2.  Calculate offset amount: `amountOffset = (ccTokenReserve * amountInWithFee) / (otherTokenReserve + amountInWithFee)`

**Additional steps:**  

3. Burn CC tokens: `ccToken.burn(amountOffset)`
 4. Mint CC Certificate: `ccCertificate.mint(msg.sender, amountOffset)`

This function allows users to offset carbon by exchanging other tokens for CC Certificates. The equivalent amount of CC tokens is burned in the process.

### Liquidity Management

#### 3. addLiquidity

```solidity
function addLiquidity(uint _ccTokenAmount, uint _otherTokenAmount) external returns (uint shares)
```

**Arithmetic:**
1. If total supply is 0:
   `shares = sqrt(_ccTokenAmount * _otherTokenAmount)`
2. If total supply > 0:
   ```
   ccTokenShare = (_ccTokenAmount * totalSupply) / ccTokenReserve
   otherTokenShare = (_otherTokenAmount * totalSupply) / otherTokenReserve
   shares = min(ccTokenShare, otherTokenShare)
   ```

This function calculates the number of CCLT tokens to mint based on the provided liquidity. For the first liquidity provider, it uses the geometric mean of the deposited amounts. For subsequent providers, it ensures proportional deposits and mints the minimum share amount to prevent manipulation.

#### 4. removeLiquidity

```solidity
function removeLiquidity(uint _shares) external returns (uint _ccTokenAmount, uint _otherTokenAmount)
```

**Arithmetic:**
1. Calculate CC token amount: `_ccTokenAmount = (_shares * ccTokenReserve) / totalSupply`
2. Calculate other token amount: `_otherTokenAmount = (_shares * otherTokenReserve) / totalSupply`

This function calculates the amount of CC and other tokens to return to the liquidity provider based on their share of the pool.

## Price Functions

### 5. getCCTokenPrice

```solidity
function getCCTokenPrice() public view returns (uint)
```

**Arithmetic:** `return (otherTokenReserve * PRECISION) / ccTokenReserve`

Calculates the price of one unit of the CC token in terms of the other token.

### 6. getOtherTokenPrice

```solidity
function getOtherTokenPrice() public view returns (uint)
```

**Arithmetic:** `return (ccTokenReserve * PRECISION) / otherTokenReserve`

Calculates the price of one unit of the other token in terms of the CC token.

### 7. estimateCCToOtherToken

```solidity
function estimateCCToOtherToken(uint ccTokenAmount) public view returns (uint)
```

**Arithmetic:**
1. Apply fee: `amountWithFee = ccTokenAmount * (FEE_DENOMINATOR - FEE_NUMERATOR) / FEE_DENOMINATOR`
2. Estimate output: `return (otherTokenReserve * amountWithFee) / (ccTokenReserve + amountWithFee)`

Estimates the amount of other tokens received for a given amount of CC tokens.

### 8. estimateOtherTokenToCC

```solidity
function estimateOtherTokenToCC(uint otherTokenAmount) public view returns (uint)
```

**Arithmetic:**
1. Apply fee: `amountWithFee = otherTokenAmount * (FEE_DENOMINATOR - FEE_NUMERATOR) / FEE_DENOMINATOR`
2. Estimate output: `return (ccTokenReserve * amountWithFee) / (otherTokenReserve + amountWithFee)`

Estimates the amount of CC tokens received for a given amount of other tokens.

## Fee Mechanism

The protocol charges a 1% fee on all swaps and carbon offsets. This fee is subtracted from the input amount before calculating the output or offset amount. The fee remains in the pool, increasing the value of liquidity provider shares.

## Constant Product Formula

The DEX uses the constant product formula: `x * y = k`

Where:
- x: Reserve of CC token
- y: Reserve of other token
- k: Constant product

This formula ensures that the product of the reserves remains constant after each trade, creating a price curve that adjusts based on supply and demand.

## Liquidity Provider Tokens (CCLT)

CCLT tokens represent a liquidity provider's share of the pool. They are minted when liquidity is added and burned when liquidity is removed. The number of CCLT tokens minted or burned is proportional to the share of the pool's liquidity being added or removed.

## CC Certificate

A CC Certificate (ERC720 token) is minted when a user offsets carbon using the `offsetCarbon` function. This certificate represents a verified carbon offset and is issued in place of the CC tokens, which are burned during the process. Each amount if the token and corresponds to a specific amount of carbon offset.

## Security Considerations

1. The contract includes checks for sufficient balances and allowances before transfers.
2. It prevents division by zero errors by checking for non-zero reserves.
3. Slippage protection should be implemented on the client side using the estimation functions.


## Current Limitations and Future Improvements

1. The contract does not implement slippage protection at the contract level.
2. Inclusion of a minimum liquidity requirement to prevent potential manipulation of small pools.
3. The fee is fixed at 1% and cannot be adjusted without modifying the contract.
4. Addition of events for important actions, which could be useful for off-chain tracking and logging.
5. Implementation of a governance mechanism for adjusting parameters such as fees or updating the oracle address.
6. Implementation of a mechanism to track and report total carbon offsets achieved through the protocol.


Contract Addresses for the protocol can be found at the following address on base sepolia:

CC Token: 0xC3e5c198b7E7599ec171eBB85a6a05d6B947AFaD

Test ERC20 Token (used in trading pair ) : 
0xD67e53553D5dC3BF78B18d2c1f094E5164ACF15b

Dex Pool Smart Contract:
0x80cBDf302A2DfAF7bAE3dA05c5EDA91556abBcB5

CC Certificate Token:
0x6Bc94BdB3a7522eA88cE9DEc8a79b29279e58204  

