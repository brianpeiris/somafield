/**
An object that provides helper functions that generate [HTMLElements](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement), usually for populating {@link Component.dom}.

@example
dom.li()
// returns an `li` HTMLElement: `<li></li>`

dom.div()
// returns a 'div' HTMLElement: '<div></div>'

dom.span('Some text')
// `<span>Some text</span>`

@example <caption>Text and dictionary parameters do handy things</caption>
dom.a('Click me', { href: '/some-url/' })
// `<a href="/some-url/">Click me</a>`

@example <caption>Any parameter can be a string, a dictionary, or another element</caption>
dom.button(
	{ type: 'button', class: 'my-button' },
	dom.img({ src: 'image.jpg' }),
	'Click me'
)
// `<button type="button" class="my-button"><img src="image.jpg" />Click me</button>`

dom.ul(
	dom.li('First item'),
	dom.li('Second item', { class: 'selected-item' })
)
// <ul>
// <li>First Item</li>
// <li class: "selected-item">Second item</li>
// </ul>

@example <caption>Populate a Component's UI</caption>
class MyComponent extends Component {
	constructor(dataObject, options) {
		super(dataObject, options)
		this.dom.appendChild(dom.h1('This is a heading'))
	}
}
*/
const dom = {}
export default dom

/**
domElementFunction is the behind the scenes logic for the functions like dom.div(...)
Below you will find the loop that uses domElementFunction
*/
dom.domElementFunction = function (tagName, ...params) {
	// Create a boring DOM element
	const element = document.createElement(tagName)

	// A convenience function to allow chaining like `let fooDiv = dom.div().appendTo(document.body)`
	element.appendTo = function (parent) {
		parent.appendChild(this)
		return this
	}

	// if element.parentElement exists, call removeChild(element) on it
	element.remove = function () {
		if (this.parentElement) {
			this.parentElement.removeChild(this)
		}
		return this
	}

	// A convenience function to allow appending strings, dictionaries of attributes, arrays of subchildren, or children
	element.append = function (child = null) {
		if (child === null) {
			return
		}
		if (typeof child === 'string') {
			this.appendChild(document.createTextNode(child))
		} else if (Array.isArray(child)) {
			for (const subChild of child) {
				this.append(subChild)
			}
			// If it's an object but not a DOM element, consider it a dictionary of attributes
		} else if (typeof child === 'object' && typeof child.nodeType === 'undefined') {
			for (const key in child) {
				if (child.hasOwnProperty(key) == false) {
					continue
				}
				this.setAttribute(key, child[key])
			}
		} else {
			this.appendChild(child)
		}
		return this
	}

	element.documentPosition = function () {
		return dom.documentOffset(this)
	}

	/*
	Sort element.children *in place* using the comparator function
	See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort for an explanation of the comparator function
	*/
	element.sort = function (comparator = dom.defaultComparator) {
		// Populate the holding array while removing children from the DOM
		const holdingArray = []
		while (this.children.length > 0) {
			holdingArray.push(this.removeChild(this.children.item(0)))
		}
		holdingArray.sort(comparator)
		for (const child of holdingArray) {
			this.appendChild(child)
		}
		return this
	}

	// Sort element.children *in place* using child[attributeName] and the comparator function
	element.sortByAttribute = function (attributeName, comparator = dom.defaultComparator) {
		this.sort((el1, el2) => {
			return comparator(el1.getAttribute(attributeName), el2.getAttribute(attributeName))
		})
		return this
	}

	// Convenience functions to add and remove classes from this element without duplication
	element.addClass = function (...classNames) {
		const classAttribute = this.getAttribute('class') || ''
		const classes = classAttribute === '' ? [] : classAttribute.split(/\s+/)
		for (const className of classNames) {
			if (classes.indexOf(className) === -1) {
				classes.push(className)
			}
		}
		this.setAttribute('class', classes.join(' '))
		return this
	}
	element.removeClass = function (...classNames) {
		const classAttribute = this.getAttribute('class') || ''
		const classes = classAttribute === '' ? [] : classAttribute.split(/\s+/)
		for (const className of classNames) {
			const index = classes.indexOf(className)
			if (index !== -1) {
				classes.splice(index, 1)
			}
		}
		if (classes.length === 0) {
			this.removeAttribute('class')
		} else {
			this.setAttribute('class', classes.join(' '))
		}
		return this
	}

	// Append the children parameters
	for (const child of params) {
		element.append(child)
	}
	return element
}

// This comparator stringifies the passed values and returns the comparison of those values
dom.defaultComparator = function (el1, el2) {
	if (el1 === el2) return 0
	const str1 = '' + el1
	const str2 = '' + el2
	if (str1 == str2) return 0
	if (str1 < str2) return -1
	return 1
}

// Traverse the document tree to calculate the offset in the entire document of this element
dom.documentOffset = function (element) {
	let left = 0
	let top = 0
	const findPos = function (obj) {
		left += obj.offsetLeft
		top += obj.offsetTop
		if (obj.offsetParent) {
			findPos(obj.offsetParent)
		}
	}
	findPos(element)
	return [left, top]
}

/** 
The tag names that will be used to generate all of the element generating functions like dom.div(...) and dom.button(...)
These names were ovingly copied from the excellent Laconic.js 
@see https://github.com/joestelmach/laconic/blob/master/laconic.js
*/
dom.TAGS = [
	'a',
	'abbr',
	'address',
	'area',
	'article',
	'aside',
	'audio',
	'b',
	'base',
	'bdo',
	'blockquote',
	'body',
	'br',
	'button',
	'canvas',
	'caption',
	'cite',
	'code',
	'col',
	'colgroup',
	'command',
	'datalist',
	'dd',
	'del',
	'details',
	'dfn',
	'div',
	'dl',
	'dt',
	'em',
	'embed',
	'fieldset',
	'figcaption',
	'figure',
	'footer',
	'form',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'head',
	'header',
	'hgroup',
	'hr',
	'html',
	'i',
	'iframe',
	'img',
	'input',
	'ins',
	'keygen',
	'kbd',
	'label',
	'legend',
	'li',
	'link',
	'map',
	'mark',
	'menu',
	'meta',
	'meter',
	'nav',
	'noscript',
	'object',
	'ol',
	'optgroup',
	'option',
	'output',
	'p',
	'picture',
	'param',
	'pre',
	'progress',
	'q',
	'rp',
	'rt',
	'ruby',
	's',
	'samp',
	'script',
	'section',
	'select',
	'small',
	'source',
	'span',
	'strong',
	'style',
	'sub',
	'summary',
	'sup',
	'table',
	'tbody',
	'td',
	'textarea',
	'tfoot',
	'th',
	'thead',
	'time',
	'title',
	'tr',
	'ul',
	'var',
	'video',
	'wbr',
]

// This loop generates the element generating functions like dom.div(...)
for (const tag of dom.TAGS) {
	const innerTag = tag
	dom[innerTag] = function (...params) {
		return dom.domElementFunction(innerTag, ...params)
	}
}

const CookieValueRegularExpressionParts = ['(?:(?:^|.*;\\s*)', '\\s*\\=\\s*([^;]*).*$)|^.*$']

dom.getCookie = function (cookieName) {
	const cookieRegExp = new RegExp(
		`${CookieValueRegularExpressionParts[0]}${encodeURIComponent(cookieName)}${CookieValueRegularExpressionParts[1]}`
	)
	return document.cookie.replace(cookieRegExp, '$1')
}

dom.setCookie = function (cookieName, value) {
	document.cookie = `${encodeURIComponent(cookieName)}=${encodeURIComponent(value)}`
}

dom.removeCookie = function (cookieName) {
	document.cookie = `${encodeURIComponent(cookieName)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}
