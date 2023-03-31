import React, { useEffect } from "react";
import AllMuseums from "../../components/Museum-Overview/AllMuseums";
import { scrollToUp } from "../../hooks/scrollToUp";
import "./museum-overview.css";

export default function MuseumOverview() {
  useEffect(() => {
    scrollToUp();
  });

  return (
    <div className="museum-overview">
      <AllMuseums />
    </div>
  );
}
