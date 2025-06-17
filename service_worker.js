
//si hay popup.js no es necesario

chrome.action.onClicked.addListener(tab => { //tab = pestaña dodne se hace click
    chrome.scripting.executeScript({ //ejecuta script en la pestaña especificada, usa la API
        target: {tabId: tab.id}, //especifica que se debe ejecutar en la pestaña que se hizo clic cuyo Id es tab.id
        func:() =>{
            alert('Hello world!');
        }
    })
})