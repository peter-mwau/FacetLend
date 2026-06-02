import { useContext, createContext, useState } from "react";
import PropTypes from "prop-types";
import { ADDRESSES } from "../constants/addresses";
import LendingABI from "../artifacts/contracts/facets/LendingFacet.sol/LendingFacet.json";
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
const Lending_ABI = LendingABI.abi;

export const LendingContext = createContext();

export const useLending = () => {
  return useContext(LendingContext);
};

export const LendingProvider = ({ children }) => {
  const account = useActiveAccount();
  const address = account?.address || null;
  const [loadingInitializingLending, setLoadingInitializingLending] =
    useState(false);
  const [error, setError] = useState(null);
  const [healthFactor, setHealthFactor] = useState(null);
  const [loading, setLoading] = useState(false);

  const contract = getContract({
    address: DiamondAddress,
    abi: Lending_ABI,
    client,
    chain: defineChain(11155111),
  });

  /* =================================================
    WRITING FUNCTIONS
    ================================================= */

  //Function to initiaze lending
  const initializeLending = async (apsTokenAddress, apsdexAddress) => {
    setLoadingInitializingLending(true);
    setError(null);
    const toastId = toast.loading("Initializing Lending...");
    try {
      if (!address || !client) {
        throw new Error(
          "Wallet not connected or Thirdweb client not configured",
        );
      }

      const transaction = await prepareContractCall({
        contract,
        method: "initializeLending",
        params: [apsTokenAddress, apsdexAddress],
      });

      const receipt = await sendTransaction({ transaction, account });
      console.log("Lending initialized, transaction receipt:", receipt);
      toast.update(toastId, {
        render: "Lending initialized successfully!",
        type: "success",
        isLoading: false,
        autoClose: 4000,
      });
    } catch (err) {
      console.error("Error initializing lending:", err);
      setError(err.message || "Failed to initialize lending");
      toast.update(toastId, {
        render: `Error: ${err.message || "Failed to initialize lending"}`,
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setLoadingInitializingLending(false);
    }
  };

  //Function to add collateral
  const addCollateral = async (amount) => {
    setError(null);
    setLoading(true);
    const toastId = toast.loading("Adding collateral...");
    try {
      if (!address || !client) {
        throw new Error(
          "Wallet not connected or Thirdweb client not configured",
        );
      }

      const transaction = await prepareContractCall({
        contract,
        method: "addCollateral",
        params: [amount],
      });

      const receipt = await sendTransaction({ transaction, account });
      console.log("Collateral added, transaction receipt:", receipt);
      toast.update(toastId, {
        render: "Collateral added successfully!",
        type: "success",
        isLoading: false,
        autoClose: 4000,
      });
      return receipt;
    } catch (err) {
      console.error("Error adding collateral:", err);
      setError(err.message || "Failed to add collateral");
      toast.update(toastId, {
        render: `Error: ${err.message || "Failed to add collateral"}`,
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  //Function to Withdraw collateral
  const withdrawCollateral = async (amount) => {
    setError(null);
    setLoading(true);
    const toastId = toast.loading("Withdrawing collateral...");
    try {
      if (!address || !client) {
        throw new Error(
          "Wallet not connected or Thirdweb client not configured",
        );
      }

      const transaction = await prepareContractCall({
        contract,
        method: "withdrawCollateral",
        params: [amount],
      });

      const receipt = await sendTransaction({ transaction, account });
      console.log("Collateral withdrawn, transaction receipt:", receipt);
      toast.update(toastId, {
        render: "Collateral withdrawn successfully!",
        type: "success",
        isLoading: false,
        autoClose: 4000,
      });
      return receipt;
    } catch (err) {
      console.error("Error withdrawing collateral:", err);
      setError(err.message || "Failed to withdraw collateral");
      toast.update(toastId, {
        render: `Error: ${err.message || "Failed to withdraw collateral"}`,
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  //Function to borrow APS tokens
  const borrowAPS = async (amount) => {
    setError(null);
    setLoading(true);
    const toastId = toast.loading("Borrowing APS tokens...");
    try {
      if (!address || !client) {
        throw new Error(
          "Wallet not connected or Thirdweb client not configured",
        );
      }

      const transaction = await prepareContractCall({
        contract,
        method: "borrowAPS",
        params: [amount],
      });

      const receipt = await sendTransaction({ transaction, account });
      console.log("APS tokens borrowed, transaction receipt:", receipt);
      toast.update(toastId, {
        render: "APS tokens borrowed successfully!",
        type: "success",
        isLoading: false,
        autoClose: 4000,
      });
      return receipt;
    } catch (err) {
      console.error("Error borrowing APS tokens:", err);
      setError(err.message || "Failed to borrow APS tokens");
      toast.update(toastId, {
        render: `Error: ${err.message || "Failed to borrow APS tokens"}`,
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  //Function to repay APS tokens
  const repayAPS = async () => {
    setError(null);
    setLoading(true);
    const toastId = toast.loading("Repaying APS tokens...");
    try {
      if (!address || !client) {
        throw new Error(
          "Wallet not connected or Thirdweb client not configured",
        );
      }

      const transaction = await prepareContractCall({
        contract,
        method: "repayLoan",
        params: [],
      });

      const receipt = await sendTransaction({ transaction, account });
      console.log("APS tokens repaid, transaction receipt:", receipt);
      toast.update(toastId, {
        render: "APS tokens repaid successfully!",
        type: "success",
        isLoading: false,
        autoClose: 4000,
      });
      return receipt;
    } catch (err) {
      console.error("Error repaying APS tokens:", err);
      setError(err.message || "Failed to repay APS tokens");
      toast.update(toastId, {
        render: `Error: ${err.message || "Failed to repay APS tokens"}`,
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  //Function to Liquidate undercollateralized positions
  const Liquidate = async (borrower) => {
    setError(null);
    setLoading(true);
    const toastId = toast.loading("Liquidating position...");
    try {
      if (!address || !client) {
        throw new Error(
          "Wallet not connected or Thirdweb client not configured",
        );
      }

      const transaction = await prepareContractCall({
        contract,
        method: "liquidate",
        params: [borrower],
      });

      const receipt = await sendTransaction({ transaction, account });
      console.log("Position liquidated, transaction receipt:", receipt);
      toast.update(toastId, {
        render: "Position liquidated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 4000,
      });
      return receipt;
    } catch (err) {
      console.error("Error liquidating position:", err);
      setError(err.message || "Failed to liquidate position");
      toast.update(toastId, {
        render: `Error: ${err.message || "Failed to liquidate position"}`,
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  //Function to update user's risk status based on current health factor
  const updateRiskStatus = async (userAddress) => {
    setError(null);
    setLoading(true);
    try {
      if (!client) {
        throw new Error("Thirdweb client not configured");
      }

      const transaction = await prepareContractCall({
        contract,
        method: "updateRiskStatus",
        params: [userAddress],
      });

      const receipt = await sendTransaction({ transaction, account });
      console.log("Risk status updated, transaction receipt:", receipt);
      return receipt;
    } catch (err) {
      console.error("Error updating risk status:", err);
      setError(err.message || "Failed to update risk status");
      return null;
    } finally {
      setLoading(false);
    }
  };

  //Function to Harvest user's collateral staking rewards/yield
  const harvestStakingRewards = async () => {
    setError(null);
    setLoading(true);
    const toastId = toast.loading("Harvesting staking rewards...");
    try {
      if (!address || !client) {
        throw new Error(
          "Wallet not connected or Thirdweb client not configured",
        );
      }

      const transaction = await prepareContractCall({
        contract,
        method: "harvestStakingRewards",
        params: [],
      });

      const receipt = await sendTransaction({ transaction, account });
      console.log("Staking rewards harvested, transaction receipt:", receipt);
      toast.update(toastId, {
        render: "Staking rewards harvested successfully!",
        type: "success",
        isLoading: false,
        autoClose: 4000,
      });
      return receipt;
    } catch (err) {
      console.error("Error harvesting staking rewards:", err);
      setError(err.message || "Failed to harvest staking rewards");
      toast.update(toastId, {
        render: `Error: ${err.message || "Failed to harvest staking rewards"}`,
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  /* =================================================
    READING FUNCTIONS
    ================================================= */

  //Function to get user health factor
  const getHealthFactor = async (userAddress) => {
    setError(null);
    setLoading(true);
    try {
      if (!client) {
        throw new Error("Thirdweb client not configured");
      }

      const healthFactor = await readContract({
        contract,
        method: "getHealthFactor",
        params: [userAddress],
      });

      setHealthFactor(healthFactor);
      return healthFactor;
    } catch (err) {
      console.error("Error getting health factor:", err);
      setError(err.message || "Failed to get health factor");
      return null;
    } finally {
      setLoading(false);
    }
  };

  //Function to check liquidation status of a user
  const checkLiquidationStatus = async (userAddress) => {
    setError(null);
    setLoading(true);
    try {
      if (!client) {
        throw new Error("Thirdweb client not configured");
      }

      const isUndercollateralized = await readContract({
        contract,
        method: "canLiquidate",
        params: [userAddress],
      });

      return isUndercollateralized;
    } catch (err) {
      console.error("Error checking liquidation status:", err);
      setError(err.message || "Failed to check liquidation status");
      return null;
    } finally {
      setLoading(false);
    }
  };

  //Function to calculate user's staiking yield
  const calculateStakingYield = async (userAddress) => {
    setError(null);
    setLoading(true);
    try {
      if (!client) {
        throw new Error("Thirdweb client not configured");
      }

      const yieldAmount = await readContract({
        contract,
        method: "calculateStakingYield",
        params: [userAddress],
      });

      return yieldAmount;
    } catch (err) {
      console.error("Error calculating staking yield:", err);
      setError(err.message || "Failed to calculate staking yield");
      return null;
    } finally {
      setLoading(false);
    }
  };

  //Function to get user's repayable amount (principal + interest)
  const getRepayableAmount = async (userAddress) => {
    setError(null);
    setLoading(true);
    try {
      if (!client) {
        throw new Error("Thirdweb client not configured");
      }

      const repayableAmount = await readContract({
        contract,
        method: "getRepayAmount",
        params: [userAddress],
      });

      return repayableAmount;
    } catch (err) {
      console.error("Error getting repayable amount:", err);
      setError(err.message || "Failed to get repayable amount");
      return null;
    } finally {
      setLoading(false);
    }
  };

  //Function to get user's position details (collateral amount, borrowed amount, etc.)
  const getPositionDetails = async (userAddress) => {
    setError(null);
    setLoading(true);
    try {
      if (!client) {
        throw new Error("Thirdweb client not configured");
      }

      const positionDetails = await readContract({
        contract,
        method: "getPosition",
        params: [userAddress],
      });

      return positionDetails;
    } catch (err) {
      console.error("Error getting position details:", err);
      setError(err.message || "Failed to get position details");
      return null;
    } finally {
      setLoading(false);
    }
  };

  //Function to get APS to ETH value from the DEX for collateral valuation
  const getAPSToETHValue = async (apsAmount) => {
    setError(null);
    setLoading(true);
    try {
      if (!client) {
        throw new Error("Thirdweb client not configured");
      }

      const ethValue = await readContract({
        contract,
        method: "apsToETHValue",
        params: [apsAmount],
      });

      return ethValue;
    } catch (err) {
      console.error("Error getting APS to ETH value:", err);
      setError(err.message || "Failed to get APS to ETH value");
      return null;
    } finally {
      setLoading(false);
    }
  };

  LendingProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <LendingContext.Provider
      value={{
        initializeLending,
        addCollateral,
        withdrawCollateral,
        borrowAPS,
        repayAPS,
        Liquidate,
        updateRiskStatus,
        harvestStakingRewards,
        getHealthFactor,
        checkLiquidationStatus,
        calculateStakingYield,
        getRepayableAmount,
        getPositionDetails,
        getAPSToETHValue,
        loadingInitializingLending,
        error,
      }}
    >
      {children}
    </LendingContext.Provider>
  );
};
