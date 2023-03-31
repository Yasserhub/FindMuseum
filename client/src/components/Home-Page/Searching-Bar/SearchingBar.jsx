import React, { useState } from "react";
import "./searching-bar.css";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const SearchingBar = () => {
  const [key, setKey] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/museums/${key}`);
  };

  return (
    <div className="searching-bar">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-icon">
          <FaSearch />
        </div>
        <input
          type="text"
          className="form-control"
          placeholder="Search"
          id="search-name"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <button className="search-bar-button" type="submit">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchingBar;
