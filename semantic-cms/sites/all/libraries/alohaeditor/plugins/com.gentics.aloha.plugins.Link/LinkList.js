if(!GENTICS.Aloha.Repositories)GENTICS.Aloha.Repositories={};GENTICS.Aloha.Repositories.LinkList=new GENTICS.Aloha.Repository("com.gentics.aloha.repositories.LinkList");GENTICS.Aloha.Repositories.LinkList.settings.data=[{name:"Aloha Editor - The HTML5 Editor",url:"http://aloha-editor.com",type:"website"},{name:"Aloha Logo",url:"http://www.aloha-editor.com/images/aloha-editor-logo.png",type:"image"}];GENTICS.Aloha.Repositories.LinkList.folder=[];
GENTICS.Aloha.Repositories.LinkList.init=function(){for(var c=0;c<this.settings.data.length;c++){var a=this.settings.data[c];a.repositoryId=this.repositoryId;a.id=a.id?a.id:a.url;var b=a.uri=this.parseUri(a.url),d=this.addFolder("",b.host);b=b.path.split("/");for(j=0;j<b.length;j++)if(b[j]&&b[j].lastIndexOf(".")<0)d=this.addFolder(d,b[j]);a.parentId=d;this.settings.data[c]=new GENTICS.Aloha.Repository.Document(a)}this.repositoryName="Linklist"};
GENTICS.Aloha.Repositories.LinkList.addFolder=function(c,a){var b=c?c+"/"+a:a;if(a&&!this.folder[b])this.folder[b]=new GENTICS.Aloha.Repository.Folder({id:b,name:a?a:b,parentId:c,type:"host",repositoryId:this.repositoryId});return b};
GENTICS.Aloha.Repositories.LinkList.query=function(c,a){var b=this.settings.data.filter(function(d){var f=RegExp(c.queryString,"i");return(!c.queryString||d.name.match(f)||d.url.match(f))&&(!c.objectTypeFilter||jQuery.inArray(d.type,c.objectTypeFilter)>-1)&&(!c.inFolderId||c.inFolderId==d.parentId)});a.call(this,b)};
GENTICS.Aloha.Repositories.LinkList.getChildren=function(c,a){var b=[];for(e in this.folder)if(typeof this.folder[e]!="function"&&(this.folder[e].parentId==c.inFolderId||!this.folder[e].parentId&&c.inFolderId==this.repositoryId))b.push(this.folder[e]);a.call(this,b)};
GENTICS.Aloha.Repositories.LinkList.parseUri=function(c){var a={strictMode:false,key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}};
c=a.parser[a.strictMode?"strict":"loose"].exec(c);for(var b={},d=14;d--;)b[a.key[d]]=c[d]||"";b[a.q.name]={};b[a.key[12]].replace(a.q.parser,function(f,g,h){if(g)b[a.q.name][g]=h});return b};GENTICS.Aloha.Repositories.LinkList.getObjectById=function(c,a){for(var b=[],d=0;d<this.settings.data.length;d++)this.settings.data[d].id==c&&b.push(this.settings.data[d]);a.call(this,b);return true};
