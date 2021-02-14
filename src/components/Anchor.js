import { dom } from '../../bink/src/index.js';
import * as components from '../../bink/src/components/index.js';

export default class AnchorComponent extends components.TextComponent {
	constructor(dataModel, options) {
		const domOptions = { href: options.href };
		if (options.target) {
			domOptions.target = options.target;
		}
		super(dataModel, {
			dom: dom.a(domOptions),
			text: options.text,
		});
	}
}
