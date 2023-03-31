import React, { useEffect } from "react";
import "./my-profile.css";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/authContext";
import avatar from "../../assets/drop/user.png";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlinePlus } from "react-icons/ai";

export default function MyProfile() {
  const { authUser, setAuthUser } = useAuth();
  const { id } = useParams();

  const onSuccess = () => {
    toast.success(<div>User updated!</div>, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
    });
  };
  const convertToBase64 = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      {
        setAuthUser({ ...authUser, profilePicture: reader.result });
      }
    };
  };

  const uploadProfilePicture = () => {
    fetch(`${process.env.BASE_SERVER_URL}/upload`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ base64: authUser.profilePicture }),
    }).then((res) => res.json());
  };

  const { performFetch, cancelFetch } = useFetch(`/user/${id}`, onSuccess);

  useEffect(() => {
    return cancelFetch;
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    performFetch({
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ authUser }),
    });
  };

  return (
    <div className="my-profile-container">
      <div className="my-profile">
        <div className="my-profile-settings">
          <span className="update-profile-header">Update Your Account</span>
        </div>
        <form className="my-profile-form" onSubmit={handleSubmit}>
          <div className="profile-settings">
            <div className="profile-image">
              {authUser?.profilePicture ? (
                <img
                  src={authUser?.profilePicture}
                  alt=""
                  style={{ width: "80px", height: "80px" }}
                />
              ) : (
                <img
                  src={avatar}
                  alt=""
                  style={{ width: "80px", height: "80px" }}
                />
              )}
              <label htmlFor="fileInput">
                <AiOutlinePlus className="pp-icon" style={{ color: "white" }} />
              </label>
            </div>
            <input
              accept="image/*"
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={convertToBase64}
            />
            <button className="upload-picture" onClick={uploadProfilePicture}>
              Upload Picture
            </button>

            <label>Name</label>
            <input
              type="text"
              defaultValue={authUser?.firstName}
              onChange={(e) =>
                setAuthUser({ ...authUser, firstName: e.target.value })
              }
            />
            <label>Last Name</label>
            <input
              type="text"
              defaultValue={authUser?.lastName}
              onChange={(e) =>
                setAuthUser({ ...authUser, lastName: e.target.value })
              }
            />
            <button className="profile-update-btn" type="submit">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
