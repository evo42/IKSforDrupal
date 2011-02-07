/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

/**
 * Correction object
 * Example:
 * <pre>
 * var correction = new GENTICS.Aloha.Annotations.Correction(origAnnotation, newAnnotation, type)
 * </pre>
 *
 * @param {object} attrs all attributes for RDFa Annotations.
 * @param {object} of @GENTICS.Aloha.Annotations.Namespace objects.
 * @param {string} type of the action ("new", "change", "remove").
 *
 */
GENTICS.Aloha.Annotations.Correction = function(origAnnotation, newAnnotation, type) {

	this.origAnnotation = origAnnotation;
	this.newAnnotaion = newAnnotation;
	this.type = type;
};
