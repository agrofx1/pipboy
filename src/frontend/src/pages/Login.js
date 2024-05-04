import React from "react";

export const Login = (props) => {
	return (
		<form>
            <h1>Приветствую, Товарищ!</h1>
			<div class="mb-3">
				<label class="form-label">Почта</label>
				<input type="email" class="form-control" id="email" />
			</div>
			<div class="mb-3">
				<label class="form-label">Пароль</label>
				<input type="password" class="form-control" id="password" />
			</div>
			<button type="submit" class="btn btn-success m-2">
				Вход
			</button>
		</form>
	);
};
