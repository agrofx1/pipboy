const cookieParser = require("cookie-parser");
const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { createUser, createSession, getUser } = require("../database");

const login = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

const register = Joi.object({
	name: Joi.string().min(3).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
});

const router = express.Router();
router.use(express.json());
router.use(cookieParser());

router.post("/login", async (req, res) => {
	try {
		let data = await login.validateAsync(req.body);
		let user = await getUser(data.email);
		if (user != null) {
			let isSame = await bcrypt.compare(data.password, user.password);
			if (isSame) {
				let session = await crypto.randomBytes(32).toString("hex");
				await createSession(session, user.id);
				res.cookie("session", session);
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
		let user = await createUser(data.email, password);
		let session = await crypto.randomBytes(32).toString("hex");
		await createSession(session, user.id);
		res.cookie("session", session);
		res.json({ success: true });
	} catch {
		res.status(400).json({ success: false });
	}
});

module.exports = router;
