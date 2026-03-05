document.addEventListener("DOMContentLoaded", () => {
	const isAuthorized = Boolean(document.cookie.split(";")[0].split("=")[1])
	if (!isAuthorized) window.location.href = "/web-wallet/login/login.html"
})

const changePasswordInput = document.querySelector(
	".change-password__form-password",
)
const form = document.querySelector(".change-password__form")
const changePasswordField = changePasswordInput.closest(
	".change-password__form-field",
)
form.addEventListener("submit", e => {
	e.preventDefault()
	const newPassword = changePasswordInput.value
	if (!newPassword.length) {
		const p = document.createElement("p")
		p.textContent = "Пароль не может быть пустым"
		p.className = "change-password__error"
		if (!changePasswordField.querySelector(".change-password__error")) {
			changePasswordField.appendChild(p)
		}
	} else {
		localStorage.setItem("password", newPassword)
		document.cookie =
			"isAuthorized=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
		window.location.href = "/login/login.html"
	}
})
