import React from "react";
import "../../Museum-Overview/museum-card.css";
import { MdTravelExplore } from "react-icons/md";

const Header = () => {
  return (
    <div className="headerContainer">
      <div className="headerGoal">
        <div className="header-icon-container">
          <MdTravelExplore className="header-icon" />
        </div>
        <div className="headerMessage">
          Explore the top rated Amsterdam museums
        </div>
      </div>
    </div>
  );
};
export default Header;
