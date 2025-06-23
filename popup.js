const search = document.getElementById("search-btn");
const input = document.getElementById("input-el");
const definitionSpace = document.getElementById("p-el");
const reminder = document.getElementById("reminder-btn");
const tooEasy = document.getElementById("tooeasy-btn");
const wait = document.getElementById("wait");
let currentWord = "";
let myWords = JSON.parse(localStorage.getItem("myWords")) || []; //cargar palabras anteriores si existen
let learned = JSON.parse(localStorage.getItem("learned")) || []; //palabras aprendidas si existen
const randomWord = myWords[Math.floor(Math.random() * myWords.length)];


async function showDefinition(wordParam) {
    const word = wordParam || input.value.trim();

    if (!word) {
        document.getElementById("extra-btn").style.display = "none";
        return;
    };

    currentWord = word;

    wait.style.display = "block";
    definitionSpace.style.display = "none";
    document.getElementById("extra-btn").style.display = "none";
    try {
        const response = await fetch(`https://jisho.org/api/v1/search/words?keyword=${word}`)

        if (response.ok) {
            const data = await response.json();

            if (data.data.length === 0) {
                throw new Error("Palabra no encontrada");
            }
            if (!myWords.includes(word) && !learned.includes(word)) {
                myWords.push(word);
                localStorage.setItem("myWords", JSON.stringify(myWords));
            }

            const firstEntry = data.data[0];
            const japanese = firstEntry.japanese[0];
            const senses = firstEntry.senses[0];

            const kanji = japanese.word || "(no kanji)";
            const reading = japanese.reading || "(sin lectura)";
            const meanings = senses.english_definitions.join(", ");

            definitionSpace.innerHTML = `<strong>${word}</strong> - ${kanji} [${reading}]: ${meanings}`;
            wait.style.display = "none";
            definitionSpace.style.display = "block";
            document.getElementById("extra-btn").style.display = "block";
        }

    } catch (error) {
        document.getElementById("extra-btn").style.display = "none";
        definitionSpace.innerHTML = `Definition for the word: <strong>${word}</strong> not found. Please try again and check the misspelling`;
        console.error(error);
        definitionSpace.style.display = "block";
        wait.style.display = "none";
    }
}

async function setReminder() {

    definitionSpace.style.display = "none";
    document.getElementById("extra-btn").style.display = "none";

    const min = 5 * 60 * 1000;
    const max = 10 * 60 * 1000;
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;

    setTimeout(() => showDefinition(randomWord), delay);

    input.value = "";
    input.focus();
}

async function wordLearned() {
    const word = currentWord.trim();
    if (!word) return;

    if (!learned.includes(word)) {
        learned.push(word);
        localStorage.setItem("learned", JSON.stringify(learned));
    }

    const index = myWords.indexOf(word);
    if (index !== -1) {
        myWords.splice(index, 1);
        localStorage.setItem("myWords", JSON.stringify(myWords));
    }

    input.value = "";
    definitionSpace.style.display = "none";
    document.getElementById("extra-btn").style.display = "none";

    input.focus();
    getStars();
}

async function getStars() {
    const container = document.getElementById("container");
    const score = document.getElementById("score");
    const count = learned.length;

    if (count < 10) {
        container.style.display = "none";
        return;
    }

    const stars = Math.min(5, Math.floor(count / 10));
    const starsHTML = '<i class="fa-solid fa-star" style="margin: 5px"></i>'.repeat(stars);
    let text = '';

    if (count % 10 === 0 && count <= 50) {
        text =
            `<p>Congratulations you have learned ${count} words: <br>
            ${learned.map(w => `<strong> ${w}</strong>`).join(', ')}</p>`;
    }
    text += `<i style="color: #FFBF00; font-size: 32px;">${starsHTML} </i>`;

    score.innerHTML = text;
    container.style.display = "block";

}


input.focus();
getStars();
search.addEventListener("click", () => { showDefinition() });
reminder.addEventListener("click", setReminder);
tooEasy.addEventListener("click", wordLearned);
showDefinition(randomWord);