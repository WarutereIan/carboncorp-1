import { erc20Abi } from "viem";

import * as ethers from "ethers";

import { useChainId, useReadContract, useWatchContractEvent } from "wagmi";
import { useWriteContract } from "wagmi";
import { ccswapAbi } from "./abis/ccswap";
import { useEffect, useState } from "react";

export const checkAllowance = (address: `0x${string}`, chainId: number) => {
  let CCAddress: `0x${string}` = "0xC3e5c198b7E7599ec171eBB85a6a05d6B947AFaD";

  if (chainId == 4202) {
    CCAddress = "0xafC9D020d0b67522337058f0fDea057769dd386A";
  } else if (chainId == 84532) {
    CCAddress = "0xC3e5c198b7E7599ec171eBB85a6a05d6B947AFaD";
  }

  let TTAddress: `0x${string}` = "0xD67e53553D5dC3BF78B18d2c1f094E5164ACF15b";

  if (chainId == 4202) {
    TTAddress = "0x8f6fDE1B60e0d74CA7B3fD496444Dac2f2C7d882";
  } else if (chainId == 84532) {
    TTAddress = "0xD67e53553D5dC3BF78B18d2c1f094E5164ACF15b";
  }

  let { writeContract } = useWriteContract();

  const { data: allowanceTT } = useReadContract({
    abi: erc20Abi,
    address: TTAddress,
    functionName: "allowance",
    args: [address!, CCAddress],
    account: address,
    chainId: 84532,
  });
  const { data: allowanceCC } = useReadContract({
    abi: erc20Abi,
    address: CCAddress,
    functionName: "allowance",
    args: [address!, CCAddress],
    account: address,
    chainId: 84532,
  });

  let CC_allowance = allowanceCC;
  let TT_allowance = allowanceTT;

  console.log("CC allowance", CC_allowance);
  console.log("TT allowance", TT_allowance);

  if (TT_allowance == BigInt(0)) {
    writeContract({
      abi: erc20Abi,
      address: TTAddress,
      functionName: "approve",
      args: [CCAddress, ethers.parseEther("1000000")],
      chainId: 84532,
    });
  }
  if (CC_allowance == BigInt(0)) {
    writeContract({
      abi: erc20Abi,
      address: CCAddress,
      functionName: "approve",
      args: [CCAddress, ethers.parseEther("1000000")],
      chainId: 84532,
    });
  }
};

export const getCCCTBalance = (address: `0x${string}`) => {
  const [balance, setBalance] = useState<string>("0");
  const chainId = useChainId();

  let CCCTAddress: `0x${string}` = "0x6Bc94BdB3a7522eA88cE9DEc8a79b29279e58204";

  if (chainId == 4202) {
    CCCTAddress = "0x4a62fa31Cd52BE39a57621783f16DEC3c54e30ac";
  } else if (chainId == 84532) {
    CCCTAddress = "0x6Bc94BdB3a7522eA88cE9DEc8a79b29279e58204";
  }

  const { data: balanceCC, refetch } = useReadContract({
    abi: erc20Abi,
    address: CCCTAddress,
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
    address: CCCTAddress,
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
export const getCCBalance = (address: `0x${string}`) => {
  const [balance, setBalance] = useState<string>("0");
  const chainId = useChainId();

  let CCAddress: `0x${string}` = "0xC3e5c198b7E7599ec171eBB85a6a05d6B947AFaD";

  if (chainId == 4202) {
    CCAddress = "0xafC9D020d0b67522337058f0fDea057769dd386A";
  } else if (chainId == 84532) {
    CCAddress = "0xC3e5c198b7E7599ec171eBB85a6a05d6B947AFaD";
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
    TTAddress = "0x8f6fDE1B60e0d74CA7B3fD496444Dac2f2C7d882";
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

  let CCAddress: `0x${string}` = "0x80cBDf302A2DfAF7bAE3dA05c5EDA91556abBcB5";

  if (chainId == 4202) {
    CCAddress = "0xC8fb994B992B01C72c969eC9C077CD030eaD2A7F";
  } else if (chainId == 84532) {
    CCAddress = "0x80cBDf302A2DfAF7bAE3dA05c5EDA91556abBcB5";
  }

  const { data: balanceCCLT, refetch } = useReadContract({
    abi: erc20Abi,
    address: CCAddress,
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

export const getPoolRatio = () => {
  const chainId = useChainId();

  let CCAddress: `0x${string}` = "0x80cBDf302A2DfAF7bAE3dA05c5EDA91556abBcB5";

  if (chainId == 4202) {
    CCAddress = "0xC8fb994B992B01C72c969eC9C077CD030eaD2A7F";
  } else if (chainId == 84532) {
    CCAddress = "0x80cBDf302A2DfAF7bAE3dA05c5EDA91556abBcB5";
  }

  const { data: poolRatio } = useReadContract({
    abi: ccswapAbi,
    address: CCAddress,
    functionName: "getPoolRatio",
    //blockTag: "safe",
    chainId: chainId,
  });

  console.log(poolRatio);

  return poolRatio ? Number(poolRatio) : 1;
};

export const getCCtoTTPrice = () => {
  const chainId = useChainId();

  let CCAddress: `0x${string}` = "0x80cBDf302A2DfAF7bAE3dA05c5EDA91556abBcB5";

  if (chainId == 4202) {
    CCAddress = "0xC8fb994B992B01C72c969eC9C077CD030eaD2A7F";
  } else if (chainId == 84532) {
    CCAddress = "0x80cBDf302A2DfAF7bAE3dA05c5EDA91556abBcB5";
  }
  const { data: CCtoTTPrice } = useReadContract({
    abi: ccswapAbi,
    address: CCAddress,
    functionName: "getAssetPrice",
    //blockTag: "safe",
    chainId: chainId,
  });

  console.log(CCtoTTPrice);

  return CCtoTTPrice ? Number(CCtoTTPrice) : 1;
};

export const depositLiquidity = (ccAmount: number, ttAmount: number) => {
  const chainId = useChainId();

  let CCAddress: `0x${string}` = "0x80cBDf302A2DfAF7bAE3dA05c5EDA91556abBcB5";

  if (chainId == 4202) {
    CCAddress = "0x60E26724f5397281b027dca7cA1f8732aEA49243";
  } else if (chainId == 84532) {
    CCAddress = "0x80cBDf302A2DfAF7bAE3dA05c5EDA91556abBcB5";
  }
  const { writeContract } = useWriteContract();

  const cc = ethers.parseUnits((ccAmount * 10 ** 18).toString(), "wei");
  const tt = ethers.parseUnits((ttAmount * 10 ** 18).toString(), "wei");

  console.log("cc", cc, "tt", tt);

  writeContract({
    abi: ccswapAbi,
    address: CCAddress,
    functionName: "addLiquidity",
    args: [cc, tt],
    chainId: chainId,
  });

  return;
};

export const withdrawLiquidity = (ccltAmount: number) => {
  const { writeContract } = useWriteContract();

  const chainId = useChainId();

  let CCAddress: `0x${string}` = "0x80cBDf302A2DfAF7bAE3dA05c5EDA91556abBcB5";

  if (chainId == 4202) {
    CCAddress = "0x60E26724f5397281b027dca7cA1f8732aEA49243";
  } else if (chainId == 84532) {
    CCAddress = "0x80cBDf302A2DfAF7bAE3dA05c5EDA91556abBcB5";
  }

  const cclt = ethers.parseUnits((ccltAmount * 10 ** 18).toString(), "wei");

  console.log("cclt", cclt);

  writeContract({
    abi: ccswapAbi,
    address: CCAddress,
    functionName: "removeLiquidity",
    args: [cclt],
    chainId: chainId,
  });

  return;
};

export const swapCC = (ccltAmount: number) => {
  const { writeContract } = useWriteContract();

  const chainId = useChainId();

  let CCAddress: `0x${string}` = "0x80cBDf302A2DfAF7bAE3dA05c5EDA91556abBcB5";

  if (chainId == 4202) {
    CCAddress = "0xC8fb994B992B01C72c969eC9C077CD030eaD2A7F";
  } else if (chainId == 84532) {
    CCAddress = "0x80cBDf302A2DfAF7bAE3dA05c5EDA91556abBcB5";
  }

  const cclt = ethers.parseUnits((ccltAmount * 10 ** 18).toString(), "wei");

  console.log("cclt", cclt);

  writeContract({
    abi: ccswapAbi,
    address: CCAddress,
    functionName: "swapCC",
    args: [cclt],
    chainId: chainId,
  });

  return;
};
