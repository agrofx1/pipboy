const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getProjects = async (maintained) => {
    let projects = await prisma.projects.findMany({
        where: {
            maintained: maintained,
        },
    });
    return projects
}

const getProject = async (id) => {
    let project = await prisma.projects.findFirst({
        where: {
            id: id
        }
    })
    return project
}
const createProject = async (name, owner) => {
    let project = await prisma.projects.create({
        data: {
            name: name,
            owner: owner,
            maintained: true
        }
    })
    return project
}

const deleteProject = async (id) => {
    await prisma.projects.delete({
        where: {
            id: id
        }
    })
    return true
}

const archiveProject = async (id) => {
    await prisma.projects.update({
        where: {
            id: id
        },
        data: {
            maintained: false
        }
    })
    return true
}

const getTasks = async (project) => {
    let tasks = await prisma.tasks.findMany({
        where: {
            project: project
        }
    })
    return tasks
}

const getTask = async (id, project) => {
    let tasks = await prisma.tasks.findFirst({
        where: {
            id: id,
            project: project
        }
    })
    return tasks
}

const createTask = async (data, project) => {
    await prisma.tasks.create({
        data: {
            title: data.title,
            note: data.note,
            project: project,
            status: "backlog",
        }
    })
    return true
}

const updateTask = async (id, project, status) => {
    await prisma.tasks.update({
        where: {
            id: id,
            project: project,
            status: status
        }
    })
    return true
}

const deleteTask = async (id, project) => {
    await prisma.tasks.delete({
        where: {
            id: id,
            project: project
        }
    })
    return true
}

const deleteTasks = async (project) => {
    await prisma.tasks.deleteMany({
        where: {
            project: project
        }
    })
    return true
}

const getPermission = async (user, project) => {
    let permission = await prisma.permissions.findFirst({
        where: {
            user: user,
            project: project,
        },
    });
    return permission
}

const checkAuth = async (currentsession) => {
    let session = await prisma.sessions.findFirst({
        where: {
            session: currentsession
        }
    });
    if (session != []) {
        let user = await prisma.users.findFirst({
            where: {
                id: session.id
            }
        })
        if (user != null) {
            return user.id
        } else {
            return false
        }
    } else {
        return false
    }
}

const getUser = async (email) => {
    let user = await prisma.users.findFirst({
        where: {
            email: email
        }
    })
    return user
}

const createUser = async (email, password) => {
    let user = await prisma.users.create({
        data: {
            email: email,
            password: password
        }
    })
    return user
}

const createSession = async (session, user) => {
    await prisma.sessions.create({
        data: {
            session: session,
            user: user
        }
    })
}

module.exports = { getProjects, getProject, createProject, deleteProject, archiveProject, getTasks, getTask, createTask, updateTask, deleteTask, deleteTasks, getPermission, checkAuth, getUser, createUser, createSession }