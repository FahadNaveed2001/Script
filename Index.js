const puppeteer = require("puppeteer");
function getRandomPauseInterval() {
  return Math.floor(Math.random() * (18000 - 3000 + 1)) + 3000;
}
function generateRandomPausePoints(minPixel, maxPixel, numberOfPoints) {
  const pausePoints = new Set();
  while (pausePoints.size < numberOfPoints) {
    const randomPoint =
      Math.floor(Math.random() * (maxPixel - minPixel + 1)) + minPixel;
    pausePoints.add(randomPoint);
  }
  return Array.from(pausePoints).sort((a, b) => a - b);
}
function generateAnotherRandomPausePoints(minPixel, maxPixel, numberOfPoints) {
  const pausePoints = new Set();
  while (pausePoints.size < numberOfPoints) {
    const randomPoint =
      Math.floor(Math.random() * (maxPixel - minPixel + 1)) + minPixel;
    pausePoints.add(randomPoint);
  }
  return Array.from(pausePoints).sort((a, b) => a - b);
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
  console.log("Search input found.");
  const searchBar = await page.$('textarea[name="q"]');
  const textToType = "amogo.net";
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
  console.log("First link visible.");
  console.log("Clicking the first link...");
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
  console.log("Page loaded, starting slow scrolling...");
  const scrollDuration = 300000;
  const startTime = Date.now();
  let scrollCount = 0;
  let stepsSinceSpeedChange = 0;
  const pausePoints = generateRandomPausePoints(200, 500, 20);
  const scrollUpPoints = generateAnotherRandomPausePoints(600, 1000, 20);
  console.log(`Generated pause points:`, pausePoints);
  console.log(`Generated scroll-up points:`, scrollUpPoints);
  let combinedPoints = [...pausePoints, ...scrollUpPoints];
  combinedPoints = combinedPoints.sort(() => Math.random() - 0.5);
  combinedPoints = combinedPoints.sort((a, b) => a - b);
  console.log(`Combined and shuffled points:`, combinedPoints);
  let scrollDelay = 50;
  while (Date.now() - startTime < scrollDuration) {
    const scrollStep = Math.floor(Math.random() * 2) + 1;
    await page.evaluate((scrollStep) => {
      window.scrollBy(0, scrollStep);
    }, scrollStep);
    await new Promise((resolve) => setTimeout(resolve, scrollDelay));
    scrollCount++;
    stepsSinceSpeedChange++;
    console.log(`Scrolled down ${scrollStep} pixels, Count: ${scrollCount}`);
    if (stepsSinceSpeedChange >= 20) {
      const randomFactor = Math.floor(Math.random() * (10 - 3 + 1)) + 3;
      const action = Math.random() < 0.5 ? "multiply" : "divide";
      if (action === "multiply") {
        scrollDelay *= randomFactor;
        console.log(
          `Speed increased dramatically. New scroll delay: ${scrollDelay}ms (multiplied by ${randomFactor})`
        );
      } else if (action === "divide" && scrollDelay > 10) {
        scrollDelay = Math.max(10, scrollDelay / randomFactor);
        console.log(
          `Speed decreased dramatically. New scroll delay: ${scrollDelay}ms (divided by ${randomFactor})`
        );
      }
      stepsSinceSpeedChange = 0;
    }
    if (combinedPoints.includes(scrollCount)) {
      if (pausePoints.includes(scrollCount)) {
        const pauseDuration = getRandomPauseInterval();
        console.log(
          `Pausing for ${
            pauseDuration / 1000
          } seconds at scroll count ${scrollCount}...`
        );
        await new Promise((resolve) => setTimeout(resolve, pauseDuration));
      }
      if (scrollUpPoints.includes(scrollCount)) {
        console.log(
          `Reached scroll-up point at ${scrollCount} pixels. Scrolling up for 300 pixels...`
        );
        let scrollUpSteps = 300;
        let scrollStepUp = Math.floor(Math.random() * 3) + 1;
        while (scrollUpSteps > 0) {
          await page.evaluate((scrollStepUp) => {
            window.scrollBy(0, -scrollStepUp);
          }, scrollStepUp);
          scrollUpSteps -= scrollStepUp;
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        console.log("Scrolled up 300 pixels.");
      }
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

