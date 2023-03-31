import React from "react";
import { FaStar } from "react-icons/fa";
import PropTypes from "prop-types";
import "./star-rating.css";

const StarRating = ({ formData, setFormData }) => {
  const colors = {
    orange: "var(--star-filled)",
    gray: "var(--star-empty)",
  };
  return (
    <>
      <div className="icon">
        <h2>Rate Museum</h2>
      </div>
      <div className="stars">
        {Array(5)
          .fill(0)
          .map((_, index) => {
            return (
              <FaStar
                size={24}
                key={index}
                style={{
                  cursor: "pointer",
                  marginRight: "10px",
                  stroke: "orange",
                }}
                color={formData.rate > index ? colors.orange : colors.gray}
                onClick={() => {
                  setFormData({ ...formData, rate: index + 1 });
                }}
              />
            );
          })}
      </div>
    </>
  );
};

StarRating.propTypes = {
  formData: PropTypes.object,
  setFormData: PropTypes.func,
};

export default StarRating;
