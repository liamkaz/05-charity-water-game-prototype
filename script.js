// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

const waterJourneyStages = [
  {
    stage: 1,
    title: "The Crisis Begins",
    type: "choice",
    question: "You're tasked with helping accrue clean water for a village that is currently at a 0% water index! What’s the first thing you should do?",
    options: [
      { label: "Bring in bottled water", correct: false },
      { label: "Investigate the local water source", correct: true },
      { label: "Dig randomly for groundwater", correct: false }
    ],
    fact: "Understanding the existing conditions is the first step to solving the crisis."
  },
  {
    stage: 2,
    title: "Local Knowledge",
    type: "choice",
    question: "Villagers offer to guide you. What do you do?",
    options: [
      { label: "Politely decline and explore alone", correct: false },
      { label: "Ask for their help mapping water sources", correct: true },
      { label: "Only speak to the local mayor", correct: false }
    ],
    fact: "Local insight can reveal safe paths, known problems, and cultural context."
  },
  {
    stage: 3,
    title: "Water Sources",
    type: "choice",
    question: "You find three nearby water sources. Which one should you choose?",
    options: [
      { label: "A clear-looking river downstream from a factory", correct: false },
      { label: "A nearby well used by livestock", correct: false },
      { label: "A distant spring in the hills", correct: true }
    ],
    fact: "Visual clarity doesn't mean safety. Pollution and bacteria are invisible."
  },
  {
    stage: 4,
    title: "Gathering Support",
    type: "choice",
    question: "How do you get the community on board?",
    options: [
      { label: "Hold a meeting and listen to their concerns", correct: true },
      { label: "Send a flyer around", correct: false },
      { label: "Wait until they ask for help", correct: false }
    ],
    fact: "Engagement builds ownership — and long-term success."
  },
  {
    stage: 5,
    title: "Choosing a Solution",
    type: "choice",
    question: "How should you bring clean water to the village?",
    options: [
      { label: "Truck in bottled water", correct: false },
      { label: "Build a borehole well", correct: true },
      { label: "Use rain barrels only", correct: false }
    ],
    fact: "A borehole well can last 20+ years and serve entire communities."
  },
  {
    stage: 6,
    title: "Funding the Project",
    type: "choice",
    question: "You’re short on funds to build the well. What’s the smartest approach?",
    options: [
      { label: "Cut corners and use cheaper materials", correct: false },
      { label: "Start a small local fundraiser with the village", correct: true },
      { label: "Delay the project indefinitely", correct: false }
    ],
    fact: "Even small fundraising efforts empower communities and raise awareness."
  },
  {
    stage: 7,
    title: "Long-Term Maintenance",
    type: "choice",
    question: "Who should maintain the well over time?",
    options: [
      { label: "A trained local water committee", correct: true },
      { label: "A foreign technician", correct: false },
      { label: "Hope it doesn’t break", correct: false }
    ],
    fact: "Local ownership ensures sustainability long after donors leave."
  },
  {
    stage: 8,
    title: "Facing a Setback",
    type: "choice",
    question: "The drilling rig breaks down. What now?",
    options: [
      { label: "Blame the equipment team", correct: false },
      { label: "Pause, fix it, and keep the community informed", correct: true },
      { label: "Abandon the project", correct: false }
    ],
    fact: "Transparency and perseverance build trust during delays."
  },
  {
    stage: 9,
    title: "Final Check",
    type: "choice",
    question: "The well is complete. What’s the next step?",
    options: [
      { label: "Test the water quality", correct: true },
      { label: "Celebrate and leave", correct: false },
      { label: "Let the villagers use it immediately", correct: false }
    ],
    fact: "Testing ensures that clean water stays safe over time."
  },
  {
    stage: 10,
    title: "Mission Accomplished",
    type: "choice",
    question: "What’s the best next step after solving the water problem?",
    options: [
      { label: "Leave and move on", correct: false },
      { label: "Share the story and educate others", correct: true },
      { label: "Build a pipeline to a nearby town without permission", correct: false }
    ],
    fact: "Raising awareness helps others join the cause — and spread solutions."
  }
];

let currentStage = 0;
let waterIndex = 0;
let gameStarted = false;

// Checklist state: true if checked, false if not
let checklistState = [false, false, false];
// Challenge flags for easier reference
let challengeTimeLimit = false;
let challengeRandomEvents = false;
let challengeHarderPenalties = false;

// Timer variables for the time limit challenge
let stageTimer = null;
let stageTimeLeft = 0;
const STAGE_TIME_LIMIT = 15; // seconds

// Helper function to clear any running timer
function clearStageTimer() {
  if (stageTimer) {
    clearInterval(stageTimer);
    stageTimer = null;
  }
  // Remove timer display if present
  const timerDiv = document.getElementById('timer-div');
  if (timerDiv && timerDiv.parentNode) {
    timerDiv.parentNode.removeChild(timerDiv);
  }
}

// Helper function to show the timer
function showStageTimer(seconds) {
  // Try to find the timer div
  let timerDiv = document.getElementById('timer-div');
  if (!timerDiv) {
    // If it doesn't exist, create it
    const container = document.querySelector('.game-container');
    timerDiv = document.createElement('div');
    timerDiv.id = 'timer-div';
    timerDiv.style.margin = '8px 0 12px 0';
    timerDiv.style.fontSize = '1.1rem';
    timerDiv.style.color = '#FFC907';
    timerDiv.style.fontWeight = 'bold';
    timerDiv.style.textAlign = 'center';
    // Insert timer above the question
    const questionDiv = document.getElementById('question-text');
    if (questionDiv && questionDiv.parentNode) {
      questionDiv.parentNode.insertBefore(timerDiv, questionDiv);
    }
  }
  // Just update the text
  timerDiv.textContent = `Time left: ${seconds}s`;
}

// Helper function to start the timer for a stage
function startStageTimer(onTimeout) {
  stageTimeLeft = STAGE_TIME_LIMIT;
  showStageTimer(stageTimeLeft);

  // Use setInterval to count down every second
  stageTimer = setInterval(() => {
    stageTimeLeft--;
    if (stageTimeLeft > 0) {
      showStageTimer(stageTimeLeft);
    } else {
      // Show 0 seconds left before timing out
      showStageTimer(0);
      clearStageTimer();
      onTimeout();
    }
  }, 1000);
}

// Helper function for random events
function maybeTriggerRandomEvent(afterCorrect, callback) {
  // Only trigger if challenge is enabled and after a correct answer
  if (!challengeRandomEvents || !afterCorrect) {
    callback();
    return;
  }
  // 40% chance of random event
  if (Math.random() < 0.4) {
    // Pick a random event
    const events = [
      {
        text: "A sudden drought hits! Lose 10% water index.",
        effect: () => { waterIndex = Math.max(0, waterIndex - 10); }
      },
      {
        text: "A donor is inspired by your work! Gain 10% water index.",
        effect: () => { waterIndex = Math.min(100, waterIndex + 10); }
      },
      {
        text: "A road is blocked. You must skip the next stage.",
        effect: () => { currentStage = Math.min(currentStage + 1, waterJourneyStages.length - 1); }
      }
    ];
    const event = events[Math.floor(Math.random() * events.length)];
    showAlertAboveButtons(event.text, "warning");
    event.effect();
    updateWaterIndexColor();
    setTimeout(callback, 1500);
  } else {
    callback();
  }
}

// Update startGameHandler to read challenge flags
function startGameHandler() {
  if (gameStarted) return; // Prevent multiple starts
  gameStarted = true;

  // Read challenge flags from checklistState
  challengeTimeLimit = checklistState[0];
  challengeRandomEvents = checklistState[1];
  challengeHarderPenalties = checklistState[2];

  // Reset the stage and score for a new game
  currentStage = 0;
  waterIndex = 0;

  // Render the stage UI
  renderStageUI();
  // Load the first stage (this will attach listeners)
  loadStage(currentStage);

  updateProgressBar();
  setResetButtonVisibility(true);
}

// Function to render the stage UI
function renderStageUI() {
  const container = document.querySelector('.game-container');
  // Add a dedicated alert container above the choices
  container.innerHTML = `
    <div style="
      color: white;
      font-size: 1.5rem;
      font-family: 'proxima-nova', Arial, Helvetica, sans-serif;
      margin-bottom: 4px;
      text-align: center;
    "><strong>Journey Progress</strong></div>
    <div class="progress-bar-container" style="
      width: 100%;
      max-width: 400px;
      height: 28px;
      background: #eaf6fd;
      border: 2px solid #154c79;
      border-radius: 10px;
      margin: 18px auto 18px auto;
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div class="progress-bar-fill" id="progressBarFill" style="
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, #2E9DF7 70%, #154c79 100%);
        transition: width 0.7s ease;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
      "></div>
      <span id="stage-label" style="
        position: relative;
        z-index: 2;
        color: #063970;
        font-size: 1rem;
        font-family: 'proxima-nova', Arial, Helvetica, sans-serif;
        width: 100%;
        text-align: center;
        pointer-events: none;
        user-select: none;
      "></span>
    </div>
    <div id="question-text" style="margin-bottom: 18px;"></div>
    <div id="alert-container"></div>
    <!-- Each choice-row contains an image and a button. The image is hidden by default and shown on button hover. -->
    <div class="choice-row" style="display: flex; align-items: center; margin-bottom: 8px;">
      <img id="choice-img-0" class="choice-img" style="width: 48px; height: 48px; margin-right: 8px; display: none;" alt="">
      <button class="choice-button" data-choice="0"></button>
    </div>
    <div class="choice-row" style="display: flex; align-items: center; margin-bottom: 8px;">
      <img id="choice-img-1" class="choice-img" style="width: 48px; height: 48px; margin-right: 8px; display: none;" alt="">
      <button class="choice-button" data-choice="1"></button>
    </div>
    <div class="choice-row" style="display: flex; align-items: center; margin-bottom: 8px;">
      <img id="choice-img-2" class="choice-img" style="width: 48px; height: 48px; margin-right: 8px; display: none;" alt="">
      <button class="choice-button" data-choice="2"></button>
    </div>
    <div id="water-index" style="margin-top: 18px;"></div>
  `;

  // Add event listeners to show/hide images on button hover
  // We will later disable these when a choice is made
  for (let i = 0; i < 3; i++) {
    const btn = container.querySelector(`.choice-button[data-choice="${i}"]`);
    const img = container.querySelector(`#choice-img-${i}`);
    if (btn && img) {
      btn._mouseenterHandler = () => { img.style.display = ''; };
      btn._mouseleaveHandler = () => { img.style.display = 'none'; };
      btn.addEventListener('mouseenter', btn._mouseenterHandler);
      btn.addEventListener('mouseleave', btn._mouseleaveHandler);
    }
  }
}

// Update loadStage to start timer if needed
function loadStage(index) {
  clearStageTimer(); // Always clear timer before loading a new stage

  const stage = waterJourneyStages[index];
  document.getElementById('question-text').textContent = stage.question;
  const buttons = document.querySelectorAll('.choice-button');
  // Show/hide buttons and images based on number of options
  buttons.forEach((btn, i) => {
    const img = document.getElementById(`choice-img-${i}`);
    if (stage.options[i]) {
      btn.style.display = '';
      btn.textContent = `${String.fromCharCode(65 + i)}: ${stage.options[i].label}`;
      // Set the image source and alt text for each choice
      const stageNum = index + 1;
      const choiceLetter = String.fromCharCode(97 + i); // 0 -> 'a', 1 -> 'b', 2 -> 'c'
      img.style.display = '';
      img.src = `img/${stageNum}${choiceLetter}.png`;
      img.alt = `Choice ${String.fromCharCode(65 + i)} image for stage ${stageNum}`;
    } else {
      btn.style.display = 'none';
      if (img) {
        img.style.display = 'none';
      }
    }
  });

  // Update the stage label inside the progress bar
  document.getElementById('stage-label').textContent = `Stage ${index + 1}/10`;
  document.getElementById('water-index').innerHTML = `Village Water Index: <span id="waterIndexValue">${waterIndex}%</span>`;
  updateWaterIndexColor();

  // If time limit challenge is active, start timer for this stage
  if (challengeTimeLimit) {
    startStageTimer(() => {
      // If time runs out, treat as incorrect answer
      document.querySelectorAll('.choice-button').forEach(btn => btn.disabled = true);
      showAlertAboveButtons("Time's up!", "warning");
      setTimeout(() => {
        // Show correct answer
        const correctLabel = waterJourneyStages[currentStage].options.find(opt => opt.correct).label;
        showAlertAboveButtons(`The correct answer should be "${correctLabel}."`, "warning");
        // Apply penalty for wrong answer
        if (challengeHarderPenalties) {
          waterIndex = Math.max(0, waterIndex - 20);
        } else if (waterIndex > 0) {
          waterIndex -= 10;
        }
        updateWaterIndexColor();
        // Show fact, then move to next stage
        setTimeout(() => {
          showAlertAboveButtons(waterJourneyStages[currentStage].fact, "info");
          setTimeout(() => {
            currentStage++;
            updateProgressBar();
            if (currentStage < waterJourneyStages.length) {
              loadStage(currentStage);
            } else {
              endGame();
            }
          }, 1500);
        }, 1500);
      }, 1000);
    });
  }

  // Attach event listeners to the current stage's buttons (only once per stage)
  attachChoiceButtonListeners();
}

// Function to create simple confetti using DOM elements
function showConfetti() {
  // Create a container for confetti
  const confettiContainer = document.createElement('div');
  confettiContainer.id = 'confetti-container';
  confettiContainer.style.position = 'fixed';
  confettiContainer.style.left = '0';
  confettiContainer.style.top = '0';
  confettiContainer.style.width = '100vw';
  confettiContainer.style.height = '100vh';
  confettiContainer.style.pointerEvents = 'none';
  confettiContainer.style.zIndex = '10000'; // Make sure it's above everything

  // Add 80 confetti pieces for a bigger effect
  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement('div');
    // Random position and color
    const left = Math.random() * 100;
    const delay = Math.random() * 1;
    const duration = 3 + Math.random() * 2; // Longer duration
    const size = 12 + Math.random() * 12;   // Bigger size
    const colors = ['#2E9DF7', '#FFD700', '#FF69B4', '#32CD32', '#FF4500', '#00CED1'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.position = 'absolute';
    confetti.style.left = `${left}vw`;
    confetti.style.top = '-20px';
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size * 0.6}px`;
    confetti.style.background = color;
    confetti.style.borderRadius = '3px';
    confetti.style.opacity = '0.8';
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    // Animation using CSS
    confetti.style.transition = `top ${duration}s linear ${delay}s`;

    // Start the falling animation
    setTimeout(() => {
      confetti.style.top = '90vh';
    }, 100);

    // After the falling animation is done, fade out the confetti
    setTimeout(() => {
      confetti.style.transition = 'opacity 0.7s'; // Fade out over 0.7 seconds
      confetti.style.opacity = '0';
    }, (duration + delay) * 1000); // Wait for fall to finish

    confettiContainer.appendChild(confetti);
  }

  // Add confetti to the body
  document.body.appendChild(confettiContainer);

  // Remove confetti after 6 seconds (longer)
  setTimeout(() => {
    if (confettiContainer.parentNode) {
      confettiContainer.parentNode.removeChild(confettiContainer);
    }
  }, 6000);
}

// Function to handle end of game
function endGame() {
  // Show the final score with a span for coloring
  document.querySelector('.game-container').innerHTML = `
    <h2>You've completed the journey!</h2>
    <p>Your final Village Water Index: <span id="finalWaterIndexValue">${waterIndex}%</span></p>
    <p>Thank you for playing and learning about clean water!</p>
  `;
  // Update the color of the final water index
  updateFinalWaterIndexColor();

  // Show confetti if the player did well (70% or higher)
  if (waterIndex >= 70) {
    showConfetti(); // Show celebration confetti!
  }
}

// Helper function to color the final water index at the end screen
function updateFinalWaterIndexColor() {
  const finalSpan = document.getElementById('finalWaterIndexValue');
  if (!finalSpan) return;

  // Change color based on the value, same logic as updateWaterIndexColor
  if (waterIndex == 100) {
    finalSpan.style.color = 'lightgreen';
  } else if (waterIndex >= 70) {
    finalSpan.style.color = 'green';
  } else if (waterIndex >= 40) {
    finalSpan.style.color = 'orange';
  } else {
    finalSpan.style.color = 'red';
  }
}

// Helper function to color the water index during the game
function updateWaterIndexColor() {
  // Get the span that shows the current water index
  const waterSpan = document.getElementById('waterIndexValue');
  if (!waterSpan) return;

  // Change color based on the value, same logic as updateFinalWaterIndexColor
  if (waterIndex == 100) {
    waterSpan.style.color = 'lightgreen';
  } else if (waterIndex >= 70) {
    waterSpan.style.color = 'green';
  } else if (waterIndex >= 40) {
    waterSpan.style.color = 'orange';
  } else {
    waterSpan.style.color = 'red';
  }
}

// Helper function to show a Bootstrap-style alert above the buttons
function showAlertAboveButtons(message, type = "info") {
  // Use the dedicated alert container
  const alertContainer = document.getElementById('alert-container');
  if (!alertContainer) return;

  // Remove any existing alert
  alertContainer.innerHTML = '';

  // Create a new alert div
  const alertDiv = document.createElement('div');
  alertDiv.id = 'journey-alert';
  alertDiv.className = `alert alert-${type}`;
  alertDiv.style.margin = "16px 0";
  alertDiv.style.padding = "12px";
  alertDiv.style.border = "2px solid #2E9DF7";
  alertDiv.style.background = "#eaf6fd";
  alertDiv.style.color = "#063970";
  alertDiv.style.borderRadius = "8px";
  alertDiv.style.fontSize = "1rem";
  alertDiv.style.fontFamily = "'proxima-nova', Arial, Helvetica, sans-serif";
  alertDiv.style.textAlign = "center";
  alertDiv.textContent = message;

  // Add the alert to the alert container
  alertContainer.appendChild(alertDiv);

  // Remove alert after 1.5 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.parentNode.removeChild(alertDiv);
    }
  }, 1500);
}

// Helper function to play a sound effect
function playSoundEffect(src) {
  // Create a new audio element
  const audio = new Audio(src);
  // Play the audio
  audio.play();
}

// Update the attachChoiceButtonListeners function to avoid stacking event listeners
function attachChoiceButtonListeners() {
  // Select all choice buttons
  const buttons = document.querySelectorAll('.choice-button');
  // Loop through each button
  buttons.forEach((button) => {
    // Remove any previous click event by setting onclick to null
    // This ensures only one click handler is active at a time
    button.onclick = null;
    // Enable the button for the new stage
    button.disabled = false;
    // Add a click event handler to the button
    button.onclick = (e) => {
      // Stop the timer if running
      clearStageTimer();
      // Get which choice was clicked
      const choice = parseInt(e.target.dataset.choice);
      // Check if the answer is correct
      const isCorrect = waterJourneyStages[currentStage].options[choice].correct;

      // Disable all buttons after a choice is made
      document.querySelectorAll('.choice-button').forEach(btn => btn.disabled = true);

      // Hide all images and remove their hover event listeners so they can't appear
      for (let i = 0; i < 3; i++) {
        const btn = document.querySelector(`.choice-button[data-choice="${i}"]`);
        const img = document.getElementById(`choice-img-${i}`);
        if (img) {
          img.style.display = 'none';
        }
        // Remove hover event listeners for images
        if (btn && btn._mouseenterHandler && btn._mouseleaveHandler) {
          btn.removeEventListener('mouseenter', btn._mouseenterHandler);
          btn.removeEventListener('mouseleave', btn._mouseleaveHandler);
        }
        // Restore the parent .choice-row display to default (flex)
        if (btn && btn.parentNode && btn.parentNode.classList.contains('choice-row')) {
          btn.parentNode.style.display = 'flex';
        }
      }

      // Handle correct answer
      if (isCorrect) {
        // Play win sound
        playSoundEffect('audio/win.mp3');
        waterIndex = Math.min(100, waterIndex + 10);
        showAlertAboveButtons("Correct!", "success");
        // Wait 1 second, then show the fact
        setTimeout(() => {
          showAlertAboveButtons(waterJourneyStages[currentStage].fact, "info");
          // Wait another 1.5 seconds, then maybe trigger random event, then go to the next stage
          setTimeout(() => {
            // If random events are enabled, maybe trigger one after a correct answer
            maybeTriggerRandomEvent(true, () => {
              currentStage++;
              updateProgressBar();
              // Show halfway alert after finishing stage 5 (index 5, after increment)
              if (currentStage === 5) {
                // Show a special alert for halfway mark
                showAlertAboveButtons("You're halfway through the journey! Keep going!", "success");
                // Wait 1.5 seconds before loading the next stage
                setTimeout(() => {
                  if (currentStage < waterJourneyStages.length) {
                    loadStage(currentStage);
                  } else {
                    endGame();
                  }
                }, 1500);
              } else {
                if (currentStage < waterJourneyStages.length) {
                  loadStage(currentStage);
                } else {
                  endGame();
                }
              }
            });
          }, 1500); // Wait for the fact message to show
        }, 1000); // Wait for the "Correct!" message to show
      } else {
        // Play lose sound
        playSoundEffect('audio/lose.mp3');
        // Handle wrong answer with penalty
        if (challengeHarderPenalties) {
          waterIndex = Math.max(0, waterIndex - 20);
        } else if (waterIndex > 0) {
          waterIndex -= 10;
        }
        showAlertAboveButtons("Not quite...", "warning");
        // Wait 1 second, then show the correct answer
        setTimeout(() => {
          const correctLabel = waterJourneyStages[currentStage].options.find(opt => opt.correct).label;
          showAlertAboveButtons(`The correct answer should be "${correctLabel}."`, "warning");
          // Wait another 1 second, then show the fact
          setTimeout(() => {
            showAlertAboveButtons(waterJourneyStages[currentStage].fact, "info");
            // Wait another 1.5 seconds, then go to the next stage
            setTimeout(() => {
              // For wrong answers, random events do NOT trigger (per challenge rules)
              currentStage++;
              updateProgressBar();
              if (currentStage < waterJourneyStages.length) {
                loadStage(currentStage);
              } else {
                endGame();
              }
            }, 1500); // Wait for the fact message to show
          }, 1500); // Wait for the correct answer message to show
        }, 1000); // Wait for the "Not quite..." message to show
      }
    };
  });
}

// Update the progress bar based on the current stage
function updateProgressBar() {
  // Get the progress bar fill element inside the game container
  const progressBar = document.getElementById('progressBarFill');
  // Calculate progress as a percentage
  const percent = ((currentStage + 1) / waterJourneyStages.length) * 100;
  // Set the width of the fill if the progress bar exists
  if (progressBar) {
    progressBar.style.width = `${percent}%`;
  }
}

function setResetButtonVisibility(visible) {
  const resetButton = document.getElementById('resetGameButton');
  if (resetButton) {
    if (visible) {
      resetButton.classList.remove('hidden'); // Remove 'hidden' class to show
    }else {
      resetButton.classList.add('hidden'); // Add 'hidden' class to hide
    }
  }
}

// Helper function to update checklistState when a checkbox is clicked
function setupChecklistListeners() {
  // For each checklist item
  for (let i = 0; i < checklistState.length; i++) {
    const checkbox = document.getElementById(`checklist-${i}`);
    if (checkbox) {
      // Remove any previous event listener by replacing with a clone
      const newCheckbox = checkbox.cloneNode(true);
      checkbox.parentNode.replaceChild(newCheckbox, checkbox);
      // Set checked property based on checklistState
      newCheckbox.checked = checklistState[i];
      // Add event listener
      newCheckbox.addEventListener('change', (e) => {
        checklistState[i] = e.target.checked;
        // For debugging: log the checklist state
        console.log(`Checklist item ${i} is now ${checklistState[i]}`);
      });
    }
  }
}

// Helper function to reset checklist state and UI
function resetChecklist() {
  checklistState = [false, false, false];
  for (let i = 0; i < checklistState.length; i++) {
    const checkbox = document.getElementById(`checklist-${i}`);
    if (checkbox) {
      checkbox.checked = false;
    }
  }
}

// Helper function to clear the game container content
function clearGameContainer() {
  // Find the game container and clear its HTML
  const container = document.querySelector('.game-container');
  if (container) {
    container.innerHTML = '';
  }
}

// After the DOM is loaded, set up checklist listeners and attach the start button event listener if present
window.addEventListener('DOMContentLoaded', () => {
  setupChecklistListeners();
  // Attach start button event listener if it exists (for initial HTML)
  const startBtn = document.getElementById('startGameButton');
  if (startBtn) {
    startBtn.addEventListener('click', startGameHandler);
  }
});

// When the game is reset, also reset the checklist and clear timer
document.getElementById('resetGameButton').addEventListener('click', () => {
  clearStageTimer();
  // Clear the game container and reset variables
  clearGameContainer();
  gameStarted = false;
  currentStage = 0;
  waterIndex = 0;
  showInitialGameScreen();
  setResetButtonVisibility(false);
  resetChecklist();
  setupChecklistListeners();
});

// When the initial game screen is shown, also set up checklist listeners
function showInitialGameScreen() {
  const container = document.querySelector('.game-container');
  // Add the checklist section to the start screen
  container.innerHTML = `
    <div class="start-section">
      <h1>Charity Water Game Prototype</h1>
      <button id="startGameButton" class="start-btn pixel-btn">Start Game</button>
      <p>Click the button above to start the game.</p>
      <p class="note-text">Note: This is a prototype and does not include all game features.</p>
    </div>
    <div id="checklist-section" style="margin-top: 24px; text-align: left;">
      <h3 style="color: #FFC907;">Current Challenges</h3>
      <ul style="list-style: none; padding: 0;">
        <li>
          <input type="checkbox" id="checklist-0">
          <label for="checklist-0">Time Limit</label>
        </li>
        <li>
          <input type="checkbox" id="checklist-1">
          <label for="checklist-1">Random Events</label>
        </li>
        <li>
          <input type="checkbox" id="checklist-2">
          <label for="checklist-2">Harder Penalties</label>
        </li>
      </ul>
    </div>
  `;
  // Re-attach the start button event listener
  document.getElementById('startGameButton').addEventListener('click', startGameHandler);
  setupChecklistListeners();
}

// Do not start the game automatically on page load
