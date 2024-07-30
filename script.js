import { AudioPipeline, SoundEffect } from "./audio.js";

// Neat trick to make it easier to grab elements from the DOM.
let $ = document.querySelector.bind(document);

// Array of cat images.
let cats = [
    "./meow/silly_kitty.png",
    "./meow/kitty_meow.png",
    "./meow/kitty_yawn.png",
    "./meow/kitty_stare.png",
    "./meow/derpy_kitty.png"
];
// Current cat image ID that is being shown.
let catId = 0;

// Cat button and button image.
let catButton = $("#kitty");
let catImage = $("#imgClickAndChange");

/**
 * This function changes the cat image to the next one in the list.
 */
function changeImage() {
    // Increment the cat id, and if we've gone past the end of the list of cats,
    // we wrap around to the beginning using the modulo operator.
    catId = (catId + 1) % cats.length;

    // Set the cat image to the new cat.
    setCatImage(catId);
}

/**
 * Set the cat image to the one at `id` and update the catId variable.
 * @param {number} id Cat image ID
 */
function setCatImage(id) {
    catId = id;
    catImage.src = cats[catId];
}

// Audio context setup (from audio.js)
let audio = null;
function setup() {
    if (audio === null) audio = new AudioPipeline();
}
// Listen for user interaction before we spawn our audio context. (Security limitaiton)
["click", "keydown", "mousedown", "touch", "touchstart"].forEach(event => document.addEventListener(event, setup));

/**
 * Spawn a new Audio object and play the meow sound.
 */
function playMeowSound() {
    let sfx = new SoundEffect("./meow/Meow_sfx.mp3");
    audio.playSound(sfx);
}

// Set the initial cat image.
setCatImage(catId);

// Add a click handler for the cat button which switches the image and plays the sound.
catButton.addEventListener("click", () => {
    changeImage();
    playMeowSound();
});