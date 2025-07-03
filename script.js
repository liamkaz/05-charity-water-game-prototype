// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

const waterJourneyStages = [
  {
    stage: 1,
    title: "The Crisis Begins",
    type: "choice",
    question: "What’s the first thing you should do?",
    options: [
      { label: "Bring in bottled water", correct: false },
      { label: "Investigate the local water source", correct: true },
      { label: "Dig randomly for groundwater", correct: false }
    ],
    fact: "Understanding the existing conditions is the first step to solving the crisis."
  },
  {
    stage: 2,
    title: "Mapping the Problem",
    type: "trivia",
    question: "What percentage of the world’s population lacks access to safe drinking water?",
    options: [
      { label: "1%", correct: false },
      { label: "10%", correct: true },
      { label: "25%", correct: false }
    ],
    fact: "771 million people lack access to clean water. That’s more than twice the population of the U.S."
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
    title: "Hidden Dangers",
    type: "trivia",
    question: "What is the most common cause of water-related illness in developing countries?",
    options: [
      { label: "Chemicals", correct: false },
      { label: "Bacteria and parasites", correct: true },
      { label: "Salt", correct: false }
    ],
    fact: "Contaminated water can cause diarrhea, cholera, and other deadly illnesses."
  },
  {
    stage: 5,
    title: "Choosing a Solution",
    type: "choice",
    question: "How should you bring clean water to the village?",
    options: [
      { label: "Truck in bottled water", correct: false },
      { label: "Build a borehole well", correct: true },
      { label: "Use rain barrels", correct: false }
    ],
    fact: "A borehole well can last 20+ years and serve entire communities."
  },
  {
    stage: 6,
    title: "Community Buy-In",
    type: "choice",
    question: "Some villagers are hesitant to change. What should you do?",
    options: [
      { label: "Force them to use the new well", correct: false },
      { label: "Involve community leaders in planning", correct: true },
      { label: "Ignore their opinions", correct: false }
    ],
    fact: "Projects succeed when communities are involved from the start."
  },
  {
    stage: 7,
    title: "Hygiene Education",
    type: "trivia",
    question: "What simple action can prevent over 50% of waterborne diseases?",
    options: [
      { label: "Filtering water", correct: false },
      { label: "Boiling water", correct: false },
      { label: "Washing hands with soap", correct: true }
    ],
    fact: "Handwashing with soap is one of the most cost-effective health interventions."
  },
  {
    stage: 8,
    title: "Sustainability Planning",
    type: "choice",
    question: "Who should maintain the well long-term?",
    options: [
      { label: "Volunteers from outside", correct: false },
      { label: "No one, it should work fine", correct: false },
      { label: "A trained local water committee", correct: true }
    ],
    fact: "Sustainability requires training and local accountability."
  },
  {
    stage: 9,
    title: "Testing and Safety",
    type: "trivia",
    question: "How often should water sources be tested for safety?",
    options: [
      { label: "Every year", correct: false },
      { label: "Monthly", correct: true },
      { label: "Never, if the water looks clear", correct: false }
    ],
    fact: "Regular testing prevents outbreaks before they start."
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

// Helper function to clear the game container
function clearGameContainer() {
  const container = document.querySelector('.game-container');
  container.innerHTML = '';
}

// Function to render the stage UI
function renderStageUI() {
  const container = document.querySelector('.game-container');
  container.innerHTML = `
    <div id="stage-label" style="margin-bottom: 12px;"></div>
    <div id="question-text" style="margin-bottom: 18px;"></div>
    <button class="choice-button" data-choice="0"></button>
    <button class="choice-button" data-choice="1"></button>
    <button class="choice-button" data-choice="2"></button>
    <div id="water-index" style="margin-top: 18px;"></div>
  `;
}

// Function to load a stage
function loadStage(index) {
  const stage = waterJourneyStages[index];
  document.getElementById('question-text').textContent = stage.question;
  const buttons = document.querySelectorAll('.choice-button');
  // Show/hide buttons based on number of options
  buttons.forEach((btn, i) => {
    if (stage.options[i]) {
      btn.style.display = '';
      btn.textContent = `${String.fromCharCode(65 + i)}: ${stage.options[i].label}`;
    } else {
      btn.style.display = 'none';
    }
  });

  document.getElementById('stage-label').textContent = `Stage ${index + 1}/10`;
  document.getElementById('water-index').textContent = `Village Water Index: ${waterIndex}%`;
}

// Function to handle end of game
function endGame() {
  document.querySelector('.game-container').innerHTML = `
    <h2>You've completed the journey!</h2>
    <p>Your final Village Water Index: ${waterIndex}%</p>
    <p>Thank you for playing and learning about clean water!</p>
  `;
}

// Helper function to show a Bootstrap-style alert above the buttons
function showAlertAboveButtons(message, type = "info") {
  // Remove any existing alert
  const oldAlert = document.getElementById('journey-alert');
  if (oldAlert) {
    oldAlert.remove();
  }
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
  alertDiv.style.fontFamily = "'Press Start 2P', Arial, Helvetica, sans-serif";
  alertDiv.style.textAlign = "center";
  alertDiv.textContent = message;

  // Insert the alert above the first button
  const firstButton = document.querySelector('.choice-button');
  if (firstButton && firstButton.parentNode) {
    firstButton.parentNode.insertBefore(alertDiv, firstButton);
  }

  // Remove alert after 1.5 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.parentNode.removeChild(alertDiv);
    }
  }, 1500);
}

// Update the attachChoiceButtonListeners function to avoid stacking event listeners
function attachChoiceButtonListeners() {
  // Select all choice buttons
  const buttons = document.querySelectorAll('.choice-button');
  // Loop through each button
  buttons.forEach((button) => {
    // Remove any old event listeners by replacing the button with a clone
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);

    // Enable the button for the new stage
    newButton.disabled = false;

    // Add a click event listener to the new button
    newButton.addEventListener('click', (e) => {
      // Get the choice number from the button's data attribute
      const choice = parseInt(e.target.dataset.choice);
      // Check if the selected option is correct
      const isCorrect = waterJourneyStages[currentStage].options[choice].correct;

      // Show feedback using a Bootstrap-style alert above the buttons
      if (isCorrect) {
        waterIndex += 10;
        showAlertAboveButtons("Correct! You chose the sustainable option.", "success");
      } else {
        if (waterIndex > 0) {
          waterIndex -= 10;
        }
        showAlertAboveButtons("Hmm... That might not help long-term.", "warning");
      }

      // Disable all buttons after a choice is made
      document.querySelectorAll('.choice-button').forEach(btn => btn.disabled = true);

      // Move to the next stage after a short delay
      currentStage++;
      if (currentStage < waterJourneyStages.length) {
        setTimeout(() => {
          loadStage(currentStage);
          attachChoiceButtonListeners(); // Attach listeners again for new buttons
        }, 1500);
      } else {
        setTimeout(endGame, 1500);
      }
    });
  });
}

// Start button event listener
document.getElementById('startGameButton').addEventListener('click', () => {
  if (gameStarted) return; // Prevent multiple starts
  gameStarted = true;

  // Reset the stage and score for a new game
  currentStage = 0;
  waterIndex = 0;

  // Render the stage UI and set up event listeners
  renderStageUI();
  loadStage(currentStage);
  attachChoiceButtonListeners(); // <-- Attach listeners for the first stage
});

// Do not start the game automatically on page load
