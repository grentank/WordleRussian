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
let hiddenWord = 'дождь';
let guessedWord = '';

function keyboardListener(pressedKey) {
    if (currentLetterPosition <= 4) {
        displayedLetters[getLetterIndex()].innerHTML = pressedKey.target.innerHTML;
        currentLetterPosition++;
    }
}

for (let button of keyboardKeys) {
    button.addEventListener('click', keyboardListener);
}

backspaceKey.addEventListener('click', () => {
    if (currentLetterPosition > 0) {
        currentLetterPosition--;
        displayedLetters[getLetterIndex()].innerHTML = '';
    }
})

enterKey.addEventListener('click', () => {
    guessedWord = '';
    for (let i=0; i<5; i++)
        guessedWord += displayedLetters[getLetterIndex()-5+i].innerHTML;
    if (wordsData.includes(guessedWord) === false)
        alert('The word is not in a dictionary!');
    else if (currentLetterPosition === 5) {
        wordCheck();
        currentLetterPosition = 0;
        currentTry++;
    }
})

function wordCheck() {
    for (let i=0; i<5; i++) {
        if (hiddenWord.includes(guessedWord[i])) {
            if (hiddenWord[i] === guessedWord[i]) {
                displayedLetters[getLetterIndex() - 5 + i].style = 'background: #6AAA64; color: white; border-color: #6AAA64';
                document.getElementById(guessedWord[i]).style.backgroundColor = '#6AAA64';
            }
            else {
                displayedLetters[getLetterIndex() - 5 + i].style = 'background: #C9B458; color: white; border-color: #C9B458';
                if (document.getElementById(guessedWord[i]).style.backgroundColor !== 'rgb(106, 170, 100)')
                    document.getElementById(guessedWord[i]).style.backgroundColor = '#C9B458';
            }
        }
        else {
            displayedLetters[getLetterIndex() - 5 + i].style = 'background: #787C7E; color: white; border-color: #787C7E';
            document.getElementById(guessedWord[i]).style.backgroundColor = '#787C7E';
        }
    }
    if (guessedWord === hiddenWord) {
        for (let button of keyboardKeys)
            button.removeEventListener('click', keyboardListener);
    }
}
