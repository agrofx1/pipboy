import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export const Archive = (props) => {
	const [projects, setProjects] = useState([]);

	async function fetchData() {
		setProjects([]);
		let json = await axios.get("/api/v1/archive");
		setProjects(json.data);
	}

	useEffect(() => {
		fetchData();
	}, []);

	return (
			<div className="container">
				<div className="d-flex justify-content-evenly text-center">
					<h1>Архив 1.15</h1>
				</div>
				<hr className="hr" />
				<div className="row">
					<div className="col-12">
						<div className="tab-content" id="myTabContent">
							<div
								className="tab-pane fade show active"
								id="special"
								role="tabpanel"
							>
								<ul className="spc-list">
									{projects.map((project) => {
										return (<li key={project.id}>
											<Link
												to={"/project/" + project.id}
												className="sp-perception"
											>
												{project.name}
											</Link>
										</li>);
									})}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
	);
};
