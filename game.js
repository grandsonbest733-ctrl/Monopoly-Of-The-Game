// Game State & Data Models
const characters = [
    { name: "Raymond", cash: 1000000, gas: 5, location: "Town Square", alive: true, router: false, inventory: [] },
    { name: "Leonard", cash: 1000000, gas: 5, location: "Town Square", alive: true, router: false, inventory: [] },
    { name: "Howard", cash: 1000000, gas: 5, location: "Town Square", alive: true, router: false, inventory: [] },
    { name: "Charlie", cash: 1000000, gas: 5, location: "Town Square", alive: true, router: false, inventory: [] }
];

let activeCharIndex = null;

const locations = {
    "Town Square": { type: "hub" },
    "Bank": { type: "bank", price: 100000000, owner: null },
    "Internet Tower": { type: "tower", price: 20000000, owner: null },
    "McDonald's": { type: "restaurant", price: 5000000, owner: null, foodPrice: 10 },
    "Burger King": { type: "restaurant", price: 5000000, owner: null, foodPrice: 10 },
    "Wendy's": { type: "restaurant", price: 5000000, owner: null, foodPrice: 10 },
    "Taco Bell": { type: "restaurant", price: 5000000, owner: null, foodPrice: 10 },
    "Red Robin": { type: "restaurant", price: 10000000, owner: null, foodPrice: 50 },
    "Home Depot": { type: "store", price: 250000, owner: null, stock: { gas: 10, router: 1 } },
    "7-Eleven": { type: "store", price: 100000, owner: null, stock: { gas: 3, gatorade: 20 } },
    "Flea Market": { type: "store", price: 10000, owner: null, stock: { gas: 3, router: 1, painting: 1 } }
};

// Add 25 Houses
for (let i = 1; i <= 25; i++) {
    locations[`House ${i}`] = { type: "house", price: 500000, owner: null, tenant: null };
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("hidden");
    renderSidebar();
}

function renderSidebar() {
    const list = document.getElementById("character-list");
    list.innerHTML = "";
    characters.forEach((char, index) => {
        const div = document.createElement("div");
        div.className = `char-card ${activeCharIndex === index ? 'active' : ''} ${!char.alive ? 'dead' : ''}`;
        div.innerHTML = `<strong>${char.name}</strong><br>Cash: $${char.cash.toLocaleString()}<br>Status: ${char.alive ? 'Alive' : 'Dead'}`;
        if (char.alive) {
            div.onclick = () => selectCharacter(index);
        }
        list.appendChild(div);
    });
}

function selectCharacter(index) {
    activeCharIndex = index;
    toggleSidebar();
    updateHUD();
    renderActions();
    renderMap();
}

function updateHUD() {
    const char = characters[activeCharIndex];
    document.getElementById("active-name").innerText = char.name;
    document.getElementById("active-cash").innerText = `$${char.cash.toLocaleString()}`;
    document.getElementById("active-gas").innerText = char.gas;
    document.getElementById("active-status").innerText = char.alive ? "Alive" : "Dead";
    document.getElementById("active-location").innerText = char.location;
}

function renderMap() {
    const container = document.getElementById("destination-buttons");
    container.innerHTML = "";
    Object.keys(locations).forEach(locName => {
        const btn = document.createElement("button");
        btn.className = "action-btn";
        btn.innerText = `Drive to ${locName}`;
        btn.onclick = () => travelTo(locName);
        container.appendChild(btn);
    });
}

function travelTo(locName) {
    const char = characters[activeCharIndex];
    if (char.gas <= 0) {
        alert("Out of gas! You need a gas can.");
        return;
    }
    char.gas -= 1;
    char.location = locName;
    updateHUD();
    renderActions();
}

function renderActions() {
    const char = characters[activeCharIndex];
    const panel = document.getElementById("location-actions");
    const loc = locations[char.location];
    panel.innerHTML = `<h4>At: ${char.location}</h4>`;

    if (loc.type === "restaurant") {
        panel.innerHTML += `<p>Buy Food (${loc.foodPrice})</p>`;
        panel.innerHTML += `<button class="action-btn" onclick="buyFood('${char.location}')">Eat Meal ($${loc.foodPrice})</button>`;
    } else if (loc.type === "house") {
        if (!loc.owner) {
            panel.innerHTML += `<button class="action-btn" onclick="buyHouse('${char.location}')">Buy House ($500,000)</button>`;
        } else {
            panel.innerHTML += `<p>House owned by ${loc.owner}</p>`;
            panel.innerHTML += `<button class="action-btn" onclick="useComputer()">Use In-House Computer</button>`;
        }
    } else if (loc.type === "store") {
        panel.innerHTML += `<p>Store Stock available for purchase.</p>`;
        panel.innerHTML += `<button class="action-btn" onclick="buyStoreItem('${char.location}')">Buy Supplies</button>`;
    } else if (loc.type === "bank") {
        panel.innerHTML += `<button class="action-btn" onclick="visitBank()">Visit Bank / Cash Painting</button>`;
    }
}

function buyFood(place) {
    const char = characters[activeCharIndex];
    const price = locations[place].foodPrice;
    if (char.cash < price) {
        alert("Not enough cash!");
        return;
    }
    char.cash -= price;
    alert(`${char.name} ate and survived the turn!`);
    updateHUD();
}

function buyHouse(houseName) {
    const char = characters[activeCharIndex];
    if (char.cash < 500000) {
        alert("Need $500,000 to buy this house!");
        return;
    }
    char.cash -= 500000;
    locations[houseName].owner = char.name;
    alert(`${char.name} purchased ${houseName}!`);
    renderActions();
    updateHUD();
}

// Initialize Sidebar on Load
window.onload = () => {
    renderSidebar();
};
