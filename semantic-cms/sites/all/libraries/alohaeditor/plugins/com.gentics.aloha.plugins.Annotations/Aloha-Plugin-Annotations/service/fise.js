/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

/**
 * Create the Services object. Namespace for Services
 * @hide
 */
if ( !GENTICS.Aloha.Annotations.Services ) GENTICS.Aloha.Annotations.Services = {};

/**
 * register the plugin with unique name
 */
GENTICS.Aloha.Annotations.Services.fise = new GENTICS.Aloha.Annotations.Service('com.gentics.aloha.plugins.Annotations.service.fise');

/**
 * init IKS Fise Service
 */
GENTICS.Aloha.Annotations.Services.fise.init = function() {
	var that = this;
	
	this.subscribeEvents();
	
	// REST API Endpoint URL.
	//this.ApiEndpoint = "http://fise.demo.nuxeo.com/engines/"; // @todo
	this.ApiEndpoint = false;
	if (GENTICS.Aloha.Annotations.settings.Services && GENTICS.Aloha.Annotations.settings.Services.fise && GENTICS.Aloha.Annotations.settings.Services.fise.ApiEndpoint) {
	   this.ApiEndpoint = GENTICS.Aloha.Annotations.settings.Services.fise.ApiEndpoint;
    }
    
    if (!this.ApiEndpoint) {
    	alert('ERROR: GENTICS.Aloha.Annotations.settings.Services.fise.ApiEndpoint not defined. Configure your FISE ApiEndpoint first.');
    }

	// @todo (due to bug in fise: text/plain == json-ld output); application/json, application/rdf+xml, application/rdf+json, text/turtle or text/rdf+nt
	this.ResponseFormat = "text/plain";
	
	if ( this.settings.ApiKey ) {
		// set the service name
		this.repositoryName = 'fise/' + this.settings.ApiKey;
	} else {
		// set the service name
		this.repositoryName = 'fise/public';
	}
};

/**
 * Subscribe for events
 */
GENTICS.Aloha.Annotations.Services.fise.subscribeEvents = function () {

	var that = this;	
	
    // add the event handler for smartContentChanged / editableDeactivated
    GENTICS.Aloha.EventRegistry.subscribe(GENTICS.Aloha, 'editableDeactivated', function(event, rangeObject) {
    
		//alert('smartContentChanged: ' + rangeObject.triggerType);
		/*
		$('#aloha_status_value').text('smartContentChanged: ' + rangeObject.triggerType);
		$('#aloha_status_value2').text('snapshotContent: ' + rangeObject.snapshotContent);
		$('#aloha_status_value3').text('editable content: ' + rangeObject.editable.getContents());
		*/
		//return false;
		
		
    	if (GENTICS.Aloha.activeEditable) {
    	    
    		var url = false;
    		
    		// @todo use new proxy plugin settings
			if (GENTICS.Aloha.settings.proxyUrl) {
               // the service url is passed as Query parameter, so it needs to be URLEncoded!
               url = GENTICS.Aloha.settings.proxyUrl + that.ApiEndpoint;
            } else {
                alert('ERROR: GENTICS.Aloha.settings.proxyUrl not defined. Configure your AJAXproxy Plugin.');
            }

			var data = {
				// @todo all or only parts of the content
				content: GENTICS.Aloha.activeEditable.getContents(), // send all content
				//content: rangeObject.changedDom.outerHTML, // outerText or outerHTML? send currently changed dom
				ajax: true,
				format: that.ResponseFormat
			};
			
			// submit the data to our proxy
			jQuery.ajax({
				type: "POST",
				url: url,
				data: data,
				//dataType: "html",
				contentType: 'text/plain',
				cache: false,
				beforeSend : function (xhr) {
					xhr.setRequestHeader('Accept', that.ResponseFormat);
					xhr.setRequestHeader('X-Service-Info', 'Aloha Editor Annotation Service');
				},
				success: function(result) {
					var obj = false;
					
					try {
						obj = jQuery.parseJSON(result);
					} catch (e) {
						// @todo error from fise - it should provide a error message in the same format as expected... json not html
						var re = new RegExp('<title>(.*)<\/title>');
						var match = re.exec(result);
						if (match && match[1]) {
							GENTICS.Aloha.Annotations.log('error', 'FISE ERROR: ' + match[1]);
						}
						return false;
					}
					
					var suggestionsContainer = jQuery("input.as-input");
					var suggestions = [];
					// try / catch instead of:
					try {
						if (obj["@"] == undefined) {
							obj["@"] = [];
							obj["@"][0] = false;
						}
					
					for (i = 0; i < obj["@"].length; i++) {
						var label = obj["@"][i]["http://fise.iks-project.eu/ontology/entity-label"];
						var confidence = obj["@"][i]["http://fise.iks-project.eu/ontology/confidence"];
						//if (label == undefined) {
						//	var label = obj["@"][i]["http://fise.iks-project.eu/ontology/selected-text"];
						//}
						if (label != undefined && confidence != undefined) {
							//var re = new RegExp('\"(.*)\"\^\^<\w+:\w+>'); // not working for "Tag Name"^^<ns5:string>
							// read suggestion
							var re = new RegExp('\"(.*)\"');
							var match = re.exec(label);
							
							// Confidence -- ""0.01657282257080078"^^<http://www.w3.org/2001/XMLSchema#double>"
							// @todo -- move to config with min max confidence
							//var re = new RegExp('\"(1\.*)\"');
							var re = new RegExp('\"([2-9]+\.*)\"');
							var match_confidence = re.exec(confidence);
							if (match != null && match_confidence != null) {
								if (jQuery.inArray(match[1], suggestions) < 0) { // a bit of that is now also in the autoSuggest plugin
									suggestions.push(match[1]);
								}
							}
						}
					};
					for (i=0; i < suggestions.length; i++) {
						//suggestionsContainer[0].add_selected_item({name:suggestions[i]+' (f)', value:suggestions[i]+' (f)'});
													var term = suggestions[i];
						    	     //var term = 'from aloha';
     var context = '#edit-field-tags';
    var termDiv = jQuery(context);
    var termList = termDiv.parent().find('.at-term-list');
    var excludedTermList = [];
    
    //excludedTermList = 
       //alert(term);

  // Removing all HTML tags. Need to wrap in tags for text() to work correctly.
  //term = $('<div>' + term + '</div>').text();
  term = Drupal.checkPlain(term);
  term = jQuery.trim(term);

  var tags = '';
  var tags_array = [];
  termList.find('.at-term-text').each(function (i) {
    // Get tag and revome quotes to prevent doubling
    var tag = jQuery(this).text().replace(/["]/g, '');
    // Wrap in quotes if tag contains a comma.
    if (tag.search(',') != -1) {
      tag = '"' + tag + '"';
    }
    // Collect tags as a comma seperated list.
    tags = (i == 0) ? tag : tags + ', ' + tag;
    tags_array.push(tag);
  });

  //if (term != '') {
  if (term != '' && jQuery.inArray(term, tags_array) < 0 && jQuery.inArray(term, excludedTermList) < 0) {
    termList.append(Drupal.theme('activeTagsTermRemove', term));
    // Wrap in quotes if tag contains a comma.
    if (term.search(',') != -1) {
      term = '"' + term + '"';
    }    
    tags = tags + ', ' + term;
    //tags_array.push(term);
    // Attach behaviors to new DOM content.
    Drupal.attachBehaviors(termList);
  
  // Set comma seperated tags as value of form field.
  termList.parent().find('input.at-terms').val(tags);
    termList.parent().find('.at-term-entry').val('');
  }

					}

					} catch(m) {
						// debug: offline info...
						var time = new Date();
						time = time.getTime();
						//suggestionsContainer[0].add_selected_item({name:'debug: fise '+time, value:'fise-debug-value-'+time});
					}
					
				},
				error: function(result) {
					GENTICS.Aloha.Annotations.log('error', 'There was an error fetching the contents of the FISE annotation service. Service not available.');
				}
			});
		}
	});
};
