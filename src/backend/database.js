const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getProjects = async (maintained) => {
	let projects = await prisma.projects.findMany({
		where: {
			maintained: maintained,
		},
	});
	return projects;
};

const getProject = async (id) => {
	let project = await prisma.projects.findFirst({
		where: {
			id: id,
		},
	});
	return project;
};
const createProject = async (name, owner) => {
	let project = await prisma.projects.create({
		data: {
			name: name,
			owner: owner,
			maintained: true,
		},
	});
	return project;
};

const deleteProject = async (id) => {
	await prisma.projects.delete({
		where: {
			id: id,
		},
	});
	return true;
};

const archiveProject = async (id) => {
	await prisma.projects.update({
		where: {
			id: id,
		},
		data: {
			maintained: false,
		},
	});
	return true;
};

const getTasks = async (project) => {
	let tasks = await prisma.tasks.findMany({
		where: {
			project: project,
		},
	});
	return tasks;
};

const getTasksStats = async (project) => {
	let tasks = await prisma.tasks.findMany({
		where: {
			project: project,
		},
	});
	let done = await prisma.tasks.findMany({
		where: {
			project: project,
			status: "done",
		},
	});
	if (tasks.length == 0 && done.length == 0) {
		return 0;
	}
	return Math.round((done.length / tasks.length) * 100);
};

const getTask = async (id, project) => {
	let task = await prisma.tasks.findFirst({
		where: {
			id: id,
			project: project,
		},
	});
	return task;
};

const createTask = async (data, project) => {
	await prisma.tasks.create({
		data: {
			title: data.title,
			note: data.note,
			project: project,
			status: "backlog",
		},
	});
	return true;
};

const updateTask = async (id, project, status) => {
	await prisma.tasks.update({
		where: {
			id: id,
			project: project,
		},
		data: {
			status: status,
		},
	});
	return true;
};

const deleteTask = async (id, project) => {
	await prisma.tasks.delete({
		where: {
			id: id,
			project: project,
		},
	});
	return true;
};

const deleteTasks = async (project) => {
	await prisma.tasks.deleteMany({
		where: {
			project: project,
		},
	});
	return true;
};

const getPermission = async (user, project) => {
	let permission = await prisma.permissions.findFirst({
		where: {
			user: user,
			project: project,
		},
	});
	return permission;
};

const createPermission = async (user, project) => {
	await prisma.permissions.create({
		data: {
			user: user,
			project: project,
		},
	});
};

const checkAuth = async (currentsession) => {
	if (currentsession == undefined) {
		return false;
	}
	let session = await prisma.sessions.findFirst({
		where: {
			session: currentsession,
		},
	});
	if (session != null) {
		let user = await prisma.users.findFirst({
			where: {
				id: session.user,
			},
		});
		if (user != null) {
			return user.id;
		} else {
			return false;
		}
	} else {
		return false;
	}
};

const getUser = async (email) => {
	let user = await prisma.users.findFirst({
		where: {
			email: email,
		},
	});
	return user;
};

const getUserById = async (id) => {
	let user = await prisma.users.findFirst({
		where: {
			id: id,
		},
	});
	return user;
};

const updatePassword = async (id, password) => {
	await prisma.users.update({
		where: {
			id: id,
		},
		data: {
			password: password,
		},
	});
};

const createUser = async (name, email, password) => {
	let user = await prisma.users.create({
		data: {
			name: name,
			email: email,
			password: password,
		},
	});
	return user;
};

const createSession = async (session, user) => {
	await prisma.sessions.create({
		data: {
			session: session,
			user: user,
		},
	});
};

const getUserProjects = async (id) => {
	let response = [];
	let projects = await prisma.permissions.findMany({
		where: {
			user: id,
		},
	});
	for (let project in projects) {
		let projectData = await prisma.projects.findFirst({
			where: {
				id: project.project,
			},
		});
		response.push(projectData);
	}
};

const getUsers = async () => {
	let users = await prisma.users.findMany({
		select: {
			id: true,
			name: true,
			email: false,
			password: false,
		},
	});
	return users;
};

const getUserSafe = async (id) => {
	let user = await prisma.users.findFirst({
		where: {
			id: id,
		},
		select: {
			id: true,
			name: true,
			email: true,
			password: false,
		},
	});
	return user;
};

module.exports = {
	getProjects,
	getProject,
	createProject,
	deleteProject,
	archiveProject,
	getTasks,
	getTasksStats,
	getTask,
	createTask,
	updateTask,
	deleteTask,
	deleteTasks,
	getPermission,
	checkAuth,
	getUser,
	getUserById,
	createUser,
	createSession,
	getUserProjects,
	getUsers,
	getUserSafe,
	updatePassword,
	createPermission,
};
