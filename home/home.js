document.addEventListener("DOMContentLoaded", () => {
	const isAuthorized = Boolean(document.cookie.split(";")[0].split("=")[1])
	if (!isAuthorized) window.location.href = "/login/login.html"
})

let balance = 0
const numericInput = document.querySelectorAll(".numeric-input")
const costsForm = document.querySelector(".costs__form")

function validateNumericInput(value, fieldSelector, textError) {
	const field = document.querySelector(fieldSelector)
	const errors = field.querySelectorAll(".form-error")
	if (!checkIsNumericInput(value) && !errors.length) {
		const p = createErrorParagraph(textError)
		field.append(p)
	} else if (checkIsNumericInput(value) && errors.length) {
		const error = field.querySelector(".form-error")
		field.removeChild(error)
	}
}

function checkIsNumericInput(value) {
	if (value.length === 0) return true
	return /^[1-9]\d*(\s\d+)*$/.test(value.trim())
}

function createErrorParagraph(textError) {
	const p = document.createElement("p")
	p.textContent = textError
	p.className = "form-error"
	return p
}

numericInput[0].addEventListener("input", e => {
	validateNumericInput(
		e.target.value,
		".income__form-field_child",
		"Введите число",
	)
})
numericInput[1].addEventListener("input", e => {
	validateNumericInput(
		e.target.value,
		".costs__form-field_child",
		"Введите число",
	)
})
