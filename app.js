/*
document.getElementById('randomWord').addEventListener('click', () => {
    let randomIndex = Math.floor(Math.random()*(wordsDataLength-1));
    document.getElementById('textbox').innerHTML = wordsData[randomIndex];
})

document.getElementById('findWords').addEventListener('click', () => {
    for (let word of wordsData) {
        if (!word.includes("я") && !word.includes("р") && !word.includes("п") && !word.includes("т") && !word.includes("с") && !word.includes("и") && !word.includes("а") && word[1] === "о" && !word.includes("н") && !word.includes("в") && !word.includes("м") && !word.includes("к") && !word.includes("й") && !word.includes("г") && !word.includes("з") && !word.includes("ы") && !word.includes("л"))
            document.getElementById('textbox').innerHTML += word + "\n";
    }
})
*/

const keyboardKeys = document.querySelectorAll('.key'),
    displayedLetters = document.querySelectorAll('.letter'),
    backspaceKey = document.getElementById('backspace'),
    enterKey = document.getElementById('enter');
let currentTry = 0;
let currentLetterPosition = 0;
let getLetterIndex = () => currentLetterPosition+5*currentTry;
let hiddenWord = goodWords[Math.floor(Math.random()*(goodWordsLength-1))];
let guessedWord = '';



// Making a listener for a screen keyboard press
function screenKeyboardListener(pressedKey) {
    // Don't print another letter if there are already 5 letters printed
    if (currentLetterPosition <= 4) {
        displayedLetters[getLetterIndex()].innerHTML = pressedKey.target.innerHTML;
        currentLetterPosition++; // Tracking the current position of input 'cursor'
    }
}

for (let button of keyboardKeys) {
    button.addEventListener('click', screenKeyboardListener);
}

// Making a listener for a physical keyboard
function physicalKeyboardListener(pressedKey) {
    // Check whether the key is appropriate (cyrillic) and there is blank space available
    if (currentLetterPosition <= 4 && 'абвгдежзийклмнопрстуфхцчшщъыьэюя'.includes(pressedKey.key)) {
        displayedLetters[getLetterIndex()].innerHTML = pressedKey.key;
        currentLetterPosition++; // Tracking the current position of input 'cursor'
    }
    else if (currentLetterPosition > 0 && (pressedKey.code === 'Backspace' || pressedKey.code === 'Delete')) {
        currentLetterPosition--;
        displayedLetters[getLetterIndex()].innerHTML = '';
    }
    else if (currentLetterPosition === 5 && pressedKey.code === 'Enter') enterKeyHandler();
}

document.addEventListener('keydown', physicalKeyboardListener);

backspaceKey.addEventListener('click', () => {
    if (currentLetterPosition > 0) {
        currentLetterPosition--;
        displayedLetters[getLetterIndex()].innerHTML = '';
    }
});

function enterKeyHandler() {
    guessedWord = '';
    for (let i=0; i<5; i++)
        guessedWord += displayedLetters[getLetterIndex()-5+i].innerHTML;
    if (wordsData.includes(guessedWord) === false && goodWords.includes(guessedWord) === false) {
        document.getElementById('noDictionary').style.visibility = 'visible';
        setTimeout(() => document.getElementById('noDictionary').style.visibility = 'hidden', 1000)
    }
    else {
        wordCheck();
        currentLetterPosition = 0;
        currentTry++;
    }
}

enterKey.addEventListener('click', () => {
    if (currentLetterPosition !== 5) return;
    enterKeyHandler()
})

function wordCheck() {
    let guessColoredLetters = [0,0,0,0,0]; // was letter colore ? 1 : 0
    let hiddenColoredLetters = [0,0,0,0,0]; // the same, but for a hidden letter. Was there a green match?
    let coloredFlag = 0;
    for(let i=0; i<5; i++) { // At first color each letter either in green or gray
        if (hiddenWord[i] === guessedWord[i]) {
            displayedLetters[getLetterIndex() - 5 + i].style = 'background: #6AAA64; color: white; border-color: #6AAA64';
            document.getElementById(guessedWord[i]).style.backgroundColor = '#6AAA64';
            guessColoredLetters[i] = 1; // Mark colored letters
            hiddenColoredLetters[i] = 1;
        }
        if (hiddenWord.includes(guessedWord[i]) === false) {
            displayedLetters[getLetterIndex() - 5 + i].style = 'background: #787C7E; color: white; border-color: #787C7E';
            document.getElementById(guessedWord[i]).style.backgroundColor = '#787C7E';
            guessColoredLetters[i] = -1; // mark colored letters
        }
    }
    // Now let's decide whether the displayed color should be yellow or gray
    for(let i=0; i<5; i++) {
        if (guessColoredLetters[i] !== 0) continue; // Skip the letter if it has been already colored green or gray

        coloredFlag = 0;
        // if the letter has not been colored, search for the same character in the hidden word that was not yet matched to its green counterpart
        for(let j=0; j<5; j++) {
            // if there is an uncolored character in a hidden word that matches an uncolored character in a guess word, then it should be colored yellow
            if (guessedWord[i] === hiddenWord[j] && hiddenColoredLetters[j] === 0) {
                guessColoredLetters[i] = 1;
                hiddenColoredLetters[j] = 1;
                displayedLetters[getLetterIndex() - 5 + i].style = 'background: #C9B458; color: white; border-color: #C9B458';
                coloredFlag = 1;
                if (document.getElementById(guessedWord[i]).style.backgroundColor !== 'rgb(106, 170, 100)')
                    document.getElementById(guessedWord[i]).style.backgroundColor = '#C9B458';
                break;
            }
        }
        if (coloredFlag === 0) { // if a letter could not be colored yellow, color it gray
            displayedLetters[getLetterIndex() - 5 + i].style = 'background: #787C7E; color: white; border-color: #787C7E'; // Don't change the color of keys because they have been changed previously
        }

    }
    if (guessedWord === hiddenWord) { // if a word was guessed, display the congratulations message
        for (let button of keyboardKeys) button.removeEventListener('click', screenKeyboardListener);
        document.removeEventListener('keydown',physicalKeyboardListener);
        document.getElementById('endgame').innerHTML = 'Поздравляю! Вы выиграли! <br> Обновите страницу (F5), чтобы сыграть ещё <br> <br> <br> Congratulations! You win! <br> Reload this page (F5) to play again';
        let ending = setTimeout(showEndgame, 1000);
    }
    else if (currentTry === 5) { // after the last try with the game is over
        for (let button of keyboardKeys) button.removeEventListener('click', screenKeyboardListener);
        document.removeEventListener('keydown',physicalKeyboardListener);
        document.getElementById('endgame').innerHTML = `Вы проиграли! Загаданное слово было ${hiddenWord} <br> Обновите страницу (F5), чтобы сыграть ещё <br> <br> <br> You lost! <br> Reload this page (F5) to play again`;
        let ending = setTimeout(showEndgame, 1000);
    }
}

// a function to animate window fade in
function showEndgame() { 
    const message = document.getElementById('endgame');
    message.style.visibility = 'visible';
    let i = 0;
    for (i=0; i<1; i+=.01) setTimeout(() => message.style.opacity = i, 300*i);
}


// setTimeout(showEndgame,2000)
