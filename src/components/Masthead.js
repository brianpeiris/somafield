import { Component } from '../../bink/src/index.js';
import * as components from '../../bink/src/components/index.js';

import Anchor from './Anchor.js';
import SomaPlayer from './SomaPlayer.js';

export default class Masthead extends Component {
	constructor(dataModel, options) {
		super(dataModel, options);

		this.addClass('masthead');

		new Anchor(undefined, { href: '#' })
			.appendTo(this)
			.addClass('brand')
			.appendComponent(
				new components.HeadingComponent(undefined, { text: 'SomaField' })
			);

		new SomaPlayer(undefined, {
			audioProvider: options.audioProvider,
		}).appendTo(this);

		new Anchor(undefined, { href: '#about', text: 'About' })
			.addClass('about-link')
			.appendTo(this);
	}
}
