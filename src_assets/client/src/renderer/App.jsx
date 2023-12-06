import React, { useEffect, useState } from "react";
import { useThrottleFn } from "~/hooks/useThrottleFn";
import { RemService } from "~/services/RemService";
import { MyRouter } from "~/routes/router";

const App = () => {
  const [htmlFontSize, setHtmlFontSize] = useState(() => {
    return RemService.setRem();
  });

  const throttleSetRem = useThrottleFn(
    () => {
      const fontSize = RemService.setRem();
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

  return (
    <div className="app">
      <MyRouter />
    </div>
  );
};

export { App };
