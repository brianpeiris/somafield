import * as components from '../../bink/src/components/index.js';

import Visualizer from './Visualizer.js';

export default class SketchTile extends components.CardComponent {
	constructor(dataModel, options) {
		super(dataModel, options);

		this.addClass('sketch-tile');

		new Visualizer(dataModel, {
			dataField: 'code',
			audioProvider: options.audioProvider,
		}).appendTo(this.mainComponent);
	}
}
