import React, { useEffect } from "react";
import "./forgot-password.css";
import background from "../../assets/img/register-background.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Oval } from "react-loading-icons";

import useFetch from "../../hooks/useFetch";
import { scrollToUp } from "../../hooks/scrollToUp";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const onSuccess = ({ reset }) => {
    formik.resetForm();
    toast.success(
      <div>Check your email inbox to get code for your password</div>,
      {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      }
    );

    sessionStorage.setItem("random_key", reset.random);

    setTimeout(() => {
      navigate(`/otp/${reset.userId}`);
    }, 2000);
  };

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    "/user/forgotPassword",
    onSuccess
  );

  useEffect(() => {
    return cancelFetch;
  }, []);

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email!")
      .required("Please enter your email!"),
  });

  const onSubmit = () => {
    const { email } = formik.values;

    performFetch({
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
  };

  useEffect(() => {
    if (error == "User Not Exist!") {
      toast.error(error, {
        position: toast.POSITION.TOP_CENTER,
        className: "toast-position",
      });
    }
  }, [error]);

  const formik = useFormik({ initialValues, validationSchema, onSubmit });

  useEffect(() => {
    scrollToUp();
  });

  return (
    <div
      className="container--forgotten-password"
      style={{
        background: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255,255,255,0.7)), url(${background}) no-repeat`,
        backgroundSize: "cover",
        backgroundPosition: "50%",
      }}
    >
      <form
        className="forgotten-password-details"
        onSubmit={formik.handleSubmit}
      >
        <h1>Forgot Password</h1>
        <p className="information-text-forgotten-password">
          Enter your registered email to reset your password.
        </p>
        <div className="form-forgotten-password">
          <input
            type="email"
            {...formik.getFieldProps("email")}
            className="user-email-input"
            placeholder="name@email.com"
          ></input>
          <p className="message-email">
            {formik.touched.email && formik.errors.email ? (
              <>{formik.errors.email}</>
            ) : (
              <> </>
            )}
          </p>
          <button
            className="get-code-button"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Oval className="spinner" stroke="white" />
            ) : (
              "Get Code"
            )}
          </button>
        </div>
        <div className="divider">
          <hr className="divider-hr"></hr>
          <div>or</div>
          <hr className="divider-hr"></hr>
        </div>
        <div className="footer-forgotten-password">
          <div className="container--sign">
            <span>New here? </span>
            <Link to="/register">Sign Up.</Link>
          </div>
          <div className="container--sign">
            <span>Already have an account? </span>
            <Link to="/login">Sign In.</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
