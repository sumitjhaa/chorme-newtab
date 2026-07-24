/**
 * @fileoverview Timer completion sounds using Web Audio API.
 */

let audioCtx: AudioContext | null = null

function getCtx(): AudioContext {
    if (!audioCtx) audioCtx = new AudioContext()
    if (audioCtx.state === 'suspended') audioCtx.resume()
    return audioCtx
}

function playTone(freq: number, duration: number, startTime: number, type: OscillatorType = 'sine', gain = 0.3) {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    g.gain.setValueAtTime(gain, startTime)
    g.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
    osc.connect(g)
    g.connect(ctx.destination)
    osc.start(startTime)
    osc.stop(startTime + duration)
}

/** Work session complete — ascending chime */
export function playWorkComplete() {
    const ctx = getCtx()
    const t = ctx.currentTime
    playTone(523, 0.15, t, 'sine', 0.25)        // C5
    playTone(659, 0.15, t + 0.12, 'sine', 0.25)  // E5
    playTone(784, 0.25, t + 0.24, 'sine', 0.3)   // G5
}

/** Short break complete — two quick blips */
export function playShortBreakComplete() {
    const ctx = getCtx()
    const t = ctx.currentTime
    playTone(880, 0.1, t, 'triangle', 0.2)        // A5
    playTone(1109, 0.1, t + 0.12, 'triangle', 0.2) // C#6
}

/** Long break complete — gentle descending tone */
export function playLongBreakComplete() {
    const ctx = getCtx()
    const t = ctx.currentTime
    playTone(784, 0.2, t, 'sine', 0.25)           // G5
    playTone(659, 0.2, t + 0.18, 'sine', 0.25)    // E5
    playTone(523, 0.3, t + 0.36, 'sine', 0.3)     // C5
}
