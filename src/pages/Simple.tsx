import { FaArrowRight, FaCog } from "react-icons/fa";
import { IoSwapVertical } from "react-icons/io5";
import Dropdown from "../components/Dropdown";
import { getCCBalance, getCCtoTTPrice, getTTBalance } from "../utils/ccUtils";

const Simple = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const [swapAmount, setSwapAmount] = useState(0);
  const { writeContract, isSuccess, error, isPending } = useWriteContract();

  const chainId = useChainId();

  let ccSwapAddress: `0x${string}` =
    "0xafC9D020d0b67522337058f0fDea057769dd386A";

  if (chainId == 4202) {
    ccSwapAddress = "0x665FE43468B4a10128a406bc4F826065C9cDA877";
  } else if (chainId == 84532) {
    ccSwapAddress = "0xafC9D020d0b67522337058f0fDea057769dd386A";
  }

  const swapCC = (ccltAmount: number) => {
    const cclt = ethers.parseUnits(ccltAmount.toString(), "ether");

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

  const handleSwap = () => {
    swapCC(swapAmount);
  };

  return (
    <div className="flex justify-center items-center">
      <article>
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/market/advanced")}
            className="mb-2 p-2 hover:bg-[#252b36] border text-sm rounded-lg flex items-center gap-2"
          >
            Advanced <FaArrowRight />
          </button>
        </div>
        <div className="p-7 bg-[#252b36] rounded-lg w-[30rem]">
          <div className="flex items-center justify-between">
            <p className="text-[#717A8C] font-bold">Swap</p>
            <FaCog size={20} color="#717A8C" />
          </div>
          <div className="relative flex flex-col gap-3 mt-3">
            <div className="w-14 absolute inset-0 m-auto h-14 border flex justify-center items-center rounded-full p-5 bg-[#2b3342]">
              <IoSwapVertical color="#717A8C" size={30} />
            </div>
            <div className="h-24 bg-[#2b3342] rounded-lg flex flex-col justify-between p-3">
              <div className="flex justify-between items-center">
                <Dropdown asset="CC" label="" />
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  className="block py-2 pl-3 w-40 border rounded-md border-gray-300 pr-10 text-black"
                  onChange={(e) => setSwapAmount(Number(e.target.value))}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[#717A8C]">
                  Balance: {getCCBalance(address!)} CC{" "}
                </p>
                <p className="text-[#717A8C]"> = $ 626.23</p>
              </div>
            </div>
            <div className="h-24 bg-[#2b3342] rounded-lg flex flex-col justify-between p-3">
              <div className="flex justify-between items-center">
                <Dropdown asset="TT" label="" />
                {/*  <input
                  type="number"
                  name="amount"
                  id="amount"
                  className="block py-2 pl-3 w-20 border rounded-md border-gray-300 pr-10 text-black"
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                /> */}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[#717A8C]">
                  Balance: {getTTBalance(address!)} TT
                </p>
                <p className="text-[#717A8C]"> = $ 626.23</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-7 bg-[#252b36] rounded-lg w-[30rem] mt-3">
          <div className="relative flex flex-col gap-3 mt-3">
            <div className="flex items-center justify-between">
              <p className="text-[#717A8C] font-bold">Summary</p>
            </div>
            <div className=" p-3 bg-[#2b3342] rounded-lg border border-[#516AE4]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[#717A8C]">Price</p>
                <p className="text-[#717A8C]">
                  1 CC = {getCCtoTTPrice() * 10 ** -18} TT
                </p>
              </div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[#717A8C]">You will receive</p>
                <p className="text-[#717A8C]">
                  {swapAmount} CC ={" "}
                  {swapAmount * (getCCtoTTPrice() * 10 ** -18)} TT
                </p>
              </div>
              <div className="flex items-center justify-between mb-2">
                {/* <p className="text-[#717A8C]">Fee</p>
                <p className="text-[#717A8C]">0 TT</p> */}
              </div>
            </div>

            <button
              className="w-full text-lg p-3 shadow-lg bg-[#516AE4] rounded-lg"
              onClick={handleSwap}
            >
              Swap
            </button>
          </div>
          {isPending && !isSuccess && (
            <p className="text-[#76809D]">Loading...</p>
          )}
          {isSuccess && (
            <p className="text-[#76809D]">Withdrawal successful!</p>
          )}
          {error && <p className="text-[#76809D]">Error making transaction</p>}
          {error && (
            <div className="text-red-500 mt-2">Error: {error.message}</div>
          )}
        </div>
      </article>
    </div>
  );
};

export default Simple;

import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

import { useAccount, useChainId, useWriteContract } from "wagmi";
import { ethers } from "ethers";
import { ccswapAbi } from "../utils/abis/ccswap";

const people = [
  { id: 1, name: "CC" },
  { id: 2, name: "Metamask" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function DropDown() {
  const [selected, setSelected] = useState(people[0]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-[160%] cursor-default rounded-md border border-gray-300 bg-[#252b36] py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
              <span className="block truncate">{selected.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {people.map((person) => (
                  <Listbox.Option
                    key={person.id}
                    className={({ active }) =>
                      classNames(
                        active ? "text-white bg-indigo-600" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {person.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
