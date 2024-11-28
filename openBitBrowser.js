const { exec } = require('child_process');

function openBitBrowser(profileName) {
    const BIT_BROWSER_EXECUTABLE = "BitBrowser Global.exe";
    const BIT_BROWSER_PATH = `"C:\\Users\\Fahad MK\\AppData\\Local\\Programs\\BitBrowser Global\\BitBrowser Global.exe"`;

    // Command to check if Bit Browser is running
    exec(`tasklist /FI "IMAGENAME eq ${BIT_BROWSER_EXECUTABLE}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error checking processes: ${error.message}`);
            return;
        }
        if (stderr) {
            console.warn(`Tasklist stderr: ${stderr}`);
        }

        // Log tasklist output for debugging
        console.log('Tasklist Output:', stdout);

        // If Bit Browser is running, switch to the requested profile
        if (stdout.includes(BIT_BROWSER_EXECUTABLE)) {
            console.log('Bit Browser is already open. Attempting to switch profile...');
            const PROFILE_COMMAND = `${BIT_BROWSER_PATH} --profile="${profileName}"`;

            console.log(`Running command to switch profile: ${PROFILE_COMMAND}`);
            exec(PROFILE_COMMAND, (profileError, profileStdout, profileStderr) => {
                if (profileError) {
                    console.error(`Error switching to profile: ${profileError.message}`);
                    return;
                }
                if (profileStderr) {
                    console.warn(`Profile stderr: ${profileStderr}`);
                }
                console.log(`Profile switch output: ${profileStdout}`);
            });
        } else {
            // If Bit Browser is not running, open it with the requested profile
            console.log('Bit Browser is not open. Opening with the requested profile...');
            const OPEN_PROFILE_COMMAND = `${BIT_BROWSER_PATH} --profile="${profileName}"`;

            console.log(`Running command to open Bit Browser with profile: ${OPEN_PROFILE_COMMAND}`);
            exec(OPEN_PROFILE_COMMAND, (openError, openStdout, openStderr) => {
                if (openError) {
                    console.error(`Error opening Bit Browser with profile: ${openError.message}`);
                    return;
                }
                if (openStderr) {
                    console.warn(`Profile stderr: ${openStderr}`);
                }
                console.log(`Bit Browser opened with profile "${profileName}": ${openStdout}`);
            });
        }
    });
}

const profileName = "Browser Profile";
openBitBrowser(profileName);
