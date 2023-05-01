import PropTypes from "prop-types";
import React, { createContext, useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";

const MuseumsFavContext = createContext();

export function useFavNum() {
  return useContext(MuseumsFavContext);
}

export const MuseumsFavProvider = ({ children }) => {
  const [allUsers, setAllUsers] = useState([]);
  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    "/user",
    (response) => {
      setAllUsers(response.result);
    }
  );

  useEffect(() => {
    performFetch();
    return cancelFetch;
  }, []);

  const value = {
    isLoading,
    error,
    allUsers,
  };

  return (
    <MuseumsFavContext.Provider value={value}>
      {children}
    </MuseumsFavContext.Provider>
  );
};

MuseumsFavProvider.propTypes = {
  children: PropTypes.node,
};
