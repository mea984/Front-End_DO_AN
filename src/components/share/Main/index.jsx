import React from "react";
import styles from "./Main.module.scss";

import Header from "../Header";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Main;
