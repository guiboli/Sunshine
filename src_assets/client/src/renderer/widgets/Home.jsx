import { Link } from "react-router-dom";
import React from "react";

const Home = () => {
  return (
    <div>
      <p>This is Home Page</p>
      <Link to="/loading">to Hello World Page</Link>
    </div>
  );
};

export { Home };
