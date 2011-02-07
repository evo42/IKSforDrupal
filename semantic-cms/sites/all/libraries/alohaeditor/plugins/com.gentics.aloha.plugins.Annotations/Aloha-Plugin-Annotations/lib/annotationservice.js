/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

/**
 * Abstract Annotation Service
 * @namespace GENTICS.Aloha
 * @class Service
 * @constructor
 * @param {String} serviceId unique repository identifier
 * @param {String} basePath (optional) basepath of the repository (relative to 'repositories' folder). If not given, the basePath is taken
 */
GENTICS.Aloha.Annotations.Service = function(serviceId, serviceName) {
	/**
	 * @cfg {String} serviceId is the unique Id for this Service repository instance 
	 */
	this.serviceId = serviceId;
	
	/**
	 * contains the service settings object
	 * @cfg {Object} settings the service settings stored in an object
	 */
	this.settings = {};

	/**
	 * @cfg {String} serviceName is the name for this Service instance 
	 */
	// annotationServiceName
	this.serviceName = (serviceName) ? serviceName : serviceId;
	
	GENTICS.Aloha.Annotations.AnnotationServiceManager.register(this);
};

/**
 * Init method of the repository. Called from Aloha Annotations Plugin to initialize this Service
 * @return void
 * @hide
 */
GENTICS.Aloha.Annotations.Service.prototype.init = function() {
	
};