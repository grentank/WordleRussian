const screenKeyboardKeys = document.querySelectorAll('.key'),
    displayedLetters = document.querySelectorAll('.letter'),
    backspaceKey = document.getElementById('backspace'),
    enterKey = document.getElementById('enter');
let currentTry = 0; // keeps track of incorrect tries
let currentLetterPosition = 0; // keeps track of the last div with a letter in a row
const getLetterIndex = () => currentLetterPosition+5*currentTry; // function to calculate div with the last letter
const hiddenWord = goodWords[Math.floor(Math.random()*(goodWordsLength-1))]; // choose a good hidden word
let guessedWord = ''; // will be used later


if(localStorage.getItem('needsReset') === null || localStorage.getItem('needsReset') === 'true') {
    localStorage.clear();
    localStorage.setItem('needsReset', 'false')
}

if(localStorage.getItem('totalWins') === null) localStorage.setItem('totalWins', '0')
if(localStorage.getItem('totalLosses') === null) localStorage.setItem('totalLosses', '0')
if(localStorage.getItem('winStats') === null) localStorage.setItem('winStats', '0,0,0,0,0,0')



// Adding a listener to screen keyboard (needed for correct deleting process after game over)
function screenKeyboardListener(pressedKey) {
    // Don't print another letter if there are already 5 letters printed
    if (currentLetterPosition <= 4) {
        displayedLetters[getLetterIndex()].innerHTML = pressedKey.target.innerHTML;
        currentLetterPosition++; // Tracking the current position of input 'cursor'
    }
}


// Making a listener for a screen keyboard press
for (let button of screenKeyboardKeys) button.addEventListener('click', screenKeyboardListener)


// Making a listener for a physical keyboard
function physicalKeyboardListener(pressedKey) {
    // Check whether the key is appropriate (cyrillic) and there is a blank space available
    if (currentLetterPosition <= 4 && 'абвгдежзийклмнопрстуфхцчшщъыьэюя'.includes(pressedKey.key)) {
        displayedLetters[getLetterIndex()].innerHTML = pressedKey.key;
        currentLetterPosition++; // Tracking the current position of input 'cursor'
    } // handle the backspace and delete keys
    else if (currentLetterPosition > 0 && (pressedKey.code === 'Backspace' || pressedKey.code === 'Delete')) {
        currentLetterPosition--; // shift input position backwards and delete the last letter on the screen
        displayedLetters[getLetterIndex()].innerHTML = '';
    } // handle the enter key only when 5 letters are inputted
    else if (currentLetterPosition === 5 && pressedKey.code === 'Enter') enterKeyHandler();
}

// adding keyboard listener
document.addEventListener('keydown', physicalKeyboardListener);


// Adding a listener to backspace button
backspaceKey.addEventListener('click', () => {
    if (currentLetterPosition > 0) {
        currentLetterPosition--;
        displayedLetters[getLetterIndex()].innerHTML = '';
    }
});


// Initiate enter key handler only if there are 5 letters inputted
enterKey.addEventListener('click', () => currentLetterPosition === 5 ? enterKeyHandler() : false)


function enterKeyHandler() {
    guessedWord = ''; // clear the variable before initiation
    for (let i=0; i<5; i++) // construct the word a user has entered
        guessedWord += displayedLetters[getLetterIndex()-5+i].innerHTML;
    if (wordsData.includes(guessedWord) === false && goodWords.includes(guessedWord) === false) {
        document.getElementById('noDictionary').style.visibility = 'visible'; // if the entered word is not in dictionaries display an error message
        setTimeout(() => document.getElementById('noDictionary').style.visibility = 'hidden', 1000) // that fades away after 1 sec
    }
    else {
        wordCheck();
        currentLetterPosition = 0;
        currentTry++;
    }
}


// a function to check the words and color their letters
function wordCheck() {
    let guessColoredLetters = [0,0,0,0,0]; // was a letter colored ? 1 : 0
    let hiddenColoredLetters = [0,0,0,0,0]; // the same, but for a hidden letter. Was there a green match?
    let coloredFlag = 0;
    for(let i=0; i<5; i++) { // At first color each letter either in green or gray
        if (hiddenWord[i] === guessedWord[i]) { // positions are matched => color in green
            displayedLetters[getLetterIndex() - 5 + i].style = 'background: #6AAA64; color: white; border-color: #6AAA64';
            document.getElementById(guessedWord[i]).style.backgroundColor = '#6AAA64'; // also color screen keyboard keys
            guessColoredLetters[i] = 1; // Mark colored letters in both the hidden word
            hiddenColoredLetters[i] = 1; // and the guessing word
        }
        if (hiddenWord.includes(guessedWord[i]) === false) { // no such letter in a hidden word => color in gray
            displayedLetters[getLetterIndex() - 5 + i].style = 'background: #787C7E; color: white; border-color: #787C7E';
            document.getElementById(guessedWord[i]).style.backgroundColor = '#787C7E'; // also color screen keyboard keys
            guessColoredLetters[i] = -1; // mark colored letters
        }
    }
    // For other letters we need to compute if their color should be yellow or gray
    for(let i=0; i<5; i++) {
        if (guessColoredLetters[i] !== 0) continue; // Skip the letter if it has been already colored green or gray

        coloredFlag = 0;
        // if the letter has not been colored, search for the same character in the hidden word that was not yet matched to its green counterpart
        for(let j=0; j<5; j++) {
            // if there is an uncolored character in a hidden word that matches an uncolored character in a guess word, then it should be colored yellow
            if (guessedWord[i] === hiddenWord[j] && hiddenColoredLetters[j] === 0) {
                guessColoredLetters[i] = 1; // mark newly colored letters
                hiddenColoredLetters[j] = 1;
                displayedLetters[getLetterIndex() - 5 + i].style = 'background: #C9B458; color: white; border-color: #C9B458';
                coloredFlag = 1;
                if (document.getElementById(guessedWord[i]).style.backgroundColor !== 'rgb(106, 170, 100)')
                    document.getElementById(guessedWord[i]).style.backgroundColor = '#C9B458'; // color screen keyboard in yellow only if it is not green already
                break;
            }
        }
        if (coloredFlag === 0) { // if a letter could not be colored yellow, color it in gray
            displayedLetters[getLetterIndex() - 5 + i].style = 'background: #787C7E; color: white; border-color: #787C7E'; // Don't change the color of keys because they have been changed previously
        }

    }
    if (guessedWord === hiddenWord) { // if a word is guessed, display the congratulations message
        for (let button of screenKeyboardKeys) button.removeEventListener('click', screenKeyboardListener);
        document.removeEventListener('keydown',physicalKeyboardListener);
        document.getElementById('endgame').innerHTML = 'Поздравляю! Вы выиграли! <br> Обновите страницу (F5), чтобы сыграть ещё'; /* <br> <br> <br> Congratulations! You win! <br> Reload this page (F5) to play again*/

        localStorage.setItem('totalWins', (parseInt(localStorage.getItem('totalWins'))+1).toString())
        let winStats = localStorage.getItem('winStats').split(',').map(element => parseInt(element));
        winStats[currentTry]++;
        localStorage.setItem('winStats', winStats.toString())

        setTimeout(showEndgame, 1000);
    }
    else if (currentTry === 5) { // after the last try with the game is over
        for (let button of screenKeyboardKeys) button.removeEventListener('click', screenKeyboardListener);
        document.removeEventListener('keydown',physicalKeyboardListener);
        document.getElementById('endgame').innerHTML = `Вы проиграли! Загаданное слово было ${hiddenWord} <br> Обновите страницу (F5), чтобы сыграть ещё`; /*<br> <br> <br> You lost! <br> Reload this page (F5) to play again*/

        localStorage.setItem('totalLosses', (parseInt(localStorage.getItem('totalLosses'))+1).toString())

        setTimeout(showEndgame, 1000);
    }
}


// animate the fading process of the ending message
function showEndgame() {
    document.getElementById('endContent').style.opacity = '1';
    const totalWins = parseInt(localStorage.getItem('totalWins'));
    const totalLosses = parseInt(localStorage.getItem('totalLosses'));
    const winRate = totalWins**2 + totalLosses**2 === 0 ? 0 : Math.round(100*totalWins/(totalWins+totalLosses));
    document.getElementById('statistics').innerHTML = `Побед: ${totalWins} &nbsp;&nbsp;
        Поражений: ${totalLosses} &nbsp;&nbsp;
        Процент побед: ${winRate}%`;
    const winBars = localStorage.getItem('winStats').split(',').map(element => parseInt(element));
    document.querySelectorAll('.statBar').forEach((divElement,index) => {
        divElement.style.width = (winBars[index]*450/Math.max(...winBars) + 20).toString() + 'px'
    })

    // message.style.visibility = 'visible';
    // for (let i=0; i<1; i+=.01) setTimeout(() => message.style.opacity = i, 300*i);
}

document.getElementById('closeEndgame').addEventListener('click', () => document.getElementById('endContent').style.opacity = '0')

document.getElementById('statsButton').addEventListener('click', showEndgame)


// document.getElementById('endgame').innerHTML = `Вы проиграли! Загаданное слово было ${hiddenWord} <br> Обновите страницу (F5), чтобы сыграть ещё`;
// setTimeout(showEndgame,2000)
//
// localStorage.setItem('winStats',[0,3,6,9,10,7].toString())
// localStorage.setItem('totalWins',[0,3,6,9,10,7].reduce((a,e) => a+e,0).toString())
