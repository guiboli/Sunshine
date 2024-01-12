import "~/styles/error-status-page.scss";
import React from "react";
import Button from "@mui/material/Button";
import { LogoIcon } from "../icons/LogoIcon";

const ErrorStatusPage = () => {
  const relaunch = () => {
    console.log("[ErrorStatusPage] call relaunched");
    // @ts-ignore
    window.electronAPI.relaunch();
  };
  return (
    <div className="error-status-page">
      <div className="error-status-page__wrapper">
        <LogoIcon className="error-status-page__wrapper--icon"></LogoIcon>
        <p className="error-status-page__wrapper--text">
          Error! 广汽串流应用未启动
        </p>
        <Button
          className="error-status-page__wrapper--btn"
          variant="contained"
          color="primary"
          size="medium"
          onClick={relaunch}
        >
          重新启动
        </Button>
      </div>
    </div>
  );
};

export { ErrorStatusPage };
