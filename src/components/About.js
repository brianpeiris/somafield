import { Component, dom } from '../../bink/src/index.js';
import * as components from '../../bink/src/components/index.js';

export default class About extends Component {
	constructor() {
		super();
		this.addClass('about');

		new components.HeadingComponent(undefined, {
			dom: dom.h2(),
			text: 'About',
		}).appendTo(this);

		new components.TextComponent(undefined, {
			text: 'SomaField lets you build and collect music visualizations.',
		}).appendTo(this);

		new components.ButtonComponent(undefined, {
			text: 'Back',
			anchor: '#',
		}).appendTo(this);
	}
}
