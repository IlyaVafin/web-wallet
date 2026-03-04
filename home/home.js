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
const incomeFormData = { title: "", size: 0, date: "" }
const costsFormData = { title: "", size: 0, date: "", category: "" }
const incomeArray = JSON.parse(localStorage.getItem("incomes")) ?? []
const costsArray = JSON.parse(localStorage.getItem("costs")) ?? []
balanceElement.textContent = `Баланс: ${balance}`

createTable(incomeArray, ".income-table__body")
createTable(costsArray, ".costs__table-body")

function createTable(data, tableBodySelector) {
	if (data.length > 0) {
		const tableBody = document.querySelector(tableBodySelector)
		for (let item of data) {
			const row = document.createElement("tr")
			for (let key in item) {
				const cell = document.createElement("td")
				cell.textContent = item[key]
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
		localStorage.setItem("balance", balance)
		balanceElement.textContent = `Баланс: ${balance}`
		console.log(arrayToAdd)
		store["category"] = category
		arrayToAdd.push(store)
		localStorage.setItem(localStorageKey, JSON.stringify(arrayToAdd))
		resetForm(inputs)
	}
	return isSuccess
}

function resetForm(inputs) {
	inputs.forEach(input => {
		input.value = ""
	})
}

function appendRowInTable(tableBodySelector, store) {
	const tableBody = document.querySelector(tableBodySelector)
	const row = document.createElement("tr")	
	row.classList.add("row-table")
	for (let key in store) {
		const cell = document.createElement("td")
		cell.textContent = store[key]
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
		appendRowInTable(".costs__table-body", costsFormData)
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
		appendRowInTable(".income-table__body", incomeFormData)
	}
})

function filterByCategory(data, category) {
	
	const filtered = data.filter(item => item.category === category)
	return filtered
}

removeErrorOnInputClick(incomeInputs, ".income__form-field")
removeErrorOnInputClick(costsInputs, ".costs__form-field")
