import React from "react";
import { Oval } from "react-loading-icons";
import "./loading.css";

const Loading = () => {
  return (
    <div className="loading-page">
      <Oval className="spinner" />
      <span>Loading...</span>
    </div>
  );
};

export default Loading;
