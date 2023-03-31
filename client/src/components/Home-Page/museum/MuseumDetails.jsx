import React, { useState, useEffect } from "react";
import useFetch from "../../../hooks/useFetch";
import { useParams } from "react-router-dom";
import { AiFillBank, AiFillPhone } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import { FaLink } from "react-icons/fa";
import ReviewForm from "./review/ReviewForm";
import ReviewCard from "./review/ReviewCard";
import Heart from "../../../components/Favorite/Heart";
import "./museum-details.css";

const MuseumDetails = () => {
  const { museumId } = useParams();
  const [museum, setMuseum] = useState({});
  const [refresh, setRefresh] = useState(false);
  const { performFetch, cancelFetch } = useFetch(
    `/museum/${museumId}`,
    (response) => {
      setMuseum(response.result);
    }
  );

  useEffect(() => {
    performFetch();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    return cancelFetch;
  }, [museumId, refresh]);

  const {
    image,
    name,
    address,
    location,
    phone,
    website,
    description,
    openingHours,
    price,
    category,
    comments,
  } = museum;

  return (
    <>
      <div className="museum-container">
        <div className="museum-details">
          <div className="each-museum">
            <img src={image && image.url} alt={name} className="image-museum" />
            <Heart id={museumId} />
            <div className="museum-category">
              <AiFillBank className="icon" />
              <h2>{category && category}</h2>
            </div>

            <div className="museum-information">
              <div className="address">
                <p>{address?.street}</p>
                <p>{address?.postcode}</p>
                <p>{address?.city}</p>
                <p>The Netherlands</p>
              </div>

              <div className="contact">
                <div className="contact-item">
                  <MdLocationPin style={{ color: "#3F4E4F" }} />
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={location?.map}
                  >
                    View on map
                  </a>
                </div>
                <div className="contact-item">
                  <AiFillPhone style={{ color: "#3F4E4F" }} />
                  <a href={`tel:+${phone}`}>+{phone}</a>
                </div>
                <div className="contact-item">
                  <FaLink style={{ color: "#3F4E4F" }} />
                  <a target="_blank" rel="noopener noreferrer" href={website}>
                    Visit Website
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="museum-description">
            <h2>{name}</h2>
            <p>{description}</p>
          </div>
        </div>
        <div className="hours-price">
          <div className="opening-hours">
            <h1>Opening Hours</h1>
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Hour</th>
                </tr>
              </thead>
              <tbody>
                {openingHours?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item && item.day}</td>
                      <td>{item && item.hours}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="museum-fees">
            <h1>Entrance Fees</h1>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {price &&
                  Object.keys(price).map((item, index) => (
                    <tr key={index}>
                      <td>{item}</td>
                      <td>{"€" + price[item]}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="museum-iframe">
            <h1>Location & Map</h1>
            <iframe
              src={location?.iframe}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div className="comments-review-container">
          <div className="comment-card">
            <ReviewCard comments={comments} museumName={name} />
          </div>
          <div className="comment-box">
            <ReviewForm
              type="Write"
              museumId={museumId}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MuseumDetails;
