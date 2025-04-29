// Wait for the DOM to be fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', function() {
    // Test if all required elements exist
    const elementsToCheck = [
        'game-field', 'score', 'game-message', 
        'time-left', 'hits', 'misses', 'water-fill'
    ];
    
    const missingElements = [];
    elementsToCheck.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            missingElements.push(id);
        }
    });
    
    if (missingElements.length > 0) {
        alert(`Inicjalizacja gry nie powiodła się. Brakujące elementy HTML: ${missingElements.join(', ')}`);
        return; // Stop execution if elements are missing
    }
    
    // Game variables
    let gameActive = false;
    let countdownActive = false;
    let score = 0;
    let hits = 0;
    let misses = 0;
    let timeLeft = 30;
    let targetInterval;
    let gameInterval;
    let timerInterval;
    let countdownInterval;
    let waterLevel = 100;
    let lastTargetSpawnTime = 0; // Track when the last target was spawned

    // DOM elements
    const gameField = document.getElementById('game-field');
    const scoreDisplay = document.getElementById('score');
    const gameMessage = document.getElementById('game-message');
    const timeLeftDisplay = document.getElementById('time-left');
    const hitsDisplay = document.getElementById('hits');
    const missesDisplay = document.getElementById('misses');
    const waterFill = document.getElementById('water-fill');
    
    // Add a visible indicator that the script is running
    gameMessage.textContent = 'Kliknij gdziekolwiek lub naciśnij spację, aby rozpocząć.';
    
    // Event listeners with error handling
    try {
        // Add keyboard event listener to start game with spacebar
        document.addEventListener('keydown', function(e) {
            if (e.code == 'Space' && !gameActive && !countdownActive) {
                try {
                    startCountdown();
                } catch (error) {
                    alert('Błąd podczas rozpoczynania odliczania: ' + error.message);
                }
            }
        });
    } catch (error) {
        // Error handling
    }
    
    try {
        gameField.addEventListener('click', function(e) {
            if (gameActive) {
                try {
                    handleMiss(e);
                } catch (error) {
                    // Error handling
                }
            }
        });
    } catch (error) {
        // Error handling
    }

    // Add click anywhere to start - but only in the game area
    gameField.addEventListener('click', function(e) {
        if (!gameActive && !countdownActive) {
            try {
                startCountdown();
            } catch (error) {
                alert('Błąd podczas rozpoczynania odliczania: ' + error.message);
            }
        }
    });

    // Add countdown to start
    function startCountdown() {
        if (gameActive || countdownActive) return; // Don't start countdown if game is already active
        
        countdownActive = true;
        let countdown = 3;
        gameMessage.textContent = `Gra rozpocznie się za ${countdown}...`;
        
        countdownInterval = setInterval(function() {
            countdown--;
            if (countdown > 0) {
                gameMessage.textContent = `Gra rozpocznie się za ${countdown}...`;
            } else {
                clearInterval(countdownInterval);
                countdownActive = false;
                startGame();
            }
        }, 1000);
    }

    // Game functions
    function startGame() {
        if (gameActive) {
            return;
        }
        
        try {
            // Reset game state
            gameActive = true;
            score = 0;
            hits = 0;
            misses = 0;
            timeLeft = 30;
            waterLevel = 100;
            
            // Update UI
            scoreDisplay.textContent = score;
            timeLeftDisplay.textContent = timeLeft;
            hitsDisplay.textContent = hits;
            missesDisplay.textContent = misses;
            waterFill.style.transform = `scaleX(${waterLevel / 100})`;
            gameMessage.textContent = 'Łap postacie i oblewaj je wodą!';
            
            // Clear previous targets if any
            gameField.innerHTML = '';
            
            // Start spawning targets
            targetInterval = setInterval(function() {
                try {
                    spawnTarget();
                } catch (error) {
                    // Error handling
                }
            }, 1200);
            
            // Start timer
            timerInterval = setInterval(function() {
                try {
                    updateTimer();
                } catch (error) {
                    // Error handling
                }
            }, 1000);
            
            // Set game duration
            gameInterval = setTimeout(function() {
                try {
                    endGame();
                } catch (error) {
                    // Error handling
                }
            }, 30000);
        } catch (error) {
            gameActive = false;
            gameMessage.textContent = 'Błąd podczas uruchamiania gry: ' + error.message;
        }
    }

    function updateTimer() {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
        }
    }

    function spawnTarget() {
        if (!gameActive) {
            return;
        }
        
        try {
            // Create character element
            const character = document.createElement('div');
            character.className = 'game-character';
            
            // Use max possible character size from CSS clamp() for boundary calculation
            const charMaxWidth = 60; 
            const charMaxHeight = 90;
            const maxX = gameField.clientWidth - charMaxWidth; 
            const maxY = gameField.clientHeight - charMaxHeight; 
            
            if (maxX <= 0 || maxY <= 0) {
                console.warn("Game field too small to spawn target."); // Added warning
                return; 
            }
            
            const randomX = Math.floor(Math.random() * maxX);
            const randomY = Math.floor(Math.random() * maxY);
            
            // Set position
            character.style.left = `${randomX}px`;
            character.style.top = `${randomY}px`;
            
            // Store the spawn time for this target
            lastTargetSpawnTime = Date.now();
            character.dataset.spawnTime = lastTargetSpawnTime;
            
            // Add click event
            character.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent bubbling to game field
                try {
                    handleHit(character, e);
                } catch (error) {
                    // Error handling
                    console.error('Error in handleHit:', error); // Added console error
                }
            });
            
            // Add to game field
            gameField.appendChild(character);
            
            // Auto-remove after some time
            setTimeout(() => {
                // Check if character still exists before removing
                if (character.parentNode === gameField) { 
                    gameField.removeChild(character);
                }
            }, 2000); // Character lifespan
        } catch (error) {
            // Error handling
            console.error('Error in spawnTarget:', error); // Added console error
        }
    }

    function handleHit(character, event) {
        if (!gameActive) {
            return;
        }
        
        try {
            // Remove character
            if (character.parentNode == gameField) {
                gameField.removeChild(character);
            }
            
            // Create water splash effect
            createWaterSplash(event.clientX, event.clientY);
            
            // Calculate time since target spawn
            const spawnTime = parseInt(character.dataset.spawnTime) || Date.now();
            const currentTime = Date.now();
            const timeSinceSpawn = currentTime - spawnTime;
            
            // Kahoot-style scoring: Start with maximum points and decrease over time
            // Maximum points: 100, minimum points: 10
            const maxPoints = 100;
            const minPoints = 10;
            // Calculate percentage of time elapsed (2000ms is the total time before character disappears)
            const timePercentage = Math.min(1, timeSinceSpawn / 2000);
            // Calculate points using a non-linear decay (similar to Kahoot)
            const pointsToAdd = Math.round(maxPoints - (maxPoints - minPoints) * (timePercentage * timePercentage));
            
            // Update score and stats
            score += pointsToAdd;
            hits++;
            scoreDisplay.textContent = score;
            hitsDisplay.textContent = hits;
            
            // Show points added with color based on timing (like Kahoot)
            showPointsAdded(event.clientX, event.clientY, pointsToAdd, timePercentage);
            
            // Decrease water level slightly
            waterLevel = Math.max(0, waterLevel - 2);
            waterFill.style.transform = `scaleX(${waterLevel / 100})`;
            
            // Check if water is depleted
            if (waterLevel <= 0) {
                endGame();
            }
        } catch (error) {
            // Error handling
        }
    }
    
    // Function to show points added with color coding
    function showPointsAdded(x, y, points, timePercentage) {
        try {
            // Create points element
            const pointsElement = document.createElement('div');
            pointsElement.className = 'points-added';
            pointsElement.textContent = `+${points}`;
            
            // Color based on timing (like Kahoot)
            if (timePercentage < 0.2) {
                // Fast response - green/gold
                pointsElement.style.color = '#5ad65a';
                pointsElement.style.fontSize = '24px'; // Bigger text for higher points
            } else if (timePercentage < 0.5) {
                // Medium response - blue
                pointsElement.style.color = '#4a90e2';
                pointsElement.style.fontSize = '22px';
            } else if (timePercentage < 0.8) {
                // Slower response - yellow/orange
                pointsElement.style.color = '#e6a23c';
                pointsElement.style.fontSize = '20px';
            } else {
                // Very slow response - red
                pointsElement.style.color = '#f56c6c';
                pointsElement.style.fontSize = '18px';
            }
            
            // Position relative to game field
            const fieldRect = gameField.getBoundingClientRect();
            
            pointsElement.style.left = `${x - fieldRect.left}px`;
            pointsElement.style.top = `${y - fieldRect.top - 30}px`; // Position above click
            
            // Add to game field
            gameField.appendChild(pointsElement);
            
            // Animate and remove
            setTimeout(() => {
                pointsElement.style.opacity = '0';
                pointsElement.style.transform = 'translateY(-20px)';
            }, 50);
            
            setTimeout(() => {
                if (pointsElement.parentNode == gameField) {
                    gameField.removeChild(pointsElement);
                }
            }, 1000);
        } catch (error) {
            // Error handling
        }
    }

    function handleMiss(event) {
        if (!gameActive) {
            return;
        }
        
        try {
            // Only count as miss if clicking directly on game field (not on characters)
            if (event.target == gameField) {
                // Create water splash effect
                createWaterSplash(event.clientX, event.clientY);
                
                // Update stats
                misses++;
                missesDisplay.textContent = misses;
                
                // Deduct 10 points for each miss (keeping original penalty)
                score = Math.max(0, score - 10); // Prevent negative score
                scoreDisplay.textContent = score;
                
                // Decrease water level more for misses
                waterLevel = Math.max(0, waterLevel - 5);
                waterFill.style.transform = `scaleX(${waterLevel / 100})`;
                
                // Check if water is depleted
                if (waterLevel <= 0) {
                    endGame();
                }
            }
        } catch (error) {
            // Error handling
        }
    }

    function createWaterSplash(x, y) {
        try {
            const splash = document.createElement('div');
            splash.className = 'water-splash';
            
            // Adjust splash size for mobile
            if (window.innerWidth <= 600) {
                splash.style.width = '80px';
                splash.style.height = '80px';
            }
            
            // Position relative to game field
            const fieldRect = gameField.getBoundingClientRect();
            
            splash.style.left = `${x - fieldRect.left - 50}px`; // Center splash (100px width / 2)
            splash.style.top = `${y - fieldRect.top - 50}px`; // Center splash (100px height / 2)
            
            // Add to game field
            gameField.appendChild(splash);
            
            // Remove after animation completes
            setTimeout(() => {
                if (splash.parentNode == gameField) {
                    gameField.removeChild(splash);
                }
            }, 500); // Match animation duration
        } catch (error) {
            // Error handling
        }
    }

    // Add window resize handler to adjust game elements
    window.addEventListener('resize', function() {
        // Adjust water fill display
        if (gameActive) {
            waterFill.style.transform = `scaleX(${waterLevel / 100})`;
        }
    });

    function endGame() {
        try {
            gameActive = false;
            
            // Stop all intervals and timeouts
            clearInterval(targetInterval);
            clearInterval(timerInterval);
            clearTimeout(gameInterval);
            
            // Show game over message
            let message = '';
            if (waterLevel <= 0) {
                message = `Koniec wody! Twój wynik: ${score}`;
            } else {
                message = `Koniec czasu! Twój wynik: ${score}`;
            }
            
            gameMessage.textContent = message;
            
            // Add restart instructions
            setTimeout(() => {
                gameMessage.textContent += ' Kliknij lub naciśnij spację, aby zagrać ponownie.';
            }, 2000);
            
            // Optional: clear remaining targets
            setTimeout(() => {
                gameField.innerHTML = '';
            }, 1000);
        } catch (error) {
            // Error handling
        }
    }
});

// Log when the script is first loaded (outside DOMContentLoaded)
console.log('Skrypt Lany Poniedziałek został załadowany');
