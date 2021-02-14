import { DataModel, DataCollection } from '../bink/src/index.js';

export class SketchModel extends DataModel {
	get url() {
		return this.data.id ? `sketches/${this.data.id}` : `sketches`;
	}
}

export class SketchCollection extends DataCollection {
	get url() {
		return 'sketches';
	}
}
