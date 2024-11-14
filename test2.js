const puppeteer = require("puppeteer");

// Function to generate a random number between 1 and 20 every second
function generateRandomNumber() {
  let currentSpeed = 20; // Default speed

  setInterval(() => {
    currentSpeed = Math.floor(Math.random() * 500) + 1; // Generate random number between 1 and 20
    console.log(`New scroll speed: ${currentSpeed}`);
  }, 5000); // 1000ms = 1 second

  return currentSpeed; // Initially return the default speed
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

  // Wait for search bar to load and type text
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

  const scrollDuration = 300000; // 5 minutes
  const startTime = Date.now();
  let stepsSinceSpeedChange = 0;

  // Scroll delay between each step (in milliseconds)
  let scrollDelay = 20; // Default smooth scrolling delay

  let pausePoints = []; // To store the scroll points where pauses will occur

  // Pre-calculate potential pause points before scrolling begins
  // Ensure the points are between 300 and 2000
  for (let i = 300; i <= 2000; i++) {
    if (Math.random() < 0.1) { // Adjust probability as needed (10%)
      pausePoints.push(i); // Store scroll points for pausing during the down scroll
    }
  }

  for (let i = -2000; i <= -300; i++) {
    if (Math.random() < 0.1) { // Adjust probability as needed (10%)
      pausePoints.push(i); // Store scroll points for pausing during the up scroll
    }
  }

  // Log all the points where pauses will occur
  console.log("Pause points pre-calculated:", pausePoints);

  // Start generating scroll speed changes every second
  const randomSpeed = generateRandomNumber(); // Initially get the default speed
  
  while (Date.now() - startTime < scrollDuration) {
    // Pick a random value between 400 and 800 for scrolling down
    const scrollDownAmount = Math.floor(Math.random() * (800 - 400 + 1)) + 400;
    console.log(`Scrolling down ${scrollDownAmount} pixels...`);

    // Scroll down the selected amount
    for (let i = 0; i < scrollDownAmount; i++) {
      await page.evaluate(() => window.scrollBy(0, 1)); // Scroll 1px down
      console.log("Scrolled down 1 pixel.");
      
      // Pause if this scroll point is in the pre-calculated pause points
      if (pausePoints.includes(i + 1)) {
        const randomPause = Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000; // Random pause between 3s and 10s
        console.log(`Pausing for ${randomPause / 1000} seconds at scroll point: ${i + 1} pixels down.`);
        await new Promise((resolve) => setTimeout(resolve, randomPause));
      }

      await new Promise((resolve) => setTimeout(resolve, randomSpeed)); // Use the updated speed for scrolling
    }

    // Pick a random value between 200 and 400 for scrolling up
    const scrollUpAmount = Math.floor(Math.random() * (400 - 200 + 1)) + 200;
    console.log(`Scrolling up ${scrollUpAmount} pixels...`);

    // Scroll up the selected amount
    for (let i = 0; i < scrollUpAmount; i++) {
      await page.evaluate(() => window.scrollBy(0, -1)); // Scroll 1px up
      console.log("Scrolled up 1 pixel.");
      
      // Pause if this scroll point is in the pre-calculated pause points
      if (pausePoints.includes(-(i + 1))) {
        const randomPause = Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000; // Random pause between 3s and 10s
        console.log(`Pausing for ${randomPause / 1000} seconds at scroll point: ${-(i + 1)} pixels up.`);
        await new Promise((resolve) => setTimeout(resolve, randomPause));
      }

      await new Promise((resolve) => setTimeout(resolve, randomSpeed)); // Use the updated speed for scrolling
    }

    // After each cycle, adjust scroll delay to simulate human-like rhythm
    stepsSinceSpeedChange++;
    if (stepsSinceSpeedChange >= 20) {
      const randomFactor = Math.floor(Math.random() * (3 - 1 + 1)) + 1; // Random speed variation factor
      const action = Math.random() < 0.5 ? "multiply" : "divide";
      if (action === "multiply") {
        scrollDelay *= randomFactor;
      } else if (action === "divide" && scrollDelay > 20) {
        scrollDelay = Math.max(20, scrollDelay / randomFactor);
      }
      stepsSinceSpeedChange = 0;
    }

    // Check if the scroll duration has passed
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
