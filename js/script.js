// State Management
let state = {
    income: 0,
    expenses: []
};

// Load from LocalStorage
const loadState = () => {
    const saved = localStorage.getItem('budget_planner_state');
    if (saved) {
        state = JSON.parse(saved);
        updateUI();
    }
};

const saveState = () => {
    localStorage.setItem('budget_planner_state', JSON.stringify(state));
};

// DOM Elements
const incomeInput = document.getElementById('income-input');
const setIncomeBtn = document.getElementById('set-income-btn');
const expenseName = document.getElementById('expense-name');
const expenseAmount = document.getElementById('expense-amount');
const addExpenseBtn = document.getElementById('add-expense-btn');
const expenseList = document.getElementById('expense-list');
const remainingBalance = document.getElementById('remaining-balance');
const resetHistoryBtn = document.getElementById('reset-history');
const glow = document.getElementById('cursor-glow');

// Cursor Glow
document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    glow.style.opacity = '1';
});

// Logic
function formatIDR(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount).replace('IDR', 'Rp');
}

function updateUI() {
    // Update Balance
    const totalExpenses = state.expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const balance = state.income - totalExpenses;
    remainingBalance.textContent = formatIDR(balance);
    
    // Update List
    if (state.expenses.length === 0) {
        expenseList.innerHTML = '<div class="empty-state">Belum ada data pengeluaran.</div>';
    } else {
        expenseList.innerHTML = '';
        state.expenses.slice().reverse().forEach((expense, index) => {
            const originalIndex = state.expenses.length - 1 - index;
            const item = document.createElement('div');
            item.className = 'expense-item';
            item.innerHTML = `
                <div class="ei-info">
                    <span class="ei-name">${expense.name}</span>
                    <span class="ei-date">${expense.date}</span>
                </div>
                <div class="ei-right">
                    <span class="ei-amount">${formatIDR(expense.amount)}</span>
                    <button class="delete-btn" onclick="deleteExpense(${originalIndex})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            `;
            expenseList.appendChild(item);
        });
    }

    incomeInput.value = state.income || '';
}

setIncomeBtn.addEventListener('click', () => {
    const val = parseFloat(incomeInput.value);
    if (!isNaN(val)) {
        state.income = val;
        saveState();
        updateUI();
    }
});

addExpenseBtn.addEventListener('click', () => {
    const name = expenseName.value.trim();
    const amount = parseFloat(expenseAmount.value);

    if (name && !isNaN(amount)) {
        const expense = {
            id: Date.now(),
            name,
            amount,
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        };
        state.expenses.push(expense);
        expenseName.value = '';
        expenseAmount.value = '';
        saveState();
        updateUI();
    }
});

window.deleteExpense = (index) => {
    state.expenses.splice(index, 1);
    saveState();
    updateUI();
};

resetHistoryBtn.addEventListener('click', () => {
    if (confirm('Hapus semua riwayat pengeluaran?')) {
        state.expenses = [];
        saveState();
        updateUI();
    }
});

// Init
loadState();
