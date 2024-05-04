import React, { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import axios from "axios";

export const Stats = (props) => {
	const [stats, setStats] = useState([]);
	const [isStatsLoading, setIsStatsLoading] = useState(true);

	async function fetchData() {
		try {
			let json = await axios.get("/api/v1/all");
			setStats(json.data);
			setIsStatsLoading(false);
		} catch {}
	}

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<>
			<div className="container-fluid">
				<div className="row justify-content-center text-center">
					<h1>Проекты 1.15</h1>
					<hr className="hr" />
				</div>
				<div className="row justify-content-center">
					<div className="col-auto">
						{isStatsLoading ? (
							<ScaleLoader color="#14fe17" />
						) : (
							<table className="table">
								<thead>
									<tr>
										<th scope="col">Проект</th>
										<th scope="col">Прогресс</th>
										<th scope="col">Ответственный</th>
									</tr>
								</thead>
								<tbody id="pr">
									{stats.map((project) => {
										let precent = 0;
										if (project.tasks != 0) {
											precent = Math.round(
												(project.doneTasks / project.tasks) * 100
											);
										} else {
											precent = 0;
										}
										return (
											<tr className="project-row">
												<th scope="row">{project.name}</th>
												<td>{precent}%</td>
												<td>{project.user}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						)}
					</div>
				</div>
			</div>
		</>
	);
};
