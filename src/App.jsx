import { Route, RouterProvider, Routes, createBrowserRouter } from "react-router-dom";
import React from "react";
import Header from "src/app/layout/header";
import { ErrorBoundary } from "react-error-boundary";
import HomePage from "src/app/pages/homepage";
import ErrorPage from "src/app/pages/errorpage";
import AuctionList from "src/app/pages/auctionlist";
import AuctionType from "src/app/pages/auctiontype";
import NFTDetail from "src/app/pages/nftdetail";
import AuctionDetail from "src/app/pages/auctiondetail";
import CollectionDetail from "src/app/pages/collectiondetail";
import UserDetail from "src/app/pages/userdetail";
import AuctionTutorial from "src/app/pages/auctiontutorial";
import { Box, Typography } from "@mui/material";
import { useChainId } from "wagmi";
import EditUser from "src/app/pages/edituser";
import useAuctionConfig from "./hooks/reactquery/useAuctionConfig";
import { FailToLoad } from "./app/components/error";
import PageLoading from "./app/components/loading";
import CollectionList from "./app/pages/collectionlist";
import Footer from "./app/layout/footer";

const MainApp = () => {
  const chainId = useChainId();

  const { data, isLoading, isError, error } = useAuctionConfig();
  
  if(isLoading) {
    return <PageLoading/>
  }
  if(isError) {
    console.log("Error cannot getting auction config::", error.message);
    return <FailToLoad size="3rem" className="fontSmallSize" title={`Network error: ${error.message}`}/>
  }

  return (
    <div style={{position: "relative"}}>
      <Footer/>
      <Header/>
      <Box minHeight="calc(100vh - 82px)">
        {
          chainId == 11155111 ?
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/auctionlist" element={<AuctionList/>} />
            <Route path="/auction/:auctionType" element={<AuctionType/>} />
            <Route path="/nftdetail/:address/:tokenId" element={<NFTDetail/>} />
            <Route path="/auctiondetail/:auctionAddress" element={<AuctionDetail/>} />
            <Route path="/collectionList" element={<CollectionList/>} />
            <Route path="/collectiondetail/:address" element={<CollectionDetail/>} />
            <Route path="/userdetail/:userAddress" element={<UserDetail/>}/>
            <Route path="/edituser" element={<EditUser/>} />
            <Route path="/auctiontutorial" element={<AuctionTutorial/>} />
            <Route path="/*" element={<ErrorPage/>} />
          </Routes> 
          : <>
            <Typography sx={{
              fontFamily: "Poppins",
              fontSize: "32px",
              textAlign: "center",
              p: 5
            }}>Please change to sepolia</Typography>
          </>
        }
      </Box>
    </div>
  )
}

function Fallback({ error }) {
  return (
    <>
      <div style={{padding: "20px"}}>
        <p>Something went wrong, app crashed. Please contact admin</p>
        <p>Error message:: <span style={{color: "#fc2f70"}}>{error.message ?? "Unknown message"}</span></p>
      </div>
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "*",
    element: (
      <ErrorBoundary FallbackComponent={Fallback}>
        <MainApp/>
      </ErrorBoundary>
    )
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
