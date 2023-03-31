import React, { useEffect } from "react";
import "./otp-input.css";
import background from "../../assets/img/register-background.jpeg";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { scrollToUp } from "../../hooks/scrollToUp";

const OtpInput = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const initialValues = {
    otp: "",
  };

  const validationSchema = Yup.object({
    otp: Yup.string()
      .required("Please enter the confirmation code!")
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(4, "Your confirmation code have to be 6 digit"),
  });

  const onSubmit = () => {
    const { otp } = formik.values;
    const random = sessionStorage.getItem("random_key");

    if (otp === random) {
      formik.resetForm();
      toast.success("Confirmation completed successfully!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      sessionStorage.clear();
      setTimeout(() => {
        navigate(`/resetPassword/${userId}`);
      }, 2000);
    } else {
      toast.error("Enter the correct verification code!", {
        position: toast.POSITION.TOP_CENTER,
        className: "toast-position",
      });
    }
  };

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
      <div className="otp-group">
        <h1>Enter your verification code</h1>
        <p>Please enter the code we sent to your email</p>
        <form onSubmit={formik.handleSubmit}>
          <div className="container-input">
            <input
              type="text"
              maxLength={"6"}
              placeholder={"Verification Code"}
              {...formik.getFieldProps("otp")}
            />
          </div>

          <div className="message-container">
            {formik.touched.otp && formik.errors.otp ? (
              <>{formik.errors.otp}</>
            ) : (
              <> </>
            )}
          </div>
          <button className="submit-button" type="submit">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpInput;
