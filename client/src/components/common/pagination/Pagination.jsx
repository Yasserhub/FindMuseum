import React, { useEffect } from "react";
import "./pagination.css";
import PropTypes from "prop-types";
import { GrPrevious, GrNext } from "react-icons/gr";
import { scrollToUp } from "../../../hooks/scrollToUp";

export default function Pagination({
  pages,
  setCurrentPage,
  currentButton,
  setCurrentButton,
}) {
  const numOfPages = [];

  for (let i = 1; i <= pages; i++) {
    numOfPages.push(i);
  }

  useEffect(() => {
    setCurrentPage(currentButton);
    scrollToUp();
  }, [currentButton, setCurrentPage]);

  return (
    <div className="clearfix">
      <ul className={pages === 0 ? "pagination hidden" : "pagination"}>
        <li
          className={`${
            currentButton === 1 ? "page-item disabled" : "page-item"
          }`}
        >
          <a
            href="#!"
            onClick={() =>
              setCurrentButton((prev) => (prev === 1 ? prev : prev - 1))
            }
          >
            <GrPrevious className="pagination-icon" />
          </a>
        </li>

        {numOfPages.map((page, index) => {
          return (
            <li
              key={index}
              className={`${
                currentButton === page ? "page-item active" : "page-item"
              }`}
            >
              <a
                href="#!"
                className="page-link"
                onClick={() => setCurrentButton(page)}
              >
                {page}
              </a>
            </li>
          );
        })}

        <li
          className={`${
            currentButton === numOfPages.length
              ? "page-item disabled"
              : "page-item"
          }`}
        >
          <a
            href="#!"
            onClick={() =>
              setCurrentButton((next) =>
                next === numOfPages.length ? next : next + 1
              )
            }
          >
            <GrNext />
          </a>
        </li>
      </ul>
    </div>
  );
}
Pagination.propTypes = {
  pages: PropTypes.number,
  setCurrentPage: PropTypes.func,
  currentButton: PropTypes.number,
  setCurrentButton: PropTypes.func,
};
