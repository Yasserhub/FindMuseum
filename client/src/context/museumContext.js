import PropTypes from "prop-types";
import React, { createContext, useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";

const MuseumsContext = createContext();

export function useMuseums() {
  return useContext(MuseumsContext);
}

export const MuseumsProvider = ({ children }) => {
  const [museums, setMuseums] = useState([]);
  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    "/museum",
    (response) => {
      setMuseums(response.result);
    }
  );

  useEffect(() => {
    performFetch();
    return cancelFetch;
  }, []);

  const value = {
    isLoading,
    error,
    museums,
  };

  return (
    <MuseumsContext.Provider value={value}>{children}</MuseumsContext.Provider>
  );
};

MuseumsProvider.propTypes = {
  children: PropTypes.node,
};
