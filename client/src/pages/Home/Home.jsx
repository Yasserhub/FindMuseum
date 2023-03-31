import React from "react";
import Goal from "../../components/Home-Page/Goal-Section/Goal";
import SearchingBar from "../../components/Home-Page/Searching-Bar/SearchingBar";
import MuseumList from "../../components/Home-Page/museum/MuseumList";
import Events from "../../components/Home-Page/Upcoming-Events/Events";

const Home = () => {
  return (
    <main>
      <Goal />
      <SearchingBar />
      <MuseumList />
      <Events />
    </main>
  );
};

export default Home;
