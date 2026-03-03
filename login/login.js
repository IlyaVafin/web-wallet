const passwordInput = document.querySelector(".login__form-password")
const loginForm = document.querySelector(".login__form")

let isPasswordChanged = false
loginForm.addEventListener("submit", e => {
	e.preventDefault()
	const password = passwordInput.value
	if (!isPasswordChanged && password !== "0000") {
		const p = document.createElement("p")
		p.className = "login__error"
		p.textContent = "Введен неправильный пароль :("
		loginForm.appendChild(p)
	} else {
		document.cookie = "isAuthorized=true;path=/;"
		window.location.href = "/home/home.html"
	}
})
