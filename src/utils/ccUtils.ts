import { erc20Abi } from "viem";

import * as ethers from "ethers";

import { useChainId, useReadContract, useWatchContractEvent } from "wagmi";
import { useWriteContract } from "wagmi";
import { ccswapAbi } from "./abis/ccswap";
import { useEffect, useState } from "react";

export const getCCBalance = (address: `0x${string}`) => {
  const [balance, setBalance] = useState<string>("0");
  const chainId = useChainId();

  let CCAddress: `0x${string}` = "0x8f6fDE1B60e0d74CA7B3fD496444Dac2f2C7d882";

  if (chainId == 4202) {
    CCAddress = "0x8f6fDE1B60e0d74CA7B3fD496444Dac2f2C7d882";
  } else if (chainId == 84532) {
    CCAddress = "0x8f6fDE1B60e0d74CA7B3fD496444Dac2f2C7d882";
  }

  const { data: balanceCC, refetch } = useReadContract({
    abi: erc20Abi,
    address: CCAddress,
    functionName: "balanceOf",
    args: [address],
    account: address,
    chainId: chainId,
  });

  useEffect(() => {
    if (balanceCC) {
      setBalance(ethers.formatUnits(balanceCC, 18));
    }
  }, [balanceCC]);

  useWatchContractEvent({
    address: CCAddress,
    abi: erc20Abi,
    eventName: "Transfer",
    onLogs(logs) {
      const relevantLog = logs.find(
        (log) => log.args.from === address || log.args.to === address
      );
      if (relevantLog) {
        refetch();
      }
    },
  });

  return Number(balance).toFixed(4);
};

export const getTTBalance = (address: `0x${string}`) => {
  const [balance, setBalance] = useState<string>("0");
  const chainId = useChainId();

  let TTAddress: `0x${string}` = "0xD67e53553D5dC3BF78B18d2c1f094E5164ACF15b";

  if (chainId == 4202) {
    TTAddress = "0xD67e53553D5dC3BF78B18d2c1f094E5164ACF15b";
  } else if (chainId == 84532) {
    TTAddress = "0xD67e53553D5dC3BF78B18d2c1f094E5164ACF15b";
  }

  const { data: balanceTT, refetch } = useReadContract({
    abi: erc20Abi,
    address: TTAddress,
    functionName: "balanceOf",
    args: [address],
    account: address,
    chainId: chainId,
  });

  useEffect(() => {
    if (balanceTT) {
      setBalance(ethers.formatUnits(balanceTT, 18));
    }
  }, [balanceTT]);

  useWatchContractEvent({
    address: TTAddress,
    abi: erc20Abi,
    eventName: "Transfer",
    onLogs(logs) {
      const relevantLog = logs.find(
        (log) => log.args.from === address || log.args.to === address
      );
      if (relevantLog) {
        refetch();
      }
    },
  });

  return Number(balance).toFixed(4);
};

export const getCCLTBalance = (address: `0x${string}`) => {
  const [balance, setBalance] = useState<string>("0");
  const chainId = useChainId();

  let ccSwapAddress: `0x${string}` =
    "0xafC9D020d0b67522337058f0fDea057769dd386A";

  if (chainId == 4202) {
    ccSwapAddress = "0x665FE43468B4a10128a406bc4F826065C9cDA877";
  } else if (chainId == 84532) {
    ccSwapAddress = "0xafC9D020d0b67522337058f0fDea057769dd386A";
  }

  const { data: balanceCCLT, refetch } = useReadContract({
    abi: erc20Abi,
    address: ccSwapAddress,
    functionName: "balanceOf",
    args: [address],
    account: address,
    chainId: chainId,
  });

  useEffect(() => {
    if (balanceCCLT) {
      setBalance(ethers.formatUnits(balanceCCLT, 18));
    }
  }, [balanceCCLT]);

  useWatchContractEvent({
    address: ccSwapAddress,
    abi: erc20Abi,
    eventName: "Transfer",
    onLogs(logs) {
      const relevantLog = logs.find(
        (log) => log.args.from === address || log.args.to === address
      );
      if (relevantLog) {
        refetch();
      }
    },
  });

  return Number(balance).toFixed(4);
};

export const getPoolRatio = () => {
  const chainId = useChainId();

  let ccSwapAddress: `0x${string}` =
    "0xafC9D020d0b67522337058f0fDea057769dd386A";

  if (chainId == 4202) {
    ccSwapAddress = "0x665FE43468B4a10128a406bc4F826065C9cDA877";
  } else if (chainId == 84532) {
    ccSwapAddress = "0xafC9D020d0b67522337058f0fDea057769dd386A";
  }

  const { data: poolRatio } = useReadContract({
    abi: ccswapAbi,
    address: ccSwapAddress,
    functionName: "getPoolRatio",
    //blockTag: "safe",
    chainId: chainId,
  });

  console.log(poolRatio);

  return poolRatio ? Number(poolRatio) : 1;
};

export const getCCtoTTPrice = () => {
  const chainId = useChainId();

  let ccSwapAddress: `0x${string}` =
    "0xafC9D020d0b67522337058f0fDea057769dd386A";

  if (chainId == 4202) {
    ccSwapAddress = "0x665FE43468B4a10128a406bc4F826065C9cDA877";
  } else if (chainId == 84532) {
    ccSwapAddress = "0xafC9D020d0b67522337058f0fDea057769dd386A";
  }
  const { data: CCtoTTPrice } = useReadContract({
    abi: ccswapAbi,
    address: ccSwapAddress,
    functionName: "getAssetPrice",
    //blockTag: "safe",
    chainId: chainId,
  });

  console.log(CCtoTTPrice);

  return CCtoTTPrice ? Number(CCtoTTPrice) : 1;
};

export const depositLiquidity = (ccAmount: number, ttAmount: number) => {
  const chainId = useChainId();

  let ccSwapAddress: `0x${string}` =
    "0xafC9D020d0b67522337058f0fDea057769dd386A";

  if (chainId == 4202) {
    ccSwapAddress = "0x665FE43468B4a10128a406bc4F826065C9cDA877";
  } else if (chainId == 84532) {
    ccSwapAddress = "0xafC9D020d0b67522337058f0fDea057769dd386A";
  }
  const { writeContract } = useWriteContract();

  const cc = ethers.parseUnits((ccAmount * 10 ** 18).toString(), "wei");
  const tt = ethers.parseUnits((ttAmount * 10 ** 18).toString(), "wei");

  console.log("cc", cc, "tt", tt);

  writeContract({
    abi: ccswapAbi,
    address: ccSwapAddress,
    functionName: "addLiquidity",
    args: [cc, tt],
    chainId: chainId,
  });

  return;
};

export const withdrawLiquidity = (ccltAmount: number) => {
  const { writeContract } = useWriteContract();

  const chainId = useChainId();

  let ccSwapAddress: `0x${string}` =
    "0xafC9D020d0b67522337058f0fDea057769dd386A";

  if (chainId == 4202) {
    ccSwapAddress = "0x665FE43468B4a10128a406bc4F826065C9cDA877";
  } else if (chainId == 84532) {
    ccSwapAddress = "0xafC9D020d0b67522337058f0fDea057769dd386A";
  }

  const cclt = ethers.parseUnits((ccltAmount * 10 ** 18).toString(), "wei");

  console.log("cclt", cclt);

  writeContract({
    abi: ccswapAbi,
    address: ccSwapAddress,
    functionName: "removeLiquidity",
    args: [cclt],
    chainId: chainId,
  });

  return;
};

export const swapCC = (ccltAmount: number) => {
  const { writeContract } = useWriteContract();

  const chainId = useChainId();

  let ccSwapAddress: `0x${string}` =
    "0xafC9D020d0b67522337058f0fDea057769dd386A";

  if (chainId == 4202) {
    ccSwapAddress = "0x665FE43468B4a10128a406bc4F826065C9cDA877";
  } else if (chainId == 84532) {
    ccSwapAddress = "0xafC9D020d0b67522337058f0fDea057769dd386A";
  }

  const cclt = ethers.parseUnits((ccltAmount * 10 ** 18).toString(), "wei");

  console.log("cclt", cclt);

  writeContract({
    abi: ccswapAbi,
    address: ccSwapAddress,
    functionName: "swapCC",
    args: [cclt],
    chainId: chainId,
  });

  return;
};
