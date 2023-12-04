import { MemoryRouter } from "react-router-dom";
import React from "react";
import { MyRoutes } from "./routes";

const MyRouter = () => {
  return (
    <MemoryRouter basename="/main_window" initialEntries={["/main_window"]}>
      <MyRoutes></MyRoutes>
    </MemoryRouter>
  );
};

export { MyRouter };
