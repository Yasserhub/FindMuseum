import React, { useState } from "react";
import { useMuseums } from "../../context/museumContext";
import { useAuth } from "../../context/authContext";
import MuseumCard from "../../components/Museum-Overview/MuseumCard";
import "../../components/Museum-Overview/museum-card.css";
import "../../components/Museum-Overview/all-museums.css";
import Pagination from "../../components/common/pagination/Pagination";

const Favorites = () => {
  const { favorites } = useAuth();

  const { museums } = useMuseums();

  const [currentPage, setCurrentPage] = useState(1);
  const [favoritesPerPage] = useState(8);
  const [currentButton, setCurrentButton] = useState(1);

  const indexOfLastFavorite = currentPage * favoritesPerPage;
  const indexOfFirstFavorite = indexOfLastFavorite - favoritesPerPage;

  const favMuseums = museums.filter((museum) => {
    if (favorites.includes(museum._id)) {
      return museum;
    }
  });

  const currentFavorites = favMuseums?.slice(
    indexOfFirstFavorite,
    indexOfLastFavorite
  );
  const totalPagesNum = Math.ceil(favMuseums?.length / favoritesPerPage);

  return (
    <div className="favorites_page">
      {favorites.length === 0 && (
        <>
          <h1>You have not chosen any favorites yet! </h1>
          <img
            src="https://res.cloudinary.com/diyopzdxb/image/upload/v1677845113/cars-images/favorite_t3zede.png"
            alt="not yet"
            className="notYet_img"
          />
        </>
      )}

      {favMuseums.length > 0 && (
        <div className="all-museums-card">
          {currentFavorites &&
            currentFavorites.map((museum) => {
              return <MuseumCard key={museum._id} museum={museum} />;
            })}
        </div>
      )}
      <Pagination
        pages={totalPagesNum}
        setCurrentPage={setCurrentPage}
        currentButton={currentButton}
        setCurrentButton={setCurrentButton}
      />
    </div>
  );
};

export default Favorites;
