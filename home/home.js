document.addEventListener("DOMContentLoaded", () => {
	const isAuthorized = Boolean(document.cookie.split(";")[0].split("=")[1])
	if (!isAuthorized) window.location.href = "/web-wallet/login/login.html"
})

let balance = parseFloat(localStorage.getItem("balance") ?? 0)
const numericInputs = document.querySelectorAll(".numeric-input")
const balanceElement = document.querySelectorAll(".balance")
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
const logoutButton = document.querySelectorAll(".button-logout")
const mobileBalance = document.querySelector(".mobile-balance")
const filterCostsContainer = document.querySelector(".costs__filters")
const filterIncomeContainer = document.querySelector(".income__filters")
const totalCosts = document.querySelector(".costs__total")
const totalIncome = document.querySelector(".income__total")
if (window.innerWidth <= 800) {
	mobileBalance.style.display = "block"
} else {
	mobileBalance.style.display = "none"
}

balanceElement.forEach(el => {
	el.textContent = `Баланс: ${balance}`
})
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

function sumTotal(rowSelector) {
	const rows = document.querySelectorAll(rowSelector)
	let sum = 0
	rows.forEach(row => {
		if (!row.classList.contains("none")) {
			const size = row.children[1].textContent.replace(/\s+/g, "")
			sum += parseFloat(size)
		}
	})
	return sum
}

totalCosts.textContent = `Итого: ${formatNumber(String(sumTotal(".costs-row-table")))} рублей`
totalIncome.textContent = `Итого: ${formatNumber(String(sumTotal(".income-row-table")))} рублей`

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
	const { date, size, title } = store

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
		costsOffer()
		balanceElement.forEach(el => {
			el.textContent = `Баланс: ${balance}`
		})
		totalCosts.textContent = `Итого: ${formatNumber(String(sumTotal(".costs-row-table")))} рублей`
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
		balanceElement.forEach(el => {
			el.textContent = `Баланс: ${balance}`
		})
		totalIncome.textContent = `Итого: ${formatNumber(String(sumTotal(".income-row-table")))} рублей`
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
const costsFilters = {
	category: "",
	month: "",
	day: "",
	week: "",
}
filterCostsContainer.addEventListener("change", e => {
	costsFilters[e.target.dataset.filter] = e.target.value

	document.querySelectorAll(".costs-row-table").forEach(row => {
		const dateRow = new Date(row.children[2].textContent)
		const monthRow = MONTHS[dateRow.getMonth()]
		const dayRow = dateRow.getDate()
		const category = row.children[3].textContent
		const weekNumber = Math.ceil(dateRow.getDate() / 7)
		const isShow =
			(costsFilters.category === "" ||
				costsFilters.category === "Все категории" ||
				category === costsFilters.category) &&
			(costsFilters.month === "" ||
				costsFilters.month === "Все месяцы" ||
				monthRow === costsFilters.month) &&
			(costsFilters.day === "" || dayRow === parseFloat(costsFilters.day)) &&
			(costsFilters["week"] === "" ||
				costsFilters["week"] === "Все недели" ||
				parseInt(costsFilters["week"]) === parseInt(weekNumber))

		row.classList.toggle("none", !isShow)
	})

	const totalSum = sumTotal(".costs-row-table")
	totalCosts.textContent = `Итого: ${formatNumber(String(totalSum))} рублей`
})

const incomeFilters = {
	month: "",
	day: "",
	week: "",
}

filterIncomeContainer.addEventListener("change", e => {
	incomeFilters[e.target.dataset.filter] = e.target.value

	document.querySelectorAll(".income-row-table").forEach(row => {
		const dateRow = new Date(row.children[2].textContent)
		const monthRow = MONTHS[dateRow.getMonth()]
		const dayRow = dateRow.getDate()
		const weekNumber = Math.ceil(dateRow.getDate() / 7)
		const isShow =
			(incomeFilters.month === "" ||
				incomeFilters.month === "Все месяцы" ||
				monthRow === incomeFilters.month) &&
			(incomeFilters.day === "" || dayRow === parseFloat(incomeFilters.day)) &&
			(incomeFilters["week"] === "" ||
				incomeFilters["week"] === "Все недели" ||
				parseInt(incomeFilters["week"]) === parseInt(weekNumber))

		row.classList.toggle("none", !isShow)
	})
	const totalSum = sumTotal(".income-row-table")
	totalIncome.textContent = `Итого: ${totalSum} рублей`
})

logoutButton.forEach(btn => {
	btn.addEventListener("click", () => {
		document.cookie =
			"isAuthorized=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
		window.location.href = "/web-wallet/login/login.html"
	})
})

function costsOffer() {
	const rows = document.querySelectorAll(".costs-row-table")
	const offerBlock = document.querySelector(".offer")
	if (rows.length < 1) {
		offerBlock.classList.add("hide")
		return
	} else {
		offerBlock.classList.remove("hide")
	}
	const sum = sumTotal(".costs-row-table")
	let categoriesSum = {
		Развлечения: 0,
		Хобби: 0,
		Еда: 0,
		Транспорт: 0,
		Туризм: 0,
	}
	let max = 0
	rows.forEach(row => {
		const category = row.children[3].textContent
		const size = row.children[1].textContent.replace(/\s+/g, "")
		categoriesSum[category] += parseFloat(size)
	})
	for (let key in categoriesSum) {
		max = Math.max(max, categoriesSum[key])
	}
	let largestCategory = ""
	for (let key in categoriesSum) {
		if (categoriesSum[key] === max) largestCategory = key
	}
	const headingOfferCard = document.querySelector(".offer__heading-card")
	const description = document.querySelector(".offer__description")
	const percent = Math.floor((max / sum) * 100)

	description.textContent = `${percent}% расходов`
	headingOfferCard.textContent = largestCategory
}
costsOffer()

removeErrorOnInputClick(incomeInputs, ".income__form-field")
removeErrorOnInputClick(costsInputs, ".costs__form-field")
