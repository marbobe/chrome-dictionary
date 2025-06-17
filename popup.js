async function decirHola() {
    let [tab] = await chrome.tabs.query({ active: true , currentWindow: true }); //chrome.tabs.query obtiene la pestaña activa y ventana actual
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            alert('Hola desde js popup');
        }
    })
}

document.getElementById("boton").addEventListener("click", decirHola);