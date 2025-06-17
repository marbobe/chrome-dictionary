async function decirHola() {
    let [tab] = await chrome.tabs.query({ active: true , currentWindow: true }); //chrome.tabs.query obtiene la pestaña activa y ventana actual
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            alert('Hola desde js popup');
        }
    })
}

const search = document.getElementById("search");
const input = document.getElementById("input-el");
const definitionSpace = document.getElementById("p-el");

async function showDefinition(){

    const text = "something";
    definitionSpace.innerHTML = text;
}


input.focus();

search.addEventListener("click", showDefinition);


search.addEventListener("click", decirHola);


