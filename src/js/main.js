
//VARIABLES for changing theme
let themeLightBtn, themeDarkBtn

//VARIABLES connected with Add new transaction PANEL and income/expense areas
let nameTransactionInput, amountTransactionInput, categoryTransaction, deleteTransactionBtn
let addTransactionBtn, addPanel, addPanelBtns, panelError
let expensesArea, incomeArea

//VARIABLES - transaction
let id = 0
let categoryIcon
let selectedCategory

//VARIABLE - total balance
let totalMoney

//Array for every transaction to create totalBalance
let moneyArr = [0]


//VARIABLES for exchange rate
let currencyOne, currencyTwo, amountOne, amountTwo, switchCurrencyBtn, rateInfo


//FUNCTIONS

const main = () => {
	getDOMElements()
	prepareDOMEvents()
}

//GETTING ELEMENTS
const getDOMElements = () => {
	//theme variables
	themeLightBtn = document.querySelector('.btn--motive-light')
	themeDarkBtn = document.querySelector('.btn--motive-dark')

	//transaction panel variables
	addTransactionBtn = document.querySelector('.btn--add')
	addPanel = document.querySelector('.add')
	addPanelBtns = document.querySelectorAll('.add__btn')
	deleteTransactionBtn = document.querySelector('.transaction__btn--delete')
	panelError = document.querySelector('.add__error')
	//panel inputs
	categoryTransaction = document.getElementById('category')
	nameTransactionInput = document.getElementById('name')
	amountTransactionInput = document.getElementById('amount')

	//areas
	incomeArea = document.querySelector('.income-area')
	expensesArea = document.querySelector('.expenses-area')

	//total balance
	totalMoney = document.querySelector('.total__sum')

	//exchange rates

	//
}



const prepareDOMEvents = () => {
	// themeLightBtn.addEventListener('click', () => setTheme('dark'))
	// themeDarkBtn.addEventListener('click', () => setTheme('light'))
	// themeLightBtn.addEventListener('click', () => document.documentElement.classList.toggle = 'dark')
	themeDarkBtn.addEventListener('click', () => document.documentElement.className = 'light')

	addTransactionBtn.addEventListener('click', addTransaction)
	addPanelBtns.forEach((btn) =>
		btn.addEventListener('click', SaveOrCancelTransaction)
	)

	categoryTransaction.addEventListener('click', checkSeletedCategory)

	incomeArea.addEventListener('click', deleteTransaction, {capture: true})
	expensesArea.addEventListener('click', deleteTransaction, {capture: true})
	calculate()

	switchCurrencyBtn.addEventListener('click', switchCurrencies)
	currencyOne.addEventListener('change', calculate)
	currencyTwo.addEventListener('change', calculate)
	amountOne.addEventListener('input', calculate)
}

const calculate = () => {
	currencyOne = document.querySelector('#currency-one')
	currencyTwo = document.querySelector('#currency-two')
	amountOne = document.querySelector('.amount-one')
	amountTwo = document.querySelector('.amount-two')
	switchCurrencyBtn = document.querySelector('.rate__btn')
	rateInfo = document.querySelector('.rate__result')

	const URL = `https://api.exchangerate.host/latest?base=${currencyOne.value}&symbols=${currencyTwo.value}`
	fetch(URL)
	.then(res => res.json())
	.then (data => {
	const currency1 = currencyOne.value
	const currency2 = currencyTwo.value

	const rate = data.rates[currency2]
	rateInfo.textContent = `1${currency1} = ${rate.toFixed(4)} ${currency2}`
	}

	// amountTwo.value = (amountOne * rate).toFixed(2)
	)
}

const switchCurrencies = () => {
	const previousCurrency = currencyOne.value
	currencyOne.value = currencyTwo.value
	currencyTwo.value = previousCurrency
	calculate()
}


const setTheme = (theme) => {
	document.documentElement.className = theme
}




const addTransaction = () => {
	addPanel.style.display = 'flex'
	console.log('showed add panel transaction')
}

const SaveOrCancelTransaction = (e) => {
	if (e.target.matches('.add__btns--save')) {
		checkFromValidation()
        console.log('save');
	} else if (e.target.matches('.add__btns--cancel')) {
		clearPanel()
        console.log('cancel');
	}
}

const checkFromValidation = () => {
    console.log('form');
	if (
		nameTransactionInput.value !== '' &&
		amountTransactionInput.value !== '' &&
		categoryTransaction.selectedIndex !== 0
	) {
        createTransaction()
        panelError.style.visibility = 'hidden'
	} else {
		panelError.style.visibility = 'visible'
	}
}

const clearPanel = () => {
	addPanel.style.display = 'none'
	nameTransactionInput.value = ''
	amountTransactionInput.value = ''
	categoryTransaction.selectedIndex = 0
	panelError.style.visibility = 'hidden'
}

const createTransaction = () => {
	const newTransaction = document.createElement('article')
	newTransaction.classList.add('transaction')
	newTransaction.setAttribute('id', id)

	checkCategory(` ${selectedCategory}`)

	newTransaction.innerHTML = `
    <p class="transaction__name">${categoryIcon}${nameTransactionInput.value}</p>
    <p class="transaction__amount">${parseFloat(amountTransactionInput.value).toFixed(2)} zł
        <button class="transaction__btn--delete"><i class="fas fa-times"></i></button>
    </p>
`

	if (amountTransactionInput.value > 0) {
		incomeArea.appendChild(newTransaction)
	} else {
        expensesArea.appendChild(newTransaction)
    }

	const newCost = parseFloat(amountTransactionInput.value)
	moneyArr.push(newCost)


	moneyArr = moneyArr.map(x => x.toFixed(2))
	moneyArr = moneyArr.map(x => parseFloat(x))
	console.log(moneyArr);
	countMoney(moneyArr)

	id++
	clearPanel()
}

const checkSeletedCategory = () => {
	selectedCategory =
		categoryTransaction.options[categoryTransaction.selectedIndex].text
}

const checkCategory = (transaction) => {
	switch (transaction) {
		case ' + Salary': 
		case ' + Refund':
		case ' + Bonus':
		case ' + Other':
			categoryIcon = "<i class='transaction__icon fa-regular fa-credit-card'></i>"
			break
		case ' - Shopping':
			categoryIcon = 
				"<i class='transaction__icon fa-solid fa-cart-arrow-down'></i>"
			break
		case ' - Car':
			categoryIcon = "<i class='transaction__icon fa-solid fa-car'></i>"
			break
		case ' - Invoices':
			categoryIcon = "<i class='transaction__icon  fa-solid fa-file-invoice'></i>"
			break
		case ' - Other':
			categoryIcon = "<i class='transaction__icon  fa-solid fa-receipt'></i>"
			break
	}
}

const countMoney = (money) => {
	const newMoney = money.reduce((a,b) => a + b)
	console.log(newMoney)
	totalMoney.textContent = `${newMoney.toFixed(2)} PLN`
}

const deleteTransaction = (e) => {
	if (e.target.matches('.transaction__btn--delete')){
		const transactionToDelete = e.target.closest('article')
		const index = transactionToDelete.id
		const amount = parseFloat(transactionToDelete.querySelector('.transaction__amount').textContent)

		const indexOfAmount = moneyArr.indexOf(amount)
		moneyArr.splice(indexOfAmount, 1)

		amount > 0 ? incomeArea.removeChild(transactionToDelete) : expensesArea.removeChild(transactionToDelete) 
	
		
	}
}











document.addEventListener('DOMContentLoaded', main)



// document.addEventListener('keydown', e => {
// 	if (e.key === ',') {
// 		  e.preventDefault();
// 		  return false;
// 	  }
//   })