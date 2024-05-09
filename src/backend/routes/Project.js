const express = require("express");
const cookieParser = require("cookie-parser");
const {
	getProjects,
	getProject,
	deleteProject,
	getTasks,
	getTask,
	updateTask,
	deleteTask,
	deleteTasks,
	getPermission,
	checkAuth,
	createProject,
	getTasksStats,
	createTask,
} = require("../database");
const Joi = require("joi");

const router = express.Router();
const taskscheme = Joi.object({
	title: Joi.string().required(),
	note: Joi.string(),
});
const projectscheme = Joi.object({
	title: Joi.string().min(3).required(),
	users: Joi.array().required(),
});

router.use(express.json());
router.use(cookieParser());

router.get("/all", async (req, res) => {
	try {
		let response = [];
		let projects = await getProjects(true);
		for (let project of projects) {
			let precent = await getTasksStats(project.id);
			response.push({
				...project,
				precent: precent,
			});
		}
		res.json(response);
	} catch {
		res.status(500).json({ success: false });
	}
});

router.get("/archive", async (req, res) => {
	try {
		let projects = await getProjects(false);
		res.json(projects);
	} catch {
		res.status(500).json({ success: false });
	}
});

router.post("/create", async (req, res) => {
	try {
		let auth = await checkAuth(req.cookies.session);
		if (auth !== false) {
			try {
				let data = await projectscheme.validateAsync(req.body);
				let id = await createProject(data.name, auth);
			} catch {
				res.status(400).json({ success: false });
			}
		} else {
			res.status(401).json({ success: false });
		}
	} catch {
		res.status(500).json({ success: false });
	}
});

router.get("/:id", async (req, res) => {
	try {
		let project = await getProject(parseInt(req.params.id));
		if (project != null) {
			let auth = await checkAuth(req.cookies.session);
			if (auth !== false) {
				let permission = await getPermission();
				if (permission != null || project.owner === auth) {
					let tasks = await getTasks(parseInt(req.params.id));
					res.json({
						id: project.id,
						name: project.name,
						maintained: project.maintained,
						owner: project.owner,
						tasks: tasks,
					});
				} else {
					res.status(403).json({ success: false });
				}
			} else {
				res.status(401).json({ success: false });
			}
		} else {
			res.status(404).json({ success: false });
		}
	} catch {
		res.status(500).json({ success: false });
	}
});

router.post("/:id/:taskid/work", async (req, res) => {
	try {
		let project = await getProject(req.params.id);
		if (project != null && project.maintained == true) {
			let task = await getTask(req.params.id, req.params.taskid);
			if (task != null) {
				if (req.cookies.session != undefined) {
					let auth = await checkAuth(req.cookies.session);
					if (auth !== false) {
						let permission = await getPermission(auth, project.id);
						if (permission != null || project.owner === auth) {
							await updateTask(
								req.params.taskid,
								req.params.id,
								"work"
							);
							res.json({ success: true });
						} else {
							res.status(403).json({ success: false });
						}
					} else {
						res.status(401).json({ success: false });
					}
				}
			} else {
				res.status(404).json({ success: false });
			}
		} else {
			res.status(404).json({ success: false });
		}
	} catch {
		res.status(500).json({ success: false });
	}
});

router.post("/:id/:taskid/done", async (req, res) => {
	try {
		let project = await getProject(req.params.id);
		if (project != null && project.maintained == true) {
			let task = await getTask(req.params.id, req.params.taskid);
			if (task != null) {
				let auth = await checkAuth(req.cookies.session);
				if (auth !== false) {
					let permission = await getPermission(auth, project.id);
					if (permission != null || project.owner === auth) {
						await updateTask(
							req.params.taskid,
							req.params.id,
							"done"
						);
						res.json({ success: true });
					} else {
						res.status(403).json({ success: false });
					}
				} else {
					res.status(401).json({ success: false });
				}
			} else {
				res.status(404).json({ success: false });
			}
		} else {
			res.status(404).json({ success: false });
		}
	} catch {
		res.status(500).json({ success: false });
	}
});

router.post("/:id/create", async (req, res) => {
	try {
		let project = await getProject(parseInt(req.params.id));
		if (project != null && project.maintained == true) {
			let auth = await checkAuth(req.cookies.session);
			if (auth !== false) {
				let permission = await getPermission(auth, project.id);
				if (permission != null || project.owner === auth) {
					try {
						let isValid = await taskscheme.validateAsync(req.body);
						if (isValid) {
							await createTask(req.body, parseInt(req.params.id));
							res.json({ success: true });
						}
					} catch {
						res.status(400).json({ success: false });
					}
				} else {
					res.status(403).json({ success: false });
				}
			} else {
				res.status(401).json({ success: false });
			}
		} else {
			res.status(404).json({ success: false });
		}
	} catch {
		res.status(500).json({ success: false });
	}
});

router.delete("/:id/:taskid/delete", async (req, res) => {
	try {
		let project = await getProject(parseInt(req.params.id));
		if (project != null && project.maintained == true) {
			let task = await getTask(
				parseInt(req.params.taskid),
				parseInt(req.params.id)
			);
			console.log(task);
			if (task != null) {
				let auth = await checkAuth(req.cookies.session);
				if (auth !== false) {
					let permission = await getPermission(auth, project.id);
					if (permission != null || project.owner === auth) {
						await deleteTask(
							parseInt(req.params.taskid),
							parseInt(req.params.id)
						);
						res.json({ success: true });
					} else {
						res.status(403).json({ success: false });
					}
				} else {
					res.status(401).json({ success: false });
				}
			} else {
				res.status(404).json({ success: false });
			}
		} else {
			res.status(404).json({ success: false });
		}
	} catch {
		res.status(500).json({ success: false });
	}
});

router.delete("/:id/delete", async (req, res) => {
	// try {
	let project = await getProject(parseInt(req.params.id));
	if (project != null) {
		let auth = await checkAuth(req.cookies.session);
		if (auth === false) {
			res.status(401).json({ success: false });
		} else {
			if (project.owner === auth) {
				await deleteProject(parseInt(req.params.id));
				await deleteTasks(parseInt(req.params.id));
				res.json({ success: true });
			} else {
				res.status(403).json({ success: false });
			}
		}
	} else {
		res.status(404).json({ success: false });
	}
	// } catch {
	// 	res.status(500).json({ success: false });
	// }
});

router.get("/:id/archive", async (req, res) => {
	try {
		let project = await getProject(req.params.id);
		if (project != null) {
			let auth = await checkAuth(req.cookies.session);
			if (auth === false) {
				res.status(401).json({ success: false });
			} else {
				if (project.owner === auth) {
					await archiveProject(req.params.id);
					res.json({ success: true });
				} else {
					res.status(403).json({ success: false });
				}
			}
		} else {
			res.status(404).json({ success: false });
		}
	} catch {
		res.status(500).json({ success: false });
	}
});

module.exports = router;
