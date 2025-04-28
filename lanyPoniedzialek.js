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

        console.log("Game starting...");
        gameActive = true;
        score = 0;
        waterLevel = 100;
        timeLeft = gameDuration;
        peopleCount = 0;

        updateDisplays();
        gameMessage.textContent = "Gra w toku! Klikaj na postacie!";
        console.log("Game message updated:", gameMessage.textContent);
        startButton.disabled = true;
        console.log("Start button disabled");

        // Start game timer
        gameInterval = setInterval(function() {
            console.log("Timer tick, time left:", timeLeft);
            timeLeft--;
            updateDisplays();

            if (timeLeft <= 0) {
                console.log("Time up, ending game");
                endGame();
            }
        }, 1000);

        // Start spawning characters
        console.log("Setting up character spawn interval");
        characterInterval = setInterval(function() {
            console.log("Attempting to spawn character");
            spawnCharacter();
        }, 1000); // Spawn rate (e.g., every 1 second)
    }

    // Spawn a new character
    function spawnCharacter() {
        if (!gameActive) {
            console.log("Game not active, not spawning character");
            return;
        }

        console.log("Creating character element");
        const character = document.createElement('div');
        character.className = 'game-character';

        // Random position within gameField boundaries
        const charWidth = 60; // Must match CSS width
        const charHeight = 90; // Must match CSS height
        const maxX = gameField.offsetWidth - charWidth;
        const maxY = gameField.offsetHeight - charHeight;
        // Ensure maxX/maxY are not negative if gameField is too small
        const randomX = Math.floor(Math.random() * Math.max(0, maxX));
        const randomY = Math.floor(Math.random() * Math.max(0, maxY));

        console.log("Character position:", randomX, randomY);
        character.style.left = `${randomX}px`;
        character.style.top = `${randomY}px`;

        // Click event
        character.addEventListener('click', function(event) {
            console.log("Character clicked!");
            if (waterLevel >= waterPerClick) {
                waterLevel -= waterPerClick;
                score++;
                peopleCount++;
                updateDisplays();

                // Create water splash - Position relative to gameField
                const splash = document.createElement('div');
                splash.className = 'water-splash';
                // Use character position for splash base, adjust for centering
                const splashSize = 100; // Match CSS size
                splash.style.left = `${character.offsetLeft + (charWidth / 2) - (splashSize / 2)}px`;
                splash.style.top = `${character.offsetTop + (charHeight / 2) - (splashSize / 2)}px`;
                gameField.appendChild(splash);
                setTimeout(() => {
                    splash.remove();
                }, 500); // Duration of the splash animation

                character.remove(); // Remove the clicked character
            } else {
                gameMessage.textContent = "Nie masz wystarczająco wody! Napełnij wiadro!";
                setTimeout(() => {
                    if (gameActive) {
                        gameMessage.textContent = "Gra w toku! Klikaj na postacie!";
                    }
                }, 2000);
            }
            // Prevent event bubbling if necessary
            event.stopPropagation();
        });

        // Auto-remove if not clicked after a delay
        setTimeout(() => {
            // Check if character still exists in the game field before removing
            if (character.parentNode === gameField) {
                character.remove();
            }
        }, 2000); // Character lifespan (e.g., 2 seconds)

        gameField.appendChild(character);
        console.log("Character added to game field");
    }

    // Refill water
    function refillWater() {
        if (!gameActive) return;
        waterLevel = waterRefillAmount;
        updateDisplays();
        gameMessage.textContent = "Wiadro napełnione! Kontynuuj grę!";
        // Optionally add a short delay before resetting the message
        setTimeout(() => {
            if (gameActive) {
                gameMessage.textContent = "Gra w toku! Klikaj na postacie!";
            }
        }, 1500);
    }

    // Update all displays
    function updateDisplays() {
        scoreDisplay.textContent = score;
        // Ensure waterLevel doesn't go below 0 for display
        waterFill.style.transform = `scaleX(${Math.max(0, waterLevel) / 100})`;
        timeDisplay.textContent = timeLeft;
        peopleDisplay.textContent = peopleCount;
    }

    // End game
    function endGame() {
        gameActive = false;
        clearInterval(gameInterval);
        clearInterval(characterInterval);

        // Remove all characters and splashes safely
        const characters = gameField.querySelectorAll('.game-character');
        characters.forEach(char => char.remove());
        const splashes = gameField.querySelectorAll('.water-splash');
        splashes.forEach(splash => splash.remove());


        gameMessage.textContent = `Koniec gry! Twój wynik: ${score} punktów. Kliknij "Start" aby zagrać ponownie.`;
        startButton.disabled = false;
        // Reset styles potentially changed during game over message
        gameMessage.style.color = "white";
        gameMessage.style.fontSize = "1.4rem";
    }

    // Event listeners
    startButton.addEventListener('click', startGame);
    refillButton.addEventListener('click', refillWater);

    // Initial setup
    updateDisplays(); // Ensure initial display is correct
});