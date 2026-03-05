const passwordInput = document.querySelector(".login__form-password")
const loginForm = document.querySelector(".login__form")

if (!localStorage.getItem("password")) localStorage.setItem("password", "0000")
let correctPassword = localStorage.getItem("password")
loginForm.addEventListener("submit", e => {
	e.preventDefault()
	const password = passwordInput.value
	if (password !== correctPassword) {
		const p = document.createElement("p")
		p.className = "login__error"
		p.textContent = "Введен неправильный пароль :("
		if (!loginForm.querySelector(".login__error")) {
			loginForm.appendChild(p)
		}
	} else {
		document.cookie = "isAuthorized=true;path=/;"
		window.location.href = "/web-wallet/home/home.html"
	}
})
