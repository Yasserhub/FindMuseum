import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MuseumCard from "./MuseumCard";
import SearchingBar from "../Home-Page/Searching-Bar/SearchingBar";
import "./searched-museums.css";
import { useMuseums } from "../../context/museumContext";
import FilterBar from "./FilterBar";
import NotFound from "./NotFound";
import Pagination from "../common/pagination/Pagination";
import { FaRegWindowClose } from "react-icons/fa";
import { GiSettingsKnobs } from "react-icons/gi";

export default function SearchedMuseums() {
  const { key } = useParams();
  const { museums } = useMuseums();

  //Filter in mobile mode
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const handleClick = () => setFilterIsOpen(!filterIsOpen);

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [museumsPerPage] = useState(12);

  const indexOfLastMuseum = currentPage * museumsPerPage;
  const indexOfFirstMuseum = indexOfLastMuseum - museumsPerPage;

  //Filter lists by city, category, rating and price
  const [activeCityFilterList, setActiveCityFilterList] = useState([]);
  const [activeCategoryFilterList, setActiveCategoryFilterList] = useState([]);
  const [activeRatingFilterList, setActiveRatingFilterList] = useState([]);
  const [activePriceList, setActivePriceList] = useState([]);

  //Museum lists by city, category and rating
  const [cityFilteredMuseum, setCityFilteredMuseum] = useState([]);
  const [categoryFilteredMuseum, setCategoryFilteredMuseum] = useState([]);
  const [ratingFilteredMuseum, setRatingFilteredMuseum] = useState([]);
  const [priceFilteredMuseum, setPriceFilteredMuseum] = useState([]);

  //price index value
  const [activePriceIndex, setActivePriceIndex] = useState(null);
  const [currentButton, setCurrentButton] = useState(1);

  const searchedMuseum = museums.filter((museum) => {
    if (!key) {
      return museum;
    } else if (museum.name?.toLowerCase().includes(key.toLowerCase())) {
      return museum;
    } else if (museum.address.city?.toLowerCase().includes(key.toLowerCase())) {
      return museum;
    } else if (museum.category?.toLowerCase().includes(key.toLowerCase())) {
      return museum;
    }
  });

  const searchedCurrentMuseums = searchedMuseum?.slice(
    indexOfFirstMuseum,
    indexOfLastMuseum
  );
  const searchedTotalPages = Math.ceil(searchedMuseum?.length / museumsPerPage);

  useEffect(() => {
    // city filtering
    if (activeCityFilterList.length > 0) {
      let cityMuseums = searchedMuseum.filter((museum) => {
        if (activeCityFilterList?.includes(museum.address.city)) {
          return museum;
        }
      });
      setCityFilteredMuseum(cityMuseums);
    } else {
      setCityFilteredMuseum(searchedMuseum);
    }

    // category filtering
    if (activeCategoryFilterList.length > 0) {
      let categoryMuseums = searchedMuseum.filter((museum) => {
        if (activeCategoryFilterList?.includes(museum.category)) {
          return museum;
        }
      });
      setCategoryFilteredMuseum(categoryMuseums);
    } else {
      setCategoryFilteredMuseum(searchedMuseum);
    }

    // rating filtering
    if (activeRatingFilterList.length > 0) {
      let ratingMuseums = searchedMuseum.filter((museum) => {
        if (activeRatingFilterList?.includes(museum.rating.toString())) {
          return museum;
        }
      });
      setRatingFilteredMuseum(ratingMuseums);
    } else {
      setRatingFilteredMuseum(searchedMuseum);
    }

    // price filtering
    if (activePriceList.length > 0) {
      let priceMuseums = searchedMuseum.filter((museum) => {
        if (
          activePriceList?.some(
            (item) =>
              museum.price.adults >= item.minPrice &&
              museum.price.adults < item.maxPrice
          )
        ) {
          return museum;
        }
      });
      setPriceFilteredMuseum(priceMuseums);
    } else {
      setPriceFilteredMuseum(searchedMuseum);
    }
    setCurrentPage(1);
    setCurrentButton(1);
  }, [
    activeCityFilterList,
    activeCategoryFilterList,
    activeRatingFilterList,
    activePriceList,
  ]);

  const filteredMuseum = cityFilteredMuseum.filter((museum) => {
    if (
      categoryFilteredMuseum.includes(museum) &&
      ratingFilteredMuseum.includes(museum) &&
      priceFilteredMuseum.includes(museum)
    ) {
      return museum;
    }
  });

  const filteredCurrentMuseums = filteredMuseum?.slice(
    indexOfFirstMuseum,
    indexOfLastMuseum
  );
  const filteredTotalPages = Math.ceil(filteredMuseum?.length / museumsPerPage);

  return (
    <>
      <div className="container--filter-bar-icon">
        <hr className="filter-bar-hr"></hr>
        <div className="filter-bar-icon" onClick={handleClick}>
          {filterIsOpen ? <FaRegWindowClose /> : <GiSettingsKnobs />}
        </div>
        <hr className="filter-bar-hr"></hr>
      </div>
      <div className={filterIsOpen ? "open" : "closed"}>
        <FilterBar
          activeCityFilterList={activeCityFilterList}
          setActiveCityFilterList={setActiveCityFilterList}
          activeCategoryFilterList={activeCategoryFilterList}
          setActiveCategoryFilterList={setActiveCategoryFilterList}
          activeRatingFilterList={activeRatingFilterList}
          setActiveRatingFilterList={setActiveRatingFilterList}
          museumData={searchedMuseum}
          setActivePriceList={setActivePriceList}
          activePriceIndex={activePriceIndex}
          setActivePriceIndex={setActivePriceIndex}
        />
      </div>

      <div className="searched-museums">
        {activeCityFilterList.length > 0 ||
        activeCategoryFilterList.length > 0 ||
        activeRatingFilterList.length > 0 ||
        activePriceList.length > 0 ? (
          <>
            <div className="search-bar">
              <SearchingBar />
              <div className="selected-filter-counter">
                <b>{filteredMuseum?.length} museums</b> &nbsp;found
              </div>
            </div>
            <div className="all-museums-card">
              <>
                {filteredMuseum.length > 0 ? (
                  <>
                    {filteredCurrentMuseums &&
                      filteredCurrentMuseums.map((museum) => {
                        return <MuseumCard key={museum._id} museum={museum} />;
                      })}
                  </>
                ) : (
                  <NotFound
                    setActiveCityFilterList={setActiveCityFilterList}
                    setActiveCategoryFilterList={setActiveCategoryFilterList}
                    setActiveRatingFilterList={setActiveRatingFilterList}
                    setActivePriceList={setActivePriceList}
                    setActivePriceIndex={setActivePriceIndex}
                  />
                )}
              </>
            </div>
            <Pagination
              pages={filteredTotalPages}
              setCurrentPage={setCurrentPage}
              currentButton={currentButton}
              setCurrentButton={setCurrentButton}
            />
          </>
        ) : (
          <>
            <div className="search-bar">
              <SearchingBar />
              <div className="selected-filter-counter">
                <b>{searchedMuseum?.length} museums</b> &nbsp;found
              </div>
            </div>

            <div className="searched-museums-cards">
              <>
                {searchedMuseum.length > 0 ? (
                  <>
                    {searchedCurrentMuseums &&
                      searchedCurrentMuseums.map((museum) => {
                        return <MuseumCard key={museum._id} museum={museum} />;
                      })}
                  </>
                ) : (
                  <NotFound
                    setActiveCityFilterList={setActiveCityFilterList}
                    setActiveCategoryFilterList={setActiveCategoryFilterList}
                    setActiveRatingFilterList={setActiveRatingFilterList}
                    setActivePriceList={setActivePriceList}
                    setActivePriceIndex={setActivePriceIndex}
                  />
                )}
              </>
            </div>
            <Pagination
              pages={searchedTotalPages}
              setCurrentPage={setCurrentPage}
              currentButton={currentButton}
              setCurrentButton={setCurrentButton}
            />
          </>
        )}
      </div>
    </>
  );
}
