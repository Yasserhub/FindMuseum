import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import useFetch from "../hooks/useFetch";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { error, performFetch, cancelFetch } = useFetch(
    `/user/update/${authUser?._id}`,
    handleLogoutFavorite
  );
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("isLoggedIn"));
    if (userData) {
      setIsLoggedIn(userData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("authUser"));
    if (authData) {
      setAuthUser(authData);
    }
  }, []);

  useEffect(() => {
    return cancelFetch;
  }, []);

  useEffect(() => {
    localStorage.setItem("authUser", JSON.stringify(authUser));
  }, [authUser]);

  // Favorite
  const [favorites, setFavorites] = useState(
    localStorage.getItem("favorites")
      ? JSON.parse(localStorage.getItem("favorites"))
      : []
  );

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);
  //
  const isFavorite = (id) => {
    return favorites.includes(id);
  };
  //
  const clearFavorites = () => {
    setFavorites([]);
  };
  //
  const handleFavorite = (id, isLoggedIn) => {
    if (!isLoggedIn) {
      toast.warn("Please, log in to add favorites!", {
        position: "top-center",
        autoClose: 3000,
      });
    } else if (favorites.includes(id)) {
      const favoritesIds = favorites.filter((favId) => favId !== id);
      setFavorites(favoritesIds);
    } else {
      setFavorites([...favorites, id]);
    }
    // event.stopPropagation();
  };

  // logout for favorite
  const handleLogoutFavorite = () => {
    try {
      performFetch({
        method: "PUT",
        headers: {
          "content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({ userFavorite: favorites }),
      });
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    if (error == "BAD REQUEST: favorite museums list was not added") {
      toast.warn("favorite museums list was not added", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  }, [error]);

  ///---

  const value = {
    authUser,
    setAuthUser,
    isLoggedIn,
    setIsLoggedIn,
    isFavorite,
    favorites,
    setFavorites,
    handleFavorite,
    handleLogoutFavorite,
    clearFavorites,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};
