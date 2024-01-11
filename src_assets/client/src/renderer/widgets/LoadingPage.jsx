import { Link } from "react-router-dom";
import React from "react";
import { LogoIcon } from "../icons/LogoIcon";
import "~/styles/loading-page.scss";

const LoadingPage = () => {
  return (
    <div className="loading-page">
      <div className="loading-page__wrapper">
        <LogoIcon className="loading-page__wrapper--icon"></LogoIcon>
        <p className="loading-page__wrapper--text">
          启动中
          <span className="loading-page__wrapper__dot-container">
            <span className="loading-page__wrapper__dot-container--dot"></span>
            <span className="loading-page__wrapper__dot-container--dot"></span>
            <span className="loading-page__wrapper__dot-container--dot"></span>
          </span>
        </p>
      </div>
    </div>
  );
};

export { LoadingPage };
