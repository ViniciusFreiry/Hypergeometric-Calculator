# 🎲 Hypergeometric Calculator with Conflicts

A web-based tool to calculate hypergeometric probabilities for multiple categories simultaneously — including overlapping/conflicting items. This calculator is especially useful for analyzing probabilities in card games, draft pools, or any finite population with complex category relationships.

🔗 **Live Demo:** [hypergeometric-calculator-psi.vercel.app](https://hypergeometric-calculator-psi.vercel.app/)

---

## 📌 Features

- ✅ Support for multiple independent categories.
- 🔄 Define minimum and maximum desired successes per category.
- ⚠️ Conflict handler for overlapping items (e.g., a card belonging to two categories).
- 📈 Final adjusted probability considering overlaps.
- 📄 Export results as `.txt` for sharing or documentation.

---

## 📐 How It Works

This calculator is based on the **hypergeometric distribution**, which describes the probability of drawing `k` successes (without replacement) from a finite population of `N`, containing `K` successes, in a sample of size `n`.

It also allows for **conflict-aware adjustments** when an item (like a playing card) is part of more than one category.

---

## 🧮 Usage Example

Say you have a 54-card deck and want to:

- Calculate the probability of drawing **1 to 2 Aces**.
- Also get **1 to 3 Hearts (♥️)**.
- While accounting for the fact that **one Ace is also a Heart**.

This tool will:

1. Adjust category counts to avoid double-counting.
2. Compute individual probabilities.
3. Combine results and provide a corrected final probability.

---

## 🗃 Exporting

You can **export the full results** (per-category and final) as a `.txt` file, including a breakdown of conflicts.

---

## 💻 Technologies

- **HTML5**
- **CSS3** with custom variables (dark theme)
- **Vanilla JavaScript**
- **Deployed via Vercel**

---

## 🚀 Getting Started (Local)

```bash
git clone https://github.com/your-username/hypergeometric-calculator.git
cd hypergeometric-calculator
```

Then open index.html in your browser.
- No build steps or dependencies required.

---

## 📃 License

This project is open-source under the MIT License.