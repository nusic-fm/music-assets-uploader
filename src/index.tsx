import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import WebFont from "webfontloader";
import { MarketPlace } from "./MarketPlace";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

WebFont.load({
  google: {
    families: ["Tenor Sans"],
  },
});

const themeSettings = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#573FC8",
      light: "#000000",
    },
    secondary: {
      main: "#ffffff",
    },
    info: {
      main: "#A794FF",
    },
    background: { paper: "#16162A" },
  },
  typography: {
    allVariants: {
      color: "#ffffff",
    },
    fontFamily: `"Tenor Sans" , sans-serif`,
  },
});
const theme = responsiveFontSizes(themeSettings);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/market" element={<MarketPlace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
