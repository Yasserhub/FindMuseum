import React from "react";
import ReactDOM from "react-dom";
import "../src/assets/css/index.css";

import AppWrapper from "./AppWrapper";
import App from "./App";

ReactDOM.render(
  <AppWrapper>
    <App />
  </AppWrapper>,
  document.getElementById("root")
);
