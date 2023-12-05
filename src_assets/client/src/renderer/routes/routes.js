import { Home } from "~/widgets/Home";
import { LoadingPage } from "~/widgets/LoadingPage";
import { ErrorStatusPage } from "~/widgets/ErrorStatusPage";
import { Route, Routes } from "react-router-dom";
import React from "react";

const MyRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="loading" element={<LoadingPage />} />
      <Route path="error" element={<ErrorStatusPage />} />
    </Routes>
  );
};

export { MyRoutes };
