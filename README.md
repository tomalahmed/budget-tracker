# Minimal Budget Tracker

A small web app for tracking income and expenses with a clean, minimal interface.

## Tech Stack

- HTML
- CSS (Tailwind + custom styling)
- JavaScript
- `localStorage` for persistence

## Features (Updated -- v2)

- Add income or expense with description, amount, and category
- Instantly update balance, total income, and total expense
- View recent transactions with category, date, and delete action
- Clear all transactions at once
- Select preferred currency (USD, BDT, INR, AED, EUR)
- Auto-apply currency symbol in balance, totals, and transaction amounts
- Dynamic accent styling based on selected currency (badge, button, focus states, toast dot)
- Remember selected currency using `localStorage`
- Display toast messages for user feedback

## What I Learned

- Using `localStorage` to save and load transactions after page refresh
- DOM manipulation for dynamic balance and transaction updates
- Writing reusable functions (for example, `formatCurrency` and `formatDate`)
- Applying CSS variables for lightweight runtime theme switching
- Applying array methods like `filter`, `reduce`, and `map` for totals and rendering
- Handling UI interactions through buttons, form inputs, and delete actions
- Designing a minimal interface with Tailwind CSS and custom styles

## Challenges I Faced

- Validating user input (description and amount)
- Managing state between income and expense toggle actions
- Formatting numbers and dates in a user-friendly way
- Making toast notifications animate in and out smoothly
- Debugging `localStorage` behavior when deleting or clearing transactions
- Keeping UI style updates consistent when currency/theme changes

## Project Structure

```text
.
|- index.html
|- style.css
|- script.js
|- readme.md
```

## Run Locally

1. Clone or download the project.
2. Open `index.html` in your browser.

No build step or installation is required.
