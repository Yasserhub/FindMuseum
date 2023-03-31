import React from "react";
import ReviewCardRate from "./ReviewCardRate.jsx";
import PropTypes from "prop-types";
import "./review-card.css";

const ReviewCard = ({ comments, museumName }) => {
  ReviewCard.propTypes = {
    comments: PropTypes.array,
    museumName: PropTypes.string,
  };
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <>
      <div className="review-card-container">
        <div className="review-card-section">
          <div className="review-card-head">
            <h1>{`Reviews of ${museumName}`} </h1>
            <h3>
              {" "}
              {comments && comments.length > 1
                ? `There are ${
                    comments && comments.length
                  } reviews of ${museumName} `
                : `There is ${
                    comments && comments.length
                  } review of ${museumName} `}
            </h3>
          </div>
          <div className="comment-sections-container">
            {comments &&
              comments.map((comment) => {
                let date = "";
                let day = "";
                let month = "";
                if (comment) {
                  date = new Date(comment.createdAt);
                  day = date.getDate();
                  month = monthNames[date.getMonth()];
                }

                return (
                  <div className="comment-section" key={comment._id}>
                    <div className="comment-container">
                      <div className="comment-header-content">
                        <div className="avatar-container">
                          <div className="avatar">
                            {comment.userId.profilePicture ? (
                              <img
                                src={comment.userId.profilePicture}
                                alt=""
                                style={{ width: "60px", height: "60px" }}
                              />
                            ) : (
                              <div>{comment.userId.firstName.charAt(0)}</div>
                            )}
                          </div>
                          <div className="name-rate-container">
                            <div className="name-date">
                              <h4>{`${
                                comment.userId.firstName
                              } ${comment.userId.lastName.charAt(0)}`}</h4>
                            </div>
                            <div>
                              <ReviewCardRate rate={comment && comment.rate} />
                            </div>
                          </div>
                        </div>
                        <div className="date-container">{`${month} ${day}`}</div>
                      </div>
                      <hr />
                      <div className="review-body">
                        <p>{comment && comment.review}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewCard;
