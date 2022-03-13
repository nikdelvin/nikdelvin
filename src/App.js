import './daisyui.css';
import './tailwind.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { t } from 'ttag';
import Drawer from "./pages/Drawer"
import Main from "./pages/Main";
import PoketSpace from "./pages/PoketSpace";
import Market from "./pages/Market";
import { addLocale, useLocale } from 'ttag';
import { useUserContext } from "./context/userContext";

function App() {
  const { user, setUser } = useUserContext();
  const locale = user.lang
  document.querySelector("html").setAttribute("data-theme", user.theme)
  const styles = {
    drawerButton: {
      position: "absolute",
      top: "15px",
      left: "15px",
      zIndex: "1"
    }
  }
  if (locale != 'en') {
      const translationsObj = require(`./locale/${locale}.po.json`);
      addLocale(locale, translationsObj);
  }
  useLocale(locale);
  console.log(user)

  return (
    <Router>
      <div className="drawer" style={{height: "100vh"}}>
        <input id="my-drawer" type="checkbox" className="drawer-toggle"/>
        <div className="flex flex-col items-center justify-center drawer-content">
          <label htmlFor="my-drawer" className="btn btn-square btn-ghost drawer-button" style={styles.drawerButton}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </label>
          <Routes>
            <Route path="/market" element={<Market/>} />
            <Route path="/poketspace" element={<PoketSpace/>} />
            <Route path="/" element={<Main/>} />
          </Routes>
        </div>
        <Drawer/>
      </div>
    </Router>
  );
}

export default App;
