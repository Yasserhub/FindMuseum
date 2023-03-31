import React, { useEffect, useState } from "react";
import StarRating from "./StarRating";
// import styled from "styled-components";
import PropTypes from "prop-types";
import useFetch from "../../../../hooks/useFetch";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from "react-loading-icons";
import { IoMdCloseCircleOutline } from "react-icons/io";
import "./review-form.css";
import { useNavigate } from "react-router-dom";

const ReviewForm = ({
  type,
  museumId,
  comment,
  setTrigger,
  refresh,
  setRefresh,
}) => {
  ReviewForm.propTypes = {
    type: PropTypes.string,
    museumId: PropTypes.number,
    comment: PropTypes.object,
    setTrigger: PropTypes.bool,
    refresh: PropTypes.bool,
    setRefresh: PropTypes.func,
  };
  const navigate = useNavigate();
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
  const [formData, setFormData] = useState({
    museumId: `${comment ? comment.museumId._id : museumId}`,
    rate: `${comment ? comment.rate : 0}`,
    review: `${comment ? comment.review : ""}`,
  });

  ReviewForm.propTypes = {
    museumId: PropTypes.string,
  };

  const onSuccess = (response) => {
    setRefresh(!refresh);
    if (response.type == "update") {
      toast.success("Review Edited Successfully", {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      toast.success("Thanks for your review", {
        position: "top-center",
        autoClose: 2000,
      });
    }
    setFormData({ ...formData, museumId: "", rate: 0, review: "" });
  };

  const { isLoading, error, setError, performFetch, cancelFetch } = useFetch(
    // if type of review "write" we will send /comment/create url with POST method below in performFetch"
    // els type of review "Edit" we will send /comment/edit url with PUT method below in performFetch
    `/comment/${type == "Write" ? "create" : "edit"}`,
    onSuccess
  );

  useEffect(() => {
    if (error == "BAD REQUEST: review is a required field") {
      toast.warn("Review is required field", {
        position: "top-center",
        autoClose: 2000,
      });
    } else if (error == "UnAuthorized") {
      toast.warn("You must be logged in to comment", {
        position: "top-center",
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, [error]);

  useEffect(() => {
    return cancelFetch;
  }, []);

  const handleFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClose = () => {
    setTrigger(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoggedIn == false) {
      setError("UnAuthorized");
      return;
    }
    const { _id } = authUser;
    let commentId = "";
    if (comment) {
      commentId = comment?._id;
    }
    const { rate, review, museumId } = formData;
    try {
      performFetch({
        method: `${type == "Write" ? "POST" : "PUT"}`,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          comment: { userId: _id, commentId, museumId, rate, review },
        }),
      });
      setTrigger(false);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <div className="review-form-container">
        <div className="review-form">
          {type == "Edit" && (
            <div className="close">
              <IoMdCloseCircleOutline onClick={handleClose} />
            </div>
          )}
          <div className="review-form-box">
            <h1>{`${type} Your Review`}</h1>
            <StarRating formData={formData} setFormData={setFormData} />
          </div>
          <div className="review-form-box">
            <form
              className="review-form-input"
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="input-group">
                <input
                  type="hidden"
                  name="rate"
                  onChange={handleFormData}
                  value={formData.rate}
                />
              </div>

              <div className="input-group">
                <textarea
                  cols="50"
                  rows="15"
                  name="review"
                  value={formData.review}
                  onChange={handleFormData}
                ></textarea>
              </div>

              <button
                className="submit-button"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Oval className="spinner" stroke="white" />
                ) : (
                  "Send"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewForm;
