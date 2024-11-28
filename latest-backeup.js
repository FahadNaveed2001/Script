const { exec } = require('child_process');
const ffi = require('ffi-napi');
const ref = require('ref-napi');
const fs = require('fs');
const path = require('path');


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
const VK_SHIFT = 0x10; // Shift key
const VK_I = 0x49; // I key
const VK_C = 0x43; // C key for "copy"

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

        if (title === targetWindowTitle) {
            console.log(`Found specific Bit Browser window: "${title}"`);
            user32.ShowWindow(hwnd, SW_RESTORE);
            user32.ShowWindow(hwnd, SW_MAXIMIZE);
            user32.SetForegroundWindow(hwnd);
            simulateKeyPress();
            return false; 
        }

        return true; 
    });

    user32.EnumWindows(callback, 0);

    console.log('Finished window search.');
}

function simulateKeyPress() {
    console.log('Simulating key presses to open a new tab and enter "whoer.net" in the input field...');
    user32.keybd_event(VK_CONTROL, 0, 0, 0);  
    user32.keybd_event(VK_T, 0, 0, 0);    
    user32.keybd_event(VK_T, 0, 2, 0);       
    user32.keybd_event(VK_CONTROL, 0, 2, 0); 
    setTimeout(() => {
        typeText([VK_W, VK_H, VK_O, VK_E, VK_R, VK_DOT, VK_N, VK_E2, VK_T2]);
        setTimeout(() => {
            hitEnter();
            // Wait for 3 seconds and then log "Process completed"
            setTimeout(() => {
                console.log("Process completed");
            }, 3000);
        }, 1500);  
    }, 500);
}

function typeText(keys) {
    keys.forEach((key, index) => {
        setTimeout(() => {
            user32.keybd_event(key, 0, 0, 0);
            user32.keybd_event(key, 0, 2, 0);
        }, index * 150);  
    });
}

function hitEnter() {
    const ENTER_KEY = 0x0D;
    user32.keybd_event(ENTER_KEY, 0, 0, 0);  
    user32.keybd_event(ENTER_KEY, 0, 2, 0);
    
    // setTimeout(() => {
    //     openDevTools();
    // }, 7000);

    setTimeout(() => {
        copyDisguisePercentageFromPage();
    }, 7000);
}

function copyDisguisePercentageFromPage() {
    console.log('Starting web scraping...');

    // Simulate pressing Tab to navigate to the input element
    let numberOfTabPresses = 15;  // Adjust this as needed based on your page structure
    console.log(`Simulating ${numberOfTabPresses} Tab key presses to navigate.`);
    
    for (let i = 0; i < numberOfTabPresses; i++) {
        user32.keybd_event(0x09, 0, 0, 0);  // Tab key
        user32.keybd_event(0x09, 0, 2, 0);  // Release Tab key
    }

    console.log('Element selected, now copying content...');

    // Simulate pressing "Ctrl + C" to copy the selected content
    user32.keybd_event(0x11, 0, 0, 0);  // Ctrl key
    user32.keybd_event(0x43, 0, 0, 0);  // C key
    user32.keybd_event(0x43, 0, 2, 0);  // Release C key
    user32.keybd_event(0x11, 0, 2, 0);  // Release Ctrl key

    console.log('Simulated Ctrl + C, content copied (assuming success).');

    // Now simulate a delay for clipboard processing (if done manually)
    setTimeout(() => {
        console.log('Content copied, checking if the disguise percentage is available...');
        
        // Here you would check the clipboard for the disguise percentage using external tools, or log the expected outcome.
        console.log('Ideally, you would use an external tool to read the copied content here.');
    }, 1000);  // Delay before checking
}




function openDevTools() {
    console.log('Opening Developer Tools...');
    // Simulate Ctrl + Shift + I to open DevTools
    user32.keybd_event(VK_CONTROL, 0, 0, 0);  
    user32.keybd_event(VK_SHIFT, 0, 0, 0);  
    user32.keybd_event(VK_I, 0, 0, 0);    
    user32.keybd_event(VK_I, 0, 2, 0);   
    user32.keybd_event(VK_SHIFT, 0, 2, 0);  
    user32.keybd_event(VK_CONTROL, 0, 2, 0); 


    setTimeout(() => {
        // copyBodyTagFromInspect();
        // copySpecificElement(); 
        // copySpecificElementFromInspect(); 
        copyDisguisePercentage()
    }, 3000);
}



function copyBodyTagFromInspect() {
    console.log('Opening Developer Tools and copying <body> tag from Inspect Element...');

    // Simulate Ctrl + Shift + I to open Developer Tools if not already open
    user32.keybd_event(VK_CONTROL, 0, 0, 0);  
    user32.keybd_event(VK_SHIFT, 0, 0, 0);  
    user32.keybd_event(VK_I, 0, 0, 0);    
    user32.keybd_event(VK_I, 0, 2, 0);   
    user32.keybd_event(VK_SHIFT, 0, 2, 0);  
    user32.keybd_event(VK_CONTROL, 0, 2, 0);

    // Wait for DevTools to open and focus
    setTimeout(() => {
        console.log('Navigating to the Elements tab...');
        // Simulate Ctrl + Shift + C to open the inspect tool (select elements)
        user32.keybd_event(VK_CONTROL, 0, 0, 0);  
        user32.keybd_event(VK_SHIFT, 0, 0, 0);  
        user32.keybd_event(VK_C, 0, 0, 0);    
        user32.keybd_event(VK_C, 0, 2, 0);   
        user32.keybd_event(VK_SHIFT, 0, 2, 0);  
        user32.keybd_event(VK_CONTROL, 0, 2, 0);

        setTimeout(() => {
            console.log('Directly selecting the <body> tag...');
            // Simulate Tab key to focus on the elements tree and then Arrow Down to find <body>
            user32.keybd_event(0x09, 0, 0, 0);  // Simulate Tab key
            user32.keybd_event(0x09, 0, 2, 0);  // Release Tab key
            setTimeout(() => {
                // Increase the number of arrow key presses to navigate
                for (let i = 0; i < 20; i++) {  // Increase to 20 or more depending on the structure
                    user32.keybd_event(0x26, 0, 0, 0);  // 0x26 is the "Arrow Down" key
                    user32.keybd_event(0x26, 0, 2, 0);
                }

                setTimeout(() => {
                    console.log('Attempting to click <body> tag and copy...');
                    // Simulate the Enter key to "click" the body tag (this may focus it)
                    user32.keybd_event(0x0D, 0, 0, 0);  // Enter key to simulate clicking the <body> tag
                    user32.keybd_event(0x0D, 0, 2, 0);  // Release Enter key

                    setTimeout(() => {
                        // Now that the body tag is selected, simulate pressing "Ctrl + C" to copy it.
                        user32.keybd_event(VK_CONTROL, 0, 0, 0);  
                        user32.keybd_event(0x43, 0, 0, 0);   // 0x43 is "C" key for copying
                        user32.keybd_event(0x43, 0, 2, 0);  
                        user32.keybd_event(VK_CONTROL, 0, 2, 0);

                        setTimeout(() => {
                            console.log('Body tag copied.');
                        }, 1000);
                    }, 1500);  // Wait to ensure copy happens after body tag is clicked
                }, 1000);  // Allow time for clicking to register
            }, 1000);  // Allow time for tabbing to the DOM elements
        }, 1000);  // Delay for tab to open
    }, 1000);  // Wait time to ensure DevTools is fully opened
}


function copySpecificElementFromInspect() {
    console.log('Opening Developer Tools and copying the specific <strong> tag...');

    // Simulate Ctrl + Shift + I to open Developer Tools if not already open
    user32.keybd_event(VK_CONTROL, 0, 0, 0);  
    user32.keybd_event(VK_SHIFT, 0, 0, 0);  
    user32.keybd_event(VK_I, 0, 0, 0);    
    user32.keybd_event(VK_I, 0, 2, 0);   
    user32.keybd_event(VK_SHIFT, 0, 2, 0);  
    user32.keybd_event(VK_CONTROL, 0, 2, 0);

    // Wait for DevTools to open and focus
    setTimeout(() => {
        console.log('Navigating to the Elements tab...');
        // Simulate Ctrl + Shift + C to open the inspect tool (select elements)
        user32.keybd_event(VK_CONTROL, 0, 0, 0);  
        user32.keybd_event(VK_SHIFT, 0, 0, 0);  
        user32.keybd_event(VK_C, 0, 0, 0);    
        user32.keybd_event(VK_C, 0, 2, 0);   
        user32.keybd_event(VK_SHIFT, 0, 2, 0);  
        user32.keybd_event(VK_CONTROL, 0, 2, 0);

        setTimeout(() => {
            console.log('Directly selecting the <strong> tag with ID "hidden_rating_link"...');
            // Simulate typing the selector for the specific element (ID selector)
            // First, press F12 to open the search bar
            user32.keybd_event(0x73, 0, 0, 0);  // F12 key
            user32.keybd_event(0x73, 0, 2, 0);  // Release F12 key

            setTimeout(() => {
                // Now type the selector "#hidden_rating_link" to focus on the target element
                user32.keybd_event(0x48, 0, 0, 0);  // H key for "h"
                user32.keybd_event(0x69, 0, 0, 0);  // I key for "i"
                user32.keybd_event(0x64, 0, 0, 0);  // D key for "d"
                user32.keybd_event(0x64, 0, 0, 0);  // D key for "d"
                user32.keybd_event(0x65, 0, 0, 0);  // E key for "e"
                user32.keybd_event(0x73, 0, 0, 0);  // S key for "s"
                user32.keybd_event(0x73, 0, 0, 0);  // S key for "s"
                user32.keybd_event(0x67, 0, 0, 0);  // G key for "g"
                user32.keybd_event(0x6E, 0, 0, 0);  // N key for "n"
                user32.keybd_event(0x69, 0, 0, 0);  // I key for "i"
                user32.keybd_event(0x74, 0, 0, 0);  // T key for "t"
                user32.keybd_event(0x5F, 0, 0, 0);  // "_" key for "_"
                user32.keybd_event(0x72, 0, 0, 0);  // R key for "r"
                user32.keybd_event(0x61, 0, 0, 0);  // A key for "a"
                user32.keybd_event(0x74, 0, 0, 0);  // T key for "t"
                user32.keybd_event(0x69, 0, 0, 0);  // I key for "i"
                user32.keybd_event(0x6E, 0, 0, 0);  // N key for "n"
                user32.keybd_event(0x67, 0, 0, 0);  // G key for "g"
                user32.keybd_event(0x5F, 0, 0, 0);  // "_" key for "_"
                user32.keybd_event(0x6C, 0, 0, 0);  // L key for "l"
                user32.keybd_event(0x69, 0, 0, 0);  // I key for "i"
                user32.keybd_event(0x6E, 0, 0, 0);  // N key for "n"
                user32.keybd_event(0x6B, 0, 0, 0);  // K key for "k"
                user32.keybd_event(0x0D, 0, 0, 0);  // Enter key to select

                setTimeout(() => {
                    console.log('Element found, now copying content...');

                    // Simulate pressing "Ctrl + C" to copy the element's content
                    user32.keybd_event(VK_CONTROL, 0, 0, 0);  
                    user32.keybd_event(0x43, 0, 0, 0);   // 0x43 is "C" key for copying
                    user32.keybd_event(0x43, 0, 2, 0);  
                    user32.keybd_event(VK_CONTROL, 0, 2, 0);

                    setTimeout(() => {
                        console.log('Specific <strong> tag copied.');
                    }, 1000);
                }, 1000);  // Wait to ensure the content is selected
            }, 1000);  // Time to type the selector and press Enter
        }, 1000);  // Wait for search bar to be ready
    }, 1000);  // Wait for DevTools to be fully opened
}

 // Run the function

 function copyDisguisePercentage() {
    // Select the element containing the disguise percentage
    const percentageElement = document.querySelector('#hidden_rating_link span');

    // Check if the element exists
    if (percentageElement) {
        // Extract the percentage text
        const percentageText = percentageElement.textContent;

        // Create a new element to temporarily hold the text for copying
        const tempInput = document.createElement('input');
        document.body.appendChild(tempInput);
        tempInput.value = `Your disguise: ${percentageText}`;

        // Select the text in the input field
        tempInput.select();
        tempInput.setSelectionRange(0, 99999); // For mobile devices

        // Copy the text to the clipboard
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        console.log('Copied to clipboard: ' + tempInput.value);
    } else {
        console.error('Percentage element not found!');
    }
}




checkBitBrowser();
