import { HashRouter } from "react-router-dom";
import React from "react";
import { MyRoutes } from "./routes";

const MyRouter = () => {
  const pathname = window.location.pathname;
  return (
    <HashRouter>
      <MyRoutes></MyRoutes>
    </HashRouter>
  );
};

export { MyRouter };
