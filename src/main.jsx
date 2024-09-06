import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import "animate.css";
import AppProvider from "src/context/index.jsx";
import ThemeWrapper from "src/ThemeWrapper.jsx";
import WalletWrapper from "src/WalletWrapper.jsx";
import { Toaster } from 'react-hot-toast';
import TransactionStatus from "./TransactionStatus.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./flickity.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppProvider>
    <WalletWrapper>
      <ThemeWrapper>
        <App />
        <Toaster/>
        <TransactionStatus/>
      </ThemeWrapper>
    </WalletWrapper>
  </AppProvider>
)
