/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

/**
 * register the plugin with unique name
 */
GENTICS.Aloha.Annotations = new GENTICS.Aloha.Plugin('com.gentics.aloha.plugins.Annotations');

/**
 * Configure the available languages
 */
GENTICS.Aloha.Annotations.languages = ['en', 'de'];

/**
 * Initialize the plugin
 */
GENTICS.Aloha.Annotations.init = function () {
	var that = this;
	
	GENTICS.Aloha.Annotations.AnnotationServiceManager.init();
	GENTICS.Aloha.Annotations.AnnotationWriterManager.init();
};

/**
 * Register Annotation Services
 */
GENTICS.Aloha.Annotations.registerAnnotationService = function () {
	
};

/**
 * Register Annotation Writer
 */
GENTICS.Aloha.Annotations.registerAnnotationWriter = function () {
	
};