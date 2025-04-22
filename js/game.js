// Конфигурация игры
const gameConfig = {
    backgroundImage: "assets/images/back.jpg",
    debug: true,
    roundTime: 10, // 10 секунд на раунд
    musicDuration: 6000, // 5 секунд музыки персонажа
    allOptions: ["Bobrito Bandito", "Tralalero Tralala", "Tung Tung Sahur",
     "Bombardiro Crocodilo", "Lirilì Larilà", "Brr Brr Patapim", "Trippi Troppi",
      "Boneca Ambalabu", "Chimpanzini Bananini", "Bombombini Gusini"], // Общий массив вариантов
    sounds: {
        correct: "assets/sounds/correct.mp3",
        wrong: "assets/sounds/wrong.mp3"
    },
    characters: [
        {
            name: "Bobrito Bandito",
            image: "assets/images/bobrito.jpg",
            music: "assets/sounds/bobrito.mp3",
            blur: 10
        },
        {
            name: "Tralalero Tralala",
            image: "assets/images/tralala.jpg",
            music: "assets/sounds/tralala.mp3",
            blur: 10
        },
        {
            name: "Bombardiro Crocodilo",
            image: "assets/images/crocodil.jpg",
            music: "assets/sounds/crocodil.mp3",
            blur: 10
        },
        {
            name: "Tung Tung Sahur",
            image: "assets/images/tuntun.jpg",
            music: "assets/sounds/tuntun.mp3",
            blur: 10
        },
        {
            name: "Brr Brr Patapim",
            image: "assets/images/patapim.jpg",
            music: "assets/sounds/patapim.mp3",
            blur: 10
        }
        ,
        {
            name: "Trippi Troppi",
            image: "assets/images/tripi.jpg",
            music: "assets/sounds/tripi.mp3",
            blur: 10
        },
        {
            name: "Boneca Ambalabu",
            image: "assets/images/boneka.jpg",
            music: "assets/sounds/boneka.mp3",
            blur: 10
        },
        {
            name: "Chimpanzini Bananini",
            image: "assets/images/chimp.jpg",
            music: "assets/sounds/chimp.mp3",
            blur: 10
        },
        {
            name: "Bombombini Gusini",
            image: "assets/images/gus.jpg",
            music: "assets/sounds/gus.mp3",
            blur: 10
        },
        {
            name: "Lirilì Larilà",
            image: "assets/images/liri.jpg",
            music: "assets/sounds/liri.mp3",
            blur: 10
        }

    ]
};

// Состояние игры
let currentCharacter = null;
let previousCharacter = null;
let score = 0;
let timer = null;
let musicTimer = null;
let currentAudio = null;
let allowSkip = false;

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log("Игра загружена!");
    
    document.getElementById('start-button').onclick = startGame;
    document.getElementById('restart-button').onclick = resetGame;
    
    // Обработчик клика для пропуска музыки
    document.addEventListener('click', function() {
        if (allowSkip && musicTimer) {
            skipMusic();
        }
    });
    
    preloadAssets();
});

function skipMusic() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    clearTimeout(musicTimer);
    allowSkip = false;
    startNewRound();
}

function preloadAssets() {
    gameConfig.characters.forEach(char => {
        new Image().src = char.image;
    });
    
    [gameConfig.sounds.correct, gameConfig.sounds.wrong].forEach(sound => {
        new Audio(sound).load();
    });
}

function startGame() {
    console.log("Игра начата!");
    switchScreen('game');
    score = 0;
    updateScore();
    startNewRound();
}

function startNewRound() {
    // Разблокируем кнопки
    const buttons = document.querySelectorAll('#options-container button');
    buttons.forEach(btn => {
        btn.disabled = false;
    });
    clearTimers();
    allowSkip = false;
    
    // Выбор персонажа (исключая предыдущего)
    let availableChars = gameConfig.characters.filter(
        char => char !== previousCharacter
    );
    
    if (availableChars.length === 0) {
        availableChars = [...gameConfig.characters];
    }
    
    currentCharacter = availableChars[
        Math.floor(Math.random() * availableChars.length)
    ];
    previousCharacter = currentCharacter;
    
    console.log("Персонаж:", currentCharacter.name);
    
    const img = document.getElementById('character-image');
    img.onload = function() {
        img.style.filter = `blur(${currentCharacter.blur}px)`;
        createOptions();
        startTimer();
    };
    img.onerror = function() {
        console.error("Ошибка загрузки изображения");
        alert("Ошибка загрузки: " + currentCharacter.image);
    };
    img.src = currentCharacter.image;
}

function createOptions() {
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    
    let options = [currentCharacter.name];
    const wrongOptions = gameConfig.allOptions.filter(
        name => name !== currentCharacter.name
    );
    
    while (options.length < 4 && wrongOptions.length > 0) {
        const randomIndex = Math.floor(Math.random() * wrongOptions.length);
        options.push(wrongOptions[randomIndex]);
        wrongOptions.splice(randomIndex, 1);
    }
    
    options = shuffleArray(options);
    
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.onclick = function() {
            checkAnswer(option);
        };
        container.appendChild(btn);
    });
}

function startTimer() {
    let timeLeft = gameConfig.roundTime;
    updateTimer(timeLeft);
    
    timer = setInterval(function() {
        timeLeft--;
        updateTimer(timeLeft);
        
        if (timeLeft <= 0) {
            timeOut();
        }
    }, 1000);
}

function checkAnswer(selected) {
    clearInterval(timer);
    timer = null;
    
    const isCorrect = selected === currentCharacter.name;
    
    if (isCorrect) {
        handleCorrectAnswer();
    } else {
        endGame();
    }
}

function handleCorrectAnswer() {
    score += 10;
    updateScore();
    // Блокируем кнопки
    const buttons = document.querySelectorAll('#options-container button');
    buttons.forEach(btn => {
        btn.disabled = true;
    });

    // Подсвечиваем правильный ответ
    buttons.forEach(btn => {
        if (btn.textContent === currentCharacter.name) {
            btn.classList.add('correct-answer');
        }
    });

    
    document.getElementById('character-image').style.filter = 'none';
    
    // Воспроизведение музыки
    currentAudio = new Audio(currentCharacter.music);
    currentAudio.play().catch(e => console.error("Ошибка звука:", e));
    
    // Разрешаем пропуск через 1 секунду
    setTimeout(() => {
        allowSkip = true;
    }, 1000);
    
    // Автоматический переход через 5 секунд
    musicTimer = setTimeout(() => {
        skipMusic();
    }, gameConfig.musicDuration);
}

function timeOut() {
    clearInterval(timer);
    timer = null;
    endGame();
}

function endGame() {
    playSound(gameConfig.sounds.wrong);
    switchScreen('end');
    document.getElementById('final-score').textContent = `Ваш счёт: ${score}`;
}

function resetGame() {
    clearTimers();
    switchScreen('start');
}

function clearTimers() {
    if (timer) clearInterval(timer);
    if (musicTimer) clearTimeout(musicTimer);
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    timer = null;
    musicTimer = null;
    allowSkip = false;
}

function playSound(soundFile) {
    try {
        const audio = new Audio(soundFile);
        audio.play().catch(e => console.error("Ошибка звука:", e));
    } catch(e) {
        console.error("Ошибка создания аудио:", e);
    }
}

function switchScreen(screen) {
    document.querySelectorAll('.screen').forEach(el => {
        el.classList.add('hidden');
    });
    document.getElementById(`${screen}-screen`).classList.remove('hidden');
}

function updateScore() {
    document.getElementById('score').textContent = `Очки: ${score}`;
}

function updateTimer(seconds) {
    document.getElementById('timer').textContent = `Время: ${seconds}`;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}