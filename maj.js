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
// Change foodItems to produktySpozywcze
const produktySpozywcze = {
    kielbasa: ["Włoska", "Polska", "Bratwurst", "Chorizo", "Frankfurter"],
    sos: ["Ketchup", "Musztarda", "Majonez", "BBQ", "Ostry"],
    pieczywo: ["Bułka", "Bajgiel", "Precel", "Ciabatta"]
};
// ... existing code ...

// Change gameState to stanGry
const stanGry = {
    poziom: 1,
    punkty: 0,
    czas: 60,
    jestGraAktywna: false,
    aktualneZamowienie: null,
    elementyTalerza: [],
    czasownik: null
};

// Change elements to elementy
const elementy = {
    startPrzycisk: document.getElementById("start-button"),
    aktualneZamowienie: document.getElementById("current-order"),
    elementyTalerza: document.getElementById("plate-items"),
    czasWyswietlacz: document.getElementById("time-display"),
    poziomWyswietlacz: document.getElementById("level-display"),
    punktyWyswietlacz: document.getElementById("score-display"),
    grillEfekt: document.getElementById("grill-effect")
};
// ... existing code ...

// Change startGame to rozpocznijGre
function rozpocznijGre() {
    if (stanGry.jestGraAktywna) return;
    
    // Reset game state
    stanGry.poziom = 1;
    stanGry.punkty = 0;
    stanGry.czas = 60;
    stanGry.jestGraAktywna = true;
    stanGry.elementyTalerza = [];
    
    // Update displays
    aktualizujWyswietlacze();
    
    // Generate first order
    wygenerujZamowienie();
    
    // Start timer
    rozpocznijCzasomierz();
    
    // Change button text
    elementy.startPrzycisk.textContent = "Gra w toku...";
    elementy.startPrzycisk.disabled = true;
}

// Change generateOrder to wygenerujZamowienie
function wygenerujZamowienie() {
    // Clear plate first
    wyczyscTalerz();
    
    // Determine number of items based on level
    const iloscKielbas = Math.min(Math.ceil(stanGry.poziom / 2), 2);
    const iloscSosow = Math.min(Math.ceil(stanGry.poziom / 2), 3);
    const iloscPieczywa = 1; // Always one bread
    
    // Generate random items
    const zamowienieKielbasy = pobierzLosoweElementy(produktySpozywcze.kielbasa, iloscKielbas);
    const zamowienieSosy = pobierzLosoweElementy(produktySpozywcze.sos, iloscSosow);
    const zamowieniePieczywo = pobierzLosoweElementy(produktySpozywcze.pieczywo, iloscPieczywa);
    
    // Create order object
    stanGry.aktualneZamowienie = {
        kielbasa: zamowienieKielbasy,
        sos: zamowienieSosy,
        pieczywo: zamowieniePieczywo
    };
    
    // Display order
    wyswietlZamowienie();
}

// Change getRandomItems to pobierzLosoweElementy
function pobierzLosoweElementy(tablica, ilosc) {
    const potasowana = [...tablica].sort(() => 0.5 - Math.random());
    return potasowana.slice(0, ilosc);
}

// Change displayOrder to wyswietlZamowienie
function wyswietlZamowienie() {
    if (!stanGry.aktualneZamowienie) return;
    
    let zamowienieHTML = `<h3>Zamówienie:</h3><ul>`;
    
    // Add sausages
    stanGry.aktualneZamowienie.kielbasa.forEach(kielbasa => {
        zamowienieHTML += `<li>🌭 Kiełbasa: ${kielbasa}</li>`;
    });
    
    // Add sauces
    stanGry.aktualneZamowienie.sos.forEach(sos => {
        zamowienieHTML += `<li>${pobierzEmojiSosu(sos)} Sos: ${sos}</li>`;
    });
    
    // Add bread
    stanGry.aktualneZamowienie.pieczywo.forEach(pieczywo => {
        zamowienieHTML += `<li>${pobierzEmojiPieczywa(pieczywo)} Pieczywo: ${pieczywo}</li>`;
    });
    
    zamowienieHTML += `</ul>`;
    elementy.aktualneZamowienie.innerHTML = zamowienieHTML;
}

// Change getSauceEmoji to pobierzEmojiSosu
function pobierzEmojiSosu(sos) {
    const emoji = {
        "Ketchup": "🟥",
        "Musztarda": "🟨",
        "Majonez": "⬜",
        "BBQ": "🟫",
        "Ostry": "🔴"
    };
    
    return emoji[sos] || "";
}

// Change getBreadEmoji to pobierzEmojiPieczywa
function pobierzEmojiPieczywa(pieczywo) {
    const emoji = {
        "Bułka": "🍞",
        "Bajgiel": "🥯",
        "Precel": "🥨",
        "Ciabatta": "🥖"
    };
    
    return emoji[pieczywo] || "";
}

// Change addToPlate to dodajDoTalerza
function dodajDoTalerza(typ, nazwa) {
    if (!stanGry.jestGraAktywna) return;
    
    // Add to plate items array
    stanGry.elementyTalerza.push({ typ, nazwa });
    
    // Update plate display
    aktualizujWyswietlaczTalerza();
    
    // Add grill effect
    dodajEfektGrilla();
}

// Change updatePlateDisplay to aktualizujWyswietlaczTalerza
function aktualizujWyswietlaczTalerza() {
    elementy.elementyTalerza.innerHTML = "";
    
    stanGry.elementyTalerza.forEach((element, indeks) => {
        const elementTalerza = document.createElement("div");
        elementTalerza.className = "element-talerza";
        
        let emoji = "";
        if (element.typ === "kielbasa") emoji = "🌭";
        else if (element.typ === "sos") emoji = pobierzEmojiSosu(element.nazwa);
        else if (element.typ === "pieczywo") emoji = pobierzEmojiPieczywa(element.nazwa);
        
        elementTalerza.innerHTML = `
            ${emoji} <span>${element.nazwa}</span>
            <button class="usun-element" onclick="usunZTalerza(${indeks})">×</button>
        `;
        
        elementy.elementyTalerza.appendChild(elementTalerza);
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
document.addEventListener("DOMContentLoaded", );