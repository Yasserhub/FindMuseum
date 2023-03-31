import React from "react";
import "./unauthorized.css";

const UnAuthorized = () => {
  return (
    <div className="unauthorized">
      <h2>Opps! Something went wrong</h2>
      <p>You are not authorized to view this page.</p>
    </div>
  );
};

export default UnAuthorized;
