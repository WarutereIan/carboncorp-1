import Header from "../components/Header";

import { useEffect, useState } from "react";
import Dropdown from "../components/Dropdown";
import {
  Connector,
  useConnect,
  useAccount,
  useDisconnect,
  useWriteContract,
} from "wagmi";

import { ethers } from "ethers";
import {
  getCCBalance,
  getCCLTBalance,
  getPoolRatio,
  getTTBalance,
} from "../utils/ccUtils";
import { ccswapAbi } from "../utils/abis/ccswap";

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
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);

  const { writeContract, isSuccess, error } = useWriteContract();

  const depositLiquidity = (ccAmount: number, ttAmount: number) => {
    const cc = ethers.parseUnits((ccAmount * 10 ** 18).toString(), "wei");
    const tt = ethers.parseUnits((ttAmount * 10 ** 18).toString(), "wei");

    console.log("cc", cc, "tt", tt);

    writeContract({
      abi: ccswapAbi,
      address: "0x857260f0f04571c9512cb94D36948b0027583b9D",
      functionName: "addLiquidity",
      args: [cc, tt],
      chainId: 4202,
    });
  };

  const ratio = getPoolRatio();

  const handleDeposit = () => {
    depositLiquidity(depositAmount, depositAmount / ratio);
  };

  const withdrawLiquidity = (ccltAmount: number) => {
    const cclt = ethers.parseUnits((ccltAmount * 10 ** 18).toString(), "wei");

    console.log("cclt", cclt);

    writeContract({
      abi: ccswapAbi,
      address: "0x857260f0f04571c9512cb94D36948b0027583b9D",
      functionName: "removeLiquidity",
      args: [cclt],
      chainId: 4202,
    });

    return;
  };

  const handleWithdrawal = () => {
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

      <section className="flex flex-col justify-center gap-10 items-center h-full space-y-10">
        {!isConnected ? (
          <div className="rounded-lg w-[25rem] p-5 c bg-white ">
            <h4 className="text-black font-semibold">Connect to wallet</h4>
            <div>
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
                  Amount in CC (Pool Ratio CC:TT = {getPoolRatio()} )
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    className="block py-2 pl-3 w-full border rounded-md border-gray-300 pr-10 text-black"
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                  />
                  <div className="pointer-events-none absolute text-blue-400 inset-y-0 right-0 flex items-center pr-3">
                    MAX
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[#76809D]">Available</p>
              <p className="text-[#76809D]">{getCCBalance(address!)} CC</p>
              <p className="text-[#76809D]">{getTTBalance(address!)} TT</p>
            </div>
            <p className="text-[#76809D]">
              Amount to be deposited: {depositAmount} CC :{" "}
              {depositAmount / getPoolRatio()} TT
            </p>

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
              <button className="text-black p-2 border  rounded-lg">
                Cancel
              </button>
              <button
                className="bg-[#00632B] p-2 text-white rounded-lg"
                onClick={handleDeposit}
              >
                Confirm Deposit
              </button>
            </div>

            {isSuccess && <p className="text-[#76809D]">Deposit successful!</p>}
            {error && (
              <p className="text-[#76809D]">Error: Error making transaction</p>
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
              <button className="text-black p-2 border  rounded-lg">
                Cancel
              </button>
              <button
                className="bg-[#00632B] p-2 text-white rounded-lg"
                onClick={handleWithdrawal}
              >
                Confirm Withdraw
              </button>
            </div>
          </div>

          <div>
            <button onClick={() => disconnect()}>Disconnect Wallet</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Wallet;
