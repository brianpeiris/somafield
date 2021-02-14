import { Component } from '../../bink/src/index.js';
import * as components from '../../bink/src/components/index.js';

import Anchor from './Anchor.js';

export default class SomaPlayer extends Component {
	constructor(dataModel, options) {
		super(dataModel, options);

		this.addClass('soma-player');

		this._loadingText = new components.TextComponent(undefined, {
			text: 'Loading...',
		})
			.hide()
			.appendTo(this);
		this._loadingTimeout = setTimeout(() => this._loadingText.show(), 500);

		this.init();
	}
	async init() {
		try {
			this._channels = (
				await fetch('https://somafm.com/channels.json').then((r) => r.json())
			).channels;
		} catch (e) {
			console.error('Could not load channels', e);
			this._channels = [];
		}

		clearTimeout(this._loadingTimeout);
		this._loadingText.hide();

		const randomChannelIndex = Math.floor(
			this._channels.length * Math.random()
		);

		const channelSelector = new components.SelectionComponent(undefined, {
			items: this._channels.map((c) => [c.title, c.id]),
		}).appendTo(this);

		channelSelector.selectedIndex = randomChannelIndex;

		this._setAudioFromChannelIndex(channelSelector.selectedIndex);

		// HACK: Shouldn't have to listen directly to the dom event.
		this.listenTo('input', channelSelector.dom, () => {
			this._setAudioFromChannelIndex(channelSelector.selectedIndex);
		});

		new components.AudioPlayerComponent(undefined, {
			audioDOM: this.options.audioProvider.audioEl,
		}).appendTo(this);

		new Anchor(undefined, {
			href: 'https://somafm.com/',
			text: 'powered by somafm.com',
			target: '_blank',
		})
			.addClass('soma-link')
			.appendTo(this);
	}
	_setAudioFromChannelIndex(channelIndex) {
		const selectedChannel = this._channels[channelIndex];
		const url = `https://ice4.somafm.com/${selectedChannel.id}-128-mp3`;

		const { audioEl } = this.options.audioProvider;
		const wasPlaying = !audioEl.paused;

		audioEl.src = url;

		if (wasPlaying) audioEl.play();
	}
}
