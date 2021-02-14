import { Component } from '../../bink/src/index.js';
import * as components from '../../bink/src/components/index.js';

import CodeMirror from './CodeMirror.js';
import Visualizer from './Visualizer.js';

class EditorControls extends Component {
	constructor(dataModel, options) {
		super(dataModel, options);
		this.addClass('editor-controls');

		new components.TextInputComponent(dataModel, {
			dataField: options.titleDataField,
		})
			.addClass('editor-title-input')
			.appendTo(this);

		const deleteButton = new components.ButtonComponent(undefined, {
			text: 'Delete',
		}).appendTo(this);

		deleteButton.listenTo('click', deleteButton.dom, async () => {
			await dataModel.delete();
			location.href = '#';
		});

		const saveButton = new components.ButtonComponent(undefined, {
			text: 'Save',
		}).appendTo(this);

		saveButton.listenTo('click', saveButton.dom, async () => {
			await dataModel.save();
		});
	}
}

export default class Editor extends Component {
	constructor(dataModel, options) {
		super(dataModel, options);

		this.addClass('editor');

		const backButton = new components.ButtonComponent(undefined, {
			text: 'Back',
		})
			.addClass('editor-back-button')
			.appendTo(this);

		backButton.listenTo('click', backButton.dom, async () => {
			location.href = '#';
		});

		new EditorControls(dataModel, options).appendTo(this);

		new CodeMirror(dataModel, {
			dataField: options.codeDataField,
		}).appendTo(this);

		new Visualizer(dataModel, {
			dataField: options.codeDataField,
			audioProvider: options.audioProvider,
		}).appendTo(this);
	}
}
