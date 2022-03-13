import React, { useState, useEffect } from 'react';
import { t } from 'ttag';
import { useUserContext } from "../context/userContext";

const Drawer = () => {
	const { user, setUser } = useUserContext();

	function setLocale(locale) {
		var temp = JSON.parse(JSON.stringify(user))
		temp.lang = locale
		setUser(temp)
	}

	function setTheme(theme) {
		var temp = JSON.parse(JSON.stringify(user))
		temp.theme = theme
		setUser(temp)
	}

	function setForm(form) {
		var temp = JSON.parse(JSON.stringify(user))
		temp.form = form
		setUser(temp)
	}

	function logOut() {
		var temp = JSON.parse(JSON.stringify(user))
		temp.form = null
		temp.jwt = null
		temp.role = "guest"
		setUser(temp)
	}

	return (
		<div className="drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
			{(user.page == "/") && (
				<ul className="menu p-4 overflow-y-auto w-60 bg-base-100 text-base-content compact">
					<li className="menu-title">
						<span>{t`Projects`}</span>
					</li>
					<li>
						<a href="/market">{t`Market`}</a>
					</li>
					<li>
						<a href="/poketspace">{t`Poket Space`}</a>
					</li>
					<li className="menu-title">
						<span>{t`Languages`}</span>
					</li>
					<li>
						<a onClick={function () {setLocale("en")}}>English</a>
					</li>
					<li>
						<a onClick={function () {setLocale("ru")}}>Русский</a>
					</li>
					<li className="menu-title">
						<span>{t`Themes`}</span>
					</li>
					<li>
						<a onClick={function () {setTheme("emerald")}}>{t`Light`}</a>
					</li>
					<li>
						<a onClick={function () {setTheme("forest")}}>{t`Dark`}</a>
					</li>
				</ul>
			)}
			{(user.page == "/market") && (
				<ul className="menu p-4 overflow-y-auto w-60 bg-base-100 text-base-content compact">
					{(user.form != null) && (<li className="menu-title">
						<span>{t`Market`}</span>
					</li>)}
					{((user.form == "register") || (user.form == "login")) && (<li>
						<a onClick={function () {setForm(null)}}>{t`Welcome Page`}</a>
					</li>)}
					{(user.role == "admin") && (<li>
						<a onClick={function () {setForm("admin")}}>{t`Admin Page`}</a>
					</li>)}
					{((user.form == "admin") || (user.form == "cart")) && (<li>
						<a onClick={function () {setForm("catalog")}}>{t`Catalog`}</a>
					</li>)}
					{((user.form == "admin") || (user.form == "catalog")) && (<li>
						<a onClick={function () {setForm("cart")}}>{t`Cart`}</a>
					</li>)}
					{((user.form == "catalog") || (user.form == "cart") || (user.form == "admin")) && (<li>
						<a onClick={function () {logOut()}}>{t`Logout`}</a>
					</li>)}
					<li className="menu-title">
						<span>{t`Languages`}</span>
					</li>
					<li>
						<a onClick={function () {setLocale("en")}}>English</a>
					</li>
					<li>
						<a onClick={function () {setLocale("ru")}}>Русский</a>
					</li>
				</ul>
			)}
        </div>
	)
}
export default Drawer;