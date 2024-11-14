console.log("Script is starting...");

const puppeteer = require('puppeteer');

// Function to generate a random interval between 3 to 18 seconds
function getRandomPauseInterval() {
  return Math.floor(Math.random() * (18000 - 3000 + 1)) + 3000; // Random value between 3000ms and 18000ms
}

// Function to generate unique random pause points after 200 pixels
function generateRandomPausePoints(minPixel, maxPixel, numberOfPoints) {
  const pausePoints = new Set();
  while (pausePoints.size < numberOfPoints) {
    const randomPoint = Math.floor(Math.random() * (maxPixel - minPixel + 1)) + minPixel;
    pausePoints.add(randomPoint);
  }
  return Array.from(pausePoints).sort((a, b) => a - b);
}

function generateAnotherRandomPausePoints(minPixel, maxPixel, numberOfPoints) {
  const pausePoints = new Set();
  while (pausePoints.size < numberOfPoints) {
    const randomPoint = Math.floor(Math.random() * (maxPixel - minPixel + 1)) + minPixel;
    pausePoints.add(randomPoint);
  }
  return Array.from(pausePoints).sort((a, b) => a - b);
}

async function openChromeAndSearch() {
  console.log("Opening browser...");
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  console.log("Google homepage loaded.");
  
  // Wait for the search input field
  await page.waitForSelector('textarea[name="q"]', { timeout: 15000 });
  console.log("Search input found.");
  
  const searchBar = await page.$('textarea[name="q"]');
  const textToType = 'amogo.net'; // Text to type in the search bar
  
  // Loop through each character in the string and type it with a random delay
  for (let i = 0; i < textToType.length; i++) {
    const randomDelay = Math.floor(Math.random() * (150 - 50 + 1)) + 50; // Random delay between 50ms and 150ms
    await page.keyboard.type(textToType[i]); // Type each character
    await new Promise(resolve => setTimeout(resolve, randomDelay)); // Wait for a random delay before typing the next character
  }
  
  console.log("Text typed into the search bar.");
  
  // Submit the search
  await searchBar.press('Enter');
  console.log("Search submitted with Enter key.");
  
  // Wait for the search results page to load
  await page.waitForSelector('#search', { timeout: 15000 });
  console.log("Search results page loaded.");
  
  // Wait for the search result link to load (using a more generic selector for the first link)
  await page.waitForSelector('.g a', { timeout: 15000 });  // More general selector
  console.log("First link visible.");

  // Click on the first link in the search results
  console.log("Clicking the first link...");
  const firstLink = await page.$('.g a'); // More general selector for the first link
  if (firstLink) {
    await firstLink.click(); // Click the first link
    console.log("First link clicked.");
  } else {
    console.log("First link not found.");
    return;
  }

  // Wait for the page to load
  console.log("Waiting for the page to load...");
  await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 3 seconds for the page to load after click

  console.log("Page loaded, starting slow scrolling...");

  const scrollDuration = 180000; // 3 minutes
  const startTime = Date.now(); // Start time
  let scrollCount = 0;

  // Generate 20 random pause points after 200 pixels (for example, between 200 and 500 pixels)
  const pausePoints = generateRandomPausePoints(200, 500, 20); 
  const scrollUpPoints = generateAnotherRandomPausePoints(600, 1000, 20); // Generate points for scrolling up
  console.log(`Generated pause points:`, pausePoints);
  console.log(`Generated scroll-up points:`, scrollUpPoints);

  // Combine both arrays
  let combinedPoints = [...pausePoints, ...scrollUpPoints];

  // Shuffle the combined array to randomly mix pause points and scroll-up points
  combinedPoints = combinedPoints.sort(() => Math.random() - 0.5); // Random shuffle

  // Sort the combined array in ascending order (to ensure the points are in order)
  combinedPoints = combinedPoints.sort((a, b) => a - b);

  console.log(`Combined and shuffled points:`, combinedPoints);

  // Initial scroll speed (delay in ms)
  let scrollDelay = 50;

  while (Date.now() - startTime < scrollDuration) {
    // Fixed smaller scroll step size (1-2 pixels per scroll for smoother scrolling)
    const scrollStep = Math.floor(Math.random() * 2) + 1; // Scroll either 1 or 2 pixels

    // Scroll down by the fixed number of pixels
    await page.evaluate(scrollStep => {
      window.scrollBy(0, scrollStep); // Scroll down by fixed pixels
    }, scrollStep);

    // Delay between each scroll (adjustable to simulate speed change)
    await new Promise(resolve => setTimeout(resolve, scrollDelay)); // Variable delay between scrolls

    scrollCount++;
    console.log(`Scrolled down ${scrollStep} pixels, Count: ${scrollCount}`);

    // Check if we hit one of the combined points (either pause or scroll-up)
    if (combinedPoints.includes(scrollCount)) {
      // If it's a pause point
      if (pausePoints.includes(scrollCount)) {
        const pauseDuration = getRandomPauseInterval(); // Get random pause interval
        console.log(`Pausing for ${pauseDuration / 1000} seconds at scroll count ${scrollCount}...`);
        await new Promise(resolve => setTimeout(resolve, pauseDuration)); // Pause for the random interval
      }

      // If it's a scroll-up point
      if (scrollUpPoints.includes(scrollCount)) {
        console.log(`Reached scroll-up point at ${scrollCount} pixels. Scrolling up for 300 pixels...`);
        let scrollUpSteps = 300;
        let scrollStepUp = Math.floor(Math.random() * 3) + 1; // Randomize scroll up speed between 1-3 pixels

        // Scroll up 300 pixels with a random step size
        while (scrollUpSteps > 0) {
          await page.evaluate(scrollStepUp => {
            window.scrollBy(0, -scrollStepUp); // Scroll up
          }, scrollStepUp);
          
          scrollUpSteps -= scrollStepUp; // Decrease remaining scroll distance
          await new Promise(resolve => setTimeout(resolve, 100)); // Delay for smoother scrolling
        }

        console.log("Scrolled up 300 pixels.");

        // Increase the scroll speed by reducing the delay (randomized)
        const randomSpeedIncrease = Math.floor(Math.random() * 20) + 10; // Increase speed randomly by 10ms to 30ms
        scrollDelay = Math.max(10, scrollDelay - randomSpeedIncrease); // Ensure scroll delay doesn't go below 10ms
        console.log(`Increasing speed. New scroll delay: ${scrollDelay}ms`);
      }
    }
  }

  console.log("Reached the bottom of the page after 3 minutes.");

  // Close the browser after scrolling
  await browser.close();
  console.log("Browser closed.");
}

openChromeAndSearch();
