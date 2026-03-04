document.addEventListener("DOMContentLoaded", () => {
	const isAuthorized = Boolean(document.cookie.split(";")[0].split("=")[1])
	if (!isAuthorized) window.location.href = "/login/login.html"
})

let balance = parseFloat(localStorage.getItem("balance") ?? 0)
const numericInputs = document.querySelectorAll(".numeric-input")
const balanceElement = document.querySelector(".sidebar__balance")
const incomeForm = document.querySelector(".income__form")
const costsForm = document.querySelector(".costs__form")
const incomeInputs = document.querySelectorAll(".income__input")
const costsInputs = document.querySelectorAll(".costs__input")
const select = document.querySelector(".costs__input_select-filter")
const selectMonths = document.querySelector(".input-filter-date")
const incomeFormData = { title: "", size: 0, date: "" }
const costsFormData = { title: "", size: 0, date: "", category: "" }
const incomeArray = JSON.parse(localStorage.getItem("incomes")) ?? []
const costsArray = JSON.parse(localStorage.getItem("costs")) ?? []
const logoutButton = document.querySelector(".button-logout")
const filtersContainer = document.querySelector(".costs__filters")
balanceElement.textContent = `Баланс: ${balance}`

createTable(incomeArray, ".income-table__body", "income-row-table")
createTable(costsArray, ".costs__table-body", "costs-row-table")

function createTable(data, tableBodySelector, rowClass) {
	if (data.length > 0) {
		const tableBody = document.querySelector(tableBodySelector)
		for (let item of data) {
			const row = document.createElement("tr")
			const formatedNumber = formatNumber(item["size"])
			row.className = rowClass
			for (let key in item) {
				const cell = document.createElement("td")
				if (key === "size") {
					cell.textContent = formatedNumber
				} else {
					cell.textContent = item[key]
				}
				row.appendChild(cell)
			}
			tableBody.appendChild(row)
		}
	}
}

function submitForm(
	inputs,
	store,
	titleSelector,
	sizeSelector,
	sizeError,
	dateSelector,
	type,
	arrayToAdd,
	localStorageKey,
) {
	let isSuccess = true
	inputs.forEach(input => {
		const inputName = input.getAttribute("name")
		store[inputName] = input.value
	})
	const { date, size, title, category } = store

	if (title.length < 1) {
		isSuccess = false
		const p = createErrorParagraph("Наименование не может быть пустым")
		const fieldTitle = document.querySelector(titleSelector)
		if (!fieldTitle.querySelector(".form-error")) {
			fieldTitle.appendChild(p)
		}
	} else if (title.length) {
		removeError(titleSelector)
	}
	if (size.length < 1 || !checkIsNumericInput(size)) {
		isSuccess = false
		const p = createErrorParagraph(sizeError)
		const fieldSize = document.querySelector(sizeSelector)
		if (!fieldSize.querySelector(".form-error")) {
			fieldSize.appendChild(p)
		}
	} else if (size.length > 1 && checkIsNumericInput(size)) {
		removeError(sizeSelector)
	}
	if (!date.length) {
		isSuccess = false
		const p = createErrorParagraph("Дата не может быть пустой")
		const fieldDate = document.querySelector(dateSelector)

		if (!fieldDate.querySelector(".form-error")) {
			fieldDate.appendChild(p)
		}
	} else if (date.length) removeError(dateSelector)

	if (
		title.length &&
		size.length > 1 &&
		checkIsNumericInput(size) &&
		date.length
	) {
		isSuccess = true
		balance =
			type === "increment"
				? balance + parseFloat(size.replace(/ /g, ""))
				: balance - parseFloat(size.replace(/ /g, ""))
		if (balance < 0) balance = 0
		localStorage.setItem("balance", balance)
		balanceElement.textContent = `Баланс: ${balance}`
		const storeCopy = { ...store }
		arrayToAdd.push(storeCopy)
		localStorage.setItem(localStorageKey, JSON.stringify(arrayToAdd))
		resetForm(inputs)
	}
	return isSuccess
}

function resetForm(inputs) {
	inputs.forEach(input => {
		if (input.classList.contains("category-select")) return
		input.value = ""
	})
}
function formatNumber(number) {
	return new Intl.NumberFormat("ru-RU", {
		useGrouping: true,
	}).format(parseFloat(number.replaceAll(" ", "")))
}
function appendRowInTable(tableBodySelector, store, rowClass) {
	const tableBody = document.querySelector(tableBodySelector)
	const formatedNumber = formatNumber(store["size"])
	const row = document.createElement("tr")
	row.className = rowClass
	for (let key in store) {
		const cell = document.createElement("td")
		if (key === "size") {
			cell.textContent = formatedNumber
		} else {
			cell.textContent = store[key]
		}
		if (cell.textContent) {
			row.appendChild(cell)
		}
	}
	tableBody.appendChild(row)
}

function removeErrorOnInputClick(inputs, parentSelector) {
	inputs.forEach(input => {
		input.addEventListener("click", e => {
			const parent = e.target.closest(parentSelector)
			const error = parent.querySelector(".form-error")
			if (error) {
				parent.removeChild(error)
			}
		})
	})
}

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

costsForm.addEventListener("submit", e => {
	e.preventDefault()
	const success = submitForm(
		costsInputs,
		costsFormData,
		".costs__input_title",
		".costs__input_size",
		"Введите корректный расход",
		".costs__input_date",
		"decrement",
		costsArray,
		"costs",
	)
	if (success) {
		appendRowInTable(".costs__table-body", costsFormData, "costs-row-table")
	}
})

incomeForm.addEventListener("submit", e => {
	e.preventDefault()
	const success = submitForm(
		incomeInputs,
		incomeFormData,
		".income__form-field_title",
		".income__form-field_size",
		"Доход не может быть отрицательным или пустым",
		".income__form-field_date",
		"increment",
		incomeArray,
		"incomes",
	)
	if (success) {
		appendRowInTable(".income-table__body", incomeFormData, "income-row-table")
	}
})

const MONTHS = [
	"Январь",
	"Февраль",
	"Март",
	"Апрель",
	"Май",
	"Июнь",
	"Июль",
	"Август",
	"Сентябрь",
	"Октябрь",
	"Ноябрь",
	"Декабрь",
]
const filters = {
	category: "",
	month: "",
	day: "",
}
filtersContainer.addEventListener("change", e => {
	console.log(e.target.value)
	filters[e.target.dataset.filter] = e.target.value
	const rows = document.querySelectorAll(".costs-row-table")
	rows.forEach(row => {
		const month = row.children[2]
	})
})

logoutButton.addEventListener("click", () => {
	document.cookie =
		"isAuthorized=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
	window.location.href = "/login/login.html"
})

removeErrorOnInputClick(incomeInputs, ".income__form-field")
removeErrorOnInputClick(costsInputs, ".costs__form-field")
