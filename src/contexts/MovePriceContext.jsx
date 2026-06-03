import { useContext, createContext, useState } from "react";
import PropTypes from "prop-types";
import { ADDRESSES } from "../constants/addresses";
import MovePriceABI from "../artifacts/contracts/facets/MovePriceFacet.sol/MovePriceFacet.json";
import { client } from "../services/client";
import { toast } from "react-toastify";
import { useActiveAccount } from "thirdweb/react";
import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { defineChain } from "thirdweb/chains";

const DiamondAddress = ADDRESSES.MainDiamond;
const MovePrice_ABI = MovePriceABI.abi;

const MovePriceContext = createContext();

export const useMovePrice = () => {
  return useContext(MovePriceContext);
};

export const MovePriceProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const contract = getContract({
    address: DiamondAddress,
    abi: MovePrice_ABI,
    client,
    chain: defineChain(11155111),
  });

  const account = useActiveAccount();
  const address = account?.address;

  /* =====================================================================
   * WRITER FUNCTIONS
   * ========================================================================== */

  //Function to initializeMovePrice
  const initializeMovePrice = async (atsTokenAddress, apsDexAddress) => {
    setLoading(true);
    setError(null);
    const toastId = toast.loading("Initializing move price...");
    if (!address) {
      toast.error("Please connect your wallet to initialize move price.");
      setLoading(false);
      toast.dismiss(toastId);
      return;
    }

    try {
      const transaction = await prepareContractCall({
        contract,
        method: "initializeMovePrice",
        params: [atsTokenAddress, apsDexAddress],
      });

      await sendTransaction({ transaction, account });

      toast.update(toastId, {
        render: "Move price initialized successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error initializing move price:", err);
      setError("Failed to initialize move price. Please try again.");
      toast.update(toastId, {
        render: "Failed to initialize move price. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  //Function to move price
  const movePrice = async (amount) => {
    setLoading(true);
    const toastId = toast.loading("Moving price...");
    setError(null);
    if (!address) {
      toast.error("Please connect your wallet to move price.");
      setLoading(false);
      toast.dismiss(toastId);
      return;
    }

    try {
      const transaction = await prepareContractCall({
        contract,
        method: "movePrice",
        paramss: [amount],
      });

      await sendTransaction({ transaction, account });

      toast.update(toastId, {
        render: "Price moved successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error moving price:", err);
      setError("Failed to move price. Please try again.");
      toast.update(toastId, {
        render: "Failed to move price. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MovePriceContext.Provider
      value={{
        initializeMovePrice,
        error,
        loading,
        movePrice,
      }}
    >
      {children}
    </MovePriceContext.Provider>
  );
};

MovePriceProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MovePriceProvider;
