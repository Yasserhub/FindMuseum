import React from "react";
import PropTypes from "prop-types";
import noData from "../../assets/img/no_data.svg";
import { useNavigate } from "react-router-dom";
import "./not-found.css";

const NotFound = ({
  setActiveCityFilterList,
  setActiveCategoryFilterList,
  setActiveRatingFilterList,
  setActivePriceList,
  setActivePriceIndex,
}) => {
  const navigate = useNavigate();

  const goBack = () => {
    setActiveCityFilterList([]);
    setActiveCategoryFilterList([]);
    setActiveRatingFilterList([]);
    setActivePriceList([]);
    setActivePriceIndex(null);
    navigate("/museums");
  };

  return (
    <div className="container--not-found">
      <h1>Museum not found!</h1>
      <img src={noData} alt="Not Found Data" />
      <button onClick={goBack}>Go Back</button>
    </div>
  );
};

NotFound.propTypes = {
  setActiveCityFilterList: PropTypes.func,
  setActiveCategoryFilterList: PropTypes.func,
  setActiveRatingFilterList: PropTypes.func,
  setActivePriceList: PropTypes.func,
  setActivePriceIndex: PropTypes.func,
};

export default NotFound;
