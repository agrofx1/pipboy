const cookieParser = require("cookie-parser");
const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const {
	createUser,
	createSession,
	getUser,
	getUserProjects,
	getUserSafe,
	getUsers,
	checkAuth,
	updatePassword,
} = require("../database");

const login = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

const register = Joi.object({
	name: Joi.string().min(3).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
});

const passwordchange = Joi.object({
	current: Joi.string().required(),
	new: Joi.string().min(6),
	newrepeat: Joi.ref("new"),
});

const router = express.Router();
router.use(express.json());
router.use(cookieParser());

router.get("/all", async (req, res) => {
	try {
		let auth = await checkAuth(req.cookies.session);
		if (auth !== false) {
			let users = await getUsers();
			res.json(users);
		} else {
			res.status(401).json({ success: false });
		}
	} catch {
		res.status(500).json({ success: false });
	}
});

router.post("/login", async (req, res) => {
	try {
		let data = await login.validateAsync(req.body);
		let user = await getUser(data.email);
		if (user != null) {
			let isSame = await bcrypt.compare(data.password, user.password);
			if (isSame) {
				let session = await crypto.randomBytes(32).toString("hex");
				await createSession(session, user.id);
				res.cookie("session", session, {
					maxAge: 90 * 24 * 60 * 60 * 1000,
				});
				res.json({ success: true });
			} else {
				res.status(401).json("Invalid login or password");
			}
		} else {
			res.status(401).json("Invalid login or password");
		}
	} catch {
		res.status(400).json({ success: false });
	}
});

router.post("/register", async (req, res) => {
	try {
		let data = await register.validateAsync(req.body);
		let password = await bcrypt.hash(data.password, 12);
		let user = await createUser(data.name, data.email, password);
		let session = await crypto.randomBytes(32).toString("hex");
		await createSession(session, user.id);
		res.cookie("session", session, {
			maxAge: 90 * 24 * 60 * 60 * 1000,
		});
		res.json({ success: true });
	} catch {
		res.status(400).json({ success: false });
	}
});

router.post("/changepassword", async (req, res) => {
	try {
		let data = await passwordchange.validateAsync(req.body);
		let auth = await checkAuth(parseInt(req.cookies.session));
		if (auth !== false) {
			let user = await getUserById(auth);
			let isValid = await bcrypt.compare(data.current, user.password);
			if (isValid) {
				let hashed = await bcrypt.hash(data.new, 12);
				await updatePassword(auth, hashed);
				res.json({ success: true });
			} else {
				res.status(401).json({ success: false });
			}
		} else {
			res.status(401).json({ success: false });
		}
	} catch {
		res.status(400).json({ success: false });
	}
});

router.get("/projects", async (req, res) => {
	try {
		let auth = await checkAuth(req.cookies.session);
		if (auth !== false) {
			let projects = await getUserProjects(auth);
			res.json(projects);
		} else {
			res.status(401).json({ success: false });
		}
	} catch {
		res.status(500).json({ success: false });
	}
});

router.get("/current", async (req, res) => {
	try {
		let auth = await checkAuth(req.cookies.session);
		if (auth !== false) {
			let user = await getUserSafe(auth);
			if (user != null) {
				res.json(user);
			} else {
				res.status(403).json({ success: false });
			}
		} else {
			res.status(401).json({ success: false });
		}
	} catch {
		res.status(500).json({ success: false });
	}
});

module.exports = router;
