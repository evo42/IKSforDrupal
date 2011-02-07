/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

/**
 * Abstract Annotation Writer
 * @namespace GENTICS.Aloha
 * @class Writer
 * @constructor
 * @param {String} writerId unique repository identifier
 * @param {String} basePath (optional) basepath of the repository (relative to 'repositories' folder). If not given, the basePath is taken
 */
GENTICS.Aloha.Annotations.Writer = function(writerId, writerName) {
	/**
	 * @cfg {String} writerId is the unique Id for this Service repository instance 
	 */
	this.writerId = writerId;
	
	/**
	 * contains the writer settings object
	 * @cfg {Object} settings the writer settings stored in an object
	 */
	this.settings = {};

	/**
	 * @cfg {String} writerName is the name for this Service instance 
	 */
	// annotationServiceName
	this.writerName = (writerName) ? writerName : writerId;
	
	GENTICS.Aloha.Annotations.AnnotationWriterManager.register(this);
};

/**
 * Init method of the repository. Called from Aloha Annotations Plugin to initialize this Writer
 * @return void
 * @hide
 */
GENTICS.Aloha.Annotations.Writer.prototype.init = function() {
	
};