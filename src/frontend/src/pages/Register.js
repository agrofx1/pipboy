import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Register = (props) => {
	const [isSubmiting, setIsSubmiting] = useState(false);
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	const register = async () => {
		try {
			setIsSubmiting(true);
			let response = await axios.post("/api/v1/user/register", {
				name: document.getElementById("name").value,
				email: document.getElementById("email").value,
				password: document.getElementById("password").value,
			});
			navigate("/profile");
		} catch (err) {
			if (err.response.status == 400) {
				setMessage("Невалидные данные!");
			}
			setIsSubmiting(false);
		}
	};

	return (
		<div className="form">
			<h1>Добро пожаловать в Коллектив 2.0!</h1>
			<div class="mb-3">
				<label class="form-label">Имя</label>
				<input
					type="name"
					class="form-control"
					id="name"
					disabled={isSubmiting}
				/>
			</div>
			<div class="mb-3">
				<label class="form-label">Почта</label>
				<input
					type="email"
					class="form-control"
					id="email"
					disabled={isSubmiting}
				/>
			</div>
			<div class="mb-3">
				<label class="form-label">Пароль</label>
				<input
					type="password"
					class="form-control"
					id="password"
					disabled={isSubmiting}
				/>
			</div>
			<p>{message}</p>
			<button
				class="btn btn-success m-2"
				onClick={() => {
					register();
				}}
				disabled={isSubmiting}
			>
				Регистрация
			</button>
		</div>
	);
};
