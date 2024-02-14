const form = document.getElementById('mainForm')
const fromThisLangSelection = document.getElementById('fromThisLangSelection')
const toThisLangSelection = document.getElementById('toThisLangSelection')
const switchLangBtn = document.getElementById('switchLang')
const fromThisLangTextArea = document.getElementById('fromThisLangTextArea')
const toThisLangTextArea = document.getElementById('toThisLangTextArea')
const translateBtn = document.getElementById('translateBtn')
const copyBtn = document.getElementById('copyBtn')
const speechBtns = Array.from(document.getElementsByClassName('speechBtn'))
const charCount = document.getElementById('charCount')


eventListeners();

function eventListeners() {
    form.addEventListener('submit', translate)
    switchLangBtn.addEventListener('click', switchLanguage)
    copyBtn.addEventListener('click', copyTranslatedText)
    speechBtns.forEach(btn => btn.addEventListener('click', speechText))
    fromThisLangTextArea.addEventListener('input', characterCount)
    window.addEventListener('load', resetUI);
}


function switchLanguage(e) {
    // language switch by destructing method
    [fromThisLangSelection.value, toThisLangSelection.value] = [toThisLangSelection.value, fromThisLangSelection.value];
    [fromThisLangTextArea.value, toThisLangTextArea.value] = [toThisLangTextArea.value, fromThisLangTextArea.value];

    e.preventDefault();
}


function translate(e){
    const textToTranslate = fromThisLangTextArea.value
    const API_URL = `https://api.mymemory.translated.net/get?q=${textToTranslate}&langpair=${fromThisLangSelection.value}|${toThisLangSelection.value}`
    fetch(API_URL)
    .then(res => res.json())
    .then(data => {
        if(data.matches[1] && data.matches[1].translation !== undefined)
            toThisLangTextArea.value = data.matches[1].translation
        else if(data.matches[0] && data.matches[0].translation !== undefined)
            toThisLangTextArea.value = data.matches[0].translation
        else
            toThisLangTextArea.value = data.responseData.translatedText
    })
    e.preventDefault();
}


function copyTranslatedText(){
    const text = toThisLangTextArea.value
    
    navigator.clipboard.writeText(text);

    // For mobile devices
    copyText.select();
    copyText.setSelectionRange(0, 99999);

    window.alert("Copy Successful")
}


let currentlySpeaking = false

function speechText(e){
    if(currentlySpeaking)
        window.speechSynthesis.cancel()

    let textArea = e.target.localName === "button"
    ? e.target.parentElement.previousElementSibling
    : e.target.parentElement.parentElement.previousElementSibling

    const speech = new SpeechSynthesisUtterance(textArea.value)

    const languageCodes = {
        'en': 'en-US',
        'tr': 'tr-TR',
        'de': 'de-DE',
        'fr': 'fr-FR',
        'es': 'es-ES',
        'it': 'it-IT',
        'ru': 'ru-RU'
    }

    if(textArea.id === "fromThisLangTextArea")
        speech.lang = languageCodes[fromThisLangSelection.value]
    else
        speech.lang = languageCodes[toThisLangSelection.value]

    window.speechSynthesis.speak(speech);

    currentlySpeaking = true
}


function characterCount(){
    let textLength = fromThisLangTextArea.value.length;
    charCount.textContent = textLength + " / 500";

    if (textLength > 500)
        textarea.value = textarea.value.slice(0, 500);
}


function resetUI() {
    fromThisLangSelection.value = 'en'
    toThisLangSelection.value = 'tr'
    fromThisLangTextArea.value = ''
    toThisLangTextArea.value = ''
}