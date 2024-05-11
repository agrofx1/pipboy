import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

export const Profile = (props) => {
	const [user, setUser] = useState();
	const [isUserLoading, setIsUserLoading] = useState(true);
	const navigate = useNavigate();

	const getUser = async () => {
		try {
			let response = await axios.get("/api/v1/user/current");
			setUser(response.data);
			setIsUserLoading(false);
		} catch (err) {
			navigate("/login");
		}
	};

	useEffect(() => {
		getUser();
	}, []);

	return (
		<div className="profile-page">
			<h1 className="title">Профиль</h1>
			<div className="profile">
				{isUserLoading ? (
					<ScaleLoader color="#14fe17" />
				) : (
					<>
						<h1>{user.name}</h1>
						<h5>{user.email}</h5>
					</>
				)}
			</div>
			<div className="profile">
				{isUserLoading ? (
					<ScaleLoader color="#14fe17" />
				) : (
					<>
						<h1>Пароль</h1>
						<h3>{user.title}</h3>
					</>
				)}
			</div>
		</div>
	);
};
