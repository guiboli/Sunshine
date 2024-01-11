import "~/styles/error-status-page.scss";
import React from "react";
import Button from "@mui/material/Button";

const ErrorStatusPage = () => {
  const relaunch = () => {
    console.log("[ErrorStatusPage] call relaunched");
    // @ts-ignore
    window.electronAPI.relaunch();
  };
  return (
    <div className="error-status-page">
      <div className="error-status-page__wrapper">
        <p className="error-status-page__wrapper--text">
          Error! Steamer 未启动
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
