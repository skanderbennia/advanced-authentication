import "./App.scss";
import React from "react";
import GlassLogin from "./pages/GlassLogin/GlassLogin";
import { Routes, Route } from "react-router-dom";

function App() {
  // return <GlassLogin />;
  return (
    <Routes>
      <Route path="/" element={<GlassLogin />} />
    </Routes>
  );
}

export default App;
