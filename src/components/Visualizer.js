import { Component, dom } from '../../bink/src/index.js';

export default class Visualizer extends Component {
	constructor(dataModel, options) {
		super(dataModel, {
			dataField: options.dataField,
			audioProvider: options.audioProvider,
			dom: dom.canvas(),
		});

		this.addClass('visualizer');

		const size = 400;
		this.dom.width = size;
		this.dom.height = size;

		this._ctx = this.dom.getContext('2d');

		this._code = '';
		this._currentFunc = () => {};

		this._handleModelChange = this._handleModelChange.bind(this);
		if (this.dataObject && this.options.dataField) {
			this.listenTo(
				`changed:${this.options.dataField}`,
				this.dataObject,
				this._handleModelChange
			);
			this._handleModelChange();
		}

		this._render = this._render.bind(this);
		requestAnimationFrame(this._render);
	}

	_render() {
		this._ctx.resetTransform();

		try {
			this._currentFunc(
				this._ctx,
				this.options.audioProvider.audioData,
				this.dom.width,
				this.dom.height
			);
		} catch (e) {
			// TODO: display runtime errors
		}

		requestAnimationFrame(this._render);
	}

	_handleModelChange() {
		this._code = this.dataObject.get(this.options.dataField, '');

		try {
			this._currentFunc = new Function(
				'ctx',
				'audioData',
				'width',
				'height',
				this._code
			);
		} catch (e) {
			// TODO: display syntax errors
		}
	}
}
