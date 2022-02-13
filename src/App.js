import './daisyui.css';
import './tailwind.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { t } from 'ttag';
import Main from "./pages/Main";
import OilMap from "./pages/OilMap";
import { addLocale, useLocale } from 'ttag';


function App() {
  const [theme, setTheme] = useState("forest");
  const [locale, setLocale] = useState("en");
  document.querySelector("html").setAttribute("data-theme", theme)
  const styles = {
    drawerButton: {
      position: "absolute",
      top: "15px",
      left: "15px"
    }
  }
  if (locale != 'en') {
      const translationsObj = require(`./locale/${locale}.po.json`);
      addLocale(locale, translationsObj);
  }
  useLocale(locale);


  return (
    <Router>
      <div className="drawer" style={{height: "100vh"}}>
        <input id="my-drawer" type="checkbox" className="drawer-toggle"/>
        <div className="flex flex-col items-center justify-center drawer-content">
          <label htmlFor="my-drawer" className="btn btn-square btn-ghost drawer-button" style={styles.drawerButton}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </label>
          <Routes>
            <Route path="/oilmap" element={<OilMap/>} />
            <Route path="/" element={<Main/>} />
          </Routes>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content compact">
            <li className="menu-title">
              <span>
                {t`Projects`}
              </span>
            </li>
            <li>
              <Link to="/">
                {t`Main Page`}
              </Link>
            </li>
            <li>
              <Link to="/oilmap">
                {t`Oil Map`}
              </Link>
            </li>
            <li className="menu-title">
              <span>
                {t`Languages`}
              </span>
            </li>
            <li>
              <a onClick={function () {setLocale("en")}}>
                English
              </a>
            </li>
            <li>
              <a onClick={function () {setLocale("ru")}}>
                Русский
              </a>
            </li>
            <li className="menu-title">
              <span>
                {t`Themes`}
              </span>
            </li>
            <li>
              <a onClick={function () {setTheme("emerald")}}>
                {t`Light`}
              </a>
            </li>
            <li>
              <a onClick={function () {setTheme("forest")}}>
                {t`Dark`}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </Router>
  );
}

export default App;
