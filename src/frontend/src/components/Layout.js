import React, { useEffect, useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";

export const Layout = (props) => {
	const { pathname } = useLocation();
	const [clock, setClock] = useState("");

	useEffect(() => {
		myTimer();
		setInterval(function () {
			myTimer();
		}, 1000);
	}, []);
	function myTimer() {
		var d = new Date();
		setClock(d.toLocaleTimeString());
	}

	return (
		<>
			<nav className="navbar-light navbars navbar navbar-expand-sm">
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav">
						<li
							className={
								pathname === "/"
									? "nav-item active"
									: "nav-item"
							}
						>
							<Link className="nav-link" to="/">
								СТАТ
							</Link>
						</li>
						<li
							className={
								pathname.includes("/project")
									? "nav-item active"
									: "nav-item"
							}
						>
							<Link className="nav-link" to="/projects">
								РАБОТ
							</Link>
						</li>
						<li
							className={
								pathname === "/login" ||
								pathname === "/profile" ||
								pathname === "/register"
									? "nav-item active"
									: "nav-item"
							}
						>
							<Link className="nav-link" to="/login">
								ПРОФ
							</Link>
						</li>
					</ul>
				</div>
			</nav>
			<Outlet />
			<nav className="navbar-expand stat-footer">
				<div className="row">
					<div className="col-3">Убежище 1.15</div>
					<div className="col-6 text-center">
						<span id="clock">{clock}</span>
					</div>
					<div className="col-3 text-right">Github</div>
				</div>
			</nav>
		</>
	);
};
