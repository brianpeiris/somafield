import { Component, dom } from '../../bink/src/index.js';

function waitForNode(observerNode, targetNode, timeout = 2000) {
	return new Promise((resolve, reject) => {
		let timeoutId = null;

		const observer = new MutationObserver((list) => {
			const addedNodes = list.flatMap((mutation) =>
				Array.from(mutation.addedNodes).flatMap((node) => [
					node,
					...Array.from(node.querySelectorAll('*')),
				])
			);

			if (addedNodes.some((node) => node === targetNode)) {
				clearTimeout(timeoutId);
				observer.disconnect();
				resolve();
			}
		});

		timeoutId = setTimeout(() => {
			observer.disconnect();
			reject();
		}, timeout);

		observer.observe(observerNode, { subtree: true, childList: true });
	});
}

export default class CodeMirror extends Component {
	constructor(dataObject = null, options = {}) {
		super(
			dataObject,
			Object.assign(
				{
					text: '',
					dom: dom.textarea(),
				},
				options
			)
		);

		this._handleModelChange = this._handleModelChange.bind(this);

		this._text = null;

		if (this.dataObject && this.options.dataField) {
			this.text = this.dataObject.get(this.options.dataField, '');

			this.listenTo(
				`changed:${this.options.dataField}`,
				this.dataObject,
				this._handleModelChange
			);
		} else {
			this.text = this.options.text;
		}

		this.dom.value = this.text;

		// CodeMirror expects the textarea to be on the document so that it can get
		// correct clientRect information, so we need to wait until the component is
		// actually attache to the document before we can use CodeMirror.fromTextArea.
		waitForNode(document.body, this.dom).then(() => {
			this._codeMirror = window.CodeMirror.fromTextArea(this.dom, {
				mode: 'javascript',
				keyMap: 'sublime',
				theme: 'monokai',
				matchBrackets: true,
				lineNumbers: true,
				highlightSelectionMatches: true,
			});

			this._codeMirror.on('change', () => {
				this.text = this._codeMirror.getValue();
			});
		});
	}

	_handleModelChange() {
		this.text = this.dataObject.get(this.options.dataField, '');
	}

	get text() {
		return this._text;
	}

	set text(value) {
		value = value || '';
		if (this._text === value) return;

		this._text = value;

		if (
			this.dataObject &&
			this.options.dataField &&
			this.dataObject.get(this.options.dataField) !== this._text
		) {
			this.dataObject.set(this.options.dataField, this._text);
		}
	}
}
