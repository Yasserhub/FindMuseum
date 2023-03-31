import React from "react";
import ReviewForm from "../../components/Home-Page/museum/review/ReviewForm";
import PropTypes from "prop-types";
import "./review-edit.css";

const ReviewEdit = ({ trigger, comment, setTrigger, refresh, setRefresh }) => {
  ReviewEdit.propTypes = {
    trigger: PropTypes.bool,
    comment: PropTypes.object,
    setTrigger: PropTypes.func,
    refresh: PropTypes.bool,
    setRefresh: PropTypes.func,
  };
  return trigger ? (
    <div className="review-edit-container">
      <ReviewForm
        type="Edit"
        comment={comment}
        setTrigger={setTrigger}
        refresh={refresh}
        setRefresh={setRefresh}
      />
    </div>
  ) : (
    ""
  );
};

export default ReviewEdit;
