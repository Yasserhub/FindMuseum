import React from "react";
import PropTypes from "prop-types";
import "./filter-bar.css";

const FilterBar = ({
  activeCityFilterList,
  setActiveCityFilterList,
  activeCategoryFilterList,
  setActiveCategoryFilterList,
  activeRatingFilterList,
  setActiveRatingFilterList,
  museumData,
  setActivePriceList,
  activePriceIndex,
  setActivePriceIndex,
}) => {
  let categoryList = [];
  let cityList = [];
  let ratingList = [];
  const priceList = [
    { minPrice: 0, maxPrice: 16 },
    { minPrice: 16, maxPrice: 18 },
    { minPrice: 18, maxPrice: 20 },
    { minPrice: 20, maxPrice: 999 },
  ];

  museumData.map((museum) => {
    if (!categoryList?.includes(museum.category)) {
      categoryList.push(museum.category);
    } else return;
  });

  museumData.map((museum) => {
    if (!cityList?.includes(museum.address.city)) {
      cityList.push(museum.address.city);
    } else return;
  });

  museumData.map((museum) => {
    if (!ratingList?.includes(museum.rating)) {
      ratingList.push(museum.rating);
    } else return;
  });

  const handleActiveList = (activeList, setActiveList, e) => {
    if (activeList.length > 0) {
      if (activeList?.includes(e.target.value)) {
        setActiveList(activeList.filter((filter) => filter !== e.target.value));
      } else {
        setActiveList([...activeList, e.target.value]);
      }
    } else {
      setActiveList([e.target.value]);
    }
  };

  const handleFilterClick = (e) => {
    // add city to activeCityFilterList
    if (e.target.name === "city") {
      handleActiveList(activeCityFilterList, setActiveCityFilterList, e);
    }
    // add category to activeCategoryFilterList
    else if (e.target.name === "category") {
      handleActiveList(
        activeCategoryFilterList,
        setActiveCategoryFilterList,
        e
      );
    }
    // add rating to activeRatingFilterList
    else {
      handleActiveList(activeRatingFilterList, setActiveRatingFilterList, e);
    }
  };

  const handleResetClick = () => {
    setActiveCityFilterList([]);
    setActiveCategoryFilterList([]);
    setActiveRatingFilterList([]);
    setActivePriceList([]);
    setActivePriceIndex(null);
  };

  return (
    <div className="all-filters">
      <section className="container--filter-bar">
        <div className="header--filter-bar">
          <h1>Filters</h1>
          <button
            onClick={handleResetClick}
            className={
              activeCityFilterList.length > 0 ||
              activeCategoryFilterList.length > 0 ||
              activeRatingFilterList.length > 0
                ? null
                : "hidden"
            }
          >
            Reset filters
          </button>
        </div>
        <hr className="filter-divider"></hr>
        <div className="container--filter-list">
          {cityList.length > 0 ? (
            <>
              <fieldset className="container--fieldset">
                <legend className="title--filter">CITY</legend>
                <ul>
                  {cityList.sort().map((city) => {
                    return (
                      <li key={city}>
                        <input
                          type="button"
                          onClick={handleFilterClick}
                          value={city}
                          name="city"
                          className={
                            activeCityFilterList?.includes(city)
                              ? "filter-buttons active-filter"
                              : "filter-buttons"
                          }
                        />
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
            </>
          ) : null}

          {categoryList.length > 0 ? (
            <>
              <hr className="filter-divider"></hr>
              <fieldset className="container--fieldset">
                <legend className="title--filter">CATEGORY</legend>
                <ul>
                  {categoryList.sort().map((category) => {
                    return (
                      <li key={category}>
                        <input
                          type="button"
                          onClick={handleFilterClick}
                          value={category}
                          name="category"
                          className={
                            activeCategoryFilterList?.includes(category)
                              ? "filter-buttons active-filter"
                              : "filter-buttons"
                          }
                        />
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
            </>
          ) : null}

          {ratingList.length > 0 ? (
            <>
              <hr className="filter-divider"></hr>
              <fieldset className="container--fieldset">
                <legend className="title--filter">RATING</legend>
                <ul>
                  {ratingList
                    .sort()
                    .reverse()
                    .map((rate) => {
                      return (
                        <li key={rate}>
                          <input
                            type="button"
                            onClick={handleFilterClick}
                            value={rate}
                            name="rate"
                            className={
                              activeRatingFilterList?.includes(rate.toString())
                                ? "filter-buttons active-filter"
                                : "filter-buttons"
                            }
                          />
                        </li>
                      );
                    })}
                </ul>
              </fieldset>
            </>
          ) : null}

          {museumData.length > 0 ? (
            <>
              <hr className="filter-divider"></hr>
              <fieldset className="container--fieldset">
                <legend className="title--filter">PRICE</legend>
                <ul className="price-list">
                  {priceList &&
                    priceList.map((priceObj, index) => {
                      return (
                        <li key={index}>
                          <input
                            type="checkbox"
                            id={`${priceObj.minPrice.toString()}to${priceObj.maxPrice.toString()}`}
                            checked={index === activePriceIndex ? true : false}
                            onChange={() => {
                              if (index === activePriceIndex) {
                                setActivePriceIndex(null);
                                setActivePriceList([]);
                              } else {
                                setActivePriceIndex(index);
                                setActivePriceList([priceList[index]]);
                              }
                            }}
                          />
                          <label
                            htmlFor={`${priceObj.minPrice.toString()}to${priceObj.maxPrice.toString()}`}
                          >
                            {`€${priceObj.minPrice.toString()} to €${priceObj.maxPrice.toString()}`}
                          </label>
                        </li>
                      );
                    })}
                </ul>
              </fieldset>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
};

FilterBar.propTypes = {
  activeCityFilterList: PropTypes.array,
  setActiveCityFilterList: PropTypes.func,
  activeCategoryFilterList: PropTypes.array,
  setActiveCategoryFilterList: PropTypes.func,
  activeRatingFilterList: PropTypes.array,
  setActiveRatingFilterList: PropTypes.func,
  museumData: PropTypes.array,
  setActivePriceList: PropTypes.func,
  activePriceIndex: PropTypes.bool,
  setActivePriceIndex: PropTypes.func,
};

export default FilterBar;
