/**
 * Audio pipeline with compressor and gain.
 */
export class AudioPipeline {
    constructor() {
        this.audioContext = new AudioContext();

        this.compressorNode = this.audioContext.createDynamicsCompressor();
        this.gainNode = this.audioContext.createGain();

        this.compressorNode.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
    }

    /**
     * Set the volume of the audio pipeline.
     * @param {number} value Volume value between 0 and 1.
     */
    setVolume(value) {
        // Clamp the value just in case.
        value = Math.max(0, Math.min(1, value));
        this.gainNode.gain.value = value
    }

    /**
     * Play a sound effect via this audio pipeline.
     * @param {SoundEffect} sound SoundEffect to play via this pipeline.
     */
    async playSound(sound) {
        await sound.whenReady();
        let source = new MediaElementAudioSourceNode(this.audioContext, {
            mediaElement: sound.mediaElement
        });
        source.connect(this.compressorNode);
        sound.mediaElement.play();
    }
}

/**
 * Sound effect based off an Audio source node.
 */
export class SoundEffect {
    /**
     * @param {string} src Sound file path
     * @param {function|undefined} cb Optional callback function to call when the sound is ready to play.
     */
    constructor(src, cb) {
        this.ready = false;
        this.mediaElement = new Audio();
        this.mediaElement.autoplay = false;
        this.mediaElement.addEventListener("canplaythrough", () => { this.ready = true; if (cb !== undefined) cb(this); });
        this.mediaElement.src = src;
    }

    destroy() {
        this.mediaElement.remove();
        this.mediaElement.src = "";
        this.mediaElement = undefined;
        this.ready = false;
    }

    async whenReady() {
        while (!this.ready) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }
}

export default {
    AudioPipeline,
    SoundEffect
}