/* eslint-disable react-refresh/only-export-components */
import { useContext, createContext, useState } from "react";
import PropTypes from "prop-types";
import { ADDRESSES } from "../constants/addresses";
import FlashLoanABI from "../artifacts/contracts/facets/FlashLoanFacet.sol/FlashLoanFacet.json";
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

const DiamondAddress = ADDRESSES.MainDiamond;
const FlashLoan_ABI = FlashLoanABI.abi;

const FlashLoanContext = createContext();

export const useFlashLoan = () => {
  return useContext(FlashLoanContext);
};

export const FlashLoanProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [loadingInitializingFlashLoan, setLoadingInitializingFlashLoan] =
    useState(false);
  const [tokenBalance, setTokenBalance] = useState(null);

  const contract = getContract({
    address: DiamondAddress,
    abi: FlashLoan_ABI,
    client,
    chain: defineChain(11155111),
  });

  const account = useActiveAccount();
  const address = account?.address;

  /* =====================================================================
   * WRITER FUNCTIONS
   * ========================================================================== */

  //Function to initializeFlashLoan
  const initializeFlashLoan = async (aavePoolAddress) => {
    setLoadingInitializingFlashLoan(true);
    const toastId = toast.loading("Initializing flash loan...");
    setError(null);
    if (!address) {
      toast.error("Please connect your wallet to initialize flash loan.");
      setLoadingInitializingFlashLoan(false);
      toast.dismiss(toastId);
      return;
    }

    try {
      const transaction = await prepareContractCall({
        contract,
        method: "initializeFlashLoan",
        params: [aavePoolAddress],
      });

      await sendTransaction({ transaction, account });
      toast.update(toastId, {
        render: "Flash loan initialized successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error initializing flash loan:", err);
      toast.update(toastId, {
        render: "Failed to initialize flash loan. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      setError("Failed to initialize flash loan. Please try again.");
    } finally {
      setLoadingInitializingFlashLoan(false);
    }
  };

  //Function to requestFlashLoan
  const requestFlashLoan = async (asset, amount) => {
    setError(null);
    const toastId = toast.loading("Requesting flash loan...");
    if (!address) {
      toast.error("Please connect your wallet to request a flash loan.");
      toast.dismiss(toastId);
      return;
    }

    try {
      const transaction = await prepareContractCall({
        contract,
        method: "requestFlashLoanSimple",
        params: [asset, amount],
      });

      await sendTransaction({ transaction, account });
      toast.update(toastId, {
        render: "Flash loan requested successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error requesting flash loan:", err);
      toast.update(toastId, {
        render: "Failed to request flash loan. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      setError("Failed to request flash loan. Please try again.");
    }
  };

  //Function to Withdraw flash loan profits
  const withdrawFlashLoanProfits = async (recipient) => {
    setError(null);
    const toastId = toast.loading("Withdrawing flash loan profits...");
    if (!address) {
      toast.error("Please connect your wallet to withdraw flash loan profits.");
      toast.dismiss(toastId);
      return;
    }

    try {
      const transaction = await prepareContractCall({
        contract,
        method: "withdrawFunds",
        params: [recipient],
      });

      await sendTransaction({ transaction, account });
      toast.update(toastId, {
        render: "Flash loan profits withdrawn successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error withdrawing flash loan profits:", err);
      toast.update(toastId, {
        render: "Failed to withdraw flash loan profits. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      setError("Failed to withdraw flash loan profits. Please try again.");
    }
  };

  /* =====================================================================
   * READER FUNCTIONS
   * ========================================================================== */

  //Function to get token balance of the flash loan contract
  const getFlashLoanContractBalance = async (tokenAddress) => {
    setError(null);
    try {
      const balance = await readContract({
        contract,
        method: "getBalance", // ✅ Changed from "getContractTokenBalance" to "getBalance"
        params: [tokenAddress],
      });
      setTokenBalance(balance);
      return balance;
    } catch (err) {
      console.error("Error getting flash loan contract balance:", err);
      setError("Failed to get flash loan contract balance. Please try again.");
      return null;
    }
  };

  return (
    <FlashLoanContext.Provider
      value={{
        initializeFlashLoan,
        requestFlashLoan,
        withdrawFlashLoanProfits,
        getFlashLoanContractBalance,
        loadingInitializingFlashLoan,
        error,
        tokenBalance,
      }}
    >
      {children}
    </FlashLoanContext.Provider>
  );
};

FlashLoanProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
