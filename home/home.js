document.addEventListener("DOMContentLoaded", () => {
	const isAuthorized = Boolean(document.cookie.split(";")[0].split("=")[1])
	if (!isAuthorized) window.location.href = "/login/login.html"
})

let balance = parseFloat(localStorage.getItem("balance") ?? 0)
const numericInputs = document.querySelectorAll(".numeric-input")
const balanceElement = document.querySelector(".sidebar__balance")
const incomeForm = document.querySelector(".income__form")
const incomeInputs = document.querySelectorAll(".income__input")
const incomeFormData = { title: "", size: 0, date: "" }
balanceElement.textContent = `Баланс: ${balance}`

incomeForm.addEventListener("submit", e => {
	e.preventDefault()
	incomeInputs.forEach(input => {
		const inputName = input.getAttribute("name")
		incomeFormData[inputName] = input.value
	})
	const { date, size, title } = incomeFormData
	if (title.length < 1) {
		const p = createErrorParagraph("Наименование не может быть пустым")
		const fieldTitle = document.querySelector(".income__form-field_title")
		if (!fieldTitle.querySelector(".form-error")) {
			fieldTitle.appendChild(p)
		}
	} else if (title.length) {
		removeError(".income__form-field_title")
	}
	if (size.length < 1 || !checkIsNumericInput(size)) {
		const p = createErrorParagraph("Введите корректный доход")
		const fieldSize = document.querySelector(".income__form-field_size")
		if (!fieldSize.querySelector(".form-error")) {
			fieldSize.appendChild(p)
		}
	} else if (size.length > 1 && checkIsNumericInput(size)) {
		removeError(".income__form-field_size")
	}
	if (!date.length) {
		const p = createErrorParagraph("Дата не может быть пустой")
		const fieldDate = document.querySelector(".income__form-field_date")
		if (!fieldDate.querySelector(".form-error")) {
			fieldDate.appendChild(p)
		}
	} else if (date.length) removeError(".income__form-field_date")

	if (
		title.length &&
		size.length > 1 &&
		checkIsNumericInput(size) &&
		date.length
	) {
		balance += parseFloat(size.replace(/ /g, ""))
		localStorage.setItem("balance", balance)
		balanceElement.textContent = `Баланс: ${balance}`
	}
	incomeInputs.forEach(input => {
		input.addEventListener("click", e => {
			const parent = e.target.closest(".income__form-field")
			const error = parent.querySelector(".form-error")
			if (error) {
				parent.removeChild(error)
			}
		})
	})
})

function removeError(fieldSelector) {
	const field = document.querySelector(fieldSelector)
	const error = field.querySelector(".form-error")
	if (!error) return
	field.removeChild(error)
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
