try {
var gameActive = false;
var pen = document.querySelector("#pen");
var fruit = document.querySelector("#fruit");
var score = document.querySelector("#score");
var high = document.querySelector("#high");
var livesDisplay = document.querySelector("#lives");
var shader = document.querySelector("#shader");
var notification = document.querySelector("#notification");
var titleHigh = document.querySelector("#title-high");
var title = document.querySelector(".home");
var volume = document.querySelector("#volume");
var volumeMenu = document.querySelector(".volumeMenu");
var musicSlider = document.querySelector("#music");
var sfxSlider = document.querySelector("#sfx");
var musicOverdriveSlider = document.querySelector("#musicOverdrive");
var sfxOverdriveSlider = document.querySelector("#sfxOverdrive");
var volumeBack = document.querySelector(".volumeMenu .back");
var title2 = document.querySelector(".home-title");
var fpsDisplay = document.querySelector("#fps");
var settingsButton = document.querySelector("#settings");
var settingsMenu = document.querySelector(".settingsMenu");
var settingsBack = document.querySelector(".settingsMenu .back");
var settingsTheme = document.querySelector(".settingsMenu #theme");
var settingsResetTheme = document.querySelector(".settingsMenu #resetTheme");
var background = document.querySelector(".background");
var shopButton = document.querySelector("#shop");
var shopMenu = document.querySelector(".shopMenu");
var shopBack = document.querySelector(".shopMenu .back");
var pauseButton = document.querySelector("#pause");
var pauseMenu = document.querySelector(".pauseMenu");
var pauseBack = document.querySelector(".pauseMenu .back");
var pauseExit = document.querySelector(".pauseMenu .exit");
var loadingBar = document.querySelector("#loadbar");
var movingRight = false;
var defaultFruitTypes = [{name: "Apple", color: "lime",width: 60, height: 60, borderRadius: 60}, {name: "Pineapple", color: "yellow", width: 60, height: 80, borderRadius: 60}];
var fruitTypes = defaultFruitTypes;
var timeSinceLastFrame = null;
var gamePaused = false;
var menuOpen = true;
var devmode = false;
var fruitSpeed = 2;
var fruitPos = 125;
var fruitTop = 100;
var fruitType = 0;
var fruitMove = 0;
var curTop = 100;
var lives = 3;
var loop = 0;
var criticalHistory = [null, null, 0];
var assetRequests = [];
var version = "1.4";
var themes = {
}
var pens = {
}
var penList = ["apocalipse", "baseball_bat", "bat", "battery", "bell", "boxing_glove", "candy", "canon", "cat", "celt", "chain", "chess", "chest", "cloud", "coin", "compass", "creepy_tree", "cross", "cupcake", "default", "dino", "dolar", "elf", "elnias", "fish", "flower", "flute", "fmale", "gera", "ghost", "golden_skull", "grave", "guy", "hand", "hart", "hippy", "hook", "hot_dog", "key", "keys", "lamps", "light_bulb", "lightning", "male", "map", "match", "monster", "moon", "mortal", "mummy", "north_star", "note", "padlock", "parot", "pen_chemistry", "pen_cola", "pen_flamingo", "pen_gems", "pen_hammer", "pen_multi", "pen_octo", "pen_saturn", "pen_torch", "plane", "pren_shroom", "present", "pumpkin", "questionmark", "race_car", "rad", "recikle", "ribbon", "rose", "sand_clock", "santa", "scull", "scullliquid", "sea_shell", "shark", "ship", "slingshot", "snowflake", "snowman", "spider", "spring", "sun", "tooth", "tower", "tox", "toy", "tree", "tree_bark", "ufo", "wheel", "wifi", "witch", "zombie"];
var currentPen = "classic";
retreiveFromStorage("high", function(e) {
    if(!e) {
        saveToStorage("high", 0, function() {
            titleHigh.innerHTML = 0;
        });
    }else{
        titleHigh.innerHTML = e;
    }
});
retreiveFromStorage("dev", function(e) {
    if(e && e != "false") {
        devmode = true;
        settingsButton.style.display = "block";
    }
});
window.addEventListener("touchstart", clickHandler);
window.addEventListener("mousedown", clickHandler);
    window.addEventListener("keydown", function(e) {keyHandler(e);key = e.keyCode ? e.keyCode : e.which;if(key == 13 || key == 32 || key == 38) clickHandler()});
volume.addEventListener("touchstart", openVolumeMenu);
volume.addEventListener("mousedown", openVolumeMenu);
settingsButton.addEventListener("touchstart", openSettingsMenu);
settingsButton.addEventListener("mousedown", openSettingsMenu);
settingsTheme.addEventListener("click", changeTheme);
settingsTheme.addEventListener("touchstart", function(e) {e.preventDefault();changeTheme(e)});
settingsResetTheme.addEventListener("click", resetTheme);
settingsResetTheme.addEventListener("touchstart", function(e) {e.preventDefault();resetTheme(e)});
shopButton.addEventListener("touchstart", openShop);
shopButton.addEventListener("mousedown", openShop);
pauseButton.addEventListener("touchstart", openPauseMenu);
pauseButton.addEventListener("mousedown", openPauseMenu);
volumeBack.addEventListener("touchstart", closeVolumeMenu);
volumeBack.addEventListener("mousedown", closeVolumeMenu);
settingsBack.addEventListener("touchstart", closeSettingsMenu);
settingsBack.addEventListener("mousedown", closeSettingsMenu);
shopBack.addEventListener("touchstart", closeShop);
shopBack.addEventListener("mousedown", closeShop);
pauseBack.addEventListener("touchstart", closePauseMenu);
pauseBack.addEventListener("mousedown", closePauseMenu);
musicSlider.addEventListener("input", function() {changeMusicVolume(musicSlider.value)});
musicSlider.addEventListener("change", function() {previewBackgroundMusic()});
sfxSlider.addEventListener("input", function() {changeSFXVolume(sfxSlider.value)});
sfxSlider.addEventListener("change", function() {playSound("Unlock")});
musicOverdriveSlider.addEventListener("input", function() {changeMusicVolume(musicOverdriveSlider.value)});
musicOverdriveSlider.addEventListener("change", function() {previewBackgroundMusic()});
sfxOverdriveSlider.addEventListener("input", function() {changeSFXVolume(sfxOverdriveSlider.value)});
sfxOverdriveSlider.addEventListener("change", function() {playSound("Unlock")});
pauseExit.addEventListener("touchstart", quitGame);
pauseExit.addEventListener("mousedown", quitGame);
var keysPressed = [];
var keySequences = {
    devmode: ["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowDown", "s", "d", "s", "d", "1", "3", "5", "3", "d", "d", "s", "d"]
}
var keySequenceHandlers = {
    devmode: devmodeHandler
}
var keyTimeout = 5000;
function keyHandler(e) {
    var key = e.key;
    var maxKeyBufferSize = 0;
    for(var i in keySequences) {
        if(keySequences[i].length > maxKeyBufferSize) {
            maxKeyBufferSize = keySequences[i].length - 1;
        }
    }
    if(keysPressed.length > maxKeyBufferSize) {
        keysPressed.shift();
    }
    keysPressed.push(key);
    for(var i in keySequences) {
        var keySequence = keySequences[i];
        var match = keysPressed.join("&").match(keySequence.join("&"));
        var sequenceMatches = match ? true : false;
        if(match) {
            (keySequenceHandlers[i] || console.log)();
            keysPressed = [];
        }
    }
}
function devmodeHandler() {
    playSound("Unlock");
    popup("Dev mode activated");
    saveToStorage("dev", true);
    devmode = true;
    settingsButton.style.display = "block";
}
function openVolumeMenu() {
    if(gameActive) {
        openPauseMenu();
        return;
    }
    menuOpen = true;
    volumeMenu.style.display = "block";
    volumeMenu.style.opacity = "1";
    playSound("Click");
}
function closeVolumeMenu() {
    volumeMenu.style.display = "none";
    volumeMenu.style.opacity = "0";
    playSound("Click");
    setTimeout(function() {
        menuOpen = false;
    }, 100);
}
function openSettingsMenu() {
    if(gameActive) {
        clickHandler();
        return;
    }
    menuOpen = true;
    settingsMenu.style.display = "block";
    settingsMenu.style.opacity = "1";
    playSound("Click");
}
function closeSettingsMenu() {
    settingsMenu.style.display = "none";
    settingsMenu.style.opacity = "0";
    playSound("Click");
    setTimeout(function() {
        menuOpen = false;
    }, 100);
}
function openShop(e) {
    if(e) e.preventDefault();
    if(gameActive) {
        clickHandler();
        return;
    }
    menuOpen = true;
    shopMenu.style.opacity = 1;
    shopMenu.style.display = "block";
    setTimeout(function() {
        shopMenu.style.top = "0px";
    }, 0);
    playSound("Click");
    setTimeout(function() {
        playSound("Whoosh");
    }, 100);
}
function closeShop(e) {
    if(e) e.preventDefault();
    shopMenu.style.top = "430px";
    setTimeout(function() {
        menuOpen = false;
        shopMenu.scrollTo(0, 0);
        shopMenu.style.display = "none";
        shopMenu.style.opacity = 0;
    }, 1000);
    playSound("Click");
    setTimeout(function() {
        playSound("Whoosh");
    }, 50);
}
function openPauseMenu() {
    if(!gameActive) {
        openVolumeMenu();
        return;
    }
    pauseMenu.style.display = "block";
    pauseMenu.style.opacity = 1;
    menuOpen = true;
    gamePaused = true;
    pause();
    playSound("Click");
}
function closePauseMenu() {
    pauseMenu.style.display = "none";
    pauseMenu.style.opacity = 0;
    resume();
    playSound("Click");
    setTimeout(function() {
        menuOpen = false;
        gamePaused = false;
    }, 100);
}
function quitGame() {
    closePauseMenu();
    stop();
    playSound("GameOver");
}
function changeTheme() {
    requestFile(function(data) {
        loadTheme(data);
    });
}
function loadTheme(theme) {
    var check = checkTheme(theme);
    if(check != true) {
        console.log("Error: " + check.message);
        return;
    }
    theme = theme.split(";");
    var headers = theme.shift().split(" ");
    var assets = theme.join(";");
    var type = headers[0];
    var version = headers[1];
    var name =  unescape(headers[2]);
    var description = headers[3] == "?" ? "" : unescape(headers[3]);
    var assetDetails = JSON.parse(headers[4]);
    resetTheme();
    if(assetDetails.fruitTypes != undefined) {
        fruitTypes = assetDetails.fruitTypes;
    }
    if(assetDetails.backgrounds != undefined) {
        if(assetDetails.backgrounds.game) assetDetails.backgrounds.game = getAsset(assetDetails.backgrounds.game, assets);
        if(assetDetails.backgrounds.home) assetDetails.backgrounds.home = getAsset(assetDetails.backgrounds.home, assets);
        if(assetDetails.backgrounds.volume) assetDetails.backgrounds.volume = getAsset(assetDetails.backgrounds.volume, assets);
        if(assetDetails.backgrounds.settings) assetDetails.backgrounds.settings = getAsset(assetDetails.backgrounds.settings, assets)
        changeBackground(assetDetails.backgrounds.game, assetDetails.backgrounds.home, assetDetails.backgrounds.volume, assetDetails.backgrounds.settings);
    }
    if(typeof assetDetails.flipSettings == "object") {
        if(assetDetails.flipSettings.rotationSpeed != undefined) rotationSpeed = parseFloat(assetDetails.flipSettings.rotationSpeed);
        if(assetDetails.flipSettings.topOfArc != undefined) topOfArc = parseFloat(assetDetails.flipSettings.topOfArc);
        if(assetDetails.flipSettings.xMoveSpeed != undefined) {
            xMoveSpeed = assetDetails.flipSettings.xMoveSpeed;
        autoXMoveSpeed = false;
        }else{
            autoXMoveSpeed = true;
        }
    if(assetDetails.flipSettings.yMoveSpeed != undefined) yMoveSpeed = assetDetails.flipSettings.yMoveSpeed;
    }
    changeFruit(1);
    fruit.style.top = fruitTop = 100;
    fruit.style.left = fruitPos = 125;
    console.log(version, name, description);
    return true;
}
function resetTheme() {
    xMoveSpeed  =-1
    yMoveSpeed = -5;
    autoXMoveSpeed = true;
    fruitTypes = defaultFruitTypes;
    changeFruit(1);
    fruit.style.top = fruitTop = 100;
    fruit.style.left = fruitPos = 125;
    rotationSpeed = 20;
    topOfArc = 30;
    changeBackground("url('./assets/background.png')", "url('./assets/background.png')", "url('./assets/background.png')", "url('./assets/background.png')");
}
function getAsset(data, assets) {
    if(data.match("asset")) {
        var index = data.split("asset[")[1].replace("]", "").split("-");
        var start = parseInt(index[0]) || 0;
        var end = (parseInt(index[1]) || start) + 1;
        var result = "";
        for(i=start;i<end;i++) {
            if(i > assets.length) {
                break;
            }else{
                result += assets[i] || "";
            }
        }
        return result;
    }else{
        return data
    }
}
function checkTheme(data) {
    var version = "1.4";
    var error = {message: "", code: 0};
    var segments = data.split(";");
    if(!segments[0].match("PPAPTheme")) {
        error.message = "That's not a theme, silly!";
        error.code = 0;
        return error;
    }
    if(segments[0].match("PPAPTheme").index != 0) {
        error.message = "That's not a theme, silly!";
        error.code = 0;
        return error;
    }
    if(segments.length < 2) {
        error.message = "No header seperator present";
        error.code = 1;
        return error;
    }
    if(segments.length > 2) {
        error.message = "Only one header seperator allowed";
        error.code = 2;
        return error;
    }
    var headers = segments[0].split(" ");
    if(headers.length > 5) {
        error.message = "Extra data in header";
        error.code = 3;
        return error;
    }
    
    if(headers.length < 5) {
        error.message = "Missing data in header";
        error.code = 4;
        return error;
    }
    if(parseFloat(headers[1]) == NaN) {
        error.message = "Invalid version string";
        error.code = 5;
        return error;
    }
    if(parseFloat(headers[1]) < parseFloat(version)) {
        error.message = "Outdated theme (for v" + headers[1] + ")";
        error.code = 6;
        return error;
    }
    if(parseFloat(headers[1]) > parseFloat(version)) {
        error.message = "Outdated game (for v" + headers[1] + ")";
        error.code = 7;
        return error;
    }
    if(headers[2] == "") {
        error.message = "Empty title";
        error.code = 8;
        return error;
    }
    if(headers[3] == "") {
        error.message = "Empty description";
        error.code = 9;
        return error;
    }
    try {
        var contents = JSON.parse(headers[4]);
    }catch(e) {
        error.message = "Invalid JSON in content list: " + e;
        error.code = 10;
        return error;
    }
    return true;
}
function loadPen(texture) {
    pen.style.background = texture;
    pen.style.backgroundSize = "cover";
    pen.style.width = pens[currentPen].width + "px" || "10px";
    pen.style.height = pens[currentPen].height + "px" || "80px";
}
function selectTheme(theme) {
    loadTheme(themes[theme]);
}
function selectPen(id) {
    currentPen = id;
    loadPen(pens[id].url ? "url('" + pens[id].url + "')" : "red");
    pen.style.backgroundSize = "cover";
    pen.style.width = pens[id].width + "px" || "10px";
    pen.style.height = pens[id].height + "px" || "80px";
    clearInterval(penAnimLoop);
    penAnimLoop = 0;
    if(pens[id].animated) {
        penAnimLoop = setInterval(animatePen, 200);
    }
}
var penAnimLoop = 0;
var penFrame = 0;
function animatePen() {
    penFrame = penFrame == 1 ? 0 : 1;
    loadPen("url('" + pens[currentPen]["frame" + (penFrame + 1)] + "')");
}
function changeBackground(game, home, volume, settings) {
    if(game) background.style.background = game;
    if(home) title.style.background = home;
    if(volume) volumeMenu.style.background = volume;
    if(settings) settingsMenu.style.background = settings;
}
function shootPen() {
if(loop) return;
curTop = 350;
loop = requestAnimationFrame(penLoop);
}
function penLoop() {
loop = requestAnimationFrame(penLoop);
if(curTop < -110) {
cancelAnimationFrame(loop);
loop = false
pen.style.top = curTop = 350;
fail();
}else{
if(loop) {
detectColision({x: 155, y: curTop, width: 10, height: 15}, {x: fruitPos, y: fruitTop, width: fruitTypes[fruitType].width || 60, height: fruitTypes[fruitType].height || 60}, function() {
pen.style.top = 350;
cancelAnimationFrame(loop);
loop = false;
if(autoXMoveSpeed) xMoveSpeed = movingRight ? 1 : -1
flipFruit();
var critical = false;
detectColision({x: 155, y: curTop, width: 10, height: 15}, {x: fruitPos + fruitTypes[fruitType].width / 2, y: fruitTop, width: 2, height: fruitTypes[fruitType].height || 60}, function() {critical = true});
    if(critical) {
    }
win(critical, curTop);
curTop = 350;
});
}
if(loop) {
pen.style.top = curTop = curTop - 20;
}
}
}
function notify(text) {
var fruitPopup = document.createElement("span");
fruitPopup.id = "fruitPopup";
document.body.appendChild(fruitPopup);
fruitPopup.style.opacity = "1";
fruitPopup.innerHTML = text;
fruitPopup.style.transition = "";
fruitPopup.style.top = curTop - 20;
//fruitPopup.style.left = fruitPos + 30;
setTimeout(function() {
fruitPopup.style.transition = "top 2s cubic-bezier(1, 0.10, 0.75, 0.60), opacity 1s linear";
fruitPopup.style.top = 0;
}, 500);
setTimeout(function() {
fruitPopup.style.opacity = "0";
}, 1000);
setTimeout(function() {
document.body.removeChild(fruitPopup);
fruitPopup = null;
}, 2000);
}
function popup(text) {
shader.style.opacity = "1";
shader.style.display = "block";
notification.innerHTML = text;
setTimeout(function() {
shader.style.opacity = "0";
shader.style.display = "none";
}, 1000);
}
function start(resume) {
    gameActive = true;
    gamePaused = false;
    if(!resume) {
        changeFruit(0);
        title.style.opacity = "0";
        title2.style.opacity  = "0";
        score.innerHTML = 0;
        livesDisplay.innerHTML = lives = 3;
    }
    moveLoop();
}
function moveLoop() {
if(fruitPos < 12) movingRight = true;
if(fruitPos > (307 - fruitTypes[fruitType].width)) movingRight = false;
if(movingRight) {
fruit.style.left = fruitPos = fruitPos + fruitSpeed;
}else{
fruit.style.left = fruitPos = fruitPos - fruitSpeed;
}
fruitMove = requestAnimationFrame(moveLoop);
    retreiveFromStorage("high", function(e) {
        high.innerHTML = titleHigh.innerHTML = e;
    });
}
function win(critical) {
playStabSound();
var pointsEarned = 1;
if(critical) {
var data = getCriticalData();
criticalHistory[0] = criticalHistory[1];
criticalHistory[1] = fruitType;
pointsEarned = data.score;
criticalHistory[2] = 1;
if(xor(criticalHistory[0], criticalHistory[1]) && criticalHistory[2] == 1) {
criticalHistory = [null, null, 0];
pointsEarned = pointsEarned * 2;
notify("+" + pointsEarned);
playSound("PPAP");
changeFruit();
if(lives < 3) {
livesDisplay.innerHTML = lives = lives + 1;
}
}else{
playSound(fruitTypes[fruitType].name + "Pen");
notify("+" + pointsEarned);
    changeFruit(!gameStarting ? fruitType : null);
}
}else{
changeFruit();
criticalHistory = [null, null, 0];
notify("+1");
}
var i = 0;
var addScore = setInterval(function() {
if(i > pointsEarned - 2) {
clearInterval(addScore);
}
updateScore(true);
i++;
    retreiveFromStorage("high", function(e) {
        highScore = new Number(e);
        if(new Number(score.innerHTML) > highScore) {
            high.innerHTML = titleHigh.innerHTML = score.innerHTML;
            saveToStorage("high", high.innerHTML);
        }
    });
}, 100);
if(gameStarting) {
gameStarting = false;
start();
}
}
function fail() {
var scoreVal = updateScore(false);
lives--;
criticalHistory = [null, null, 0]
livesDisplay.innerHTML = lives;
notify("-1");
if(lives < 1 || scoreVal < 1) {
gameOver();
}
}
function updateScore(hit) {
var scoreVal = 0;
if(hit == true) {
score.innerHTML = scoreVal = new Number(score.innerHTML) + 1;
}else if(hit == false) {
score.innerHTML = scoreVal = new Number(score.innerHTML) - 1;
}
return scoreVal;
}
function setScore(value) {
    score.innerHTML = scoreVal = value;
}
function changeFruit(lastFruit) {
fruitPos = 300;
fruit.style.left = fruitPos;
movingRight = false;
fruitTop = fruit.style.top = random(15, 300 - fruitTypes[fruitType].height);
if(typeof lastFruit == "number") {
if(lastFruit == 0) {
fruitType = 1;
}else if(lastFruit == 1) {
fruitType = 0;
}
}else{
fruitType = random(0, fruitTypes.length - 1);
}
fruit.style.background = fruitTypes[fruitType].color;
fruit.style.width = fruitTypes[fruitType].width;
fruit.style.height = fruitTypes[fruitType].height;
fruit.style.borderRadius = (fruitTypes[fruitType].borderRadius || 60) + "px";
fruitSpeed = (random(22, 36) / 10) + 2;
}
function random(min, max) {
return Math.floor(Math.random() * (max - min + 1) + min);
}
function detectColision(rect1, rect2, callback) {
if (rect1.x < rect2.x + rect2.width &&
rect1.x + rect1.width > rect2.x &&
rect1.y < rect2.y + rect2.height &&
rect1.height + rect1.y > rect2.y) {
if(callback) {
callback(true);
}
return true;
}
return false;
}
function getCriticalData() {
var data = {};
data.message = fruitTypes[fruitType].name + " Pen";
var offcenter = Math.abs(150 - fruitPos);
var penoffcenter = Math.abs(fruitPos + 30);
var scoreDifficulty = (offcenter / 150) + (fruitSpeed * 20 - 2) + (Math.abs((fruitTop / 10) - 240) - 200);
data.scoreDifficulty = Math.floor(scoreDifficulty);
data.score = Math.floor(scoreDifficulty / 10);
return data;
}
function gameOver() {
notify("GAME OVER!");
stop();
playSound("GameOver");
}
function xor(x, y) {
if(x == null || y == null) {
return false;
}
if(x != y) {
return true;
}
return false;
}
function stop(pause) {
    if(!gameActive && !gamePaused) return;
    cancelAnimationFrame(fruitMove);
    gameActive = false;
    gamePaused = false;
    if(!pause) {
        fruit.style.top = 100;
        changeFruit(1);
        fruit.style.top = fruitTop = 100;
        fruit.style.left = fruitPos = 160 - fruitTypes[fruitType].width / 2;
        title.style.opacity = "1";
        title2.style.opacity = "1";
    }
    stopBackgroundMusic();
}
function pause() {
    stop(true);
    gamePaused = true;
}
function resume() {
    resumeBackgroundMusic();
    start(true);
}
function saveToStorage(key, value, callback) {
    if(window.chrome) {
        if(chrome.storage) {
            var obj = {};
            obj[key] = value;
            chrome.storage.local.set(obj, function() {
                callback = callback || function() {
                }
                callback();
            });
            return;
        }
    }
    localStorage[key] = value;
    if(callback) callback();
}
function retreiveFromStorage(key, callback) {
    callback = callback || function() {
    }
    if(window.chrome) {
        if(chrome.storage) {
            chrome.storage.local.get(key, function(e) {
                callback = callback || function() {
                };
                var value = e != {} ? e[key] : undefined;
                callback(value);
            });
            return;
        }
    }
    callback(localStorage[key]);
}
function playSoundWithHTML5(sound, playAsBackground) {
    var tag = document.createElement("audio");
    tag.src = "./assets/" + sound + ".mp3";
    tag.load();
    if(!playAsBackground) {
        tag.volume = sfxVolume;
    }else{
        tag.volume = bgVolume;
    }
    tag.play();
}
var sounds = {};
var useWebAudio = true;
if(window.AudioContext) {
    var audio = new AudioContext();
    if(audio.createGain) {
        var sfxGain = audio.createGain();
    }else{
        useWebAudio = false;
    }
}else{
    useWebAudio = false;
}
var sfxVolume = 1;
var bgVolume = 1;
var soundPlaying = false;
function playSound(sound, playAsBackground) {
    if(!useWebAudio) {
        playSoundWithHTML5(sound, playAsBackground);
        return;
    }
    if(!sounds[sound]) {
        var http = new XMLHttpRequest();
        http.responseType = "arraybuffer";
        http.open("GET", "./assets/" + sound + ".mp3", true);
        http.onload = function() { audio.decodeAudioData(http.response, function(e) {
                sounds[sound] = e;
                playSound(sound);
            });
        }
        http.onerror = function(e) {
            if(http.response == null) {
                useWebAudio = false;
                playSoundWithHTML5(sound, playAsBackground);
            }
            return false;
        }
        http.send();
    }else{
        var source = audio.createBufferSource();
        source.buffer = sounds[sound];
        if(playAsBackground) {
            source.connect(bgMusicGain);
            bgMusicGain.connect(audio.destination);
        }else{
            source.connect(sfxGain);
            sfxGain.connect(audio.destination);
        }
        source.onended = function() {
            soundPlaying = false;
        }
        soundPlaying = true;
        source.start(0);
    }
}
function playStabSound() {
    playSound("Stab" + Math.floor(Math.random() * 2 + 1));
}
var bgMusic = null;
var bgMusicStop = null;
var bgMusicStart = null;
var bgMusicCache = null;
var bgMusicPlaying = false;
if(useWebAudio) {
    var bgMusicGain = audio.createGain();
}
function playBackgroundMusic(time) {
    bgMusicPlaying = true;
    if(!useWebAudio) {
        bgMusic = document.createElement("audio");
        bgMusic.src = "./assets/Music.mp3";
        bgMusic.loop = true;
        bgMusic.currentTime = 0;
        bgMusic.load();
        bgMusic.play();
        return;
    }
    if(!bgMusicCache) {
        var http = new XMLHttpRequest();
        http.responseType = "arraybuffer";
        http.open("GET", "./assets/Music.mp3", true);
        http.onload = function() {
            audio.decodeAudioData(http.response, function(e) {
                bgMusicCache = e;
                playBackgroundMusic();
            });
        }
        http.send();
    }else{
        bgMusic = audio.createBufferSource();
        bgMusic.buffer = bgMusicCache;
        bgMusic.onended = function() {
            if(bgMusicPlaying) playBackgroundMusic();
        }
        bgMusic.connect(bgMusicGain);
        bgMusicGain.connect(audio.destination);
        bgMusicStart = audio.currentTime;
        bgMusic.start(0, time);
    }
}
function stopBackgroundMusic() {
    if(!useWebAudio) {
        bgMusic.pause();
        return;
    }
    bgMusicStop = audio.currentTime;
    bgMusic.stop(0);
    bgMusicPlaying = false;
}
function resumeBackgroundMusic() {
    if(!useWebAudio) {
        bgMusic.play();
        return;
    }
    playBackgroundMusic(bgMusicStop - bgMusicStart);
}
var gameStarting = false;
function clickHandler() {
    if(!gameActive && !gamePaused && !menuOpen) {
        playBackgroundMusic();
        shootPen(true);
        gameActive = true;
        gameStarting = true;
    }else{
        if(!gameStarting && !gamePaused && !menuOpen) shootPen();
    }
}
function changeMusicVolume(volume) {
    if(useWebAudio) bgMusicGain.gain.setValueAtTime(volume / 100, 0);
    bgVolume = volume / 100;
    musicSlider.value = volume;
    musicOverdriveSlider.value = volume;
}
function changeSFXVolume(volume) {
    if(useWebAudio) sfxGain.gain.setValueAtTime(volume / 100, 0);
    sfxVolume = volume / 100;
    sfxSlider.value = volume;
    sfxOverdriveSlider.value = volume;
}
function previewBackgroundMusic() {
    if(!soundPlaying) {
        playSound("MusicPreview", true);
    }
}
var xMoveSpeed = 0;
var autoXMoveSpeed = true;
var yMoveSpeed = -5;
var gravity = 6;
var slowdownTreshold = 10;
var topOfArc = 30;
var slowdownSpeed = 8;
var rotationSpeed = 20;
function flipFruit() {
    var fruit2 = document.createElement("div");
    fruit2.id = "fruit";
    fruit2.style.width = fruit.style.width;
    fruit2.style.height = fruit.style.height;
    fruit2.style.borderRadius = fruit.style.borderRadius;
    var fruit2Top = 0;
    var fruit2Left = 0;
    fruit2Top = fruitTop;
    fruit2Left = fruitPos;
    fruit2.style.height = fruitTypes[fruitType].height;
    fruit2.style.background = fruitTypes[fruitType].color;
    var fruit2Rotation = 0;
    document.body.appendChild(fruit2);
    var distanceMoved = 0;
    var reachedTopOfArc = false;
    var xAcceleration = xMoveSpeed + 0;
    var yAcceleration = yMoveSpeed + 0;
    function flipLoop() {
        if(fruit2Top > 430 || fruit2Left < (0 - fruitTypes[fruitType].height || 60) || fruit2Left > 320) {
            document.body.removeChild(fruit2);
            return;
        }
        fruit2.style.top = fruit2Top = fruit2Top + yAcceleration;
        fruit2.style.left = fruit2Left = fruit2Left + xAcceleration;
        fruit2.style.transform = "rotate(" + (fruit2Rotation = fruit2Rotation + rotationSpeed) + "deg)";
        function handleGravity() {
            distanceMoved += xAcceleration > 0 ? xAcceleration : 0 - xAcceleration;
            if(distanceMoved >= topOfArc) {
                reachedTopOfArc = true;
            }
            if(distanceMoved > slowdownTreshold && !reachedTopOfArc) {
                var spaceToSlowDown = topOfArc - slowdownTreshold - (distanceMoved - slowdownTreshold);
                yAcceleration = yAcceleration + gravity / spaceToSlowDown;
            }
        }
        handleGravity();
        requestAnimationFrame(flipLoop);
    }
    flipLoop();
}
var fps = 0;
var fpsUpdateFrequency = 1;
var nextUpdateTime = 0;
function showFPS() {
    if(!timeSinceLastFrame) {
        timeSinceLastFrame = Date.now();
    }else{
        var delta = (performance.now() - timeSinceLastFrame) / 1000;
        timeSinceLastFrame = performance.now();
        fps = Math.floor(1 / delta);
        if(timeSinceLastFrame > nextUpdateTime) {
            nextUpdateTime = performance.now() + 600 / fpsUpdateFrequency;
            fpsDisplay.innerHTML = fps + "fps";
        }
    }
    requestAnimationFrame(showFPS);
}
function resetHighScore() {
    saveToStorage("high", 0);
    high.innerHTML = highScore = 0;
}
function setHighScore(value) {
    saveToStorage("high", value);
    high.innerHTML = highScore = value;
}
function requestFile(callback) {
    callback = callback || console.log;
    var input = document.createElement("input");
    input.type = "file";
    input.onchange = function() {
        var reader = new FileReader();
        reader.onload = function() {
            callback(reader.result);
        }
        reader.readAsBinaryString(input.files[0]);
    }
    input.click();
}
function loadPenAsset(name, success, error) {
    success = success || console.log;
    var http = new XMLHttpRequest();
    http.responseType = "blob";
    http.open("GET", "./assets/pens/" + name + ".png");
    http.onload = function(e) {
        if(this.readyState != 4 || this.status != 200) {
            http.onerror(e);
            return;
        }
        success(http.response);
    }
    http.onerror = error || console.warn;
    http.send();
}
function getPenAsset(name, success, error) {
    success = success || console.log;
    error = error || console.warn;
    var underscore = false;
    var penframeurls = ["", ""];
    var penframeassets = [null, null];
    loadPenAsset(name + "1", function(r) {
        penframeurls[0] = URL.createObjectURL(r);
        loadPenAsset(name + "2", function(r2) {
            penframeurls[1] = URL.createObjectURL(r2);
            success(penframeurls, name);
        }, function() {
            error(name);
        });
    }, function() {
        underscore = true;
        loadPenAsset(name + "_1", function(r) {
            penframeurls[0] = URL.createObjectURL(r);
            loadPenAsset(name + "_2", function(r2) {
                penframeurls[1] = URL.createObjectURL(r2);
                success(penframeurls, name);
            }, function() {
                error(name);
            });
        });
    });
}
function loadPens() {
    for(p=0;p<penList.length-1;p++) {
        assetRequests.push({id: "pen_" + penList[p].replace("pen_", ""), status: "pending"});
        getPenAsset(penList[p], function(urls, name) {
            var penId = name.replace("pen_", "");
            pens[penId] = {url: urls[0], animated: true, frame1: urls[0], frame2: urls[1], width: 18, height: 80};
            for(r=0;r<assetRequests.length;r++) {
                if(assetRequests[r].id == "pen_" + penId) {
                    assetRequests[r].status = "done";
                }
            }
            addPenToShop(penId, function(e) {
                if(!e) return;
                closeShop();
                selectPen(e);
            });
            checkIfAssetsLoaded();
        }, function(name) {
            console.warn(name);
            var penId = name.replace("pen_", "");
            for(r=0;r<assetRequests.length;r++) {
                if(assetRequests[r].id == "pen_" + penId) {
                    assetRequests[r].status = "failed";
                }
            }
            checkIfAssetsLoaded();
        });
    }
}
function addShopEntry(type, item, handler, data) {
    var entry = document.createElement("div");
    entry.className = "shopEntry";
    var image = document.createElement("img");
    image.className = "shopEntryImage";
    entry.appendChild(image);
    entry.data = data;
    function clickHandler() {
        handler(this.data);
    }
    image.onclick = clickHandler;
    entry.onclick = clickHandler;
    if(type == "pen") {
        var penType = pens[item];
        image.width = 20;
        image.height = 90;
        entry.style.width = 100;
        entry.style.height = 100;
        image.src = penType.url;
    }
    shopMenu.appendChild(entry);
}
function addPenToShop(penId, handler) {
    addShopEntry("pen", penId, handler, penId);
}
function checkIfAssetsLoaded() {
    var allDone = true;
    var assetsLoading = 0;
    for(r=0;r<assetRequests.length;r++) {
        if(assetRequests[r].status == "pending") {
            allDone = false;
            assetsLoading++;
        }
    }
    if(allDone) {
        selectPen("default");
        playSound("Intro");
        setTimeout(closeLoadingScreen, 800);
    }
    var assetsDone = assetRequests.length - assetsLoading;
    var finishedPercentage = assetsDone / assetRequests.length * 100;
    updateLoadingScreen(finishedPercentage);
}
function updateLoadingScreen(percentage) {
    var maxLength = 100;
    var defaultHeight = 180;
    var length = percentage / 100 * maxLength;
    loadingBar.style.height = length;
    loadingBar.style.top = defaultHeight - length;
}
function closeLoadingScreen() {
    loading.style.opacity = 0;
    setTimeout(function() {
        loading.style.display = "none";
        menuOpen = false;
    }, 500);
}
window.onload = function() {
    showFPS();
    loadPens();
}
}catch(e) {
    alert(e);
}