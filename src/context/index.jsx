import { omit } from "lodash";
import { createContext, useCallback, useState } from "react";

export const AppContext = createContext({
  colorMode: { currentMode: localStorage.getItem("colorMode") || "light", setColorMode: () => {} },
  refetchQuery: false,
  getTx: () => {},
  pushTx: () => {},
  popTx: () => {},
  imageCache: { imageCache: {}, setImageCache: () => {} },
});

const AppProvider = ({children}) => {
  const [currentMode, setMode] = useState(localStorage.getItem("colorMode") || "light");
  const setColorMode = (isDark) => {
    setMode(isDark ? "dark" : "light");
    localStorage.setItem("colorMode", isDark ? "dark" : "light");
  };
  const [imageCache, setImageCache] = useState({});

  const [txStatus, setTxStatus] = useState({});

  const [refetchQuery, setRefetchQuery] = useState(false);
  const callRefetch = useCallback(() => {
    setRefetchQuery(true);
    setTimeout(() => {
      setRefetchQuery(false);
    }, 13000);
  }, []);

  return (
    <AppContext.Provider
      value={{
        colorMode: { currentMode, setColorMode },
        imageCache: { imageCache, setImageCache },
        refetchQuery,
        callRefetch,
        pushTx: (newTx) => {
          setTxStatus({
            ...txStatus,
            ...newTx
          });

        },
        popTx: (oldTx) => {
          setTxStatus(omit(txStatus, oldTx.hash));
        },
        getTx: () => {
          if (Object.entries(txStatus).length === 0) return null;
          return Object.entries(txStatus).map(([_, item]) => item);
        }
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider;