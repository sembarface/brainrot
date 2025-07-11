// Конфигурация игры
const gameConfig = {
    backgroundImage: "assets/images/back.jpg",
    debug: true,
    roundTime: 10, // 10 секунд на раунд
    musicDuration: 6000, // 6 секунд музыки персонажа
    allOptions: ["Bobrito Bandito", "Tralalero Tralala", "Tung Tung Sahur",
     "Bombardiro Crocodilo", "Lirilì Larilà", "Brr Brr Patapim", "Trippi Troppi",
      "Boneca Ambalabu", "Chimpanzini Bananini", "Bombombini Gusini","Cappuccino Assassino","Frigo Camelo",
    "Ballerina Cappuccina","Trulimero Trulicina","Girafa Celestre","Fruli Frula","Brri Brri Bicus Dicus Bombicus",
    "Glorbo Fruttodrillo","Orangutini Ananasini","Svinino Bombondino","Burbaloni Lulilolli"], // Общий массив вариантов
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
        },
        {
            name: "Cappuccino Assassino",
            image: "assets/images/cap.jpg",
            music: "assets/sounds/cap.mp3",
            blur: 10
        },
        {
            name: "Frigo Camelo",
            image: "assets/images/frigo.jpg",
            music: "assets/sounds/frigo.mp3",
            blur: 10
        },
        {
            name: "Ballerina Cappuccina",
            image: "assets/images/ballerina.jpg",
            music: "assets/sounds/ballerina.mp3",
            blur: 10
        },
        {
            name: "Trulimero Trulicina",
            image: "assets/images/truli.jpg",
            music: "assets/sounds/truli.mp3",
            blur: 10
        },
        {
            name: "Girafa Celestre",
            image: "assets/images/girafa.jpg",
            music: "assets/sounds/girafa.mp3",
            blur: 10
        },
        {
            name: "Fruli Frula",
            image: "assets/images/fruli.jpg",
            music: "assets/sounds/fruli.mp3",
            blur: 10
        },
        {
            name: "Brri Brri Bicus Dicus Bombicus",
            image: "assets/images/bicus.jpg",
            music: "assets/sounds/bicus.mp3",
            blur: 10
        },
        {
            name: "Glorbo Fruttodrillo",
            image: "assets/images/glorbo.jpg",
            music: "assets/sounds/glorbo.mp3",
            blur: 10
        },
        {
            name: "Orangutini Ananasini",
            image: "assets/images/orang.jpg",
            music: "assets/sounds/orang.mp3",
            blur: 10
        },
        {
            name: "Burbaloni Lulilolli",
            image: "assets/images/burbal.jpg",
            music: "assets/sounds/burbal.mp3",
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
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimer(timeLeft);
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            timer = null;
            handleTimeOut(); // Новая функция для обработки тайм-аута
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
        handleWrongAnswer(selected);
    }
}

function handleWrongAnswer(selected) {
    // Подсвечиваем ответы
    const buttons = document.querySelectorAll('#options-container button');
    buttons.forEach(btn => {
        if (btn.textContent === selected) {
            btn.classList.add('wrong-answer');
        }
        if (btn.textContent === currentCharacter.name) {
            btn.classList.add('correct-answer');
        }
        btn.disabled = true;
    });

    // Показываем оригинальное изображение
    document.getElementById('character-image').style.filter = 'none';
    
    // Отключаем возможность пропуска
    allowSkip = false;
    
    // Показываем окно проигрыша через 1.5 секунды
    setTimeout(() => {
        showEndScreen();
    }, 800);
}
function handleTimeOut() {
    // Подсвечиваем правильный ответ
    const buttons = document.querySelectorAll('#options-container button');
    buttons.forEach(btn => {
        if (btn.textContent === currentCharacter.name) {
            btn.classList.add('correct-answer');
        }
        btn.disabled = true;
    });

    // Показываем оригинальное изображение
    document.getElementById('character-image').style.filter = 'none';
    
    // Завершаем игру через 1.5 секунды
    setTimeout(() => {
        showEndScreen();
    }, 800);
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


function showEndScreen() {
    playSound(gameConfig.sounds.wrong);
    
    // Создаем оверлей для экрана завершения
    const endScreen = document.getElementById('end-screen');
    endScreen.style.position = 'fixed';
    endScreen.style.top = '0';
    endScreen.style.left = '0';
    endScreen.style.width = '100%';
    endScreen.style.height = '100%';
    endScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    endScreen.style.display = 'flex';
    endScreen.style.flexDirection = 'column';
    endScreen.style.justifyContent = 'center';
    endScreen.style.alignItems = 'center';
    endScreen.style.zIndex = '1000';
    
    // Центрируем содержимое
    const endContent = endScreen.querySelector('.end-content');
    endContent.style.backgroundColor = '#EEE';
    endContent.style.padding = '30px';
    endContent.style.borderRadius = '15px';
    endContent.style.textAlign = 'center';
    endContent.style.maxWidth = '500px';
    endContent.style.width = '90%';
    
    document.getElementById('final-score').textContent = `Ваш счёт: ${score}`;
    endScreen.classList.remove('hidden');
    
}



function resetGame() {
    clearTimers();
    
    // Восстанавливаем стандартные стили экрана завершения
    const endScreen = document.getElementById('end-screen');
    endScreen.style = '';
    endScreen.classList.add('hidden');
    
    // Убираем подсветку с кнопок
    const buttons = document.querySelectorAll('#options-container button');
    buttons.forEach(btn => {
        btn.classList.remove('correct-answer', 'wrong-answer');
        btn.disabled = false;
    });
    
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