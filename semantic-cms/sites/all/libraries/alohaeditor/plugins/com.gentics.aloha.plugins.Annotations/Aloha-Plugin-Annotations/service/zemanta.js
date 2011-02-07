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
GENTICS.Aloha.Annotations.Services.zemanta = new GENTICS.Aloha.Annotations.Service('com.gentics.aloha.plugins.Annotations.service.zemanta');


/**
 * init Zemanta Service
 */
GENTICS.Aloha.Annotations.Services.zemanta.init = function() {
	var that = this;

	this.subscribeEvents();
	
	// see: http://developer.zemanta.com/docs/suggest_markup/
	
	// REST API Endpoint URL.
	this.ApiEndpoint = "http://api.zemanta.com/services/rest/0.0/";
	
	// API method
	this.ApiMethod = "zemanta.suggest_markup";
	this.ApiKey = false;
	
	// merge with user config
	if (GENTICS.Aloha.Annotations.settings.Services && GENTICS.Aloha.Annotations.settings.Services.zemanta) {
		if (GENTICS.Aloha.Annotations.settings.Services.zemanta.ApiEndpoint) {
			this.ApiEndpoint = GENTICS.Aloha.Annotations.settings.Services.zemanta.ApiEndpoint;
		}
		if (GENTICS.Aloha.Annotations.settings.Services.zemanta.ApiMethod) {
			this.ApiMethod = GENTICS.Aloha.Annotations.settings.Services.zemanta.ApiMethod;
		}
		if (GENTICS.Aloha.Annotations.settings.Services.zemanta.ApiKey) {
			this.ApiKey = GENTICS.Aloha.Annotations.settings.Services.zemanta.ApiKey;
		}
	}
	
	if (!this.ApiKey) {
		alert('ERROR: GENTICS.Aloha.Annotations.settings.Services.zemanta.ApiKey is not defined. Configure your Zemanta ApiKey first.');
	}

	
	// "xml", "json", "rdfxml"
	this.ResponseFormat = "json"; 
		
	if ( this.ApiKey ) {
		// set the repository name
		this.repositoryName = 'zemanta/' + this.ApiKey;
	} else {
		// set the repository name
		this.repositoryName = 'zemanta/public';
	}
};

/**
 * Subscribe for events
 */
GENTICS.Aloha.Annotations.Services.zemanta.subscribeEvents = function () {

	var that = this;
	
    // add the event handler for smartContentChanged / editableDeactivated
    GENTICS.Aloha.EventRegistry.subscribe(GENTICS.Aloha, 'editableDeactivated', function(event, rangeObject) {
    	// @todo do not send data on every smartContentChanged... use extra config?    	
    	/*if (event['keyCode'] != 13 || event['keyCode'] != 'editableDeactivated') {
    		alert('smartContentChanged rejected.');
    		return false;
    	}*/
    	
    	//alert('hello zemanta');
    	
  
    	//jQuery('#edit-field-tags').activeTags.addTerm('#edit-field-tags', 'auto tag');
    	//$('#edit-field-tags').activeTags;
    	
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
				method: that.ApiMethod,
				api_key: that.ApiKey,
				// @todo all or only parts of the content
				//text: GENTICS.Aloha.activeEditable.getContents(), // whole editable content
				text: rangeObject.editable.getContents(), // outerHTML? send currently changed dom
				format: that.ResponseFormat,
				return_rdf_links: 1,
				markup_limit: 25
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
					//alert(result);
					//var obj = jQuery.parseJSON(result);
					var obj = result;
					var suggestionsContainer = jQuery("input.as-input");
					var suggestions = []; // @todo here we have to store also the uri
					
					try {
						if (obj.status == 'ok') {
							// @todo ad some error handling
						}
					
					for (i = 0; i < obj.markup.links.length; i++) {
						var label = obj.markup.links[i].anchor;
						var confidence = obj.markup.links[i].confidence;
						var relevance = obj.markup.links[i].relevance;
						
						// entity_type - 'string/substring'
						// target - array title, type (homepage, wikipedia, rdf, ...), url
						
						// todo -- check for min. confidence
						
						suggestions.push(label);
						
					};
					for (i=0; i < suggestions.length; i++) {
						//suggestionsContainer[0].add_selected_item({name:suggestions[i], value:suggestions[i]});
						// suggestionsContainer[0].add_selected_item({name:suggestions[i], value:suggestions[i]});
						// support for drupal active tags module
							var term = suggestions[i];
						    	     //var term = 'from aloha';
     var context = '#edit-field-tags';
    var termDiv = jQuery(context);
    var termList = termDiv.parent().find('.at-term-list');
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
  if (term != '' && jQuery.inArray(term, tags_array) < 0) {
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
						//suggestionsContainer[0].add_selected_item({name:'debug zemanta: '+time, value:'offline-zemanta-debug-value-'+time});
						
					}
					
				},
				error: function(result) {
					GENTICS.Aloha.Annotations.log('error', 'There was an error fetching the contents of the Zemanta service. ');
				}
			});
		}
	});
};