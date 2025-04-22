// Инициализация SDK Яндекс Игр
/*YaGames
    .init()
    .then(ysdk => {
        window.ysdk = ysdk;
        console.log('Yandex SDK initialized');
        
        // Показываем рекламу при загрузке (по желанию)
        ysdk.adv.showFullscreenAdv();
        
        // Инициализация игры после загрузки SDK
        if (typeof initGame === 'function') {
            initGame();
        }
    })
    .catch(error => {
        console.error('Failed to initialize Yandex SDK:', error);
        // Запускаем игру даже если SDK не загрузился
        if (typeof initGame === 'function') {
            initGame();
        }
    });*/

// Фейковый SDK для локальной разработки
window.ysdk = {
    adv: {
        showFullscreenAdv: () => console.log('Ad simulation'),
        showRewardedVideo: () => Promise.resolve()
    },
    sound: {
        play: (src) => new Audio(src).play()
    },
    leaderboards: {
        setLeaderboardScore: (name, score) => console.log(`Leaderboard ${name}: ${score}`)
    }
};

// Инициализируем игру сразу
if (typeof initGame === 'function') {
    initGame();
}