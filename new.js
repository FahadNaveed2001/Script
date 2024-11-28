const { exec } = require('child_process');
const puppeteer = require('puppeteer');
const ffi = require('ffi-napi');
const ref = require('ref-napi');

// Define user32.dll functions
const user32 = ffi.Library('user32', {
    'EnumWindows': ['bool', ['pointer', 'int32']],
    'GetWindowTextA': ['int', ['pointer', 'char *', 'int']],
    'ShowWindow': ['bool', ['pointer', 'int']],
    'SetForegroundWindow': ['bool', ['pointer']],
    'keybd_event': ['void', ['uint8', 'uint8', 'uint32', 'uint32']],
});

// Constants for ShowWindow command
const SW_RESTORE = 9;
const SW_MAXIMIZE = 3;

// Virtual key codes for keyboard events
const VK_CONTROL = 0x11; // Control key
const VK_T = 0x54; // T key for new tab
const VK_ENTER = 0x0D; // Enter key
const VK_W = 0x57; // W key
const VK_H = 0x48; // H key
const VK_O = 0x4F; // O key
const VK_E = 0x45; // E key
const VK_R = 0x52; // R key
const VK_DOT = 0xBE; // Dot key (for ".")
const VK_N = 0x4E; // N key for "net"
const VK_E2 = 0x45; // E key (again for the second E)
const VK_T2 = 0x54; // T key (again for the second T)

// Buffer size for window titles
const MAX_TITLE_LENGTH = 255;

function checkBitBrowser() {
    console.log('Checking if Bit Browser is running...');

    const tasklistCommand = 'tasklist';

    exec(tasklistCommand, (err, tasklistOutput) => {
        if (err) {
            console.error(`Error executing tasklist: ${err.message}`);
            return;
        }

        const bitBrowserLine = tasklistOutput
            .split('\n')
            .find(line => line.toLowerCase().includes('bitbrowser'));

        if (!bitBrowserLine) {
            console.log('Bit Browser is not running.');
        } else {
            console.log('Bit Browser is running.');
            maximizeSpecificBitBrowserWindow();
        }
    });
}

function maximizeSpecificBitBrowserWindow() {
    console.log('Attempting to find and maximize the specific Bit Browser window...');

    const targetWindowTitle = "50-MAC 50B-Workbench - BitBrowser";

    const callback = ffi.Callback('bool', ['pointer', 'int32'], (hwnd, lParam) => {
        const buffer = Buffer.alloc(MAX_TITLE_LENGTH);
        user32.GetWindowTextA(hwnd, buffer, MAX_TITLE_LENGTH);
        const title = buffer.toString('utf8').replace(/\0/g, '').trim();

        // Match the specific window title
        if (title === targetWindowTitle) {
            console.log(`Found specific Bit Browser window: "${title}"`);
            user32.ShowWindow(hwnd, SW_RESTORE);
            user32.ShowWindow(hwnd, SW_MAXIMIZE);
            user32.SetForegroundWindow(hwnd);
            simulateKeyPress();
            return false; // Stop enumeration after finding the window
        }

        return true; // Continue enumeration
    });

    user32.EnumWindows(callback, 0);

    console.log('Finished window search.');
}

function simulateKeyPress() {
    console.log('Simulating key presses to open a new tab and enter "whoer.net" in the input field...');

    // Simulate Ctrl + T (to open a new tab)
    user32.keybd_event(VK_CONTROL, 0, 0, 0);  // Press Control
    user32.keybd_event(VK_T, 0, 0, 0);       // Press T
    user32.keybd_event(VK_T, 0, 2, 0);       // Release T
    user32.keybd_event(VK_CONTROL, 0, 2, 0); // Release Control

    // Wait for a brief moment to ensure the tab is opened
    setTimeout(() => {
        // Simulate typing "whoer.net"
        typeText([VK_W, VK_H, VK_O, VK_E, VK_R, VK_DOT, VK_N, VK_E2, VK_T2]);

        // After typing is finished, simulate pressing Enter to go to the site
        setTimeout(() => {
            hitEnter();
            waitForPageLoad();
        }, 1500);  // Ensure that Enter is pressed after a brief delay to allow typing
    }, 500);
}

function typeText(keys) {
    keys.forEach((key, index) => {
        setTimeout(() => {
            user32.keybd_event(key, 0, 0, 0);  // Press key
            user32.keybd_event(key, 0, 2, 0);  // Release key
        }, index * 150);  // Adjusted delay between key presses
    });
}

function hitEnter() {
    // Virtual key code for Enter is 0x0D
    const ENTER_KEY = 0x0D;

    // Simulate pressing and releasing Enter key
    user32.keybd_event(ENTER_KEY, 0, 0, 0);  // Press Enter
    user32.keybd_event(ENTER_KEY, 0, 2, 0);  // Release Enter
}

function waitForPageLoad() {
    console.log('Waiting for 5 seconds before checking disguise status...');
    
    // Wait 5 seconds before checking disguise status
    setTimeout(() => {
        checkDisguiseStatus();
    }, 5000); // 5 seconds delay
}

async function checkDisguiseStatus() {
    console.log('Checking disguise status...');

    // Launch Puppeteer to open the browser and navigate to "whoer.net"
    const browser = await puppeteer.launch({ headless: false }); // set headless to false to see the browser
    const page = await browser.newPage();

    // Wait for the page to load and select the necessary element
    await page.goto('https://whoer.net', { waitUntil: 'domcontentloaded' });

    // Extract the disguise percentage from the page
    const disguisePercentage = await page.evaluate(() => {
        const disguiseElement = document.querySelector('#hidden_rating_link .title span');
        if (disguiseElement) {
            const disguiseText = disguiseElement.innerText;
            const match = disguiseText.match(/(\d+)%/);
            if (match) {
                return match[0]; // Return the disguise percentage, e.g., "70%"
            }
        }
        return 'Disguise percentage not found';
    });

    console.log(`Disguise percentage: ${disguisePercentage}`);

    await browser.close();
}

checkBitBrowser();
