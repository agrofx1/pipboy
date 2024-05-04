import React, { useEffect, useState, useReducer } from "react";
import addIcon from "../icons/add.svg";
import removeIcon from "../icons/remove.svg";
import archiveIcon from "../icons/archive.svg";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Task } from "../components/Task";
import ReactModal from "react-modal";

export const Project = (props) => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [projectInfo, setProjectInfo] = useState("");

	const [notStarted, setNotStarted] = useState([]);
	const [inProgress, setInProgress] = useState([]);
	const [done, setDone] = useState([]);

	const [deleteMessage, setDeleteMessage] = useState("")

	const [isCreatingTask, setIsCreatingTask] = useState(false);
	const [isArchivingProject, setIsArchivingProject] = useState(false);
	const [isDeletingProject, setIsDeletingProject] = useState(false)

	async function fetchData() {
		setNotStarted([]);
		setInProgress([]);
		setDone([]); 
		let json = await axios.get(`/api/v1/project/${id}`);
		setProjectInfo(json.data);
		for (let task of json.data.list) {
			if (task.status == "notStarted") {
				setNotStarted((notStarted) => [
					...notStarted,
					<Task
						title={task.title}
						text={task.text}
						projectId={task.projectId}
						ukey={task.taskId}
						status="notStarted"
						cb={updateTask}
						rm={removeTask}
					/>,
				]);
			}
			if (task.status == "inProgress") {
				setInProgress((inProgress) => [
					...inProgress,
					<Task
						title={task.title}
						text={task.text}
						projectId={task.projectId}
						ukey={task.taskId}
						status="inProgress"
						cb={updateTask}
						rm={removeTask}
					/>,
				]);
			}
			if (task.status == "done") {
				setDone((done) => [
					...done,
					<Task
						title={task.title}
						text={task.text}
						projectId={task.projectId}
						ukey={task.taskId}
						status="done"
						cb={updateTask}
						rm={removeTask}
					/>,
				]);
			}
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	async function addTask() {
		if (
			document.getElementById("taskTitle").value != "" &&
			document.getElementById("taskTitle").value != undefined &&
			document.getElementById("taskDescription").value != "" &&
			document.getElementById("taskDescription").value != undefined
		) {
			setIsCreatingTask(false);
			await axios.post(`/api/v1/addTask/`, {
				id: id,
				title: document.getElementById("taskTitle").value,
				text: document.getElementById("taskDescription").value,
			});
			fetchData();
		}
	}
	async function removeProject() {
		let response = await axios.delete(`/api/v1/project/${id}/delete?code=${document.getElementById('deletecode').value}`);
		if (response.data.success == true) {
			if (projectInfo.maintained == "true") {
				navigate("/projects")
			} else {
				navigate("/archive")
			}
			
		} else {
			setDeleteMessage("Неправильный код доступа!")
		}
		
	}
	async function archiveProject() {
		await axios.get(`/api/v1/project/${id}/archive`);
		navigate("/archive")
	}
	async function removeTask(projectId, key) {
		await axios.get(
			`/api/v1/project/${projectId}/delete/${key}`
		);
		fetchData();
	}
	async function updateTask(projectId, key, status) {
		if (status == "inProgress") {
			await axios.get(
				`/api/v1/project/${projectId}/${key}/inProgress`
			);
			fetchData();
		}
		if (status == "done") {
			await axios.get(
				`/api/v1/project/${projectId}/${key}/done`
			);
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
					<><div className="d-flex justify-content-center m-4">
					<h2>Вы уверенны? Это действие необратимо!</h2>
				</div>
				<div className="mb-3">
					<label className="form-label">Код доступа</label>
					<input type="password" className="form-control" id="deletecode" />
				</div>
				{deleteMessage}
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
				</div></>
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
				<div className="d-flex justify-content-evenly text-center">
					<h1 id="name">{projectInfo.name}</h1>
					{projectInfo.maintained == "true" &&
					<div
						role="button"
						className="d-flex align-items-center"
						onClick={() => {
							setIsCreatingTask(true);
						}}
					>
						<h2>Добавить задачу</h2>
						<img src={addIcon} className="icon" />
					</div> }
					{projectInfo.tasks == projectInfo.done && projectInfo.tasks != 0 && projectInfo.maintained == "true" ? (
						<div
							role="button"
							className="d-flex align-items-center"
							onClick={() => { setIsArchivingProject(true) }}
						>
							<h2>Архивировать проект</h2>
							<img src={archiveIcon} className="icon" />
						</div>
					) : (
						<div
							role="button"
							className="d-flex align-items-center"
							onClick={() => {
								setIsDeletingProject(true);
							}}
						>
							<h2>Удалить проект</h2>
							<img src={removeIcon} className="icon" />
						</div>
					)}
				</div>
				<hr className="hr" />
				<div className="row">
					<div className="col">
						<p className="sec">Backlog</p>
						<div id="plan-body">{notStarted}</div>
					</div>
					<div className="col">
						<p className="sec">In progress</p>
						<div id="progress-body">{inProgress}</div>
					</div>
					<div className="col">
						<p className="sec">Done</p>
						<div id="done-body">{done}</div>
					</div>
				</div>
			</div>
		</>
	);
};
