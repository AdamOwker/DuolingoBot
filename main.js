// ==UserScript==
// @name        Autolingo
// @namespace   Autolingo?
// @match       https://*.duolingo.com/*
// @grant       none
// @version     0
// @author      *-
// @description Issa code that dont work anymore atm
// ==/UserScript==

let autoSolveInterval;
let isAutomaticMode = false;
const debugMode = false;

function appendButtons() {
    if (window.location.pathname === '/learn') {
        let learnButton = document.querySelector('a[data-test="global-practice"]');
        if (learnButton) {
            return;
        }
    }

    const completeSkillButton = document.getElementById("completeSkillButton");
    if (completeSkillButton !== null) {
        return;
    }

    const originalButton = document.querySelectorAll('[data-test="player-next"]')[0];
    if (originalButton === undefined) {
        const startLearningButton = document.querySelector('[data-test="start-button"]');
        console.log(`Wrapper line: ${startLearningButton}`);
        if (startLearningButton === null) {
            return;
        }
        const parentContainer = startLearningButton.parentNode;
        const completeSkillButton = document.createElement('a');
        completeSkillButton.className = startLearningButton.className;
        completeSkillButton.id = "completeSkillButton";
        completeSkillButton.innerText = "COMPLETE SKILL";
        completeSkillButton.removeAttribute('href');
        completeSkillButton.addEventListener('click', () => {
            startSolving();
            setInterval(() => {
                const startLearningButton = document.querySelector('[data-test="start-button"]');
                if (startLearningButton && startLearningButton.innerText.startsWith("START")) {
                    startLearningButton.click();
                }
            }, 3000);
            startLearningButton.click();
        });
        parentContainer.appendChild(completeSkillButton);
    } else {
        const container = document.getElementsByClassName('_10vOG')[0];
        container.style.display = "flex";

        const solveAllButton = document.createElement('button');
        const pauseButton = document.createElement('button');

        solveAllButton.id = 'completeSkillButton';
        solveAllButton.innerHTML = autoSolveInterval ? 'PAUSE SOLVE' : 'SOLVE ALL';
        solveAllButton.disabled = false;
        pauseButton.innerHTML = 'SOLVE';

        const buttonStyle = `
      min-width: 150px;
      font-size: 17px;
      border:none;
      border-bottom: 4px solid #58a700;
      border-radius: 18px;
      padding: 13px 16px;
      transform: translateZ(0);
      transition: filter .2s;
      font-weight: 700;
      letter-spacing: .8px;
      background: #55CD2E;
      color:#fff;
      margin-left:20px;
      cursor:pointer;
    `;

        solveAllButton.style.cssText = buttonStyle;
        pauseButton.style.cssText = buttonStyle;

        [solveAllButton, pauseButton].forEach(button => {
            button.addEventListener("mousemove", () => {
                button.style.filter = "brightness(1.1)";
            });
        });

        [solveAllButton, pauseButton].forEach(button => {
            button.addEventListener("mouseleave", () => {
                button.style.filter = "none";
            });
        });

        originalButton.parentElement.appendChild(pauseButton);
        originalButton.parentElement.appendChild(solveAllButton);

        solveAllButton.addEventListener('click', startSolving);
        pauseButton.addEventListener('click', resumeSolving);
    }
}

setInterval(appendButtons, 3000);

function startSolving() {
    if (autoSolveInterval) {
        clearInterval(autoSolveInterval);
        autoSolveInterval = undefined;
        document.getElementById("completeSkillButton").innerText = "SOLVE ALL";
        isAutomaticMode = false;
    } else {
        document.getElementById("completeSkillButton").innerText = "PAUSE SOLVE";
        isAutomaticMode = true;
        autoSolveInterval = setInterval(resumeSolving, 500);
    }
}

function resumeSolving() {
    if (!isAutomaticMode || autoSolveInterval) {
        return;
    }

    autoSolveInterval = setInterval(() => {
        const correctOption = findCorrectOption();
        if (correctOption) {
            correctOption.click();
        }
    }, 500);
}

function findCorrectOption() {
    const options = Array.from(document.querySelectorAll('.option'));
    if (options.length === 0) {
        return null;
    }

    const correctOption = options.find((option) => {
        return option.innerText.includes('is correct');
    });

    return correctOption;
}

function stopSolving() {
    clearInterval(autoSolveInterval);
    autoSolveInterval = undefined;
    document.getElementById("completeSkillButton").innerText = "SOLVE ALL";
    isAutomaticMode = false;
}

function checkIfFinished() {
    const nextButton = document.querySelector('[data-test="player-next"]');
    if (nextButton && nextButton.innerText.startsWith("NEXT")) {
        stopSolving();
    }
}

setInterval(checkIfFinished, 1000);
