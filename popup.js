const search = document.getElementById("search-btn");
const input = document.getElementById("input-el");
const definitionSpace = document.getElementById("p-el");
const reminder = document.getElementById("reminder-btn");
const tooEasy = document.getElementById("tooeasy-btn");
let myWords = JSON.parse(localStorage.getItem("myWords")) || []; //cargar palabras anteriores si existen
let learned = JSON.parse(localStorage.getItem("learned")) || []; //palabras aprendidas si existen

async function showDefinition() {
    const word = input.value.trim();
    document.getElementById("extra-btn").style.display = "none";
    definitionSpace.style.display = "block";

    if (!word) return;

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

            definitionSpace.textContent = `${word} - ${kanji} [${reading}]: ${meanings}`;

            document.getElementById("extra-btn").style.display = "block";
        }


    } catch (error) {
        definitionSpace.textContent = `Definition for the word: ${word} not found. Please try again and check the misspelling`;
        console.error(error);
    }
}

async function setReminder(myWords) {


    input.value = "";
    definitionSpace.style.display = "none";
    document.getElementById("extra-btn").style.display = "none";

}

async function wordLearned() {
    const word = input.value.trim();
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
}

input.focus();

search.addEventListener("click", showDefinition);
reminder.addEventListener("click", setReminder);
tooEasy.addEventListener("click", wordLearned);

