const puppeteer = require("puppeteer");
function generateRandomNumber() {
  let currentSpeed = 20; 
  setInterval(() => {
    currentSpeed = Math.floor(Math.random() * 500) + 1; 
    console.log(`New scroll speed: ${currentSpeed}`);
  }, 5000); 
  return currentSpeed; 
}
async function openChromeAndSearch() {
  console.log("Opening browser...");
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto("https://www.google.com");
  console.log("Google homepage loaded.");
  await page.waitForSelector('textarea[name="q"]', { timeout: 15000 });
  const searchBar = await page.$('textarea[name="q"]');
  const textToType = "forbes";
  for (let i = 0; i < textToType.length; i++) {
    const randomDelay = Math.floor(Math.random() * (150 - 50 + 1)) + 50;
    await page.keyboard.type(textToType[i]);
    await new Promise((resolve) => setTimeout(resolve, randomDelay));
  }
  console.log("Text typed into the search bar.");
  await searchBar.press("Enter");
  console.log("Search submitted with Enter key.");
  await page.waitForSelector("#search", { timeout: 15000 });
  console.log("Search results page loaded.");
  await page.waitForSelector(".g a", { timeout: 15000 });
  console.log("First link visible. Clicking the first link...");
  const firstLink = await page.$(".g a");
  if (firstLink) {
    await firstLink.click();
    console.log("First link clicked.");
  } else {
    console.log("First link not found.");
    return;
  }
  console.log("Waiting for the page to load...");
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log("Page loaded, starting scroll behavior...");
  const scrollDuration = 300000; 
  const startTime = Date.now();
  let stepsSinceSpeedChange = 0;
  let scrollDelay = 20; 
  let pausePoints = []; 
  for (let i = 300; i <= 2000; i++) {
    if (Math.random() < 0.1) { 
      pausePoints.push(i); 
    }
  }
  for (let i = -2000; i <= -300; i++) {
    if (Math.random() < 0.1) { 
      pausePoints.push(i); 
    }
  }
  console.log("Pause points pre-calculated:", pausePoints);
  const randomSpeed = generateRandomNumber(); 
  while (Date.now() - startTime < scrollDuration) {
    const scrollDownAmount = Math.floor(Math.random() * (800 - 400 + 1)) + 400;
    console.log(`Scrolling down ${scrollDownAmount} pixels...`);
    for (let i = 0; i < scrollDownAmount; i++) {
      await page.evaluate(() => window.scrollBy(0, 1)); 
      console.log("Scrolled down 1 pixel.");
            if (pausePoints.includes(i + 1)) {
        const randomPause = Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000; 
        console.log(`Pausing for ${randomPause / 1000} seconds at scroll point: ${i + 1} pixels down.`);
        await new Promise((resolve) => setTimeout(resolve, randomPause));
      }

      await new Promise((resolve) => setTimeout(resolve, randomSpeed)); 
    }
    const scrollUpAmount = Math.floor(Math.random() * (100 - 50 + 1)) + 50; 
    console.log(`Scrolling up ${scrollUpAmount} pixels...`);
    for (let i = 0; i < scrollUpAmount; i++) {
      await page.evaluate(() => window.scrollBy(0, -1)); 
      console.log("Scrolled up 1 pixel.");
      if (pausePoints.includes(-(i + 1))) {
        const randomPause = Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000; 
        console.log(`Pausing for ${randomPause / 1000} seconds at scroll point: ${-(i + 1)} pixels up.`);
        await new Promise((resolve) => setTimeout(resolve, randomPause));
      }
      await new Promise((resolve) => setTimeout(resolve, randomSpeed)); 
    }
    stepsSinceSpeedChange++;
    if (stepsSinceSpeedChange >= 20) {
      const randomFactor = Math.floor(Math.random() * (3 - 1 + 1)) + 1; 
      const action = Math.random() < 0.5 ? "multiply" : "divide";
      if (action === "multiply") {
        scrollDelay *= randomFactor;
      } else if (action === "divide" && scrollDelay > 20) {
        scrollDelay = Math.max(20, scrollDelay / randomFactor);
      }
      stepsSinceSpeedChange = 0;
    }
    if (Date.now() - startTime >= scrollDuration) {
      console.log("5 minutes reached, stopping the scrolling.");
      break;
    }
  }
  console.log("Reached the bottom of the page after 5 minutes.");
  await browser.close();
  console.log("Browser closed.");
}

openChromeAndSearch();
