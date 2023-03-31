import React, { useState } from "react";
import ReviewCardRate from "../../components/Home-Page/museum/review/ReviewCardRate";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import ReviewEdit from "./ReviewEdit";
import useFetch from "../../hooks/useFetch";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { logError } from "../../../../server/src/util/logging";
import { Link } from "react-router-dom";
import "./profile-review-card.css";

const ProfileReviewCard = ({
  comments,
  refresh,
  setRefresh,
  commentLength,
}) => {
  ProfileReviewCard.propTypes = {
    comments: PropTypes.array,
    refresh: PropTypes.bool,
    setRefresh: PropTypes.func,
    commentLength: PropTypes.number,
  };
  const user = JSON.parse(localStorage.getItem("authUser"));
  const [comment, setComment] = useState({});
  const [trigger, setTrigger] = useState(false);
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

  const handleEdit = (comment) => {
    setComment(comment);
    setTrigger(true);
  };

  const { performFetch } = useFetch("/comment/delete", () => {
    toast.success("Review Deleted Successfully", {
      position: "top-center",
      autoClose: 3000,
    });
  });

  const handleDelete = (comment) => {
    setComment(comment);
    try {
      performFetch({
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          comment: { commentId: comment._id },
        }),
      });
      setRefresh(!refresh);
    } catch (error) {
      logError(error);
    }
  };

  return (
    <>
      <div className="profile-review-card-container">
        <ReviewEdit
          trigger={trigger}
          setTrigger={setTrigger}
          comment={comment}
          refresh={refresh}
          setRefresh={setRefresh}
        />
        <div className="head">
          <h1>
            {`Reviews of ${user && user.firstName} ${user && user.lastName}`}{" "}
          </h1>
          <h3>
            {commentLength > 1
              ? `There are ${commentLength && commentLength} reviews of ${
                  user && user.firstName
                } ${user && user.lastName} `
              : `There is ${commentLength && commentLength} review of ${
                  user && user.firstName
                } ${user && user.lastName} `}
          </h3>
        </div>

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
              <div className="profile-review-card-row" key={comment._id}>
                <div className="profile-review-card-col">
                  <div className="comment-container">
                    <div className="edit-delete">
                      <Link
                        className="comment-museum"
                        to={`/museum/${comment.museumId._id}`}
                      >
                        {comment && comment.museumId.name}
                      </Link>
                      <FiEdit onClick={() => handleEdit(comment)} />
                      <RiDeleteBinLine onClick={() => handleDelete(comment)} />
                    </div>
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
              </div>
            );
          })}
      </div>
    </>
  );
};

export default ProfileReviewCard;
