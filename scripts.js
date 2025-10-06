// ===== GAME STATE VARIABLES =====
const TARGET_WORD = "WORDS";  // Our secret word for testing
let currentRow = 0;           // Which row we're filling (0-5)
let currentTile = 0;          // Which tile in the row (0-4)
let gameOver = false;         // Is the game finished?

// DOM element references (set up on page load)
let gameBoard, rows, debugOutput;

// ===== HELPER FUNCTIONS (PROVIDED) =====

// Debug/Testing Functions
function logDebug(message, type = 'info') {
    // Log to browser console
    console.log(message);
    
    // Also log to visual testing area
    if (!debugOutput) {
        debugOutput = document.getElementById('debug-output');
    }
    
    if (debugOutput) {
        const entry = document.createElement('div');
        entry.className = `debug-entry ${type}`;
        entry.innerHTML = `
            <span style="color: #666; font-size: 12px;">${new Date().toLocaleTimeString()}</span> - 
            ${message}
        `;
        
        // Add to top of debug output
        debugOutput.insertBefore(entry, debugOutput.firstChild);
        
        // Keep only last 20 entries for performance
        const entries = debugOutput.querySelectorAll('.debug-entry');
        if (entries.length > 20) {
            entries[entries.length - 1].remove();
        }
    }
}

function clearDebug() {
    const debugOutput = document.getElementById('debug-output');
    if (debugOutput) {
        debugOutput.innerHTML = '<p style="text-align: center; color: #999; font-style: italic;">Debug output cleared - ready for new messages...</p>';
    }
}

// Helper function to get current word being typed
function getCurrentWord() {
    const currentRowElement = rows[currentRow];
    const tiles = currentRowElement.querySelectorAll('.tile');
    let word = '';
    tiles.forEach(tile => word += tile.textContent);
    return word;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    gameBoard = document.querySelector('.game-board');
    rows = document.querySelectorAll('.row');
    debugOutput = document.getElementById('debug-output');
    
    logDebug("🎮 Game initialized successfully!", 'success');
    logDebug(`🎯 Target word: ${TARGET_WORD}`, 'info');
    logDebug("💡 Try typing letters, pressing Backspace, or Enter", 'info');
});

// ===== YOUR CHALLENGE: IMPLEMENT THESE FUNCTIONS =====

// TODO: Add keyboard event listener
// document.addEventListener("keydown", (event) => {
//     // Your code here!
// });
document.addEventListener("keydown", (event) => {
  logDebug(`Key pressed: ${event.key}`);

  if (gameOver) return;

  const key = event.key.toUpperCase();

  if (key === "BACKSPACE") {
    deleteLetter();
  } else if (key === "ENTER") {
    submitGuess();
  } else if (/^[A-Z]$/.test(key)) {
    addLetter(key);
  } else {
    logDebug(`Ignored key: ${event.key}`);
  }
});

// TODO: Implement addLetter function
// function addLetter(letter) {
//     // Your code here!
// }

function addLetter(letter) {
  logDebug(`addLetter("${letter}") called`);

  
  if (currentTile >= 5) {
    logDebug("Row is full — ignoring extra letters");
    return;
  }

  const rowElement = rows[currentRow];
  const tiles = rowElement.querySelectorAll('.tile');

  const tile = tiles[currentTile];
  tile.textContent = letter;
  tile.classList.add('filled');
  
  currentTile += 1;

  logDebug(`Added "${letter}" to position ${currentTile - 1}`);
  logDebug(`Current word: ${getCurrentWord()}`);
}


// TODO: Implement deleteLetter function  
// function deleteLetter() {
//     // Your code here!
// }

function deleteLetter() {
  logDebug(`🗑️ deleteLetter() called`, 'info');

  if (currentTile <= 0) {
    logDebug("No letters to delete", "error");
    return;
  }

  currentTile--;

  const rowElement = rows[currentRow];
  const tiles = rowElement.querySelectorAll('.tile');
  const tile = tiles[currentTile];

  const letterBeingDeleted = tile.textContent;

  tile.textContent = '';
  tile.classList.remove('filled');

  logDebug(`Deleted '${letterBeingDeleted}' from position ${currentTile}`, 'info');
  logDebug(`Current word: ${getCurrentWord()}`, 'info');
}


// TODO: Implement submitGuess function
// function submitGuess() {
//     // Your code here!
// }

function submitGuess() {
  logDebug(`🚀 submitGuess() called`, 'info');

  if (currentTile !== 5) {
    alert("Please enter 5 letters!");
    return;
  }

  const rowEl = rows[currentRow];
  const tiles = rowEl.querySelectorAll('.tile');
  const guess = Array.from(tiles).map(t => t.textContent).join('');

  logDebug(`Guess: ${guess} | Target: ${TARGET_WORD}`, 'info');

  const result = checkGuess(guess, tiles);
  logDebug(`Result: ${JSON.stringify(result)}`, 'info');

  if (guess === TARGET_WORD) {
    gameOver = true;
    setTimeout(() => alert("Congratulations! You won!"), 500);
    return;
  }

  currentRow++;
  currentTile = 0;

  if (currentRow >= 6) {
    gameOver = true;
    setTimeout(() => alert("Game over!"), 100);
  }
}


// TODO: Implement checkGuess function (the hardest part!)
// function checkGuess(guess, tiles) {
//     // Your code here!
//     // Remember: handle duplicate letters correctly
//     // Return the result array
// }

function checkGuess(guess, tiles) {
  logDebug(`🔍 Starting analysis for "${guess}"`, 'info');

  let target = TARGET_WORD.split('');
  let guessArray = guess.split('');
  const result = ['absent', 'absent', 'absent', 'absent', 'absent'];

  for (let i = 0; i < 5; i++) {
    if (guessArray[i] === target[i]) {
      result[i] = 'correct';
      target[i] = null;
      guessArray[i] = null;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (guessArray[i] != null) {
      const idx = target.indexOf(guessArray[i]);
      if (idx !== -1) {
        result[i] = 'present';
        target[idx] = null;
      }
    }
  }

  for (let i = 0; i < 5; i++) {
    tiles[i].classList.remove('correct', 'present', 'absent');
    tiles[i].classList.add(result[i]);
  }

  logDebug(`Result: ${JSON.stringify(result)}`, 'info');
  return result;
}
