import React from "react";
import addIcon from "../icons/add.svg";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import axios from "axios";
import ReactModal from "react-modal";

export const Projects = (props) => {
	const [projects, setProjects] = useState([]);
	const [isProjectsLoading, setIsProjectsLoading] = useState(true);

	const [users, setUsers] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [isUsersLoading, setIsUsersLoading] = useState(true);

	const [user, setUser] = useState(null);

	const [isCreatingProject, setIsCreatingProject] = useState(false);

	async function fetchData() {
		setProjects([]);
		try {
			let projectsjson = await axios.get("/api/v1/project/all");
			setProjects(projectsjson.data);
			setIsProjectsLoading(false);
			let userjson = await axios.get("/api/v1/user/current");
			setUser(userjson.data);
		} catch {}
	}

	async function fetchUsers() {
		setIsUsersLoading(true);
		try {
			let usersjson = await axios.get("/api/v1/user/all");
			let data = usersjson.data.filter(({ id }) => id != user.id);
			console.log(data);
			setUsers(data);
			setIsUsersLoading(false);
		} catch {}
	}

	useEffect(() => {
		fetchData();
		setInterval(() => {
			fetchData();
		}, 5000);
	}, []);

	async function createProject() {
		if (
			document.getElementById("projectTitle").value != "" &&
			document.getElementById("projectTitle").value != undefined
		) {
			setIsCreatingProject(false);
			await axios.post("/api/v1/project/create/", {
				title: document.getElementById("projectTitle").value,
				users: selectedUsers,
			});
			fetchData();
		}
	}

	return (
		<>
			<ReactModal
				isOpen={isCreatingProject}
				style={{
					overlay: { backgroundColor: "255,255,255" },
					content: {
						inset: 300,
						backgroundColor: "#272b23",
						border: "2px solid rgb(20, 254, 23)",
						margin: "auto",
						width: "40%",
						height: "40%",
					},
				}}
			>
				<div className="mb-3">
					<label className="form-label">Название проекта</label>
					<input className="form-control" id="projectTitle" />
				</div>
				<div className="mb-3">
					<label className="form-label">Ответственные</label>
					<p>
						Выбранные пользователи:
						{(() => {
							let list = [];
							selectedUsers.forEach((user) => {
								list.push(user.name);
							});
							return list.toString();
						})()}
					</p>
					<div
						className="profile"
						id="users"
						style={{ height: "5rem" }}
					>
						{isUsersLoading ? (
							<ScaleLoader color="#14fe17" />
						) : (
							<ul className="spc-list">
								{users.map((user) => (
									<li
										key={user.id}
										onClick={() => {
											let newusers = users.filter(
												(newuser) =>
													newuser.id != user.id
											);
											setUsers(newusers);
											setSelectedUsers([
												...users,
												{
													id: user.id,
													name: user.name,
												},
											]);
										}}
									>
										<p className="sp-perception">
											{user.name}
										</p>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
				<button
					className="btn btn-success m-2"
					onClick={() => {
						createProject();
					}}
				>
					Создать проект
				</button>
				<button
					className="btn btn-outline-success m-2"
					onClick={() => {
						setIsCreatingProject(false);
					}}
				>
					Отмена
				</button>
			</ReactModal>
			<div className="container">
				<div className="d-flex justify-content-evenly text-center align-items-center">
					<h1>Проекты 1.15</h1>
					{user != null && (
						<div
							role="button"
							className="d-flex align-items-center button"
							onClick={() => {
								fetchUsers();
								setIsCreatingProject(true);
							}}
						>
							<h2>Добавить проект</h2>
							<img src={addIcon} className="icon" />
						</div>
					)}
				</div>
				<hr className="hr" />
				<div className="row">
					<div className="col-12">
						<div className="tab-content" id="myTabContent">
							{isProjectsLoading ? (
								<div
									style={{
										display: "flex",
										justifyContent: "center",
										marginTop: "3%",
									}}
								>
									<ScaleLoader
										color="#14fe17"
										style={{
											marginInline: "auto",
											display: "table",
										}}
									/>
								</div>
							) : (
								<>
									<div
										className="tab-pane fade show active"
										id="special"
										role="tabpanel"
									>
										<ul className="spc-list">
											<li>
												<Link
													to="/archive"
													className="sp-perception"
												>
													Архив
												</Link>
											</li>
											{projects.map((project) => {
												return (
													<li key={project.id}>
														<Link
															to={
																"/project/" +
																project.id
															}
															className="sp-perception"
														>
															{project.name}
														</Link>
													</li>
												);
											})}
										</ul>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
