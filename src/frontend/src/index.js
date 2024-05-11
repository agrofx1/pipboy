import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import {} from "./css/bootstrap.min.css";
import {} from "./css/styles.css";
import { Stats } from "./pages/Stats";
import { Projects } from "./pages/Projects";
import { Project } from "./pages/Project";
import { Archive } from "./pages/Archive";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <Stats />,
			},
			{
				path: "archive",
				element: <Archive />,
			},
			{
				path: "projects",
				element: <Projects />,
			},
			{
				path: "project/:id",
				element: <Project />,
			},
			{
				path: "login",
				element: <Login />,
			},
			{
				path: "register",
				element: <Register />,
			},
			{
				path: "profile",
				element: <Profile />,
			},
		],
	},
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
