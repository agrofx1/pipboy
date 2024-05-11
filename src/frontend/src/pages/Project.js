import React, { useEffect, useState, useReducer } from "react";
import addIcon from "../icons/add.svg";
import removeIcon from "../icons/remove.svg";
import archiveIcon from "../icons/archive.svg";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Task } from "../components/Task";
import ReactModal from "react-modal";
import { ScaleLoader } from "react-spinners";

export const Project = (props) => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [projectInfo, setProjectInfo] = useState("");
	const [tasksCount, setTasksCount] = useState(1);
	const [isProjectInfoLoading, setIsProjectInfoLoading] = useState(true);

	const [backlogTasks, setBacklogTasks] = useState([]);
	const [workTasks, setWorkTasks] = useState([]);
	const [doneTasks, setDoneTasks] = useState([]);

	const [errorMessage, setErrorMessage] = useState("");

	const [isCreatingTask, setIsCreatingTask] = useState(false);
	const [isArchivingProject, setIsArchivingProject] = useState(false);
	const [isDeletingProject, setIsDeletingProject] = useState(false);

	async function fetchData() {
		try {
			setBacklogTasks([]);
			setWorkTasks([]);
			setDoneTasks([]);
			let json = await axios.get(`/api/v1/project/${id}`);
			setProjectInfo(json.data);
			setTasksCount(json.data.tasks.length);
			for (let task of json.data.tasks) {
				if (task.status == "backlog") {
					setBacklogTasks((backlogTasks) => [
						...backlogTasks,
						<Task
							title={task.title}
							text={task.note}
							projectId={task.project}
							ukey={task.id}
							status="backlog"
							cb={updateTask}
							rm={removeTask}
						/>,
					]);
				}
				if (task.status == "work") {
					setWorkTasks((workTasks) => [
						...workTasks,
						<Task
							title={task.title}
							text={task.note}
							projectId={task.project}
							ukey={task.id}
							status="work"
							cb={updateTask}
							rm={removeTask}
						/>,
					]);
				}
				if (task.status == "done") {
					setDoneTasks((done) => [
						...done,
						<Task
							title={task.title}
							text={task.note}
							projectId={task.project}
							ukey={task.id}
							status="done"
							cb={updateTask}
							rm={removeTask}
						/>,
					]);
				}
			}
			setIsProjectInfoLoading(false);
		} catch (err) {
			navigate("/projects");
			console.log(err);
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	async function addTask() {
		if (
			document.getElementById("taskTitle").value !== "" &&
			document.getElementById("taskTitle").value !== undefined &&
			document.getElementById("taskDescription").value !== "" &&
			document.getElementById("taskDescription").value !== undefined
		) {
			setIsCreatingTask(false);
			await axios.post(`/api/v1/project/${projectInfo.id}/create`, {
				title: document.getElementById("taskTitle").value,
				note: document.getElementById("taskDescription").value,
			});
			fetchData();
		}
	}
	async function removeProject() {
		let response = await axios.delete(`/api/v1/project/${id}/delete`);
		if (response.status == 200) {
			if (projectInfo.maintained === true) {
				navigate("/projects");
			} else {
				navigate("/archive");
			}
		} else {
			setErrorMessage("Неправильный код доступа!");
		}
	}
	async function archiveProject() {
		await axios.get(`/api/v1/project/${id}/archive`);
		navigate("/archive");
	}
	async function removeTask(projectId, key) {
		await axios.delete(`/api/v1/project/${projectId}/${key}/delete`);
		fetchData();
	}
	async function updateTask(projectId, key, status) {
		if (status === "work") {
			await axios.post(`/api/v1/project/${projectId}/${key}/work`);
			fetchData();
		}
		if (status === "done") {
			await axios.post(`/api/v1/project/${projectId}/${key}/done`);
			fetchData();
		}
	}

	return (
		<>
			<ReactModal
				isOpen={isCreatingTask}
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
					<label className="form-label">Название задачи</label>
					<input className="form-control" id="taskTitle" />
				</div>
				<div className="mb-3">
					<label className="form-label">Описание</label>
					<textarea className="form-control" id="taskDescription" />
				</div>
				<button
					className="btn btn-success m-2"
					onClick={() => {
						addTask();
					}}
				>
					Создать задачу
				</button>
				<button
					onClick={() => {
						setIsCreatingTask(false);
					}}
					className="btn btn-outline-success m-2"
				>
					Отмена
				</button>
			</ReactModal>
			<ReactModal
				isOpen={isDeletingProject}
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
				<>
					<div className="d-flex justify-content-center m-4">
						<h2>Вы уверенны? Это действие необратимо!</h2>
					</div>
					{errorMessage}
					<div className="d-flex justify-content-center">
						<button
							type="button"
							className="btn btn-success m-2"
							onClick={() => {
								removeProject();
							}}
						>
							Удалить
						</button>
						<button
							type="button"
							className="btn btn-outline-success m-2"
							onClick={() => {
								setIsDeletingProject(false);
							}}
						>
							Отмена
						</button>
					</div>
				</>
			</ReactModal>
			<ReactModal
				isOpen={isArchivingProject}
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
				<div className="d-flex justify-content-center m-4">
					<h2>Вы уверенны? Проект невозможно убрать из архива!</h2>
				</div>
				<div className="d-flex justify-content-center">
					<button
						type="button"
						className="btn btn-success m-2"
						onClick={() => {
							archiveProject();
						}}
					>
						Архивировать
					</button>
					<button
						type="button"
						className="btn btn-outline-success m-2"
						onClick={() => {
							setIsArchivingProject(false);
						}}
					>
						Отмена
					</button>
				</div>
			</ReactModal>
			<div className="container">
				<div className="d-flex justify-content-evenly text-center align-items-center">
					<h1 id="name">
						{isProjectInfoLoading ? "-------" : projectInfo.name}
					</h1>
					{projectInfo.maintained == true && (
						<div
							role="button"
							className="d-flex align-items-center button"
							onClick={() => {
								setIsCreatingTask(true);
							}}
						>
							<h2>Добавить задачу</h2>
							<img src={addIcon} className="icon" />
						</div>
					)}
					{(() => {
						if (!isProjectInfoLoading) {
							if (projectInfo.maintained == true) {
								if (tasksCount != 0) {
									return (
										<>
											<div
												role="button"
												className="d-flex align-items-center button"
												onClick={() => {
													setIsArchivingProject(true);
												}}
											>
												<h2>Архивировать проект</h2>
												<img
													src={archiveIcon}
													className="icon"
												/>
											</div>
											<div
												role="button"
												className="d-flex align-items-center button"
												onClick={() => {
													setIsDeletingProject(true);
												}}
											>
												<h2>Удалить проект</h2>
												<img
													src={removeIcon}
													className="icon"
												/>
											</div>
										</>
									);
								} else {
									return (
										<div
											role="button"
											className="d-flex align-items-center button"
											onClick={() => {
												setIsDeletingProject(true);
											}}
										>
											<h2>Удалить проект</h2>
											<img
												src={removeIcon}
												className="icon"
											/>
										</div>
									);
								}
							} else {
								return (
									<div
										role="button"
										className="d-flex align-items-center button"
										onClick={() => {
											setIsDeletingProject(true);
										}}
									>
										<h2>Удалить проект</h2>
										<img
											src={removeIcon}
											className="icon"
										/>
									</div>
								);
							}
						}
					})()}
				</div>
				<hr className="hr" />
				{isProjectInfoLoading ? (
					<ScaleLoader
						color="#14fe17"
						style={{
							marginTop: "2rem",
							marginInline: "auto",
							display: "table",
						}}
					/>
				) : (
					<div className="row">
						<div className="col">
							<p className="sec">Backlog</p>
							<div id="plan-body">{backlogTasks}</div>
						</div>
						<div className="col">
							<p className="sec">In progress</p>
							<div id="progress-body">{workTasks}</div>
						</div>
						<div className="col">
							<p className="sec">Done</p>
							<div id="done-body">{doneTasks}</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};
