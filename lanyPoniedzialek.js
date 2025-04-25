document.addEventListener('DOMContentLoaded', function() {
    // Game variables
    let score = 0;
    let waterLevel = 100;
    let timeLeft = 60;
    let peopleCount = 0;
    let gameInterval;
    let characterInterval;
    let gameActive = false;
    const waterPerClick = 10;
    const waterRefillAmount = 100;
    const gameDuration = 60; // seconds

    // DOM elements
    const scoreDisplay = document.querySelector('.score-display');
    const waterFill = document.querySelector('.water-fill');
    const timeDisplay = document.getElementById('time-left');
    const peopleDisplay = document.getElementById('people-count');
    const startButton = document.getElementById('start-game');
    const refillButton = document.getElementById('refill-water');
    const gameField = document.getElementById('game-field');
    const gameMessage = document.getElementById('game-message');

    // Start game function
    function startGame() {
        if (gameActive) return;

        gameActive = true;
        score = 0;
        waterLevel = 100;
        timeLeft = gameDuration;
        peopleCount = 0;

        updateDisplays();
        gameMessage.textContent = "Gra w toku! Klikaj na postacie!";
        startButton.disabled = true;

        // Start game timer
        gameInterval = setInterval(function() {
            timeLeft--;
            updateDisplays();

            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);

        // Start spawning characters
        characterInterval = setInterval(spawnCharacter, 1000);
    }

    // Spawn a new character
    function spawnCharacter() {
        if (!gameActive) return;

        const character = document.createElement('div');
        character.className = 'game-character';

        // Random position
        const maxX = gameField.offsetWidth - 60;
        const maxY = gameField.offsetHeight - 90;
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        character.style.left = `${randomX}px`;
        character.style.top = `${randomY}px`;

        // Click event
        character.addEventListener('click', function() {
            if (waterLevel > 0) {
                // Create splash effect
                const splash = document.createElement('div');
                splash.className = 'water-splash';
                splash.style.left = `${randomX - 20}px`;
                splash.style.top = `${randomY - 5}px`;
                gameField.appendChild(splash);

                // Remove splash after animation
                setTimeout(() => {
                    splash.remove();
                }, 500);

                // Update game state
                score += 10;
                waterLevel -= waterPerClick;
                peopleCount++;
                updateDisplays();

                // Remove character
                character.remove();

                if (waterLevel <= 0) {
                    gameMessage.textContent = "Napełnij wodę aby kontynuować!";
                }
            }
        });

        // Auto-remove if not clicked
        setTimeout(() => {
            if (character.parentNode === gameField) {
                character.remove();
            }
        }, 2000);

        gameField.appendChild(character);
    }

    // Refill water
    function refillWater() {
        if (!gameActive) return;
        waterLevel = waterRefillAmount;
        updateDisplays();
        gameMessage.textContent = "Wiadro napełnione! Kontynuuj grę!";
    }

    // Update all displays
    function updateDisplays() {
        scoreDisplay.textContent = score;
        waterFill.style.transform = `scaleX(${waterLevel / 100})`;
        timeDisplay.textContent = timeLeft;
        peopleDisplay.textContent = peopleCount;
    }

    // End game
    function endGame() {
        gameActive = false;
        clearInterval(gameInterval);
        clearInterval(characterInterval);

        // Remove all characters
        while (gameField.firstChild) {
            gameField.firstChild.remove();
        }

        gameMessage.textContent = `Koniec gry! Twój wynik: ${score} punktów. Kliknij "Start" aby zagrać ponownie.`;
        startButton.disabled = false;
    }

    // Event listeners
    startButton.addEventListener('click', startGame);
    refillButton.addEventListener('click', refillWater);
});