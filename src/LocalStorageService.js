import { DataObject } from '../bink/src/index.js';

function responseForData(data) {
	return new Response(new Blob([data]));
}

function generateId() {
	const chars = 'abcdefghjkmnpqrstuvwxyz';

	let id = '';
	for (let i = 0; i < 6; i++) {
		id += chars[Math.floor(Math.random() * chars.length)];
	}

	return id;
}

export default class LocalStorageService {
	_get(key) {
		if (!key.includes('/')) {
			// We've received a request for all items of a certain key such as "sketches"
			const prefix = key + '/';
			const data = [];
			for (let i = 0; i < localStorage.length; i++) {
				const storageKey = localStorage.key(i);
				if (storageKey.startsWith(prefix)) {
					data.push(JSON.parse(localStorage.getItem(storageKey)));
				}
			}

			return responseForData(JSON.stringify(data));
		} else {
			// We've received a request for a specific item with a key like "sketches/afjsks"
			return responseForData(localStorage.getItem(key));
		}
	}

	_put(key, data) {
		localStorage.setItem(key, data);
		return responseForData(data);
	}

	_post(key, data) {
		let id = generateId();
		while (localStorage.getItem(`${key}/${id}`) !== null) {
			id = generateId();
		}

		const obj = JSON.parse(data);
		obj.id = id;
		data = JSON.stringify(obj);

		localStorage.setItem(`${key}/${id}`, data);

		return responseForData(data);
	}

	_delete(key) {
		localStorage.removeItem(key);
		return new Response();
	}

	attachToDataObject() {
		DataObject.prototype._innerFetch = async (key, params) => {
			const method = params.method || 'get';
			switch (method) {
				case 'get':
					return this._get(key);
				case 'post':
					return this._post(key, params.body);
				case 'put':
					return this._put(key, params.body);
				case 'delete':
					return this._delete(key);
			}
		};
	}
}
