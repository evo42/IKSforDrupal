/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

/**
 * Namespace object to use with annotations
 * Example:
 * <pre>
 * var foaf = new GENTICS.Aloha.Annotations.Namespace({ prefix: 'foaf', uri: 'http://xmlns.com/foaf/0.1/'})
 * </pre>
 *
 * @property {string} prefix a string used as shortcut for the namespace URI;
 * @property {string} uri a URI of the namespace;
 *
 * @param {object} attrs all attributes for the namespace.
 *
 */
GENTICS.Aloha.Annotations.Namespace = function(attrs) {	
	if (attrs) {
		try {
			this.prefix = this.getAttr('prefix');
			this.uri = this.getAttr('uri');
		} catch ( e ) {
			throw e;
		}
		
		// @todo check if the namespace is available; if not, add it the the parent dom object
	}
};

GENTICS.Aloha.Annotations.Namespace.prototype.getAttr = function(name) {

	var v = this.attrs[name];

	return v;
};

GENTICS.Aloha.Annotations.Namespace.prototype.checkNamespace = function(prefix) {
	// check with jQuery if Namespace is available in the html header or the parent dom container
};
