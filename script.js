let totalAmount = document.getElementById("total-amount");
let userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("product-title");
const errorMessage = document.getElementById("budget-error");
const productTitleError = document.getElementById("product-title-error");
const productCostError = document.getElementById("product-cost-error");
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");
let tempAmount = 0;
let expenseList = [];

// Function to save data to local storage
const saveDataToLocalStorage = () => {
  localStorage.setItem("budget", tempAmount);
  localStorage.setItem("expenses", JSON.stringify(expenseList));
};

// Function to load data from local storage
const loadDataFromLocalStorage = () => {
  const savedBudget = localStorage.getItem("budget");
  const savedExpenses = localStorage.getItem("expenses");

  if (savedBudget) {
    tempAmount = parseInt(savedBudget);
    amount.innerHTML = tempAmount;
  }

  if (savedExpenses) {
    expenseList = JSON.parse(savedExpenses);
    displayExpenseList();
    calculateBalance();
  }
};

// Function to calculate and update the balance
const calculateBalance = () => {
  const totalExpense = expenseList.reduce((sum, expense) => sum + expense.amount, 0);
  expenditureValue.innerText = totalExpense;
  balanceValue.innerText = tempAmount - totalExpense;
};

// Function to display the expense list
const displayExpenseList = () => {
  list.innerHTML = "";
  expenseList.forEach((expense) => {
    listCreator(expense.title, expense.amount);
  });
};

// Set Budget Part
totalAmountButton.addEventListener("click", () => {
  tempAmount = totalAmount.value;
  if (tempAmount === "" || tempAmount < 0) {
    errorMessage.classList.remove("hide");
  } else {
    errorMessage.classList.add("hide");
    amount.innerHTML = tempAmount;
    balanceValue.innerText = tempAmount - expenditureValue.innerText;
    totalAmount.value = "";
    saveDataToLocalStorage();
  }
});

//Function To Disable Edit and Delete Button
const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

//Function To Modify List Elements
const modifyElement = (element, edit = false) => {
  let parentDiv = element.parentElement;
  let currentBalance = balanceValue.innerText;
  let currentExpense = expenditureValue.innerText;
  let parentAmount = parentDiv.querySelector(".amount").innerText;
  if (edit) {
    let parentText = parentDiv.querySelector(".product").innerText;
    productTitle.value = parentText;
    userAmount.value = parentAmount;
    disableButtons(true);
  }
  balanceValue.innerText = parseInt(currentBalance) + parseInt(parentAmount);
  expenditureValue.innerText =
    parseInt(currentExpense) - parseInt(parentAmount);
  parentDiv.remove();
};

//Function To Create List
const listCreator = (expenseName, expenseValue) => {
  let sublistContent = document.createElement("div");
  sublistContent.classList.add("sublist-content", "flex-space");
  list.appendChild(sublistContent);
  sublistContent.innerHTML = `<p class="product">${expenseName}</p><p class="amount">${expenseValue}</p>`;
  let editButton = document.createElement("button");
  editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
  editButton.style.fontSize = "1.2em";
  editButton.addEventListener("click", () => {
    modifyElement(editButton, true);
  });
  let deleteButton = document.createElement("button");
  deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
  deleteButton.style.fontSize = "1.2em";
  deleteButton.addEventListener("click", () => {
    modifyElement(deleteButton);
  });
  sublistContent.appendChild(editButton);
  sublistContent.appendChild(deleteButton);
  document.getElementById("list").appendChild(sublistContent);
};

// Function to Add Expenses
checkAmountButton.addEventListener("click", () => {
  if (!userAmount.value || !productTitle.value) {
    productTitleError.classList.remove("hide");
    return false;
  }

  disableButtons(false);
  let expenditure = parseInt(userAmount.value);
  let sum = parseInt(expenditureValue.innerText) + expenditure;
  expenditureValue.innerText = sum;
  balanceValue.innerText = tempAmount - sum;

  const expense = {
    title: productTitle.value,
    amount: expenditure,
  };
  expenseList.push(expense);

  listCreator(expense.title, expense.amount);

  productTitle.value = "";
  userAmount.value = "";

  saveDataToLocalStorage();
});

// Load data from local storage on page load
loadDataFromLocalStorage();
