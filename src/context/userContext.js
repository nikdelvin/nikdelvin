import { createContext, useContext, useState } from "react";

const UserContext = createContext();

const useUserContext = () => useContext(UserContext);

const path = window.location.pathname
const defaultUser = {
	page: path,
	lang: "en",
	jwt: null,
	role: "guest",
	theme: "forest",
	form: null
}
const defaultCatalog = []

const UserProvider = ({ children }) => {

	const [user, setUser] = useState(defaultUser);
	const [catalog, setCatalog] = useState(defaultCatalog);

	return (
		<UserContext.Provider value={{ user, setUser, catalog, setCatalog}}>
			{children}
		</UserContext.Provider>
	);
}

export { useUserContext, UserProvider };