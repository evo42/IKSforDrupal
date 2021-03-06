
/*!
* Aloha Editor Drupal Link Plugin
* Author & Copyright (c) 2010 evo42 communications | rene kapusta
*/

/**
 * Create the Repositories object. Namespace for Repositories
 * @hide
 */
if ( !GENTICS.Aloha.Repositories ) GENTICS.Aloha.Repositories = {};

/**
 * register the plugin with unique name
 */
GENTICS.Aloha.Repositories.drupal = new GENTICS.Aloha.Repository('org.drupal.aloha.repositories.drupal');

/**
 * If no username is given, the public respoitory is searched:
 * @property
 * @cfg
 */
//GENTICS.Aloha.Repositories.drupal.settings.username = 'lookup';

/**
 * URL to the drupal repository:
 * @property
 * @cfg
 */
GENTICS.Aloha.Repositories.drupal.settings.url = 'http://localhost/drupal7/drupal-7.0/';

/**
 * Defines the value to use for sorting the items. Allowed a values 0-0.75 
 * We choose a low default weight 0.35
 * @property
 * @default 0.35
 * @cfg
 */
GENTICS.Aloha.Repositories.drupal.settings.weight = 0.35;



/**
 * init Delicious repository
 */
GENTICS.Aloha.Repositories.drupal.init = function() {
	var that = this;
	
	// check weight 
	if ( this.settings.weight + 0.15 > 1 ) {
		this.settings.weight = 2 - 0.15;
	}
	
	// default URL. Returns most popular links.
	this.drupalRepositoryURL = GENTICS.Aloha.Repositories.drupal.settings.url + "aloha-lookup.php?lookup=";
	
//	if ( this.settings.username ) {
		
		// set the repository name
		this.repositoryName = 'drupal/local';
		
		// when a user is specified get his tags and store it local
		/*this.tags = [];
		
		jQuery.ajax({ type: "GET",
			dataType: "jsonp",
			url: 'http://feeds.delicious.com/v2/json/tags/'+that.settings.username,
			success: function(data) {
				// convert data
				for (var tag in data) {
					that.tags.push(tag);
				}
			}
		});*/
/*} else {
		// set the repository name
		this.repositoryName = 'drupal/public';
	}*/

};


/**
 * Searches a repository for items matching query if objectTypeFilter.
 * If none found it returns null.
 */
GENTICS.Aloha.Repositories.drupal.query = function( p, callback) {
	var that = this;
	
	if ( p.objectTypeFilter && jQuery.inArray('website', p.objectTypeFilter) == -1) {
		
		// return if no website type is requested 
		callback.call( this, []);
		
	} else {
		
		// prepare tags
		var tags = [];
		/*if ( this.settings.username ) {

			// search in user tags
			var queryTags = p.queryString ? p.queryString.split(' ') : [];
		    for (var i = 0; i < queryTags.length; i++) {
				var queryTag = queryTags[i].trim();
				if ( jQuery.inArray(queryTag, that.tags) == -1 ) {
					var newtags = that.tags.filter(function(e, i, a) {
						var r = new RegExp(queryTag, 'i'); 
						return ( e.match(r) );
					});
					if ( newtags.length > 0 ) {
						tags.push(newtags[0]);
					}
				} else {
					tags.push(queryTag);
				}
			}
			
		} else {*/
			
			// handle each word as tag
			tags = p.queryString.split(' ');
			
		//}

		// search in tree
		//var folderTags = p.inFolderId ? p.inFolderId.split('+') : [];
		//jQuery.extend(tags, folderTags);

		// if we have a query and no tag matching return 
		if ( p.queryString && tags.length == 0 ) {
			callback.call( that, []);
			return;
		}
		//alert(that.drupalRepositoryURL + tags.join('+'));
		jQuery.ajax({ type: "GET",
			dataType: "json", // @todo jsonp
			url: that.drupalRepositoryURL + tags.join('+'),
			success: function(data) {
			//alert(data);
				var items = [];
				// convert data to Aloha objects
				if (data.length) {
				for (var i = 0; i < data.length; i++) {
					if (typeof data[i] != 'function' ) {
						items.push(new GENTICS.Aloha.Repository.Document ({
							id: data[i].u,
							name: data[i].d,
							repositoryId: that.repositoryId,
							type: 'website', 
							url: data[i].u,
							weight: that.settings.weight + (15-1)/100
						}));
					}
			    }
				callback.call( that, items);
				}
			}
		});
	}
};

/**
 * Returns all tags for username in a tree style way
GENTICS.Aloha.Repositories.drupal.getChildren = function( p, callback) {
	var that = this;
	
	// tags are only available when a username is available
	if ( this.settings.username ) {
		
		// return all tags
		var items = [];
		if ( p.inFolderId == this.repositoryId ) {

			for (var i = 0; i < this.tags.length; i++) {
				if (typeof this.tags[i] != 'function' ) {
					items.push(new GENTICS.Aloha.Repository.Folder ({
						id: this.tags[i],
						name: this.tags[i],
						repositoryId: this.repositoryId,
						type: 'tag', 
						url: 'http://feeds.delicious.com/v2/rss/tags/'+that.settings.username+'/'+this.tags[i]
					}));
				}
		    }
			callback.call( this, items);
		
		} else {
			jQuery.ajax({ type: "GET",
				dataType: "jsonp",
				url: 'http://feeds.delicious.com/v2/json/tags/'+that.settings.username+'/'+p.inFolderId,
				success: function(data) {
					var items = [];
					// convert data
					for (var tag in data) {
						// the id is tag[+tag+...+tag]
						var id = (p.inFolderId)?p.inFolderId + '+' + tag:tag;
						if (typeof data[tag] != 'function' ) {
							items.push(new GENTICS.Aloha.Repository.Folder({
								id: id,
								name: tag,
								repositoryId: that.repositoryId,
								type: 'tag', 
								url: 'http://feeds.delicious.com/v2/rss/tags/'+that.settings.username+'/'+id,
								hasMoreItems: true
							}));
						}
					}
					callback.call( that, items);
				}
			});
			
		}
	} else {
		callback.call( this, []);
	}
};
*/
