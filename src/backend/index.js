const express = require("express");
const cors = require("cors");
const path = require("path");
const projectRoutes = require('./routes/Project');
const userRouers = require('./routes/User')
const logger = require("./logger");

const app = express();

app.use(express.static("static"));
app.use("/api/v1/project/", projectRoutes);
app.use("/api/v1/user/", userRouers);
app.use(cors());

app.get("/*", function (req, res) {
	res.sendFile(path.join(__dirname, "static/index.html"), function (err) {
		if (err) {
			res.status(500).send(err);
		}
	});
});

app.listen(8080, function () {
	logger.info("Starting at port 8080");
});
