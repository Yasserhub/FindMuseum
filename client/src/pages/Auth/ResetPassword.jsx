import React, { useState, useEffect } from "react";
import "./reset-password.css";
import background from "../../assets/img/register-background.jpeg";
import useFetch from "../../hooks/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RxEyeClosed } from "react-icons/rx";
import { Oval } from "react-loading-icons";
import { scrollToUp } from "../../hooks/scrollToUp";

const ResetPassword = () => {
  const [passwordIsVisible, setPasswordIsVisible] = useState(true);
  const [confirmPasswordIsVisible, setConfirmPasswordIsVisible] =
    useState(true);
  const navigate = useNavigate();
  const { userId } = useParams();

  const onSuccess = () => {
    formik.resetForm();

    toast.success("Your password updated successfully", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
    });

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    `/user/resetPassword/${userId}`,
    onSuccess
  );

  useEffect(() => {
    return cancelFetch;
  }, []);

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .required("Please enter your password!")
      .min(4, "Your password have to be more than 4 character")
      .matches(/[a-z]+/, "At least 1 lowercase")
      .matches(/[A-Z]+/, "At least 1 uppercase")
      .matches(/[+-/.,!'^@%&€$£#]+/, "At least 1 special character")
      .matches(/\d+/, "At least 1 number"),
    confirmPassword: Yup.string()
      .required("Please re-enter in password field")
      .oneOf([Yup.ref("password")], "Password fields don't match"),
  });

  const onSubmit = () => {
    const { password } = formik.values;

    performFetch({
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ password }),
    });
  };

  useEffect(() => {
    if (error == "Email already exists") {
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
      className="container--reset-password"
      style={{
        background: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255,255,255,0.7)), url(${background}) no-repeat`,
        backgroundSize: "cover",
        backgroundPosition: "50%",
      }}
    >
      <form className="form-reset-password" onSubmit={formik.handleSubmit}>
        <h1>Reset Password</h1>
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
        <div className="container-input">
          <input
            type={confirmPasswordIsVisible ? "password" : "text"}
            {...formik.getFieldProps("confirmPassword")}
            placeholder="Confirm Password"
            className="register-input"
          ></input>
          {confirmPasswordIsVisible ? (
            <RxEyeClosed
              className="eyes"
              onClick={() => {
                setConfirmPasswordIsVisible(!confirmPasswordIsVisible);
              }}
            />
          ) : (
            <MdOutlineRemoveRedEye
              className="eyes"
              onClick={() => {
                setConfirmPasswordIsVisible(!confirmPasswordIsVisible);
              }}
            />
          )}
        </div>
        <div className="message-container">
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <>{formik.errors.confirmPassword}</>
          ) : (
            <> </>
          )}
        </div>
        <button className="submit-button" type="submit" disabled={isLoading}>
          {isLoading ? <Oval className="spinner" stroke="white" /> : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
