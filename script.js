let cardCounter = 0;
let conflictCardCounter = 0;
let category = [];
let conflict = [];
let finalProbability = 0;

function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

function combination(n, r) {
    if (r > n || r < 0) return 0;
    return factorial(n) / (factorial(r) * factorial(n - r));
}

function hypergeometric(N, K, n, k) {
    const numerator = combination(K, k) * combination(N - K, n - k);
    const denominator = combination(N, n);
    return numerator / denominator;
}

function addCard() {
    const container = document.getElementById("cards");
    const id = cardCounter++;
    const card = document.createElement("div");
    card.className = "card";
    card.id = `card-${id}`;
    card.innerHTML = `
    <strong>Category ${id + 1}</strong><br>
    Name: <input type="text" id="name-${id}" placeholder="Ex: Joker">
    In population (K): <input type="number" id="K-${id}">
    Min desired: <input type="number" id="minK-${id}">
    Max desired: <input type="number" id="maxK-${id}">
    <button onclick="removeCard(${id})">Remove</button>
    `;
    container.appendChild(card);
}

function removeCard(id) {
    const card = document.getElementById(`card-${id}`);
    if (card) card.remove();
}

function addConflict() {
    const container = document.getElementById("conflicts");
    const id = conflictCardCounter++;
    const div = document.createElement("div");
    div.className = "conflict";
    div.id = `conflict-card-${id}`;
    div.innerHTML = `
    <strong>Conflict:</strong><br>
    Category 1: <input type="text" class="conf-cat1">
    Category 2: <input type="text" class="conf-cat2">
    Items in common: <input type="number" class="conf-qtd">
    <button onclick="removeConflictCard(${id})">Remove</button>
    `;
    container.appendChild(div);
}

function removeConflictCard(id) {
    const card = document.getElementById(`conflict-card-${id}`);
    if (card) card.remove();
}

function calculateAll() {
    const N = parseInt(document.getElementById("N").value);
    const n = parseInt(document.getElementById("n").value);
    const results = [];

    const categories = {};
    category = [];
    const validIds = [];

    for (let i = 0; i < cardCounter; i++) {
        const nameInput = document.getElementById(`name-${i}`);
        if (!nameInput) continue;
        validIds.push(i);

        categories[nameInput.value] = {
            name: nameInput.value,
            K: parseInt(document.getElementById(`K-${i}`).value),
            minK: parseInt(document.getElementById(`minK-${i}`).value),
            maxK: parseInt(document.getElementById(`maxK-${i}`).value),
            prob: 0,
        };

        category.push({ name: nameInput.value, min: categories[nameInput.value].minK, max: categories[nameInput.value].maxK, probability: categories[nameInput.value].prob });
    }

    const conflictInputs = document.querySelectorAll(".conflict");
    const correctedConflicts = [];
    conflict = [];
    conflictInputs.forEach(c => {
        const cat1 = c.querySelector(".conf-cat1").value;
        const cat2 = c.querySelector(".conf-cat2").value;
        const qtd = parseInt(c.querySelector(".conf-qtd").value);
        if (cat1 && cat2 && qtd > 0) {
            correctedConflicts.push({ cat1, cat2, qtd });
            conflict.push({ cat1, cat2, qtd });
        }
    });

    // Adjust Ks for conflicting categories
    correctedConflicts.forEach(({ cat1, cat2, qtd }) => {
        if (categories[cat1]) categories[cat1].K -= qtd;
        if (categories[cat2]) categories[cat2].K -= qtd;

        const intersectionName = `${cat1} & ${cat2}`;
        categories[intersectionName] = {
            name: intersectionName,
            K: qtd,
            minK: 0,
            maxK: qtd,
            prob: 0
        };
    });

    let totalProb = 1;

    for (const cat in categories) {
        const { name, K, minK, maxK } = categories[cat];
        let total = 0;
        let details = "";

        for (let k = minK; k <= maxK; k++) {
            const p = hypergeometric(N, K, n, k);
            total += p;
            details += `P(${name} = ${k}) = ${p.toFixed(5)}<br>`;
        }

        categories[cat].prob = total;
        totalProb *= total;

        category.forEach(element => {
            if (element.name === cat) element.probability = total;
        });

        results.push(`
            <div class="card">
            <strong>${name}</strong><br>
            ${details}
            <strong>Total: ${(total * 100).toFixed(2)}%</strong>
            </div>
        `);
    }

    finalProbability = totalProb;
    results.push(`<div class="card"><strong>Final Combined Probability:</strong> ${(totalProb * 100).toFixed(2)}%</div>`);
    document.getElementById("results").innerHTML = results.join("");
}

function exportTXT(category, conflict, finalProbability) {
    let content = "📊 Report - Hypergeometric Calculator\n\n";

    category.forEach(cat => {
        content += `Category: ${cat.name}\n`;
        content += `  - Desired successes: min = ${cat.min}, max = ${cat.max}\n`;
        content += `  - Probability: ${(cat.probability * 100).toFixed(2)}%\n\n`;
    });

    if (conflict && conflict.length > 0) {
        content += "⚠️ Conflicts detected:\n";
        conflict.forEach(conf => {
            content += `  - ${conf.qtd} element(s) belong to both "${conf.cat1}" and "${conf.cat2}"\n`;
        });
        content += "\n";
    }

    content += `✅ Final combined probability: ${(finalProbability * 100).toFixed(2)}%\n`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hypergeometric_report.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}