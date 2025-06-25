const search = document.getElementById("search-btn");
const input = document.getElementById("input-el");
const definitionSpace = document.getElementById("definition-el");
const reminder = document.getElementById("reminder-btn");
const tooEasy = document.getElementById("tooeasy-btn");
const wait = document.getElementById("wait");
const buttons = document.getElementById("extra-btn");
let currentWord = "";
let currentLanguage = localStorage.getItem("lastLanguage") || "ja";
let myWords = JSON.parse(localStorage.getItem("myWords")) || {};
let learned = JSON.parse(localStorage.getItem("learned")) || {};

["ja", "en", "es"].forEach(lang => {
    if (!myWords[lang]) myWords[lang] = [];
    if (!learned[lang]) learned[lang] = [];
});
//palabras aprendidas y no aprendidas si existen separadas por idiomas

async function getRandomWord() {
    const words = myWords[currentLanguage];

    if (!words || words.length === 0) return "";

    return words[Math.floor(Math.random() * words.length)];
}

async function showDefinition(wordParam) {
    const word = wordParam || input.value.trim();

    if (!word) {
        definitionSpace.innerHTML = `Please enter a word.`;
        buttons.style.display = "none";
        return;
    };

    currentWord = word;
    wait.style.display = "block";
    definitionSpace.style.display = "none";
    buttons.style.display = "none";

    try {
        let response = "";
        if (currentLanguage === "ja") {
            response = await fetch(`https://jisho.org/api/v1/search/words?keyword=${word}`);

            if (!response.ok) throw new Error("No word found");

            if (response.ok) {
                const data = await response.json();

                if (data.data.length === 0) {
                    throw new Error("No word found");
                }
                if (!myWords[currentLanguage].includes(word) && !learned[currentLanguage].includes(word)) {
                    myWords[currentLanguage].push(word);
                    localStorage.setItem("myWords", JSON.stringify(myWords));
                }

                const firstEntry = data.data[0];
                const japanese = firstEntry.japanese[0];
                const senses = firstEntry.senses[0];

                const kanji = japanese.word || "(no kanji)";
                const reading = japanese.reading || "(sin lectura)";
                const meanings = senses.english_definitions.join(", ");

                definitionSpace.innerHTML = `<strong>${word}</strong> - ${kanji} [${reading}]: ${meanings}`;
            }
        } else if (currentLanguage === "en") {
            response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

            if (!response.ok) throw new Error("No word found");

            if (response.ok) {
                const dataEn = await response.json();

                if (dataEn.length === 0) {
                    throw new Error("No word found");

                } if (!myWords[currentLanguage].includes(word) && !learned[currentLanguage].includes(word)) {
                    myWords[currentLanguage].push(word);
                    localStorage.setItem("myWords", JSON.stringify(myWords));
                }

                const firstEntry = dataEn[0];
                const wordEn = firstEntry.word;
                const meaning = firstEntry.meanings[0];
                const definition = meaning.definitions[0].definition;
                const example = meaning.definitions[0].example || "";

                definitionSpace.innerHTML = `<strong>${word}</strong> -  ${definition}. <br> ${example}`

            }

        } else if (currentLanguage === "es") {
            response = await fetch(`https://rae-api.com/api/words/${word}`);

            if (!response.ok) throw new Error("No word found");

            if (response.ok) {
                const dataEs = await response.json();

                if (dataEs.data.length === 0) {
                    throw new Error("No word found");

                } if (!myWords[currentLanguage].includes(word) && !learned[currentLanguage].includes(word)) {
                    myWords[currentLanguage].push(word);
                    localStorage.setItem("myWords", JSON.stringify(myWords));
                }

                const firstEntry = dataEs.data;
                const wordEs = firstEntry.word;
                const meaning = firstEntry.meanings[0];
                const definition = meaning.senses[0].description;

                definitionSpace.innerHTML = `<strong>${word}</strong> -  ${definition}`
            }

        }

        wait.style.display = "none";
        definitionSpace.style.display = "block";
        buttons.style.display = "block";

    } catch (error) {
        buttons.style.display = "none";
        definitionSpace.innerHTML = `Definition for the word: <strong>${word}</strong> not found. Please try again and check the misspelling`;
        console.error(error);
        definitionSpace.style.display = "block";
        wait.style.display = "none";
    }
}

async function setReminder() {

    definitionSpace.style.display = "none";
    buttons.style.display = "none";

    const min = 5 * 60 * 1000;
    const max = 10 * 60 * 1000;
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;

    const randomWord = await getRandomWord();
    setTimeout(() => showDefinition(randomWord), delay);

    input.value = "";
    input.focus();
}

async function wordLearned() {
    const word = currentWord.trim();
    if (!word) return;

    if (!learned[currentLanguage].includes(word)) {
        learned[currentLanguage].push(word);
        localStorage.setItem("learned", JSON.stringify(learned));
    }

    const index = myWords[currentLanguage].indexOf(word);
    if (index !== -1) {
        myWords[currentLanguage].splice(index, 1);
        localStorage.setItem("myWords", JSON.stringify(myWords));
    }

    input.value = "";
    definitionSpace.style.display = "none";
    buttons.style.display = "none";

    input.focus();
    getStars();
}

async function getStars() {
    const container = document.getElementById("container-score");
    const score = document.getElementById("score");
    const count = learned[currentLanguage].length;

    if (count < 10) {
        container.style.display = "none";
        return;
    }

    const stars = Math.min(5, Math.floor(count / 10));
    const starsHTML = '<i class="fa-solid fa-star" style="margin: 5px"></i>'.repeat(stars);
    let text = '';

    if (count % 10 === 0 && count <= 50) {
        text =
            `<p>Congratulations you have learned[currentLanguage] ${count} words: <br>
            ${learned[currentLanguage].map(w => `<strong> ${w}</strong>`).join(', ')}</p>`;
    }
    text += `<i style="color: #FFBF00; font-size: 32px;">${starsHTML} </i>`;

    score.innerHTML = text;
    container.style.display = "block";
}

document.querySelectorAll(".mytabs label").forEach(label => {
    label.addEventListener("click", () => {
        currentLanguage = label.dataset.lang;
        localStorage.setItem("lastLanguage", currentLanguage);
        input.value = "";
        definitionSpace.innerHTML = "";
        getRandomWord().then(word => { showDefinition(word) });
        input.focus();
        getStars();

    })
})

document.querySelectorAll(".mytabs label").forEach(label => {
    if (label.dataset.lang === currentLanguage) {
        label.click();
    }
});

input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        search.click();
    }
});

search.addEventListener("click", () => { showDefinition() });
reminder.addEventListener("click", setReminder);
tooEasy.addEventListener("click", wordLearned);
