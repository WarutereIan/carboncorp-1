import Header from "../components/Header";
import cc from "../assets/user.png.png";
import wc from "../assets/WalletConnect.png";
import mm from "../assets/mm.png";
import { useState } from "react";
import Dropdown from "../components/Dropdown";
const Wallet = () => {
  const [init, setInit] = useState(true);
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
  ];

  return (
    <div className="h-[75vh] relative">
      <Header
        title="CONNECT WALLET"
        subtitle="Connect a wallet that you own."
      />

      <section className="flex justify-center gap-10 items-center h-full">
        {init ? (
          <div className="rounded-lg w-[25rem] p-5 c bg-white">
            <h4 className="text-black font-semibold">Connect to wallet</h4>
            <div>
              {coins.map((coin) => (
                <div
                  onClick={() => setInit(false)}
                  className="flex justify-between gap-3 bg-[#DBDDE5] border p-3 rounded-md shadow items-center mt-3"
                  key={coin.id}
                >
                  <p className="text-[#111] text-sm font-bold">{coin.name}</p>
                  <img src={coin.image} alt="" className="w-7 h-7" />
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
        ) : (
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="p-5 bg-white rounded-lg w-[25rem]">
              <h4 className="text-black font-semibold">Deposit</h4>
              <div>
                <Dropdown label="Asset" />

                <div>
                  <label
                    htmlFor="account-number"
                    className="block text-sm font-medium text-black"
                  >
                    Amount
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="text"
                      name="amount"
                      id="amount"
                      className="block py-2 pl-3 w-full border rounded-md border-gray-300 pr-10 outline-none sm:text-sm"
                    />
                    <div className="pointer-events-none absolute text-blue-400 inset-y-0 right-0 flex items-center pr-3">
                      MAX
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[#76809D]">Available</p>
                <p className="text-[#76809D]">0.00 USDT</p>
              </div>

              <div>
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
              </div>
              <div className="mt-3 flex items-center gap-3 justify-end">
                <button className="text-black p-2 border  rounded-lg">
                  Cancel
                </button>
                <button className="bg-[#00632B] p-2 text-white rounded-lg">
                  Confirm Deposit
                </button>
              </div>
            </div>
            <div className="p-5 bg-white rounded-lg w-[25rem]">
              <h4 className="text-black font-semibold">Withdraw</h4>
              <div>
                <Dropdown label="Asset" />
                <div>
                  <label
                    htmlFor="account-number"
                    className="block text-sm font-medium text-black"
                  >
                    Amount
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="text"
                      name="amount"
                      id="amount"
                      className="block py-2 pl-3 w-full border rounded-md border-gray-300 pr-10 outline-none sm:text-sm"
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
                  <p className="text-[#76809D]">0.00 USDT</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#76809D]">Locked Balances</p>
                  <p className="text-[#76809D]">0.00 USDT</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3 justify-end">
                <button className="text-black p-2 border  rounded-lg">
                  Cancel
                </button>
                <button className="bg-[#00632B] p-2 text-white rounded-lg">
                  Confirm Withdraw
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Wallet;
