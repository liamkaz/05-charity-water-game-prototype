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

