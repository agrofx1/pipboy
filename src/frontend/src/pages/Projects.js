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

	const [isCreatingProject, setIsCreatingProject] = useState(false);

	async function fetchData() {
		setProjects([]);
		setIsProjectsLoading(true);
		try {
			let json = await axios.get("/api/v1/all");
			setProjects(json.data);
			setIsProjectsLoading(false);
		} catch {}
	}

	useEffect(() => {
		fetchData();
		setInterval(() => {
			fetchData();
		}, 3000);
	}, []);

	async function createProject() {
		if (
			document.getElementById("projectTitle").value != "" &&
			document.getElementById("projectTitle").value != undefined &&
			document.getElementById("projectUsers").value != "" &&
			document.getElementById("projectUsers").value != undefined
		) {
			setIsCreatingProject(false);
			await axios.post("/api/v1/addProject/", {
				title: document.getElementById("projectTitle").value,
				user: document.getElementById("projectUsers").value,
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
					<textarea className="form-control" id="projectUsers" />
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
				<div className="d-flex justify-content-evenly text-center">
					<h1>Проекты 1.15</h1>
					<div
						role="button"
						className="d-flex align-items-center"
						onClick={() => {
							setIsCreatingProject(true);
						}}
					>
						<h2>Добавить проект</h2>
						<img src={addIcon} className="icon" />
					</div>
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
