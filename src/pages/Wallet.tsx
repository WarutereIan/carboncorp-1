import Header from "../components/Header";

import { useEffect, useState } from "react";
import Dropdown from "../components/Dropdown";
import {
  Connector,
  useConnect,
  useAccount,
  useDisconnect,
  useWriteContract,
  useChainId,
  useReadContract,
  useWatchContractEvent,
} from "wagmi";

import { ethers } from "ethers";
import { getCCBalance, getCCLTBalance, getTTBalance } from "../utils/ccUtils";
import { ccswapAbi } from "../utils/abis/ccswap";
import { erc20Abi } from "viem";

const Wallet = () => {
  /*  const [init, setInit] = useState(false);
  const coins = [
    {
      id: 1,
      name: "Carbon Corp Wallet",
      image: cc,
    },
    {
      id: 2,
      name: "WalletConnect",
      image: wc,
    },
    {
      id: 3,
      name: "Metamask",
      image: mm,
    },
  ]; */

  const { connectors, connect } = useConnect();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const [ccDepositAmount, setCCDepositAmount] = useState(0);
  const [ttDepositAmount, setTTDepositAmount] = useState(0);
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  const [activeAction, setActiveAction] = useState(0);
  const [isRequesting, setIsRequesting] = useState(false);

  let { writeContract, isSuccess, error, isPending } = useWriteContract();

  const chainId = useChainId();

  let ccSwapAddress: `0x${string}` =
    "0x80cBDf302A2DfAF7bAE3dA05c5EDA91556abBcB5";

  if (chainId == 4202) {
    ccSwapAddress = "0xC8fb994B992B01C72c969eC9C077CD030eaD2A7F";
  } else if (chainId == 84532) {
    ccSwapAddress = "0x80cBDf302A2DfAF7bAE3dA05c5EDA91556abBcB5";
  }

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
  //get allowance
  const { data: allowanceTT, refetch } = useReadContract({
    abi: erc20Abi,
    address: TTAddress,
    functionName: "allowance",
    args: [address!, ccSwapAddress],
    account: address,
    chainId: chainId,
  });

  useWatchContractEvent({
    address: TTAddress,
    abi: erc20Abi,
    eventName: "Approval",
    onLogs(logs) {
      const relevantLog = logs.find((log) => log.args.owner === address);
      if (relevantLog) {
        refetch();
      }
    },
  });

  const { data: allowanceCC } = useReadContract({
    abi: erc20Abi,
    address: CCAddress,
    functionName: "allowance",
    args: [address!, ccSwapAddress],
    account: address,
    chainId: chainId,
  });

  useWatchContractEvent({
    address: CCAddress,
    abi: erc20Abi,
    eventName: "Approval",
    onLogs(logs) {
      const relevantLog = logs.find((log) => log.args.owner === address);
      if (relevantLog) {
        refetch();
      }
    },
  });

  let CC_allowance;
  let TT_allowance;

  if (allowanceCC) {
    CC_allowance = ethers.formatUnits(allowanceCC!, 18);
  } else {
    CC_allowance = 0;
  }

  if (allowanceTT) {
    TT_allowance = ethers.formatUnits(allowanceTT!, 18);
  } else {
    TT_allowance = 0;
  }

  useEffect(() => {
    if (allowanceTT) {
      TT_allowance = ethers.formatUnits(allowanceTT!, 18);
    } else {
      TT_allowance = 0;
    }
  }, [allowanceTT]);

  useEffect(() => {
    if (allowanceCC) {
      CC_allowance = ethers.formatUnits(allowanceCC!, 18);
    } else {
      CC_allowance = 0;
    }
  }, [allowanceCC]);

  const approveTTSpender = () => {
    writeContract({
      abi: erc20Abi,
      address: TTAddress,
      functionName: "approve",
      args: [ccSwapAddress, ethers.parseEther("1000000")],
      chainId: chainId,
    });
  };

  const approveCCSpender = () => {
    writeContract({
      abi: erc20Abi,
      address: CCAddress,
      functionName: "approve",
      args: [ccSwapAddress, ethers.parseEther("1000000")],
      chainId: chainId,
    });
  };

  //check for allowance for the tokens, if zero give as 1m

  const depositLiquidity = (ccAmount: number, ttAmount: number) => {
    const cc = ethers.parseUnits(ccAmount.toString(), "ether");
    let tt = ethers.parseUnits(ttAmount.toString(), "ether");

    console.log("cc", cc, "tt", tt);

    writeContract({
      abi: ccswapAbi,
      address: ccSwapAddress,
      functionName: "addLiquidity",
      args: [cc, tt],
      chainId: chainId,
    });
  };

  //const ratio = getPoolRatio();

  const handleDeposit = () => {
    setActiveAction(1);
    depositLiquidity(ccDepositAmount, ttDepositAmount);
  };

  const withdrawLiquidity = (ccltAmount: number) => {
    const cclt = ethers.parseUnits(ccltAmount.toString(), "ether");

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

  const handleWithdrawal = () => {
    setActiveAction(2);
    withdrawLiquidity(withdrawalAmount);
  };

  function WalletOption({
    connector,
    onClick,
  }: {
    connector: Connector;
    onClick: () => void;
  }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
      (async () => {
        const provider = await connector.getProvider();
        setReady(!!provider);
      })();
    }, [connector]);

    return (
      <button disabled={!ready} onClick={onClick}>
        {connector.name}
      </button>
    );
  }

  return (
    <div className="h-[75vh] relative">
      <Header
        title="CONNECT WALLET"
        subtitle="Connect a wallet that you own."
      />

      <section className="flex flex-col justify-center gap- items-center h-full space-y-1 mt-100">
        {!isConnected ? (
          <div className="rounded-lg w-[25rem] p-5 c bg-white">
            <h4 className="text-black font-semibold">Connect to wallet</h4>
            <div className="h-50">
              {connectors.map((connector) => (
                <div className="flex justify-between gap-3 bg-[#DBDDE5] border p-3 rounded-md shadow items-center mt-3">
                  <WalletOption
                    onClick={() => connect({ connector })}
                    key={connector.uid}
                    connector={connector}
                  ></WalletOption>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <p className="text-center text-[#5A6689] text-sm">
                By connecting to a wallet, you agree to CC
              </p>
              <p className="text-center text-[#2563EB] text-sm">
                Terms of service
              </p>
            </div>
          </div>
        ) : null}
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="p-5 bg-white rounded-lg w-[25rem]">
            <h4 className="text-black font-semibold">Deposit</h4>
            <div>
              <Dropdown label="Asset" asset="CC : TT (Test ERC20) Pair " />

              <div>
                <label
                  htmlFor="account-number"
                  className="block text-sm font-medium text-black"
                >
                  Amount in CC:
                </label>
                <div className="relative mt-1 rounded-md shadow-sm ">
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    className="block py-2 pl-3 w-full border rounded-md border-gray-300 pr-10 text-black"
                    onChange={(e) => setCCDepositAmount(Number(e.target.value))}
                  />
                  <label
                    htmlFor="account-number"
                    className="block text-sm font-medium text-black"
                  >
                    Amount in TT:
                  </label>
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    className="block py-2 pl-3 w-full border rounded-md border-gray-300 pr-10 text-black mt-1"
                    onChange={(e) => setTTDepositAmount(Number(e.target.value))}
                  />
                  {/*   <div className="pointer-events-none absolute text-blue-400 inset-y-0 right-0 flex items-center pr-3">
                    MAX
                  </div> */}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[#76809D]">Available</p>
              <p className="text-[#76809D]">{getCCBalance(address!)} CC</p>
              <p className="text-[#76809D]">{getTTBalance(address!)} TT</p>
            </div>
            <div className="flex justify-between items-center mt-1">
              <p className="text-[#76809D]">Allowance:</p>
              <p className="text-[#76809D]">
                {Number(CC_allowance?.toString()).toFixed(4)} CC
              </p>
              <p className="text-[#76809D]">
                {Number(TT_allowance?.toString()).toFixed(4)} TT
              </p>
            </div>
            {/* <p className="text-[#76809D]">
              Amount to be deposited: {depositAmount} CC :{" "}
              {(depositAmount / (getPoolRatio() * 10 ** -18)).toFixed(4)} TT
            </p> */}

            {/*  <div>
              <h6 className="text-[#76809D]">Expiration time</h6>
              <div className="flex justify-between my-3">
                <div className="flex items-center gap-2">
                  <input type="radio" name="time" id="" />
                  <label htmlFor="time" className="text-gray-600">
                    5 m
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" name="time" id="" />
                  <label htmlFor="time" className="text-gray-600">
                    10 m
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" name="time" id="" />
                  <label htmlFor="time" className="text-gray-600">
                    30 m
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" name="time" id="" />
                  <label htmlFor="time" className="text-gray-600">
                    1 h
                  </label>
                </div>
              </div>
            </div> */}
            <div className="mt-3 flex items-center gap-3 justify-end">
              <button
                className="text-black p-2 border  rounded-lg"
                onClick={() => {
                  setActiveAction(0);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-[#00632B] p-2 text-white rounded-lg"
                onClick={handleDeposit}
              >
                Confirm Deposit
              </button>
            </div>
            {activeAction == 1 && isPending && !isSuccess && (
              <p className="text-[#76809D]">Loading...</p>
            )}
            {activeAction == 1 && isSuccess && (
              <p className="text-[#76809D]">Deposit successful!</p>
            )}
            {activeAction == 1 && error && (
              <p className="text-[#76809D]">Error making transaction</p>
            )}
            {activeAction == 1 && error && (
              <div className="text-red-500 mt-2">Error: {error.name}</div>
            )}
          </div>
          <div className="p-5 bg-white rounded-lg w-[25rem]">
            <h4 className="text-black font-semibold">Withdraw</h4>
            <div>
              <Dropdown label="Asset" asset="CCLT(Liquidity Token)" />
              <div>
                <label
                  htmlFor="account-number"
                  className="block text-sm font-medium text-black"
                >
                  Amount
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    className="block py-2 pl-3 w-full border rounded-md border-gray-300 pr-10 outline-none sm:text-sm text-black"
                    onChange={(e) =>
                      setWithdrawalAmount(Number(e.target.value))
                    }
                  />
                  <div className="pointer-events-none absolute text-blue-400 inset-y-0 right-0 flex items-center pr-3">
                    MAX
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <p className="text-[#76809D]">Available</p>
                <p className="text-[#76809D]">
                  {getCCLTBalance(address!)} CCLT
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[#76809D]">Locked Balances</p>
                <p className="text-[#76809D]">
                  {getCCLTBalance(address!)} CCLT
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3 justify-end">
              <button
                className="text-black p-2 border  rounded-lg"
                onClick={() => {
                  if (error) {
                    error.message = "";
                  }
                }}
              >
                Cancel
              </button>
              <button
                className="bg-[#00632B] p-2 text-white rounded-lg"
                onClick={handleWithdrawal}
              >
                Confirm Withdraw
              </button>
            </div>
            {activeAction == 2 && isPending && !isSuccess && (
              <p className="text-[#76809D]">Loading...</p>
            )}
            {activeAction == 2 && isSuccess && (
              <p className="text-[#76809D]">Withdrawal successful!</p>
            )}
            {activeAction == 2 && error && (
              <p className="text-[#76809D]">Error making transaction</p>
            )}
            {activeAction == 2 && error && (
              <div className="text-red-500 mt-2">Error: {error.message}</div>
            )}
          </div>

          <div>
            <div className="flex flex-row justify-between gap-5">
              <button
                className="bg-[#00632B] p-2 text-white rounded-lg"
                onClick={approveCCSpender}
              >
                Increase CC Allowance
              </button>
              <button
                className="bg-[#00632B] p-2 text-white rounded-lg"
                onClick={approveTTSpender}
              >
                Increase TT Allowance
              </button>
            </div>

            <div className="flex justify-center mt-3">
              <button
                className="bg-[#00632B] p-2 text-white rounded-lg"
                onClick={async () => {
                  //make call to faucet
                  const url = `https://api.carboncorp.xyz/faucet/${address!}`;

                  setIsRequesting(true);

                  try {
                    const response = await fetch(url, {
                      /* body: JSON.stringify({ wallet: address }),
                      method: "POST", */
                    });
                    if (!response.ok) {
                      throw new Error(`Response status: ${response.status}`);
                    }
                    console.log(response);

                    const json = await response.json();
                    console.log(json);

                    setIsRequesting(false);

                    return alert(
                      JSON.stringify({
                        msg: json.msg,
                        tx1_hash: json.CC,
                        tx2_hash: json.TT,
                      })
                    );
                  } catch (error: any) {
                    console.error(error.message);
                    setIsRequesting(false);
                    alert(error);
                  }
                }}
              >
                {isRequesting ? "Requesting..." : "Request Faucet Tokens"}
              </button>
            </div>

            <div className="flex justify-center mt-3">
              <button
                className="bg-[red] p-2 text-white rounded-lg"
                onClick={() => disconnect()}
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Wallet;
