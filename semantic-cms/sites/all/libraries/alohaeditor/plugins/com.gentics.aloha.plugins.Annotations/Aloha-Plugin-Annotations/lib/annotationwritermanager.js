/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/
/**
 * Annotation Writer Manager
 * @namespace GENTICS.Aloha.Annotations
 * @class AnnotationWriterManager
 * @singleton
 */
GENTICS.Aloha.Annotations.AnnotationWriterManager = function() {
	this.writers = new Array();
};

/**
 * Initialize all registered writers
 * @return void
 * @hide
 */
GENTICS.Aloha.Annotations.AnnotationWriterManager.prototype.init = function() {
	
	// get the writer settings
	if (GENTICS.Aloha.Annotations.settings.writers == undefined) {
		GENTICS.Aloha.Annotations.settings.writers = {};
	}

	// iterate through all registered writers
	for ( var i = 0; i < this.writers.length; i++) {
		var writer = this.writers[i];
		
		if (writer.settings == undefined) {
			writer.settings = {};
		}
		
		// merge the specific settings with the writer default settings
		if ( GENTICS.Aloha.Annotations.settings.writers[writer.writerId] ) {
			jQuery.extend(writer.settings, GENTICS.Aloha.Annotations.settings.writers[writer.writerId]);
		}
		
		writer.init();
	}
};

/**
 * Register an AnnotationWriter writer
 * @param {GENTICS.Aloha.Annotations.AnnotationWriter} Annotation Writer writer to register
 */

GENTICS.Aloha.Annotations.AnnotationWriterManager.prototype.register = function(writer) {
	
	if (writer instanceof GENTICS.Aloha.Annotations.Writer) {
		if ( !this.getWriter(writer.writerId) ) {
			this.writers.push(writer); 
		} else {
			GENTICS.Aloha.Log.warn(this, "A writer with name { " + writer.writerId+ " } already registerd. Ignoring this.");
		}
	} else {
		GENTICS.Aloha.Log.error(this, "Trying to register a writer which is not an instance of Annotations.AnnotationWriter.");
	}
	
};

/**
 * Returns a Annotation Writer writer object identified by writerId.
 * @param {String} writerId the name of the Annotation Writer writer
 * @return {GENTICS.Aloha.Annotations.AnnotationWriter} a writer or null if name not found
 */
GENTICS.Aloha.Annotations.AnnotationWriterManager.prototype.getWriter = function(writerId) {
	
	for ( var i = 0; i < this.writers.length; i++) {
		if ( this.writers[i].writerId == writerId ) {
			return this.writers[i];
		}
	}
	return null;
};

/**
 * Create the Annotation Writer Manager object
 * @hide
 */
GENTICS.Aloha.Annotations.AnnotationWriterManager = new GENTICS.Aloha.Annotations.AnnotationWriterManager();

/**
 * Expose a nice name for the Annotation Writer Manager
 * @hide
 */
GENTICS.Aloha.Annotations.AnnotationWriterManager.toString = function() {
	return "com.gentics.aloha.plugins.Annotations.AnnotationWriterManager";
};