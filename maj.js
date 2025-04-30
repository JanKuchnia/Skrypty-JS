// Game configuration
const gameConfig = {
    initialTime: 60,
    pointsPerCorrectOrder: 10,
    levelUpThreshold: 50,
    timeDecreasePerLevel: 5,
    minTime: 30
};

// Game state
let gameState = {
    score: 0,
    level: 1,
    timeLeft: gameConfig.initialTime,
    isGameRunning: false,
    currentOrder: null,
    plateItems: [],
    timer: null
};

// Food items database
const foodItems = {
    sausage: ["Italian", "Polish", "Bratwurst", "Chorizo", "Frankfurter"],
    sauce: ["Ketchup", "Mustard", "Mayo", "BBQ", "Hot"],
    bread: ["Bun", "Bagel", "Pretzel", "Ciabatta"]
};

// DOM elements
const elements = {
    scoreValue: document.getElementById("wartosc-wyniku"),
    timeValue: document.getElementById("wartosc-czasu"),
    levelValue: document.getElementById("wartosc-poziomu"),
    timerBar: document.getElementById("pasek-czasomierza"),
    currentOrder: document.getElementById("aktualne-zamowienie"),
    plateItems: document.getElementById("elementy-talerza"),
    clearButton: document.getElementById("przycisk-wyczysc"),
    serveButton: document.getElementById("przycisk-podaj"),
    startButton: document.getElementById("przycisk-start"),
    feedback: document.getElementById("informacja-zwrotna"),
    gameOver: document.getElementById("koniec-gry"),
    gameOverMessage: document.getElementById("wiadomosc-koniec-gry"),
    foodButtons: document.querySelectorAll(".przycisk-jedzenia")
};

// Initialize the game
function initGame() {
    // Reset game state
    gameState = {
        score: 0,
        level: 1,
        timeLeft: gameConfig.initialTime,
        isGameRunning: false,
        currentOrder: null,
        plateItems: [],
        timer: null
    };

    // Update UI
    updateUI();

    // Add event listeners
    elements.startButton.addEventListener("click", startGame);
    elements.clearButton.addEventListener("click", clearPlate);
    elements.serveButton.addEventListener("click", serveOrder);
    
    elements.foodButtons.forEach(button => {
        button.addEventListener("click", () => addToPlate(button.dataset.type, button.dataset.name));
    });
}

// Start the game
function startGame() {
    if (gameState.isGameRunning) return;
    
    // Reset game state
    gameState.isGameRunning = true;
    gameState.score = 0;
    gameState.level = 1;
    gameState.timeLeft = gameConfig.initialTime;
    gameState.plateItems = [];
    
    // Hide game over screen
    elements.gameOver.style.display = "none";
    
    // Update UI
    updateUI();
    
    // Generate first order
    generateOrder();
    
    // Start timer
    startTimer();
    
    // Change button text
    elements.startButton.textContent = "Gra w toku...";
    elements.startButton.disabled = true;
}

// Generate a random order
function generateOrder() {
    // Clear plate first
    clearPlate();
    
    // Determine number of items based on level
    const numSausages = Math.min(Math.ceil(gameState.level / 2), 2);
    const numSauces = Math.min(Math.ceil(gameState.level / 2), 3);
    const numBreads = 1; // Always one bread
    
    // Generate random items
    const orderSausages = getRandomItems(foodItems.sausage, numSausages);
    const orderSauces = getRandomItems(foodItems.sauce, numSauces);
    const orderBread = getRandomItems(foodItems.bread, numBreads);
    
    // Create order object
    gameState.currentOrder = {
        sausage: orderSausages,
        sauce: orderSauces,
        bread: orderBread
    };
    
    // Display order
    displayOrder();
}

// Get random items from an array
function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Display the current order
function displayOrder() {
    if (!gameState.currentOrder) return;
    
    let orderHTML = `<h3>Zamówienie:</h3><ul>`;
    
    // Add sausages
    gameState.currentOrder.sausage.forEach(sausage => {
        orderHTML += `<li>🌭 Kiełbasa: ${translateName(sausage)}</li>`;
    });
    
    // Add sauces
    gameState.currentOrder.sauce.forEach(sauce => {
        orderHTML += `<li>${getSauceEmoji(sauce)} Sos: ${translateName(sauce)}</li>`;
    });
    
    // Add bread
    gameState.currentOrder.bread.forEach(bread => {
        orderHTML += `<li>${getBreadEmoji(bread)} Pieczywo: ${translateName(bread)}</li>`;
    });
    
    orderHTML += `</ul>`;
    elements.currentOrder.innerHTML = orderHTML;
}

// Translate food names to Polish
function translateName(name) {
    const translations = {
        // Sausages
        "Italian": "Włoska",
        "Polish": "Polska",
        "Bratwurst": "Bratwurst",
        "Chorizo": "Chorizo",
        "Frankfurter": "Frankfurter",
        
        // Sauces
        "Ketchup": "Ketchup",
        "Mustard": "Musztarda",
        "Mayo": "Majonez",
        "BBQ": "BBQ",
        "Hot": "Ostry",
        
        // Breads
        "Bun": "Bułka",
        "Bagel": "Bajgiel",
        "Pretzel": "Precel",
        "Ciabatta": "Ciabatta"
    };
    
    return translations[name] || name;
}

// Get emoji for sauce
function getSauceEmoji(sauce) {
    const emojis = {
        "Ketchup": "🟥",
        "Mustard": "🟨",
        "Mayo": "⬜",
        "BBQ": "🟫",
        "Hot": "🔴"
    };
    
    return emojis[sauce] || "";
}

// Get emoji for bread
function getBreadEmoji(bread) {
    const emojis = {
        "Bun": "🍞",
        "Bagel": "🥯",
        "Pretzel": "🥨",
        "Ciabatta": "🥖"
    };
    
    return emojis[bread] || "";
}

// Add item to plate
function addToPlate(type, name) {
    if (!gameState.isGameRunning) return;
    
    // Add to plate items array
    gameState.plateItems.push({ type, name });
    
    // Update plate display
    updatePlateDisplay();
    
    // Add grill effect
    addGrillEffect();
}

// Update plate display
function updatePlateDisplay() {
    elements.plateItems.innerHTML = "";
    
    gameState.plateItems.forEach((item, index) => {
        const itemElement = document.createElement("div");
        itemElement.className = "element-talerza";
        
        let emoji = "";
        if (item.type === "sausage") emoji = "🌭";
        else if (item.type === "sauce") emoji = getSauceEmoji(item.name);
        else if (item.type === "bread") emoji = getBreadEmoji(item.name);
        
        itemElement.innerHTML = `
            ${emoji} <span>${translateName(item.name)}</span>
            <button class="usun-element" onclick="removeFromPlate(${index})">×</button>
        `;
        
        elements.plateItems.appendChild(itemElement);
    });
}

// Remove item from plate
function removeFromPlate(index) {
    if (!gameState.isGameRunning) return;
    
    gameState.plateItems.splice(index, 1);
    updatePlateDisplay();
}

// Clear plate
function clearPlate() {
    if (!gameState.isGameRunning) return;
    
    gameState.plateItems = [];
    updatePlateDisplay();
}

// Serve order
function serveOrder() {
    if (!gameState.isGameRunning || !gameState.currentOrder) return;
    
    // Check if order is correct
    const isCorrect = checkOrder();
    
    if (isCorrect) {
        // Add points
        gameState.score += gameConfig.pointsPerCorrectOrder;
        
        // Show success feedback
        showFeedback("Poprawne zamówienie! +10 punktów", "sukces");
        
        // Check for level up
        checkLevelUp();
        
        // Generate new order
        generateOrder();
    } else {
        // Show failure feedback
        showFeedback("Niepoprawne zamówienie! Spróbuj ponownie", "porazka");
    }
    
    // Update UI
    updateUI();
}

// Check if served order matches current order
function checkOrder() {
    const order = gameState.currentOrder;
    const plate = gameState.plateItems;
    
    // Count items by type and name
    const orderCounts = countItems(order);
    const plateCounts = countItemsFromPlate(plate);
    
    // Compare counts
    for (const type in orderCounts) {
        for (const name in orderCounts[type]) {
            if (!plateCounts[type] || plateCounts[type][name] !== orderCounts[type][name]) {
                return false;
            }
        }
    }
    
    // Check if there are extra items on the plate
    for (const type in plateCounts) {
        for (const name in plateCounts[type]) {
            if (!orderCounts[type] || !orderCounts[type][name]) {
                return false;
            }
        }
    }
    
    return true;
}

// Count items in order
function countItems(order) {
    const counts = {};
    
    for (const type in order) {
        counts[type] = {};
        order[type].forEach(name => {
            counts[type][name] = (counts[type][name] || 0) + 1;
        });
    }
    
    return counts;
}

// Count items on plate
function countItemsFromPlate(plate) {
    const counts = {};
    
    plate.forEach(item => {
        if (!counts[item.type]) counts[item.type] = {};
        counts[item.type][item.name] = (counts[item.type][item.name] || 0) + 1;
    });
    
    return counts;
}

// Check for level up
function checkLevelUp() {
    if (gameState.score >= gameState.level * gameConfig.levelUpThreshold) {
        gameState.level++;
        
        // Adjust time for new level
        const newTime = gameConfig.initialTime - ((gameState.level - 1) * gameConfig.timeDecreasePerLevel);
        gameState.timeLeft = Math.max(newTime, gameConfig.minTime);
        
        // Show level up feedback
        showFeedback(`Poziom ${gameState.level}! Nowe wyzwanie!`, "sukces");
    }
}

// Show feedback message
function showFeedback(message, type) {
    elements.feedback.textContent = message;
    elements.feedback.className = `informacja-zwrotna ${type}`;
    elements.feedback.style.opacity = 1;
    
    // Hide after 2 seconds
    setTimeout(() => {
        elements.feedback.style.opacity = 0;
    }, 2000);
}

// Start timer
function startTimer() {
    // Clear existing timer
    if (gameState.timer) clearInterval(gameState.timer);
    
    // Set timer
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        
        // Update timer display
        updateTimerDisplay();
        
        // Check for game over
        if (gameState.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    // Update time text
    elements.timeValue.textContent = gameState.timeLeft;
    
    // Update timer bar
    const percentage = (gameState.timeLeft / gameConfig.initialTime) * 100;
    elements.timerBar.style.width = `${percentage}%`;
    
    // Change color based on time left
    if (gameState.timeLeft <= 10) {
        elements.timerBar.style.backgroundColor = "#f44336"; // Red
    } else if (gameState.timeLeft <= 20) {
        elements.timerBar.style.backgroundColor = "#ff9800"; // Orange
    } else {
        elements.timerBar.style.backgroundColor = "#4CAF50"; // Green
    }
}

// End game
function endGame() {
    // Stop timer
    clearInterval(gameState.timer);
    
    // Update game state
    gameState.isGameRunning = false;
    
    // Show game over screen
    elements.gameOver.style.display = "flex";
    elements.gameOverMessage.textContent = `Twój wynik: ${gameState.score} punktów! Osiągnięty poziom: ${gameState.level}`;
    
    // Reset start button
    elements.startButton.textContent = "Start";
    elements.startButton.disabled = false;
}

// Update UI
function updateUI() {
    elements.scoreValue.textContent = gameState.score;
    elements.levelValue.textContent = gameState.level;
    elements.timeValue.textContent = gameState.timeLeft;
    updateTimerDisplay();
}

// Add grill effect
function addGrillEffect() {
    const effect = document.createElement("div");
    effect.className = "efekt-grilla";
    
    // Random position within the plate
    const plate = elements.plateItems;
    const plateRect = plate.getBoundingClientRect();
    
    const x = Math.random() * (plateRect.width - 80);
    const y = Math.random() * (plateRect.height - 80);
    
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    
    plate.appendChild(effect);
    
    // Remove after animation
    setTimeout(() => {
        effect.remove();
    }, 500);
}

// Add points animation
function addPointsAnimation(points) {
    const pointsElement = document.createElement("div");
    pointsElement.className = "punkty-dodane";
    pointsElement.textContent = `+${points}`;
    
    // Position in center of screen
    pointsElement.style.left = "50%";
    pointsElement.style.top = "50%";
    pointsElement.style.transform = "translate(-50%, -50%)";
    
    document.body.appendChild(pointsElement);
    
    // Animate
    setTimeout(() => {
        pointsElement.style.transform = "translate(-50%, -100px)";
        pointsElement.style.opacity = 0;
    }, 100);
    
    // Remove after animation
    setTimeout(() => {
        pointsElement.remove();
    }, 1000);
}

// Make removeFromPlate function available globally
window.removeFromPlate = removeFromPlate;

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", initGame);