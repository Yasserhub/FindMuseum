import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { Link, useNavigate } from "react-router-dom";
import "./login-form.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RxEyeClosed } from "react-icons/rx";
import background from "../../assets/img/register-background.jpeg";
import { Oval } from "react-loading-icons";
import { useAuth } from "../../context/authContext";
import { scrollToUp } from "../../hooks/scrollToUp";

const LoginForm = () => {
  const [passwordIsVisible, setPasswordIsVisible] = useState(true);
  const navigate = useNavigate();

  const { setIsLoggedIn, setAuthUser, setFavorites, clearFavorites } =
    useAuth();

  const onSuccess = (res) => {
    formik.resetForm();
    //get user from database
    const { _id, email, firstName, lastName, profilePicture, favoriteMuseums } =
      res.user;

    clearFavorites();

    toast.success(
      <div>
        Welcome {firstName}!
        <br /> You logged in successfully.
      </div>,
      {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      }
    );

    //setting context
    setIsLoggedIn(true);
    setAuthUser({
      _id,
      email,
      firstName,
      lastName,
      profilePicture,
      favoriteMuseums,
    });
    localStorage.setItem("favorites", JSON.stringify(favoriteMuseums));
    setFavorites(favoriteMuseums);
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    "/user/login",
    onSuccess
  );

  useEffect(() => {
    return cancelFetch;
  }, []);

  // useEffect(() => {
  //   localStorage.clear();
  // }, [isLoading]);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email!")
      .required("Please enter your email!"),
    password: Yup.string().required("Please enter your password!"),
  });

  const onSubmit = () => {
    const { email, password } = formik.values;

    performFetch({
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ user: { email, password } }),
    });
  };

  //error notification
  useEffect(() => {
    if (error == "Wrong Credentials!") {
      toast.error(error, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
    }
  }, [error]);

  const formik = useFormik({ initialValues, validationSchema, onSubmit });

  useEffect(() => {
    scrollToUp();
  });

  return (
    <>
      <div
        className="container--login-form"
        style={{
          background: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255,255,255,0.7)), url(${background}) no-repeat`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
        }}
      >
        <div className="login-form">
          <div className="header">
            <h1>Sign in to your account</h1>
            <div className="register-link">
              <span>or</span>
              <Link to={"/register"}> register a new account here.</Link>
            </div>
          </div>
          <form className="form-container" onSubmit={formik.handleSubmit}>
            <div className="container-field">
              <div className="container-input">
                <input
                  type="text"
                  {...formik.getFieldProps("email")}
                  placeholder="Email"
                  className="register-input"
                ></input>
              </div>

              <div className="message-container">
                {formik.touched.email && formik.errors.email ? (
                  <>{formik.errors.email}</>
                ) : (
                  <> </>
                )}
              </div>
            </div>
            <div className="container-field">
              <div className="container-input">
                <input
                  type={passwordIsVisible ? "password" : "text"}
                  {...formik.getFieldProps("password")}
                  placeholder="Password"
                  className="register-input"
                ></input>
                {passwordIsVisible ? (
                  <RxEyeClosed
                    className="eyes"
                    onClick={() => {
                      setPasswordIsVisible(!passwordIsVisible);
                    }}
                  />
                ) : (
                  <MdOutlineRemoveRedEye
                    className="eyes"
                    onClick={() => {
                      setPasswordIsVisible(!passwordIsVisible);
                    }}
                  />
                )}
              </div>

              <div className="message-container">
                {formik.touched.password && formik.errors.password ? (
                  <>{formik.errors.password}</>
                ) : (
                  <> </>
                )}
              </div>
            </div>
            <div className="login-bottom">
              <button
                className="submit-button"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Oval className="spinner" stroke="white" />
                ) : (
                  "Login"
                )}
              </button>
              <Link to={"/forgotPassword"} className="forgot-password">
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
