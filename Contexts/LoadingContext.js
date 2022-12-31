import React, { useState, useEffect, Context, createContext } from "react";
import ProgressLoader from "rn-progress-loader";

export const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  return (
    <LoadingContext.Provider value={{setLoading}}>
      <ProgressLoader
        visible={loading}
        isModal={true}
        isHUD={true}
        hudColor={"#000000"}
        color={"#FFFFFF"}
      ></ProgressLoader>
      {children}
    </LoadingContext.Provider>
  );
};
