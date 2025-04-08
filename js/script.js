const typingText = document.querySelector(".typing-text p");
const inputField = document.querySelector(".wrapper .input-field");
const timeTag = document.querySelector(".time span b");
const mistakeTag = document.querySelector(".mistake span");
const wpmTag = document.querySelector(".wpm span");
const cpmTag = document.querySelector(".cpm span");
const tryAgainButton = document.querySelector("button");

let timer,
    maxTime = 60,
    timeLeft = maxTime,
    charIndex = 0,
    mistakes = 0,
    isTyping = false,
    characters = [];

function randomText() {
    let randIndex = Math.floor(Math.random() * paragraphs.length);
    typingText.innerHTML = "";
    characters = [];

    for (let char of paragraphs[randIndex]) {
        const span = document.createElement("span");
        span.textContent = char;
        typingText.appendChild(span);
        characters.push(span);
    }

    characters[0].classList.add("active");
}

function initTyping() {
    if (charIndex < characters.length - 1 && timeLeft > 0) {
        if (!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }

        const typedChar = inputField.value.charAt(charIndex);
        const currentChar = characters[charIndex];

        if (typedChar) {
            if (typedChar === currentChar.innerText) {
                currentChar.classList.add("correct");
            } else {
                currentChar.classList.add("incorrect");
                mistakes++;
            }
            charIndex++;
        } else if (charIndex > 0) {
            charIndex--;
            const prevChar = characters[charIndex];
            if (prevChar.classList.contains("incorrect")) mistakes--;
            prevChar.classList.remove("correct", "incorrect");
        }

        // Update active span only (no forEach)
        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex]?.classList.add("active");

        // Scroll every 5 characters only
        if (charIndex % 5 === 0) {
            characters[charIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        const elapsedTime = maxTime - timeLeft;
        let wpm = Math.round((((charIndex - mistakes) / 5) / (elapsedTime || 1)) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

        mistakeTag.innerText = mistakes;
        wpmTag.innerText = wpm;
        cpmTag.innerText = charIndex - mistakes;
    } else {
        clearInterval(timer);
        inputField.value = "";
    }
}

function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
    } else {
        clearInterval(timer);
    }
}

function resetGame() {
    randomText();
    clearInterval(timer);

    inputField.value = "";
    timeLeft = maxTime;
    charIndex = 0;
    mistakes = 0;
    isTyping = false;

    timeTag.innerText = timeLeft;
    mistakeTag.innerText = mistakes;
    wpmTag.innerText = 0;
    cpmTag.innerText = 0;

    characters[0]?.scrollIntoView({ behavior: "smooth", block: "center" });
}

randomText();
inputField.addEventListener("input", initTyping);
tryAgainButton.addEventListener("click", resetGame);

document.addEventListener("keydown", () => inputField.focus());
typingText.addEventListener("click", () => inputField.focus());
