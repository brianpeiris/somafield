import { Component } from '../../bink/src/index.js';
import * as components from '../../bink/src/components/index.js';

import generateSample from '../utils/generate-sample.js';
import SketchTile from './SketchTile.js';
import { SketchModel, SketchCollection } from '../Sketch.js';

export default class Home extends Component {
	constructor(dataModel, options) {
		super(dataModel, options);

		this.addClass('home');

		this._editSketch = this._editSketch.bind(this);

		const newButton = new components.ButtonComponent(undefined, {
			text: 'New',
		})
			.addClass('new-button')
			.appendTo(this);

		newButton.listenTo('click', newButton.dom, async () => {
			const newSketch = await new SketchModel(generateSample()).save();
			location.hash = `edit/${newSketch.data.id}`;
		});

		new SketchCollection().fetch().then(async (dataCollection) => {
			if (dataCollection.length === 0) {
				for (let i = 0; i < 4; i++) {
					await dataCollection.create(generateSample());
				}
			}

			dataCollection.sort((a, b) => b.data.createdAt - a.data.createdAt);

			new components.MediaGridComponent(dataCollection, {
				itemComponent: SketchTile,
				itemOptions: { audioProvider: options.audioProvider },
				onClick: this._editSketch,
			}).appendTo(this);
		});
	}

	_editSketch(sketchModel) {
		location.hash = `edit/${sketchModel.data.id}`;
	}
}
