import React, { useEffect, useState } from "react";
import "./all-museums.css";
import SearchingBar from "../Home-Page/Searching-Bar/SearchingBar";
import MuseumCard from "./MuseumCard";
import { useMuseums } from "../../context/museumContext";
import FilterBar from "./FilterBar";
import NotFound from "./NotFound";
import Pagination from "../common/pagination/Pagination";
import { FaRegWindowClose } from "react-icons/fa";
import { GiSettingsKnobs } from "react-icons/gi";
// import { FaFilter } from "react-icons/fa";
// import { GoSettings } from "react-icons/go";

export default function AllMuseums() {
  const { museums } = useMuseums();

  //Filter in mobile mode
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const handleClick = () => setFilterIsOpen(!filterIsOpen);

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [museumsPerPage] = useState(12);

  const indexOfLastMuseum = currentPage * museumsPerPage;
  const indexOfFirstMuseum = indexOfLastMuseum - museumsPerPage;
  const currentMuseums = museums?.slice(indexOfFirstMuseum, indexOfLastMuseum);
  const totalPagesNum = Math.ceil(museums?.length / museumsPerPage);

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

  useEffect(() => {
    // city filtering
    if (activeCityFilterList.length > 0) {
      let cityMuseums = museums.filter((museum) => {
        if (activeCityFilterList?.includes(museum.address.city)) {
          return museum;
        }
      });
      setCityFilteredMuseum(cityMuseums);
    } else {
      setCityFilteredMuseum(museums);
    }

    // category filtering
    if (activeCategoryFilterList.length > 0) {
      let categoryMuseums = museums.filter((museum) => {
        if (activeCategoryFilterList?.includes(museum.category)) {
          return museum;
        }
      });
      setCategoryFilteredMuseum(categoryMuseums);
    } else {
      setCategoryFilteredMuseum(museums);
    }

    // rating filtering
    if (activeRatingFilterList.length > 0) {
      let ratingMuseums = museums.filter((museum) => {
        if (activeRatingFilterList?.includes(museum.rating.toString())) {
          return museum;
        }
      });
      setRatingFilteredMuseum(ratingMuseums);
    } else {
      setRatingFilteredMuseum(museums);
    }

    // price filtering
    if (activePriceList.length > 0) {
      let priceMuseums = museums.filter((museum) => {
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
      setPriceFilteredMuseum(museums);
    }

    setCurrentPage(1);
    setCurrentButton(1);
  }, [
    activeCityFilterList,
    activeCategoryFilterList,
    activeRatingFilterList,
    activePriceList,
  ]);

  //set filteredMuseum from result list
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
          museumData={museums}
          setActivePriceList={setActivePriceList}
          activePriceIndex={activePriceIndex}
          setActivePriceIndex={setActivePriceIndex}
        />
      </div>
      <div className="all-museums">
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
                {filteredMuseum?.length > 0 ? (
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
                <b>{museums?.length} museums</b> &nbsp;found
              </div>
            </div>
            <div className="all-museums-card">
              <>
                {museums.length > 0 ? (
                  <>
                    {currentMuseums &&
                      currentMuseums.map((museum) => {
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
              pages={totalPagesNum}
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
