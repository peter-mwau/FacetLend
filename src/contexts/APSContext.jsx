import { useState } from "react";
import PropTypes from "prop-types";
import { ADDRESSES } from "../constants/addresses";
import APSABI from "../artifacts/contracts/APS.sol/APS.json";
import { client } from "../services/client";
import { toast } from "react-toastify";
import { useActiveAccount } from "thirdweb/react";
import {
  getContract,
  prepareContractCall,
  readContract,
  sendTransaction,
} from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { APSContext } from "./APSContextSetup";

const APS_Address = ADDRESSES.APS;
const APS_ABI = APSABI.abi;

export const APSProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);

  const contract = getContract({
    address: APS_Address,
    abi: APS_ABI,
    client,
    chain: defineChain(11155111),
  });

  const account = useActiveAccount();
  const address = account?.address;

  /* =====================================================================
   * WRITE FUNCTIONS
   * ========================================================================== */

  // function to mint tokens
  // tokenHolder: receiver address
  const mintTokens = async (tokenHolder, amount) => {
    setError(null);
    const toastId = toast.loading("Minting tokens...");
    if (!address) {
      toast.error("Please connect your wallet to mint tokens.");
      return;
    }

    try {
      const transaction = await prepareContractCall({
        contract,
        method: "mintToken",
        params: [tokenHolder, amount],
      });
      await sendTransaction({ transaction, account });
      toast.update(toastId, {
        render: `${amount} APS tokens minted successfully!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error minting tokens:", err);
      setError("Failed to mint tokens. Please try again.");
      toast.update(toastId, {
        render: "Failed to mint tokens. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // Function to burn tokens
  const burnTokens = async (tokenHolder, amount) => {
    setError(null);
    const toastId = toast.loading("Burning tokens...");
    if (!address) {
      toast.error("Please connect your wallet to burn tokens.");
      return;
    }

    try {
      const transaction = await prepareContractCall({
        contract,
        method: "burnToken",
        params: [tokenHolder, amount],
      });
      await sendTransaction({ transaction, account });
      toast.update(toastId, {
        render: `${amount} APS tokens burned successfully!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error burning tokens:", err);
      setError("Failed to burn tokens. Please try again.");
      toast.update(toastId, {
        render: "Failed to burn tokens. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  /* =====================================================================
   * READE FUNCTIONS
   * ========================================================================== */

  //Function to get token balance
  const getTokenBalance = async (tokenAddress) => {
    setError(null);
    if (!address) {
      toast.error("Please connect your wallet to view token balance.");
      return;
    }

    try {
      const balance = await readContract({
        contract,
        method: "balanceOf",
        params: [tokenAddress],
      });
      setTokenBalance(balance);
      return balance;
    } catch (err) {
      console.error("Error fetching token balance:", err);
      setError("Failed to fetch token balance. Please try again.");
      toast.error("Failed to fetch token balance. Please try again.");
    }
  };

  return (
    <APSContext.Provider
      value={{
        error,
        tokenBalance,
        mintTokens,
        burnTokens,
        getTokenBalance,
      }}
    >
      {children}
    </APSContext.Provider>
  );
};

APSProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
