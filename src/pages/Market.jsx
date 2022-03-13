import { t } from 'ttag';
import React, { useState, useEffect, useRef } from 'react';
import { useUserContext } from "../context/userContext";
import Swal from 'sweetalert2';

const Market = () => {
	const { user, setUser, catalog, setCatalog } = useUserContext();

	document.querySelector("html").setAttribute("data-theme", "cmyk")

	function setForm(form) {
		var temp = JSON.parse(JSON.stringify(user))
		temp.form = form
		setUser(temp)
	}

	async function registerUser() {
		var email = document.querySelector("#email").value
		var pass = document.querySelector("#password").value
		var response = await fetch("https://"+window.location.hostname+"/auth/register", { method: "POST", body: JSON.stringify({email: email, password: pass}), headers: {'Content-Type': 'application/json'}})
        var commits = await response.json()
		if ("success" in commits) {
			var temp = JSON.parse(JSON.stringify(user))
			temp.jwt = commits.jwt
			temp.form = "catalog"
			if (email == "admin") {
				temp.role = "admin"
			}
			setUser(temp)
			Swal.fire({
				title: t`Success`,
				text: t`Account registered successfully`,
				icon: 'success',
				confirmButtonText: t`Ok`
			})
		}
		else {
			if (commits.error == "email") {
				Swal.fire({
					title: t`Error`,
					text: t`Email already in use`,
					icon: 'error',
					confirmButtonText: t`Ok`
				})
			}
			else {
				Swal.fire({
					title: t`Error`,
					text: t`API Server Error`,
					icon: 'error',
					confirmButtonText: t`Ok`
				})
			}
		}
	}

	async function loginUser() {
		var email = document.querySelector("#email").value
		var pass = document.querySelector("#password").value
		var response = await fetch("https://"+window.location.hostname+"/auth/login", { method: "POST", body: JSON.stringify({email: email, password: pass}), headers: {'Content-Type': 'application/json'}})
        var commits = await response.json()
		if ("success" in commits) {
			var temp = JSON.parse(JSON.stringify(user))
			temp.jwt = commits.jwt
			temp.form = "catalog"
			if (email == "admin") {
				temp.role = "admin"
			}
			setUser(temp)
			Swal.fire({
				title: t`Success`,
				text: t`Authorization successful`,
				icon: 'success',
				confirmButtonText: t`Ok`
			})
		}
		else {
			if (commits.error == "email") {
				Swal.fire({
					title: t`Error`,
					text: t`Email not found`,
					icon: 'error',
					confirmButtonText: t`Ok`
				})
			}
			else if (commits.error == "password") {
				Swal.fire({
					title: t`Error`,
					text: t`Wrong password`,
					icon: 'error',
					confirmButtonText: t`Ok`
				})
			}
			else {
				Swal.fire({
					title: t`Error`,
					text: t`API Server Error`,
					icon: 'error',
					confirmButtonText: t`Ok`
				})
			}
		}
	}

	function addToCart(el) {
		var temp = JSON.parse(JSON.stringify(user))
		if (temp.cart == null) {
			temp.cart = [el]
		}
		else {
			temp.cart.push(el)
		}
		setUser(temp)
		Swal.fire({
			title: t`Success`,
			text: t`Product added to cart`,
			icon: 'success',
			confirmButtonText: t`Ok`
		})
	}

	const RegisterForm = () => {
		return (
			<div style={{width: "20rem"}} className="px-2">
				<div className="form-control w-full">
					<label className="label">
						<span className="label-text">{t`Enter email address`}</span>
					</label>
					<input id="email" type="text" placeholder="example@gmail.com" className="input input-bordered input-accent w-full"/>
				</div>
				<div className="form-control w-full">
					<label className="label">
						<span className="label-text">{t`Enter password`}</span>
					</label>
					<input id="password" type="text" placeholder="example1234!" className="input input-bordered input-accent w-full"/>
				</div>
				<button className="btn btn-accent mt-5" onClick={registerUser}>{t`Sign Up`}</button>
			</div>
		)
	}

	const SignInForm = () => {
		return (
			<div style={{width: "20rem"}} className="px-2">
				<div className="form-control w-full">
					<label className="label">
						<span className="label-text">{t`Enter email address`}</span>
					</label>
					<input id="email" type="text" placeholder="example@gmail.com" className="input input-bordered input-accent w-full"/>
				</div>
				<div className="form-control w-full">
					<label className="label">
						<span className="label-text">{t`Enter password`}</span>
					</label>
					<input id="password" type="text" placeholder="example1234!" className="input input-bordered input-accent w-full"/>
				</div>
				<button className="btn btn-accent mt-5" onClick={loginUser}>{t`Sign In`}</button>
			</div>
		)
	}

	const Catalog = () => {

		useEffect(() => {
			async function run() {
				var response = await fetch("https://"+window.location.hostname+"/v1/getProducts", {headers: {"Authorization": "Bearer "+user.jwt, 'Content-Type': 'application/json'}})
	            var commits = await response.json()
				if ("products" in commits) {
					setCatalog(commits.products)
				}
			}
			if (catalog.length == 0) {
				run()
			}
		}, [])

		return (
			<div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4 m-2">
				{catalog.map((el, index) => (
					<div key={index} id={index} className="card w-50 bg-base-100 shadow-xl">
						<figure><img src={el.img} alt="Shoes"/></figure>
						<div className="card-body">
							<h2 className="card-title">{el.name}</h2>
							<p>{el.desc}</p>
							<div className="card-actions justify-end">
								<button className="btn btn-accent" onClick={function () {addToCart(el)}}>{t`Buy Now`}</button>
							</div>
						</div>
					</div>
				))}
			</div>
		)
	}

	const Cart = () => {
		return (
			<div class="grid grid-cols-1 gap-4 auto-cols-max h-screen">
				<div style={{marginTop: "78px"}} className="h-auto carousel carousel-vertical box border-t border-b border-base-content">
					{(user.cart != null) ? (
					<table className="table w-full">
						{user.cart.map((el, index) => (
							<tr>
								<th className="p-2">
									<label>
										<input type="checkbox" className="checkbox"/>
									</label>
								</th>
								<td className="p-2">
									<div className="flex items-center space-x-3">
										<div className="avatar">
											<div className="mask mask-squircle w-12 h-12">
												<img src={el.img} alt={el.name}/>
											</div>
										</div>
										<div>
											<div className="font-bold">{el.name}</div>
											<div className="text-sm opacity-50">{el.desc}</div>
										</div>
									</div>
								</td>
								<td className="p-2">
									<div className="font-bold">{el.price}</div>
									<div className="text-sm opacity-50">1</div>
								</td>
								<th className="p-2">
									<div className="btn-group">
										<button className="btn btn-xs">-</button>
										<button className="btn btn-xs">+</button>
									</div>
								</th>
							</tr>
						))}
					</table>
					) : (
					<p className="py-6">{t`Please add products to cart.`}</p>
					)}
				</div>
				<button className="btn btn-accent self-end mb-4">{t`Get Order`}</button>
			</div>
		)
	}

	const myInput = useRef(null);

	const clickElement = () => {
        myInput.current?.click();
    }

    const changeHandler = (event) => {
		for (var file of event.target.files) {
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function () {
				var id = document.querySelector("#id").value
				var name = document.querySelector("#name").value
				var desc = document.querySelector("#desc").value
				var price = document.querySelector("#price").value
				var temp = JSON.parse(JSON.stringify(user))
				temp.input = {id: id, name: name, desc: desc, price: price, img: reader.result}
				setUser(temp)
				Swal.fire({
					title: t`Success`,
					text: t`Image uploaded`,
					icon: 'success',
					confirmButtonText: t`Ok`
				})
			}
			reader.onerror = function (error) {
				Swal.fire({
					title: t`Error`,
					text: t`API Server Error`,
					icon: 'error',
					confirmButtonText: t`Ok`
				})
			}
		}
    }

    async function addProduct() {
		var temp = JSON.parse(JSON.stringify(user))
	    if (temp.input != null) {
	    	console.log(user.jwt)
			var response = await fetch("https://"+window.location.hostname+"/v1/addProduct", { method: "POST", body: JSON.stringify(temp.input), headers: {"Authorization": "Bearer "+user.jwt, 'Content-Type': 'application/json'}})
            var commits = await response.json()
		    console.log(commits)
		    temp.input = null
		    setUser(temp)
		    Swal.fire({
				title: t`Success`,
				text: t`Product added successfully`,
				icon: 'success',
				confirmButtonText: t`Ok`
			})
	    }
    }

	const AdminForm = () => {
		return (
			<div style={{width: "20rem"}} className="p-2">
				<div className="form-control w-full">
					<label className="label">
						<span className="label-text">{t`Enter product id`}</span>
					</label>
					<input id="id" type="text" placeholder="1" className="input input-bordered input-accent w-full"
					       defaultValue={(user.input != null) ? (user.input.id) : ("")}/>
				</div>
				<div className="form-control w-full">
					<label className="label">
						<span className="label-text">{t`Enter product name`}</span>
					</label>
					<input id="name" type="text" placeholder={t`Product 1`} className="input input-bordered input-accent w-full"
					       defaultValue={(user.input != null) ? (user.input.name) : ("")}/>
				</div>
				<div className="form-control w-full">
					<label className="label">
						<span className="label-text">{t`Enter description of product`}</span>
					</label>
					<input id="desc" type="text" placeholder={t`Description 1`} className="input input-bordered input-accent w-full"
					       defaultValue={(user.input != null) ? (user.input.desc) : ("")}/>
				</div>
				<div className="form-control w-full">
					<label className="label">
						<span className="label-text">{t`Enter product price`}</span>
					</label>
					<input id="price" type="text" placeholder="1000" className="input input-bordered input-accent w-full"
					       defaultValue={(user.input != null) ? (user.input.price) : ("")}/>
				</div>
				<button className="btn btn-accent mt-5" onClick={clickElement}>{t`Load Image`}</button>
				<button className="btn btn-accent ml-5 mt-5" onClick={addProduct}>{t`Add Product`}</button>
				<input style={{opacity: "0", width: "0px", height: "0px"}} type="file" id="uploadfile" ref={myInput} onChange={changeHandler}/>
			</div>
		)
	}

	return (
		<div className="hero min-h-screen bg-base-200">
			<div className="hero-content p-0 text-center">
				{(user.form == null) && (
					<div style={{width: "20rem"}} className="px-2">
						<h1 className="text-5xl font-bold">{t`Hello there`}</h1>
						<p className="py-6">{t`Please register or login in the marketplase.`}</p>
						<button style={{width: "7rem"}} className="btn btn-accent mx-5" onClick={function () {setForm("register")}}>{t`Register`}</button>
						<button style={{width: "7rem"}} className="btn btn-accent mx-5" onClick={function () {setForm("login")}}>{t`Login`}</button>
					</div>
				)}
				{(user.form == "register") && (<RegisterForm/>)}
				{(user.form == "login") && (<SignInForm/>)}
				{(user.form == "catalog") && (<Catalog/>)}
				{(user.form == "cart") && (<Cart/>)}
				{(user.form == "admin") && (<AdminForm/>)}
			</div>
		</div>
	)
}
export default Market;