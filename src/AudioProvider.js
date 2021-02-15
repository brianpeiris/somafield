export default class AudioProvider {
	constructor() {
		this._audioEl = document.createElement('audio');
		this._audioEl.crossOrigin = 'anonymous';
		document.body.append(this._audioEl);

		const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		const source = audioCtx.createMediaElementSource(this._audioEl);
		this._analyser = audioCtx.createAnalyser();
		source.connect(this._analyser);
		this._analyser.connect(audioCtx.destination);

		this._audioEl.addEventListener('play', () => audioCtx.resume());

		this._analyser.fftSize = 64;
		this._audioData = new Uint8Array(this._analyser.frequencyBinCount);

		this._updateAudioData = this._updateAudioData.bind(this);
		requestAnimationFrame(this._updateAudioData);
	}
	_updateAudioData() {
		this._analyser.getByteFrequencyData(this._audioData);
		this._lastDataUpdate = Date.now();
		requestAnimationFrame(this._updateAudioData);
	}
	get audioData() {
		return this._audioData;
	}
	get audioEl() {
		return this._audioEl;
	}
}
