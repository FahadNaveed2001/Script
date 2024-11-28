const robot = require("robotjs");
const { exec } = require("child_process");

function openChrome() {
    const chromePath = `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"`;
    const url = "https://amogo.net"; 

    exec(`${chromePath} ${url}`, (err) => {
        if (err) {
            console.error("Error launching Chrome:", err);
        } else {
            console.log("Chrome launched successfully.");
        }
    });
}
function fuckingBot() {
    const totalDuration = 120000;  
    const startTime = Date.now();
    let articleCount = 0;
    let scrollPosition = 0; 
    let minSpeed = 300;
    let maxSpeed = 1000;
    function performScroll() {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime >= totalDuration) {
            console.log("Stopped scrolling after 2 minutes.");
            return;
        }
        const scrollDelay = Math.floor(Math.random() * (maxSpeed - minSpeed)) + minSpeed;
        const scrollPixels = Math.floor(Math.random() * 81) + 20; 
        const downKeyPressCount = Math.floor(scrollPixels / 10); 
        console.log(`Scrolling down with ${downKeyPressCount} key presses to simulate ~${scrollPixels} pixels.`);
        for (let i = 0; i < downKeyPressCount; i++) {
            robot.keyTap("down");
        }
        scrollPosition += scrollPixels; 
        if (scrollPosition >= 530) {
            console.log("Scrolled down 90px, attempting to click the article.");
            clickArticleSevenGadgets(); 
            return; 
        }
        const shouldPause = Math.random() < 0.2;
        if (shouldPause) {
            const pauseDuration = Math.floor(Math.random() * 13000) + 2000; 
            articleCount++;
            console.log(`Pausing on spot ${articleCount} for ${pauseDuration}ms.`);
            setTimeout(() => {
                console.log(`Resuming scroll after pausing on spot ${articleCount}.`);
                performScroll();
            }, pauseDuration);
        } else {
            if (Math.random() < 0.3) { 
                if (Math.random() < 0.5) {
                    minSpeed = Math.max(100, minSpeed - 50);
                    maxSpeed = Math.max(500, maxSpeed - 100);
                    console.log(`Increasing speed: New speed range (${minSpeed}-${maxSpeed}ms).`);
                } else {
                    minSpeed = Math.min(500, minSpeed + 50);
                    maxSpeed = Math.min(1500, maxSpeed + 100);
                    console.log(`Decreasing speed: New speed range (${minSpeed}-${maxSpeed}ms).`);
                }
            }
            setTimeout(performScroll, scrollDelay); 
        }
    }
    performScroll();
}

// 7 proven tech gadgets
function clickArticleSevenGadgets() {
    const xMin = 850; 
    const xMax = 910; 
    const yMin = 800; 
    const yMax = 850; 
    const randomX = Math.floor(Math.random() * (xMax - xMin + 1)) + xMin;
    const randomY = Math.floor(Math.random() * (yMax - yMin + 1)) + yMin;
    robot.moveMouse(randomX, randomY);
    robot.mouseClick();
    console.log(`Clicked on the article at coordinates (${randomX}, ${randomY}).`);
    setTimeout(() => {
        fuckingBotTwo();
    }, 3000);
}


function fuckingBotTwo() {
    const totalDuration = 120000;  
    const startTime = Date.now();
    let articleCount = 0;
    let scrollPosition = 0; 
    let minSpeed = 300;
    let maxSpeed = 1000;

    function performScroll() {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime >= totalDuration) {
            console.log("Stopped scrolling after 2 minutes.");
            return;
        }
        if (scrollPosition >= 900) {
            console.log("Reached 500px. Closing the tab.");
            robot.keyTap("w", "control"); 
            return;
        }
        const scrollDelay = Math.floor(Math.random() * (maxSpeed - minSpeed)) + minSpeed;
        const scrollPixels = Math.floor(Math.random() * 81) + 20; 
        const downKeyPressCount = Math.floor(scrollPixels / 10); 
        console.log(`Scrolling down with ${downKeyPressCount} key presses to simulate ~${scrollPixels} pixels.`);

        for (let i = 0; i < downKeyPressCount; i++) {
            robot.keyTap("down");
        }
        scrollPosition += scrollPixels; 
        const shouldPauseLong = Math.random() < 0.1; 
        const shouldPauseShort = Math.random() < 0.2; 
        if (shouldPauseLong) {
            const longPauseDuration = Math.floor(Math.random() * 10000) + 20000; 
            articleCount++;
            console.log(`Long pause at spot ${articleCount} for ${longPauseDuration}ms.`);
            setTimeout(() => {
                console.log(`Resuming scroll after long pause on spot ${articleCount}.`);
                performScroll();
            }, longPauseDuration);
        } else if (shouldPauseShort) {
            const shortPauseDuration = Math.floor(Math.random() * 13000) + 2000; 
            articleCount++;
            console.log(`Short pause at spot ${articleCount} for ${shortPauseDuration}ms.`);
            setTimeout(() => {
                console.log(`Resuming scroll after short pause on spot ${articleCount}.`);
                performScroll();
            }, shortPauseDuration);
        } else {
            if (Math.random() < 0.3) { 
                if (Math.random() < 0.5) {
                    minSpeed = Math.max(100, minSpeed - 50);
                    maxSpeed = Math.max(500, maxSpeed - 100);
                    console.log(`Increasing speed: New speed range (${minSpeed}-${maxSpeed}ms).`);
                } else {
                    minSpeed = Math.min(500, minSpeed + 50);
                    maxSpeed = Math.min(1500, maxSpeed + 100);
                    console.log(`Decreasing speed: New speed range (${minSpeed}-${maxSpeed}ms).`);
                }
            }
            setTimeout(performScroll, scrollDelay); 
        }
    }
    performScroll();
}


openChrome();
setTimeout(fuckingBot, 7000); 
