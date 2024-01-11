import React, { useEffect, useState } from "react";
import { useThrottleFn } from "~/hooks/useThrottleFn";
import { RemService } from "~/services/RemService";
import { MyRouter } from "~/routes/router";
import { ThemeProvider, createTheme } from "@mui/material";
import cssVariables from "~/styles/variables.module.scss";

const App = () => {
  const [htmlFontSize, setHtmlFontSize] = useState(() => {
    var temp = RemService.setRem();
    return temp * RemService.defaultFontSize;
  });

  const throttleSetRem = useThrottleFn(
    () => {
      const temp = RemService.setRem();
      var fontSize = temp * RemService.defaultFontSize;
      setHtmlFontSize(fontSize);
    },
    1000,
    { trailing: true }
  );

  useEffect(() => {
    window.addEventListener("resize", () => throttleSetRem());
    return () => {
      window.removeEventListener("resize", () => throttleSetRem());
    };
  }, []);

  const theme = createTheme({
    typography: {
      fontFamily: cssVariables.DEFAULT_FONTS,
      htmlFontSize,
    },
    palette: {
      mode: "light",
      text: {
        primary: cssVariables.PRIMARY_FONT_COLOR,
        secondary: cssVariables.SECONDARY_FONT_COLOR,
      },
    },
  });

  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        {" "}
        <MyRouter />
      </ThemeProvider>
    </div>
  );
};

export { App };
