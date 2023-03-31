import React from "react";
import { FaStar } from "react-icons/fa";
import PropTypes from "prop-types";
import "./review-card-rate.css";

const StarRating = ({ rate }) => {
  StarRating.propTypes = {
    rate: PropTypes.string,
  };
  const colors = {
    orange: "var(--star-filled)",
    gray: "var(--star-empty)",
  };
  return (
    <>
      <div className="stars-review">
        {Array(5)
          .fill(0)
          .map((_, index) => {
            return (
              <FaStar
                size={24}
                key={index}
                style={{
                  marginRight: "1px",
                  stroke: "orange",
                }}
                color={rate > index ? colors.orange : colors.gray}
              />
            );
          })}
      </div>
    </>
  );
};

export default StarRating;
