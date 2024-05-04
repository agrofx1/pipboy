import React from "react";
import deleteIcon from "../icons/delete.svg"

export const Task = ({title, text, projectId, ukey, status, cb, rm, ...props}) => {
	return (
		<div key={ukey}>
			<div className="card bg-success bg-opacity-25 mb-3">
				<div className="card-body">
					<h5 className="card-title">{title}</h5>
					<p className="card-text">{text}</p>
					{
                        (() => {
                            if (status == "notStarted")
                                return <a className="btn btn-success" onClick={() => { cb(projectId, ukey, "inProgress") }}>В работу</a>
                            if (status == "inProgress")
                                return <a className="btn btn-success" onClick={() => { cb(projectId, ukey, "done") }}>Завершить</a>
                            if (status == "done")
                                return <></>
                        })()
                    }
					<img
						role="button"
						src={deleteIcon}
						className="icon"
						onClick={() => { rm(projectId, ukey) }}
					/>
				</div>
			</div>
		</div>
	);
};
