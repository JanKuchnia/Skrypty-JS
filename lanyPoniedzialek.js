// Lany Poniedziałek Game Script
document.addEventListener('DOMContentLoaded', function() {
    // Game variables
    let score = 0;
    let waterLevel = 100;
    let gameRunning = false;
    let timeLeft = 60;
    let peopleCount = 0;
    let gameTimer;
    let characterTimer;

    // DOM Elements
    const startButton = document.getElementById('start-game');
    const gameField = document.getElementById('game-field');
    const gameMessage = document.getElementById('game-message');
    const scoreDisplay = document.querySelector('.score-display');
    const waterFill = document.querySelector('.water-fill');
    const refillButton = document.getElementById('refill-water');
    const timeDisplay = document.getElementById('time-left');
    const peopleCountDisplay = document.getElementById('people-count');

    // Update display
    function updateDisplay() {
        scoreDisplay.textContent = score;
        waterFill.style.transform = `scaleX(${waterLevel / 100})`;
        timeDisplay.textContent = timeLeft;
        peopleCountDisplay.textContent = peopleCount;

        // Change water color based on level
        if (waterLevel < 30) {
            waterFill.style.backgroundColor = '#ff6b6b';
        } else if (waterLevel < 60) {
            waterFill.style.backgroundColor = '#ffb84d';
        } else {
            waterFill.style.backgroundColor = '#80d0f0';
        }
    }

    // Refill water bucket
    refillButton.addEventListener('click', function() {
        if (gameRunning && waterLevel < 100) {
            waterLevel = 100;
            updateDisplay();
            gameMessage.textContent = 'Wiadro napełnione!';
            setTimeout(() => {
                gameMessage.textContent = 'Oblej jak najwięcej osób!';
            }, 1000);
        }
    });

    // Create character
    function createCharacter() {
        if (!gameRunning) return;

        const character = document.createElement('div');
        character.classList.add('game-character');

        // Random position
        const posX = Math.floor(Math.random() * (gameField.offsetWidth - 60));
        const posY = Math.floor(Math.random() * (gameField.offsetHeight - 90));

        character.style.left = `${posX}px`;
        character.style.top = `${posY}px`;

        // Random character type (different outfits/colors)
        const characterType = Math.floor(Math.random() * 4);
        character.style.filter = `hue-rotate(${characterType * 90}deg)`;

        gameField.appendChild(character);

        // Character timeout
        const stayTime = Math.random() * 1500 + 1000; // 1-2.5 seconds
        setTimeout(() => {
            if (character.parentNode === gameField) {
                character.style.animation = 'character-appear 0.5s ease-in reverse';
                setTimeout(() => {
                    if (character.parentNode === gameField) {
                        gameField.removeChild(character);
                    }
                }, 500);
            }
        }, stayTime);

        // Click to splash water
        character.addEventListener('click', function() {
            if (waterLevel <= 0) {
                gameMessage.textContent = 'Brak wody! Napełnij wiadro!';
                setTimeout(() => {
                    gameMessage.textContent = 'Oblej jak najwięcej osób!';
                }, 1500);
                return;
            }

            // Create water splash effect
            const splash = document.createElement('div');
            splash.classList.add('water-splash');
            splash.style.left = `${parseInt(character.style.left) - 20}px`;
            splash.style.top = `${parseInt(character.style.top) - 10}px`;
            gameField.appendChild(splash);

            // Remove splash after animation
            setTimeout(() => {
                if (splash.parentNode === gameField) {
                    gameField.removeChild(splash);
                }
            }, 500);

            // Add score and remove character
            score += 10;
            peopleCount++;
            waterLevel -= 10;
            updateDisplay();

            gameField.removeChild(character);
        });

        // Schedule next character
        const nextCharTime = Math.random() * 1000 + 500; // 0.5-1.5 seconds
        characterTimer = setTimeout(createCharacter, nextCharTime);
    }

    // Start game
    startButton.addEventListener('click', function() {
        if (gameRunning) return;

        // Reset game state
        score = 0;
        waterLevel = 100;
        timeLeft = 60;
        peopleCount = 0;
        gameRunning = true;
        updateDisplay();

        // Update UI
        startButton.disabled = true;
        gameMessage.textContent = 'Oblej jak najwięcej osób!';

        // Clear game field
        while (gameField.firstChild) {
            gameField.removeChild(gameField.firstChild);
        }

        // Start character spawning
        createCharacter();

        // Start game timer
        gameTimer = setInterval(function() {
            timeLeft--;
            updateDisplay();

            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    });

    // End game
    function endGame() {
        gameRunning = false;
        clearInterval(gameTimer);
        clearTimeout(characterTimer);

        // Remove all characters
        const characters = document.querySelectorAll('.game-character');
        characters.forEach(char => char.remove());

        // Show final message
        gameMessage.textContent = `Koniec gry! Twój wynik: ${score} (Oblanych osób: ${peopleCount})`;
        startButton.disabled = false;
    }

    // Initialize display
    updateDisplay();
});