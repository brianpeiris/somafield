import { App, Router } from '../bink/src/index.js';

import Masthead from './components/Masthead.js';
import Main from './components/Main.js';
import Home from './components/Home.js';
import About from './components/About.js';
import Editor from './components/Editor.js';
import LocalStorageService from './LocalStorageService.js';
import AudioProvider from './AudioProvider.js';
import { SketchModel } from './Sketch.js';

class SomaField extends App {
	constructor(options = {}) {
		super(options);

		new LocalStorageService().attachToDataObject();

		const audioProvider = new AudioProvider();

		this._masthead = new Masthead(undefined, { audioProvider }).appendTo(this);
		this._main = new Main().appendTo(this);

		const router = new Router();

		router.addRoute(/^$/, 'home');
		router.addListener('home', () => {
			this._main.dom.innerHTML = '';
			new Home(undefined, { audioProvider }).appendTo(this._main);
		});

		router.addRoute(/^about$/, 'about');
		router.addListener('about', () => {
			this._main.dom.innerHTML = '';
			new About().appendTo(this._main);
		});

		router.addRoute(/^edit\/(?<id>.+)$/, 'edit');
		router.addListener('edit', async (_, __, id) => {
			this._main.dom.innerHTML = '';
			const dataModel = await new SketchModel({ id }).fetch();
			new Editor(dataModel, {
				titleDataField: 'title',
				codeDataField: 'code',
				audioProvider,
			}).appendTo(this._main);
		});

		router.start();
	}
}

document.body.innerHTML = '';
document.body.append(new SomaField().dom);
