import { useContext } from "react";
import { APSContext } from "../contexts/APSContextSetup";

export const useAPS = () => {
    return useContext(APSContext);
};
