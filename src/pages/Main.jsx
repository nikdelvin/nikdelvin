import { t } from 'ttag';
import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, addDoc, getDocs } from "firebase/firestore";
import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from "firebase/auth";

const Main = () => {
	const [user, setUser] = useState({"email": "", "password": ""})
	const firebaseConfig = {
		apiKey: "AIzaSyAES47Sr_f_qhio36Qc3c9V4RM-Xdv9itw",
		authDomain: "nikdelvin-d06ed.firebaseapp.com",
		databaseURL: "https://nikdelvin-d06ed-default-rtdb.europe-west1.firebasedatabase.app",
		projectId: "nikdelvin-d06ed",
		storageBucket: "nikdelvin-d06ed.appspot.com",
		messagingSenderId: "988046220027",
		appId: "1:988046220027:web:be8a3f358e3091c5942e5e",
		measurementId: "G-DH6RTE5SQG"
	};
	const app = initializeApp(firebaseConfig);
	const db = getFirestore();
	const provider = new GoogleAuthProvider();

	async function auth() {
		try {
		  const auth = getAuth();
		  const result = await getRedirectResult(auth);
		  const credential = GoogleAuthProvider.credentialFromResult(result);
		  if (credential) {
		    const token = credential.accessToken;
		    const user = result.user;
		    console.log(user)
		    const q = query(collection(db, "users"), where("email", "==", user.email));
		    const querySnapshot = await getDocs(q);
		    if (querySnapshot.docs.length == 0) {
		      const docRef = await addDoc(collection(db, "users"), {
		        fullname: user.displayName,
		        email: user.email
		      });
		      console.log("Success registered!");
		    } else {
		      console.log("Email already in use!");
		    }
		  }
		} catch (e) {
		  console.error(e);
		}
	}

	useEffect(() => {
		auth();
	}, [])

	async function addUser() {
		try {
		  const auth = getAuth();
		  signInWithRedirect(auth, provider)
		} catch (e) {
		  console.error(e);
		}
	};

	return (
		<div className="hero min-h-screen bg-base-200">
			<div className="text-center hero-content transition-opacity">
			  <div className="max-w-md">
			    <h1 className="mb-5 text-5xl font-bold">
			      {t`Hello there`}
			    </h1>
			    <p className="mb-5">
			      {t`Welcome to the sandbox for learning React, JavaScript, HTML and CSS. You will learn how to create web applications on a real example of the development of this site and small pet projects presented on it.`}
			    </p>
			    <a className="flex-auto btn btn-primary" onClick={addUser}>
			      {t`Get Started`}
			    </a>
			  </div>
			</div>
		</div>
	)
}
export default Main;