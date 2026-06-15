/* eslint-disable react-refresh/only-export-components */
import { useContext, createContext, useState } from "react";
import PropTypes from "prop-types";
import { ADDRESSES } from "../constants/addresses";
import APSDEX_ABI from "../artifacts/contracts/facets/ApsdexFacet.sol/ApsdexFacet.json";
import APS_TOKEN_ABI from "../artifacts/contracts/APS.sol/APS.json";
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
import { parseEther } from "viem";

const DiamondAddress = ADDRESSES.MainDiamond;
const APSAddress = ADDRESSES.APS;
const APSDEXABI = APSDEX_ABI.abi;
const APS_TOKENABI = APS_TOKEN_ABI.abi;

const APSDEXContext = createContext();

export const useAPSDEX = () => {
  return useContext(APSDEXContext);
};

export const APSDEXProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(null);
  const [xInput, setXInput] = useState(null);
  const [yOutput, setYOutput] = useState(null);
  const [ethReserves, setEthReserves] = useState(null);
  const [tokenReserves, setTokenReserves] = useState(null);
  const [totalLiquidity, setTotalLiquidity] = useState(null);
  const [providerLiquidity, setProviderLiquidity] = useState(null);

  const contract = getContract({
    address: DiamondAddress,
    abi: APSDEXABI,
    client,
    chain: defineChain(11155111),
  });

  const account = useActiveAccount();
  const address = account?.address;

  /* =====================================================================
   * WRITER FUNCTIONS
   * ========================================================================== */

  const approveAPSTokens = async (amount) => {
    setLoading(true);
    setError(null);
    const toastId = toast.loading("Approving APS tokens...");

    if (!address) {
      toast.error("Please connect your wallet");
      setLoading(false);
      return;
    }

    try {
      // Get APS token contract
      const apsTokenContract = getContract({
        address: APSAddress, // Your APS token address
        abi: APS_TOKENABI, // You'll need the ERC20 ABI
        client,
        chain: defineChain(11155111),
      });

      const transaction = await prepareContractCall({
        contract: apsTokenContract,
        method: "approve",
        params: [DiamondAddress, amount], // Approve Diamond contract to spend APS
      });

      await sendTransaction({ transaction, account });

      toast.update(toastId, {
        render: "✅ APS tokens approved successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      return true;
    } catch (err) {
      console.error("Error approving APS tokens:", err);
      toast.update(toastId, {
        render: "❌ Failed to approve APS tokens.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  //Function to initializeAPSDEX pool
  const initializeAPSDEX = async (apsAmountInWei) => {
    // This function expects wei already
    if (!apsAmountInWei || apsAmountInWei <= 0) {
      toast.error("Please enter a valid APS amount");
      return false;
    }

    setLoading(true);
    const toastId = toast.loading("Initializing APSDEX pool...");

    if (!address) {
      toast.error("Please connect your wallet");
      setLoading(false);
      return false;
    }

    try {
      const apsTokenContract = getContract({
        address: APSAddress,
        abi: APS_TOKENABI,
        client,
        chain: defineChain(11155111),
      });

      // Check allowance
      const allowance = await readContract({
        contract: apsTokenContract,
        method: "allowance",
        params: [address, DiamondAddress],
      });

      // If allowance is insufficient, approve
      if (allowance < apsAmountInWei) {
        toast.info("Approving APS tokens...");

        const approveTx = await prepareContractCall({
          contract: apsTokenContract,
          method: "approve",
          params: [DiamondAddress, apsAmountInWei],
        });

        await sendTransaction({ transaction: approveTx, account });

        toast.update(toastId, {
          render: "Approved! Initializing pool...",
          isLoading: true,
        });
      }

      // Initialize pool
      const transaction = await prepareContractCall({
        contract,
        method: "initializePool",
        params: [apsAmountInWei],
        value: parseEther("0.1"),
      });

      await sendTransaction({ transaction, account });

      toast.update(toastId, {
        render: "✅ Pool initialized successfully!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });

      return true;
    } catch (err) {
      console.error("Error:", err);
      toast.update(toastId, {
        render: `❌ Failed: ${err.message?.slice(0, 80)}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  //Function to swap tokens on APSDEX
  const swapOnAPSDEX = async (amount) => {
    setLoading(true);
    setError(null);
    const toastId = toast.loading("Swapping tokens on APSDEX...");
    if (!address) {
      toast.error("Please connect your wallet to swap tokens on APSDEX.");
      setLoading(false);
      toast.dismiss(toastId);
      return;
    }

    try {
      const transaction = await prepareContractCall({
        contract,
        method: "swap",
        params: [amount],
      });

      await sendTransaction({ transaction, account });

      toast.update(toastId, {
        render: "Tokens swapped successfully on APSDEX!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error swapping tokens on APSDEX:", err);
      setError(err);
      toast.update(toastId, {
        render: "Failed to swap tokens on APSDEX.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  //Function to deposit into APSDEX pool
  const depositToAPSDEX = async () => {
    setLoading(true);

    setError(null);
    const toastId = toast.loading("Depositing into APSDEX pool...");
    if (!address) {
      toast.error("Please connect your wallet to deposit into APSDEX pool.");
      setLoading(false);
      toast.dismiss(toastId);
      return;
    }

    try {
      const transaction = await prepareContractCall({
        contract,
        method: "deposit",
        params: [],
      });

      await sendTransaction({ transaction, account });

      toast.update(toastId, {
        render: "Deposited into APSDEX pool successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error depositing into APSDEX pool:", err);
      setError(err);
      toast.update(toastId, {
        render: "Failed to deposit into APSDEX pool.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  //Function to withdraw from APSDEX pool
  const withdrawFromAPSDEX = async (ethAmount, tokenAmount) => {
    setLoading(true);
    setError(null);
    const toastId = toast.loading("Withdrawing from APSDEX pool...");
    if (!address) {
      toast.error("Please connect your wallet to withdraw from APSDEX pool.");
      setLoading(false);
      toast.dismiss(toastId);
      return;
    }

    try {
      const transaction = await prepareContractCall({
        contract,
        method: "withdraw",
        params: [ethAmount, tokenAmount],
      });

      await sendTransaction({ transaction, account });

      toast.update(toastId, {
        render: "Withdrew from APSDEX pool successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error withdrawing from APSDEX pool:", err);
      setError(err);
      toast.update(toastId, {
        render: "Failed to withdraw from APSDEX pool.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================================
   * HELPER FUNCTIONS
   * ========================================================================== */
  const formatPrice = (priceValue) => {
    if (priceValue === null || priceValue === undefined) return null;
    const raw =
      typeof priceValue === "bigint" ? Number(priceValue) : Number(priceValue);
    const divisor = 10 ** 18;
    return raw / divisor;
  };

  /* =====================================================================
   * READ FUNCTIONS
   * ========================================================================== */

  //Function to get current price from APSDEX
  const getCurrentPrice = async () => {
    setError(null);
    try {
      // First check if pool is initialized
      const reserves = await readContract({
        contract,
        method: "apsReserve",
        params: [],
      }).catch(() => null);

      // If reserves are zero, pool isn't initialized
      if (!reserves || reserves === 0n) {
        console.log("Pool not initialized yet");
        setPrice(null);
        return null;
      }

      const price = await readContract({
        contract,
        method: "currentPrice",
        params: [],
      });
      const p = formatPrice(price);
      if (p !== null ? p.toFixed(6) : "—");
      setPrice(p);
      return p;
    } catch (err) {
      // Don't show toast for uninitialized pool
      if (err.message?.includes("APS reserve is zero")) {
        console.log("Pool not initialized - please initialize first");
        return null;
      }
      console.error("Error fetching current price from APSDEX:", err);
      setError(err);
    }
  };

  //Function to calculate the xInput required to get desired yOutput from APSDEX
  const calculateXInput = async (yOutput, xReserves, yReserves) => {
    setError(null);
    const toastId = toast.loading("Calculating x input from APSDEX...");
    try {
      const xInput = await readContract({
        contract,
        method: "calculateXInput",
        params: [yOutput, xReserves, yReserves],
      });
      setXInput(xInput);

      toast.update(toastId, {
        render: "X input calculated successfully from APSDEX!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      return xInput;
    } catch (err) {
      console.error("Error calculating x input from APSDEX:", err);
      setError(err);
      toast.update(toastId, {
        render: "Failed to calculate x input from APSDEX.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  //Function to calculate the yOutput received for given xInput from APSDEX
  const calculateYOutput = async (xInput, xReserves, yReserves) => {
    setError(null);
    const toastId = toast.loading("Calculating y output from APSDEX...");
    try {
      const yOutput = await readContract({
        contract,
        method: "price",
        params: [xInput, xReserves, yReserves],
      });
      setYOutput(yOutput);

      toast.update(toastId, {
        render: "Y output calculated successfully from APSDEX!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      return yOutput;
    } catch (err) {
      console.error("Error calculating y output from APSDEX:", err);
      setError(err);
      toast.update(toastId, {
        render: "Failed to calculate y output from APSDEX.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  //Function to get the eth reserves in APSDEX pool
  const getEthReserves = async () => {
    setError(null);
    const toastId = toast.loading("Fetching ETH reserves from APSDEX...");
    try {
      const ethReserves = await readContract({
        contract,
        method: "ethReserve",
        params: [],
      });
      setEthReserves(ethReserves);

      toast.update(toastId, {
        render: "ETH reserves fetched successfully from APSDEX!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      return ethReserves;
    } catch (err) {
      console.error("Error fetching ETH reserves from APSDEX:", err);
      setError(err);
      toast.update(toastId, {
        render: "Failed to fetch ETH reserves from APSDEX.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  //Function to get the token reserves in APSDEX pool
  const getTokenReserves = async () => {
    setError(null);
    const toastId = toast.loading("Fetching token reserves from APSDEX...");
    try {
      const tokenReserves = await readContract({
        contract,
        method: "apsReserve",
        params: [],
      });
      setTokenReserves(tokenReserves);

      toast.update(toastId, {
        render: "Token reserves fetched successfully from APSDEX!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      return tokenReserves;
    } catch (err) {
      console.error("Error fetching token reserves from APSDEX:", err);
      setError(err);
      toast.update(toastId, {
        render: "Failed to fetch token reserves from APSDEX.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  //Function to return the total Liquidity in APSDEX pool
  const getTotalLiquidity = async () => {
    setError(null);
    const toastId = toast.loading("Fetching total liquidity from APSDEX...");
    try {
      const totalLiquidity = await readContract({
        contract,
        method: "totalLiquidity",
        params: [],
      });
      setTotalLiquidity(totalLiquidity);

      toast.update(toastId, {
        render: "Total liquidity fetched successfully from APSDEX!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      return totalLiquidity;
    } catch (err) {
      console.error("Error fetching total liquidity from APSDEX:", err);
      setError(err);
      toast.update(toastId, {
        render: "Failed to fetch total liquidity from APSDEX.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  //Function to get Liquidity of a provider in APSDEX pool
  const getProviderLiquidity = async (providerAddress) => {
    setError(null);
    const toastId = toast.loading("Fetching provider liquidity from APSDEX...");
    try {
      const providerLiquidity = await readContract({
        contract,
        method: "liquidity",
        params: [providerAddress],
      });
      setProviderLiquidity(providerLiquidity);

      toast.update(toastId, {
        render: "Provider liquidity fetched successfully from APSDEX!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      return providerLiquidity;
    } catch (err) {
      console.error("Error fetching provider liquidity from APSDEX:", err);
      setError(err);
      toast.update(toastId, {
        render: "Failed to fetch provider liquidity from APSDEX.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <APSDEXContext.Provider
      value={{
        initializeAPSDEX,
        approveAPSTokens,
        swapOnAPSDEX,
        depositToAPSDEX,
        withdrawFromAPSDEX,
        getCurrentPrice,
        calculateXInput,
        calculateYOutput,
        getEthReserves,
        getTokenReserves,
        getTotalLiquidity,
        getProviderLiquidity,
        price,
        xInput,
        yOutput,
        ethReserves,
        tokenReserves,
        totalLiquidity,
        providerLiquidity,
        loading,
        error,
      }}
    >
      {children}
    </APSDEXContext.Provider>
  );
};

APSDEXProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
