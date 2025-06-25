let myWords = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "setReminder" && Array.isArray(request.words)) {
        myWords = request.words;

        console.log("Words received:", myWords);

        sendResponse({ status: "reminder set" });
        setReminder();
    } else {
        console.warn("Invalid request:", request);
    }
});

async function setReminder() {
    if (!myWords.length) return;

    const randomWord = myWords[Math.floor(Math.random() * myWords.length)];
    const min = 5 * 1000; // CAMBIAR A 5 MINUTOS  5 * 60 *1000
    const max = 10 * 1000; // CAMBIAR A 10 MINUTOS 10* 60 * 1000
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;

    console.log(`Setting reminder for word "${randomWord}" in ${delay / 1000}s`);

    setTimeout(async () => {

        chrome.notifications.create({
            type: "basic",
            iconUrl: "images/dictionary.png", // usa un icono que tengas en tu extensión
            title: "Reminder Word",
            message: `Do you remember the meaning of: <strong>${randomWord}</strong>?`,
            priority: 2
        });

        setReminder();
    }, delay);

}
chrome.notifications.onClicked.addListener(() => {
    chrome.log("Notification clicked");
});


/*async function sendWordsToBackground() {
    try {
        const response = await chrome.runtime.sendMessage({ action: "setReminder", words: myWords }); //enviar myWords a service_worker 
    } catch (error) {
        console.error("Error sending message to background:", error);
    }

    console.log((response && response.status) || "No response");
    definitionSpace.style.display = "none";
    document.getElementById("extra-btn").style.display = "none";
    input.value = "";
    input.focus();
}*/  // FUNCION PARA ACTIVAR EL POP UP DE SERVICE WORKER SE DEBERÍA PONER EN POPUP.JS


/* "background":{
    "service_worker": "service_worker.js"
  }, */ // AÑADIR AL MANIEFEST