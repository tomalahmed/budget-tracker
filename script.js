let transactions = JSON.parse(localStorage.getItem('budgetBuddyMinimal') || '[]');
let currentType = 'expense';

// DOM Elements cached for clean DOM manipulation
const btnIncome = document.getElementById('btn-income');
const btnExpense = document.getElementById('btn-expense');
const categorySelect = document.getElementById('category');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const balanceEl = document.getElementById('balance');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const txListEl = document.getElementById('tx-list');
const toastEl = document.getElementById('toast');

const incomeOptions = ['Salary', 'Business', 'Freelance', 'Gift', 'Other'];
const expenseOptions = ['Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Education', 'Other'];

function init() {
  setType('expense');
  render();
}

function setType(type) {
  currentType = type;

  const activeClass = 'bg-white shadow-sm text-gray-900';
  const inactiveClass = 'text-gray-500 hover:text-gray-700';

  btnIncome.className = `flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${type === 'income' ? activeClass : inactiveClass}`;
  btnExpense.className = `flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${type === 'expense' ? activeClass : inactiveClass}`;

  updateCategoryOptions(type);
}

function updateCategoryOptions(type) {
  const options = type === 'income' ? incomeOptions : expenseOptions;
  categorySelect.innerHTML = options.map(category => `<option value="${category}">${category}</option>`).join('');
}

function formatCurrency(num) {
  return Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(iso) {
  const date = new Date(iso);
  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function addTransaction() {
  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categorySelect.value;

  if (!desc) {
    showToast('Enter a description. ✍️');
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    showToast('Enter a valid amount. 💵');
    return;
  }

  const transaction = {
    id: Date.now(),
    type: currentType,
    desc,
    amount,
    category,
    date: new Date().toISOString()
  };

  transactions.unshift(transaction);
  save();
  render();

  descInput.value = '';
  amountInput.value = '';

  showToast('Added successfully.');
}

window.deleteTransaction = function (id) {
  transactions = transactions.filter(t => t.id !== id);
  save();
  render();
};

window.clearAll = function () {
  if (transactions.length === 0) return;
  if (confirm('Clear all transactions?')) {
    transactions = [];
    save();
    render();
  }
};

function save() {
  localStorage.setItem('budgetBuddyMinimal', JSON.stringify(transactions));
}

function render() {
  // Array Operations
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Math Operation
  const balance = income - expense;

  const sign = balance < 0 ? '-' : '';
  balanceEl.textContent = `${sign}$${formatCurrency(Math.abs(balance))}`;
  totalIncomeEl.textContent = `$${formatCurrency(income)}`;
  totalExpenseEl.textContent = `$${formatCurrency(expense)}`;

  if (transactions.length === 0) {
    txListEl.innerHTML = '<div class="text-center py-12 text-gray-400 text-sm">No transactions yet.</div>';
    return;
  }

  txListEl.innerHTML = transactions.map(t => {
    const isIncome = t.type === 'income';
    const iconBgClass = isIncome ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500';
    const amountClass = isIncome ? 'text-emerald-500' : 'text-gray-900';
    const iconPath = isIncome
      ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />'
      : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />';

    return `
      <div class="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100/50 flex items-center gap-4 group transition-all hover:shadow-[0_4px_15px_rgb(0,0,0,0.04)]">
        
        <!-- Icon -->
        <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBgClass}">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            ${iconPath}
          </svg>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-sm text-gray-900 truncate">${t.desc}</div>
          <div class="text-[0.65rem] font-medium text-gray-400 uppercase tracking-wider mt-0.5">${t.category}</div>
        </div>

        <!-- Amount -->
        <div class="text-right shrink-0">
          <div class="font-semibold text-sm ${amountClass}">
            ${isIncome ? '+' : '-'}$${formatCurrency(t.amount)}
          </div>
          <div class="text-[0.65rem] font-medium text-gray-400 mt-0.5">${formatDate(t.date)}</div>
        </div>

        <!-- Delete -->
        <button class="opacity-0 group-hover:opacity-100 p-2 -mr-2 text-gray-300 hover:text-red-500 transition-all shrink-0" onclick="deleteTransaction(${t.id})" title="Delete">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

      </div>
    `;
  }).join('');
}

let toastTimeout;
function showToast(msg) {
  clearTimeout(toastTimeout);

  toastEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400"></span> ${msg}`;
  toastEl.classList.remove('translate-y-20', 'opacity-0');

  toastTimeout = setTimeout(() => {
    toastEl.classList.add('translate-y-20', 'opacity-0');
  }, 2500);
}

document.addEventListener('DOMContentLoaded', init);