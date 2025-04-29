document.addEventListener('DOMContentLoaded', function() {
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
        return;
    }
    
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
    let lastTargetSpawnTime = 0;

    const gameField = document.getElementById('game-field');
    const scoreDisplay = document.getElementById('score');
    const gameMessage = document.getElementById('game-message');
    const timeLeftDisplay = document.getElementById('time-left');
    const hitsDisplay = document.getElementById('hits');
    const missesDisplay = document.getElementById('misses');
    const waterFill = document.getElementById('water-fill');
    
    gameMessage.textContent = 'Kliknij gdziekolwiek lub naciśnij spację, aby rozpocząć.';
    
    try {
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
    }
    
    try {
        gameField.addEventListener('click', function(e) {
            if (gameActive) {
                try {
                    handleMiss(e);
                } catch (error) {
                }
            }
        });
    } catch (error) {
    }

    gameField.addEventListener('click', function(e) {
        if (!gameActive && !countdownActive) {
            try {
                startCountdown();
            } catch (error) {
                alert('Błąd podczas rozpoczynania odliczania: ' + error.message);
            }
        }
    });

    function startCountdown() {
        if (gameActive || countdownActive) return;
        
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

    function startGame() {
        if (gameActive) {
            return;
        }
        
        try {
            gameActive = true;
            score = 0;
            hits = 0;
            misses = 0;
            timeLeft = 30;
            waterLevel = 100;
            
            scoreDisplay.textContent = score;
            timeLeftDisplay.textContent = timeLeft;
            hitsDisplay.textContent = hits;
            missesDisplay.textContent = misses;
            waterFill.style.transform = `scaleX(${waterLevel / 100})`;
            gameMessage.textContent = 'Łap postacie i oblewaj je wodą!';
            
            gameField.innerHTML = '';
            
            targetInterval = setInterval(function() {
                try {
                    spawnTarget();
                } catch (error) {
                }
            }, 1200);
            
            timerInterval = setInterval(function() {
                try {
                    updateTimer();
                } catch (error) {
                }
            }, 1000);
            
            gameInterval = setTimeout(function() {
                try {
                    endGame();
                } catch (error) {
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
            const character = document.createElement('div');
            character.className = 'game-character';
            
            const charMaxWidth = 60; 
            const charMaxHeight = 90;
            const maxX = gameField.clientWidth - charMaxWidth; 
            const maxY = gameField.clientHeight - charMaxHeight; 
            
            if (maxX <= 0 || maxY <= 0) {
                console.warn("Game field too small to spawn target.");
                return; 
            }
            
            const randomX = Math.floor(Math.random() * maxX);
            const randomY = Math.floor(Math.random() * maxY);
            
            character.style.left = `${randomX}px`;
            character.style.top = `${randomY}px`;
            
            lastTargetSpawnTime = Date.now();
            character.dataset.spawnTime = lastTargetSpawnTime;
            
            character.addEventListener('click', (e) => {
                e.stopPropagation();
                try {
                    handleHit(character, e);
                } catch (error) {
                    console.error('Error in handleHit:', error);
                }
            });
            
            gameField.appendChild(character);
            
            setTimeout(() => {
                if (character.parentNode === gameField) { 
                    gameField.removeChild(character);
                }
            }, 2000);
        } catch (error) {
            console.error('Error in spawnTarget:', error);
        }
    }

    function handleHit(character, event) {
        if (!gameActive) {
            return;
        }
        
        try {
            if (character.parentNode == gameField) {
                gameField.removeChild(character);
            }
            
            createWaterSplash(event.clientX, event.clientY);
            
            const spawnTime = parseInt(character.dataset.spawnTime) || Date.now();
            const currentTime = Date.now();
            const timeSinceSpawn = currentTime - spawnTime;
            
            const maxPoints = 100;
            const minPoints = 10;
            const timePercentage = Math.min(1, timeSinceSpawn / 2000);
            const pointsToAdd = Math.round(maxPoints - (maxPoints - minPoints) * (timePercentage * timePercentage));
            
            score += pointsToAdd;
            hits++;
            scoreDisplay.textContent = score;
            hitsDisplay.textContent = hits;
            
            showPointsAdded(event.clientX, event.clientY, pointsToAdd, timePercentage);
            
            waterLevel = Math.max(0, waterLevel - 2);
            waterFill.style.transform = `scaleX(${waterLevel / 100})`;
            
            if (waterLevel <= 0) {
                endGame();
            }
        } catch (error) {
        }
    }
    
    function showPointsAdded(x, y, points, timePercentage) {
        try {
            const pointsElement = document.createElement('div');
            pointsElement.className = 'points-added';
            pointsElement.textContent = `+${points}`;
            
            if (timePercentage < 0.2) {
                pointsElement.style.color = '#5ad65a';
                pointsElement.style.fontSize = '24px';
            } else if (timePercentage < 0.5) {
                pointsElement.style.color = '#4a90e2';
                pointsElement.style.fontSize = '22px';
            } else if (timePercentage < 0.8) {
                pointsElement.style.color = '#e6a23c';
                pointsElement.style.fontSize = '20px';
            } else {
                pointsElement.style.color = '#f56c6c';
                pointsElement.style.fontSize = '18px';
            }
            
            const fieldRect = gameField.getBoundingClientRect();
            
            pointsElement.style.left = `${x - fieldRect.left}px`;
            pointsElement.style.top = `${y - fieldRect.top - 30}px`;
            
            gameField.appendChild(pointsElement);
            
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
        }
    }

    function handleMiss(event) {
        if (!gameActive) {
            return;
        }
        
        try {
            if (event.target == gameField) {
                createWaterSplash(event.clientX, event.clientY);
                
                misses++;
                missesDisplay.textContent = misses;
                
                score = Math.max(0, score - 10);
                scoreDisplay.textContent = score;
                
                waterLevel = Math.max(0, waterLevel - 5);
                waterFill.style.transform = `scaleX(${waterLevel / 100})`;
                
                if (waterLevel <= 0) {
                    endGame();
                }
            }
        } catch (error) {
        }
    }

    function createWaterSplash(x, y) {
        try {
            const splash = document.createElement('div');
            splash.className = 'water-splash';
            
            if (window.innerWidth <= 600) {
                splash.style.width = '80px';
                splash.style.height = '80px';
            }
            
            const fieldRect = gameField.getBoundingClientRect();
            
            splash.style.left = `${x - fieldRect.left - 50}px`;
            splash.style.top = `${y - fieldRect.top - 50}px`;
            
            gameField.appendChild(splash);
            
            setTimeout(() => {
                if (splash.parentNode == gameField) {
                    gameField.removeChild(splash);
                }
            }, 500);
        } catch (error) {
        }
    }

    window.addEventListener('resize', function() {
        if (gameActive) {
            waterFill.style.transform = `scaleX(${waterLevel / 100})`;
        }
    });

    function endGame() {
        try {
            gameActive = false;
            
            clearInterval(targetInterval);
            clearInterval(timerInterval);
            clearTimeout(gameInterval);
            
            let message = '';
            if (waterLevel <= 0) {
                message = `Koniec wody! Twój wynik: ${score}`;
            } else {
                message = `Koniec czasu! Twój wynik: ${score}`;
            }
            
            gameMessage.textContent = message;
            
            setTimeout(() => {
                gameMessage.textContent += ' Kliknij lub naciśnij spację, aby zagrać ponownie.';
            }, 2000);
            
            setTimeout(() => {
                gameField.innerHTML = '';
            }, 1000);
        } catch (error) {
        }
    }
});

console.log('Skrypt Lany Poniedziałek został załadowany'); 