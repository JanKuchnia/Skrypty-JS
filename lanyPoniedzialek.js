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
        startButton.textContent = 'W trakcie gry...';

        // Start character spawning
        createCharacter();

        // Start timer
        gameTimer = setInterval(function() {
            timeLeft--;
            updateDisplay();

            // Add bonus characters every 10 seconds
            if (timeLeft % 10 === 0 && timeLeft > 0) {
                // Spawn multiple characters at once
                for (let i = 0; i < 3; i++) {
                    setTimeout(function() {
                        if (gameRunning) {
                            const bonusChar = document.createElement('div');
                            bonusChar.classList.add('game-character');
                            bonusChar.style.backgroundColor = '#ffb7dc';
                            bonusChar.style.border = '2px solid gold';

                            // Random position
                            const posX = Math.floor(Math.random() * (gameField.offsetWidth - 60));
                            const posY = Math.floor(Math.random() * (gameField.offsetHeight - 90));

                            bonusChar.style.left = `${posX}px`;
                            bonusChar.style.top = `${posY}px`;

                            gameField.appendChild(bonusChar);

                            // Bonus character click
                            bonusChar.addEventListener('click', function() {
                                if (waterLevel <= 0) {
                                    gameMessage.textContent = 'Brak wody! Napełnij wiadro!';
                                    setTimeout(() => {
                                        gameMessage.textContent = 'Oblej jak najwięcej osób!';
                                    }, 1500);
                                    return;
                                }

                                // Bonus splash
                                const splash = document.createElement('div');
                                splash.classList.add('water-splash');
                                splash.style.left = `${parseInt(bonusChar.style.left) - 20}px`;
                                splash.style.top = `${parseInt(bonusChar.style.top) - 10}px`;
                                splash.style.filter = 'hue-rotate(300deg)';
                                gameField.appendChild(splash);

                                setTimeout(() => {
                                    if (splash.parentNode === gameField) {
                                        gameField.removeChild(splash);
                                    }
                                }, 500);

                                // Bonus points
                                score += 20;
                                peopleCount++;
                                waterLevel -= 5;
                                updateDisplay();

                                gameField.removeChild(bonusChar);
                            });

                            // Bonus character timeout
                            setTimeout(() => {
                                if (bonusChar.parentNode === gameField) {
                                    bonusChar.style.animation = 'character-appear 0.5s ease-in reverse';
                                    setTimeout(() => {
                                        if (bonusChar.parentNode === gameField) {
                                            gameField.removeChild(bonusChar);
                                        }
                                    }, 500);
                                }
                            }, 1200);
                        }
                    }, i * 300);
                }

                gameMessage.textContent = 'Bonus! Wielka grupa!';
                setTimeout(() => {
                    gameMessage.textContent = 'Oblej jak najwięcej osób!';
                }, 1500);
            }

            // End game
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    });

    // End game function
    function endGame() {
        gameRunning = false;
        clearInterval(gameTimer);
        clearTimeout(characterTimer);

        // Remove all characters
        const characters = document.querySelectorAll('.game-character');
        characters.forEach(char => {
            gameField.removeChild(char);
        });

        // Reset UI
        startButton.disabled = false;
        startButton.textContent = 'Zagraj Ponownie';

        // Show final score
        gameMessage.innerHTML = `
            <strong>Koniec gry!</strong><br>
            Twój wynik: ${score} punktów<br>
            Oblałeś ${peopleCount} ${getPolishPeopleForm(peopleCount)}!
        `;

        // Add special effects for high scores
        if (score > 200) {
            gameField.style.backgroundImage = 'url("images/winner-bg.png")';
            gameMessage.style.backgroundColor = 'rgba(255, 215, 0, 0.3)';
            gameMessage.style.borderColor = 'gold';

            // Create floating eggs animation
            createFloatingEggs();
        }
    }

    // Helper function for Polish grammar
    function getPolishPeopleForm(count) {
        if (count === 1) return "osobę";
        if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
            return "osoby";
        }
        return "osób";
    }

    // Create floating eggs animation for winners
    function createFloatingEggs() {
        for (let i = 0; i < 15; i++) {
            const egg = document.createElement('div');
            egg.classList.add('floating-egg');

            // Random egg type
            const eggType = Math.floor(Math.random() * 5);
            const eggColors = ['#ffb7dc', '#80d0f0', '#ffeb7a', '#a6e386', '#c9a0ff'];

            egg.style.backgroundColor = eggColors[eggType];
            egg.style.width = `${Math.random() * 20 + 10}px`;
            egg.style.height = `${parseInt(egg.style.width) * 1.3}px`;
            egg.style.borderRadius = '50% 50% 45% 45%';
            egg.style.position = 'absolute';
            egg.style.left = `${Math.random() * 100}%`;
            egg.style.top = `${Math.random() * 100}%`;
            egg.style.animation = `float ${Math.random() * 5 + 5}s linear infinite`;
            egg.style.transform = `rotate(${Math.random() * 360}deg)`;
            egg.style.zIndex = '5';
            egg.style.boxShadow = '0 0 10px rgba(255,255,255,0.7)';

            gameField.appendChild(egg);
        }

        // Add CSS animation for floating eggs
        const styleSheet = document.createElement('style');
        styleSheet.innerText = `
            @keyframes float {
                0% { transform: translate(0, 0) rotate(0deg); }
                25% { transform: translate(10px, -20px) rotate(90deg); }
                50% { transform: translate(20px, 0) rotate(180deg); }
                75% { transform: translate(10px, 20px) rotate(270deg); }
                100% { transform: translate(0, 0) rotate(360deg); }
            }
        `;
        document.head.appendChild(styleSheet);
    }

    // Easter basket animation
    const easterBasket = document.querySelector('.easter-basket');
    const basketItems = document.querySelectorAll('.item');

    easterBasket.addEventListener('mouseenter', function() {
        basketItems.forEach(item => {
            const randomX = (Math.random() - 0.5) * 10;
            const randomY = -Math.random() * 10 - 5;
            item.style.transform = `translateY(${randomY}px) translateX(${randomX}px) rotate(${randomX * 3}deg)`;
        });
    });

    easterBasket.addEventListener('mouseleave', function() {
        basketItems.forEach(item => {
            item.style.transform = item.classList.contains('bunny') ? '' : `rotate(${(Math.random() - 0.5) * 20}deg)`;
        });
    });

    // Add water droplet effect
    function createWaterEffect() {
        const drop = document.createElement('div');
        drop.classList.add('water-drop');
        drop.style.width = '8px';
        drop.style.height = '12px';
        drop.style.backgroundColor = '#80d0f0';
        drop.style.borderRadius = '50% 50% 50% 50%';
        drop.style.position = 'absolute';
        drop.style.top = '-10px';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.opacity = '0.7';
        drop.style.zIndex = '100';

        document.querySelector('header').appendChild(drop);

        const fallAnimation = drop.animate([
            { top: '-10px', opacity: 0.7 },
            { top: '100px', opacity: 0 }
        ], {
            duration: Math.random() * 1000 + 1000,
            easing: 'cubic-bezier(0.4, 0, 1, 1)'
        });

        fallAnimation.onfinish = () => {
            if (drop.parentNode) {
                drop.parentNode.removeChild(drop);
            }
        };
    }

    // Create periodic water drops on header
    setInterval(createWaterEffect, 300);
});