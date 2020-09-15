import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";

export const StackContext = React.createContext(null)

// Wraps the standard stack navigator.
const useStackNavigation: typeof useNavigation = () => useContext(StackContext) || useNavigation();

export default useStackNavigation;