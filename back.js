const { exec } = require("child_process");
const ffi = require("ffi-napi");
const ref = require("ref-napi");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const user32 = ffi.Library("user32", {
  EnumWindows: ["bool", ["pointer", "int32"]],
  GetWindowTextA: ["int", ["pointer", "char *", "int"]],
  ShowWindow: ["bool", ["pointer", "int"]],
  SetForegroundWindow: ["bool", ["pointer"]],
  keybd_event: ["void", ["uint8", "uint8", "uint32", "uint32"]],
});
const SW_RESTORE = 9;
const SW_MAXIMIZE = 3;
const VK_CONTROL = 0x11;
const VK_T = 0x54;
const VK_ENTER = 0x0d;
const VK_W = 0x57;
const VK_H = 0x48;
const VK_O = 0x4f;
const VK_E = 0x45;
const VK_R = 0x52;
const VK_DOT = 0xbe;
const VK_N = 0x4e;
const VK_E2 = 0x45;
const VK_T2 = 0x54;
const VK_SHIFT = 0x10;
const VK_I = 0x49;
const VK_F = 0x46;
const VK_B = 0x42;
const VK_S = 0x53;
const VK_C = 0x43;
const VK_M = 0x4d;
const VK_UP = 0x26;
const VK_DOWN = 0x28;
const MAX_TITLE_LENGTH = 255;
function checkBitBrowser() {
  console.log("Checking if Bit Browser is running...");
  const tasklistCommand = "tasklist";
  exec(tasklistCommand, (err, tasklistOutput) => {
    if (err) {
      console.error(`Error executing tasklist: ${err.message}`);
      return;
    }
    const bitBrowserLine = tasklistOutput
      .split("\n")
      .find((line) => line.toLowerCase().includes("bitbrowser"));
    if (!bitBrowserLine) {
      console.log("Bit Browser is not running.");
      process.exit(1);
    } else {
      console.log("Bit Browser is running.");
      maximizeSpecificBitBrowserWindow();
    }
  });
}
function maximizeSpecificBitBrowserWindow() {
  console.log("Attempting to find and maximize any Bit Browser window...");
  const titlePattern = /- BitBrowser$/;
  const callback = ffi.Callback(
    "bool",
    ["pointer", "int32"],
    (hwnd, lParam) => {
      const buffer = Buffer.alloc(MAX_TITLE_LENGTH);
      user32.GetWindowTextA(hwnd, buffer, MAX_TITLE_LENGTH);
      const title = buffer.toString("utf8").replace(/\0/g, "").trim();
      if (titlePattern.test(title)) {
        console.log(`Found Bit Browser window: "${title}"`);
        user32.ShowWindow(hwnd, SW_RESTORE);
        user32.ShowWindow(hwnd, SW_MAXIMIZE);
        user32.SetForegroundWindow(hwnd);
        simulateKeyPress();
        return false;
      }
      return true;
    }
  );
  user32.EnumWindows(callback, 0);
  console.log("Finished window search.");
}
function simulateKeyPress() {
  console.log(
    'Simulating key presses to open a new tab and enter "whoer.net" in the input field...'
  );
  user32.keybd_event(VK_CONTROL, 0, 0, 0);
  user32.keybd_event(VK_T, 0, 0, 0);
  user32.keybd_event(VK_T, 0, 2, 0);
  user32.keybd_event(VK_CONTROL, 0, 2, 0);
  setTimeout(() => {
    typeText([VK_W, VK_H, VK_O, VK_E, VK_R, VK_DOT, VK_N, VK_E2, VK_T2]);
    setTimeout(() => {
      hitEnter();
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
  const ENTER_KEY = 0x0d;
  user32.keybd_event(ENTER_KEY, 0, 0, 0);
  user32.keybd_event(ENTER_KEY, 0, 2, 0);
  // setTimeout(() => {
  //     openDevTools();
  // }, 7000);
  setTimeout(() => {
    howMuchPercentage();
  }, 7000);
}
function howMuchPercentage() {
  rl.question("Enter the percentage: ", (answer) => {
    const percentage = parseFloat(answer);
    if (isNaN(percentage)) {
      console.log("Please enter a valid number.");
    } else if (percentage === 100) {
      console.log(`You entered ${percentage}%. Opening a new tab...`);
      maximizeSpecificBitBrowserWindowTwo();
    } else {
      console.log(`You entered ${percentage}%. This is less than 100%`);
    }
    rl.close();
  });
}
function maximizeSpecificBitBrowserWindowTwo() {
  console.log("Attempting to find and maximize any Bit Browser window...");
  const titlePattern = /- BitBrowser$/;
  const callback = ffi.Callback(
    "bool",
    ["pointer", "int32"],
    (hwnd, lParam) => {
      const buffer = Buffer.alloc(MAX_TITLE_LENGTH);
      user32.GetWindowTextA(hwnd, buffer, MAX_TITLE_LENGTH);
      const title = buffer.toString("utf8").replace(/\0/g, "").trim();

      if (titlePattern.test(title)) {
        console.log(`Found Bit Browser window: "${title}"`);
        user32.ShowWindow(hwnd, SW_RESTORE);
        user32.ShowWindow(hwnd, SW_MAXIMIZE);
        user32.SetForegroundWindow(hwnd);
        simulateKeyPressTwo();
        return false;
      }

      return true;
    }
  );
  user32.EnumWindows(callback, 0);
  console.log("Finished window search.");
}
function simulateKeyPressTwo() {
    'Simulating key presses to open a new tab and enter "forbes.com" in the input field...'
  console.log(
  );
  user32.keybd_event(VK_CONTROL, 0, 0, 0);
  user32.keybd_event(VK_T, 0, 0, 0);
  user32.keybd_event(VK_T, 0, 2, 0);
  user32.keybd_event(VK_CONTROL, 0, 2, 0);
  setTimeout(() => {
    typeTextTwo([VK_F, VK_O, VK_R, VK_B, VK_E, VK_S, VK_DOT, VK_C, VK_O, VK_M]);
    setTimeout(() => {
      hitEnterTwo();
      setTimeout(() => {
        console.log("Process completed");
      }, 3000);
    }, 1500);
  }, 500);
}
function typeTextTwo(keys) {
  keys.forEach((key, index) => {
    setTimeout(() => {
      user32.keybd_event(key, 0, 0, 0);
      user32.keybd_event(key, 0, 2, 0);
    }, index * 150);
  });
}
function hitEnterTwo() {
  const ENTER_KEY = 0x0d;
  user32.keybd_event(ENTER_KEY, 0, 0, 0);
  user32.keybd_event(ENTER_KEY, 0, 2, 0);
  setTimeout(() => {
    // randomScroll()
    scrollThroughPages();
    // inspectFullPage()
  }, 3000);
}
function randomScroll() {
  const duration = 120000;
  let startTime = Date.now();

  const interval = setInterval(() => {
    const elapsedTime = Date.now() - startTime;

    if (elapsedTime >= duration) {
      clearInterval(interval);
      console.log("Stopped scrolling after 2 minutes.");
      return;
    }

    const direction = Math.random() < 0.5 ? "up" : "down";
    const holdTime = Math.floor(Math.random() * 1000) + 500;

    if (direction === "down") {
      console.log("Simulating scroll down...");
      user32.keybd_event(VK_DOWN, 0, 0, 0);
      user32.keybd_event(VK_DOWN, 0, 10, 0);
    } else {
      console.log("Simulating scroll up...");
      user32.keybd_event(VK_UP, 0, 0, 0);
      user32.keybd_event(VK_UP, 0, 10, 0);
    }

    setTimeout(() => {
      console.log(`Holding scroll for ${holdTime}ms`);
    }, holdTime);
  }, 1500);
}
function scrollThroughPages() {
  const pages = document.querySelectorAll("div.page"); // Adjust selector to match your page elements
  const duration = 120000; // Total duration to run the script (optional)
  let startTime = Date.now();
  let currentIndex = 0;

  function scrollPage(index) {
    if (index >= pages.length) {
      console.log("Finished scrolling through all pages.");
      return;
    }

    const elapsedTime = Date.now() - startTime;
    if (elapsedTime >= duration) {
      console.log("Stopped scrolling after 2 minutes.");
      return;
    }

    const page = pages[index];
    console.log(`Scrolling on page ${index + 1}/${pages.length}`);

    // Simulate scrolling (adjust as needed for your environment)
    page.scrollIntoView({ behavior: "smooth" });

    // Pause for 5 seconds on the current page
    setTimeout(() => {
      scrollPage(index + 1); // Move to the next page
    }, 5000);
  }

  scrollPage(currentIndex);
}
function inspectFullPage() {
  const texts = [];

  function extractTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) texts.push(text);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      node.childNodes.forEach(extractTextNodes);
    }
  }

  extractTextNodes(document.body);
  console.log(texts);
  return texts;
}

checkBitBrowser();
