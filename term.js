const readline = require('readline');

// Create an interface for input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function howMuchPercentage() {
  // Ask the user for the percentage
  rl.question('Enter the percentage: ', (answer) => {
    // Convert the answer to a number
    const percentage = parseFloat(answer);
    
    // Check if the input is a valid number
    if (isNaN(percentage)) {
      console.log('Please enter a valid number.');
    } else {
      console.log(`You entered ${percentage}%`);
    }

    // Close the readline interface
    rl.close();
  });
}

// Call the function
howMuchPercentage();
