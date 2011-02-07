/*
 MIT license (MIT-LICENSE.txt)
 @version 1.0
*/
(function(c){var f={},j=/^(([a-z][\-a-z0-9+\.]*):)?(\/\/([^\/?#]+))?([^?#]*)?(\?([^#]*))?(#(.*))?$/i,k=function(a){var b=a.match(j);if(b===null)throw"Malformed URI: "+a;return{scheme:b[1]?b[2].toLowerCase():undefined,authority:b[3]?b[4]:undefined,path:b[5]||"",query:b[6]?b[7]:undefined,fragment:b[8]?b[9]:undefined}},i=function(a){var b="",d=[];if(/\./.test(a)){for(;a!==undefined&&a!=="";)if(a==="."||a==="..")a="";else if(/^\.\.\//.test(a))a=a.substring(3);else if(/^\.\//.test(a))a=a.substring(2);
else if(/^\/\.(\/|$)/.test(a))a="/"+a.substring(3);else if(/^\/\.\.(\/|$)/.test(a)){a="/"+a.substring(4);b=b.replace(/\/?[^\/]+$/,"")}else{d=a.match(/^(\/?[^\/]*)(\/.*)?$/);a=d[2];b+=d[1]}return b}else return a};c.uri=function(a,b){var d;a=a||"";if(f[a])return f[a];b=b||c.uri.base();if(typeof b==="string")b=c.uri.absolute(b);d=new c.uri.fn.init(a,b);if(f[d])return f[d];else return f[d]=d};c.uri.fn=c.uri.prototype={scheme:undefined,authority:undefined,path:undefined,query:undefined,fragment:undefined,
init:function(a,b){b=b||{};c.extend(this,k(a));if(this.scheme===undefined){this.scheme=b.scheme;if(this.authority!==undefined)this.path=i(this.path);else{this.authority=b.authority;if(this.path===""){this.path=b.path;if(this.query===undefined)this.query=b.query}else{if(!/^\//.test(this.path))this.path=b.authority!==""&&(b.path===undefined||b.path==="")?"/"+this.path:b.path.replace(/[^\/]+$/,"")+this.path;this.path=i(this.path)}}}if(this.scheme===undefined)throw"Malformed URI: URI is not an absolute URI and no base supplied: "+
a;return this},resolve:function(a){return c.uri(a,this)},relative:function(a){var b,d,e=0,g,h=[];b="";if(typeof a==="string")a=c.uri(a,{});if(a.scheme!==this.scheme||a.authority!==this.authority)return a.toString();if(a.path!==this.path){b=a.path.split("/");d=this.path.split("/");if(b[1]!==d[1])b=a.path;else{for(;b[e]===d[e];)e+=1;for(g=e;e<d.length-1;e+=1)h.push("..");for(;g<b.length;g+=1)h.push(b[g]);b=h.join("/")}b=a.query===undefined?b:b+"?"+a.query;return b=a.fragment===undefined?b:b+"#"+a.fragment}if(a.query!==
undefined&&a.query!==this.query)return"?"+a.query+(a.fragment===undefined?"":"#"+a.fragment);if(a.fragment!==undefined&&a.fragment!==this.fragment)return"#"+a.fragment;return""},toString:function(){var a="";if(this._string)return this._string;else{a=this.scheme===undefined?a:a+this.scheme+":";a=this.authority===undefined?a:a+"//"+this.authority;a+=this.path;a=this.query===undefined?a:a+"?"+this.query;return this._string=a=this.fragment===undefined?a:a+"#"+this.fragment}}};c.uri.fn.init.prototype=
c.uri.fn;c.uri.absolute=function(a){return c.uri(a,{})};c.uri.resolve=function(a,b){return c.uri(a,b)};c.uri.relative=function(a,b){return c.uri(b,{}).relative(a)};c.uri.base=function(){return c(document).base()};c.fn.base=function(){var a=c(this).parents().andSelf().find("base").attr("href"),b=c(this)[0].ownerDocument||document;b=c.uri.absolute(b.location===null?document.location.href:b.location.href);return a===undefined?b:c.uri(a,b)}})(jQuery);