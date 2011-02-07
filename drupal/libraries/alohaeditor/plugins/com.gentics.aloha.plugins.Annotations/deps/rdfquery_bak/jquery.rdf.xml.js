/*
 MIT license (MIT-LICENSE.txt)
 @version 1.0
*/
(function(e){var t=function(a,c,b,f){var k=a.ownerDocument;if(c!==undefined&&c!==null)if(k.createAttributeNS){c=k.createAttributeNS(c,b);c.nodeValue=f;a.attributes.setNamedItemNS(c)}else{c=k.createNode(2,b,c);c.nodeValue=f;a.attributes.setNamedItem(c)}else{c=k.createAttribute(b);c.nodeValue=f;a.attributes.setNamedItem(c)}return a},A=function(a,c,b,f){var k=a.ownerDocument;c=c!==undefined&&c!==null?k.createElementNS?k.createElementNS(c,b):k.createNode(1,b,c):k.createElement(b);if(f!==-1){u(a,"\n");
f===0?u(a,"\n"):u(a,"  ")}a.appendChild(c);return c},u=function(a,c){var b;b=a.ownerDocument.createTextNode(c);a.appendChild(b);return a},C=function(a){switch(a){case "http://www.w3.org/1999/02/22-rdf-syntax-ns":return"rdf";case "http://www.w3.org/XML/1998/namespace":return"xml";case "http://www.w3.org/2000/xmlns/":return"xmlns";default:throw"No default prefix mapped for namespace "+a;}},w=function(a,c,b){var f;if(a.hasAttributeNS)return a.hasAttributeNS(c,b);else try{f=/:/.test(b)?/:(.+)$/.exec(b)[1]:
b;return a.attributes.getQualifiedItem(f,c)!==null}catch(k){return a.getAttribute(C(c)+":"+b)!==null}},q=function(a,c,b){var f;if(a.getAttributeNS)return a.getAttributeNS(c,b);else try{f=/:/.test(b)?/:(.+)$/.exec(b)[1]:b;return a.attributes.getQualifiedItem(f,c).nodeValue}catch(k){return a.getAttribute(C(c)+":"+b)}},x=function(a){return a.localName||a.baseName},B=function(a,c){var b;if(w(a,"http://www.w3.org/1999/02/22-rdf-syntax-ns#","about")){b=q(a,"http://www.w3.org/1999/02/22-rdf-syntax-ns#",
"about");b=e.rdf.resource("<"+b+">",{base:c})}else if(w(a,"http://www.w3.org/1999/02/22-rdf-syntax-ns#","ID")){b=q(a,"http://www.w3.org/1999/02/22-rdf-syntax-ns#","ID");b=e.rdf.resource("<#"+b+">",{base:c})}else if(w(a,"http://www.w3.org/1999/02/22-rdf-syntax-ns#","nodeID")){b=q(a,"http://www.w3.org/1999/02/22-rdf-syntax-ns#","nodeID");b=e.rdf.blank("_:"+b)}else b=e.rdf.blank("[]");return b},y=function(a,c,b,f){var k,d,g,h,o,i,n=1,s,l,v=[],p,r={},m,j=[];f=q(a,"http://www.w3.org/XML/1998/namespace",
"lang")||f;b=q(a,"http://www.w3.org/XML/1998/namespace","base")||b;if(f!==null&&f!==undefined&&f!=="")r={lang:f};k=B(a,b);if(c&&(a.namespaceURI!=="http://www.w3.org/1999/02/22-rdf-syntax-ns#"||x(a)!=="Description")){c=e.rdf.type;h=e.rdf.resource("<"+a.namespaceURI+x(a)+">");j.push(e.rdf.triple(k,c,h))}for(o=0;o<a.attributes.length;o+=1){d=a.attributes.item(o);if(d.namespaceURI!==undefined&&d.namespaceURI!=="http://www.w3.org/2000/xmlns/"&&d.namespaceURI!=="http://www.w3.org/XML/1998/namespace"&&d.prefix!==
"xmlns"&&d.prefix!=="xml")if(d.namespaceURI!=="http://www.w3.org/1999/02/22-rdf-syntax-ns#"){c=e.rdf.resource("<"+d.namespaceURI+x(d)+">");h=e.rdf.literal(r.lang?d.nodeValue:'"'+d.nodeValue+'"',r);j.push(e.rdf.triple(k,c,h))}else if(x(d)==="type"){c=e.rdf.type;h=e.rdf.resource("<"+d.nodeValue+">",{base:b});j.push(e.rdf.triple(k,c,h))}}for(o=0;o<a.childNodes.length;o+=1){d=a.childNodes[o];if(d.nodeType===1){if(d.namespaceURI==="http://www.w3.org/1999/02/22-rdf-syntax-ns#"&&x(d)==="li"){c=e.rdf.resource("<http://www.w3.org/1999/02/22-rdf-syntax-ns#_"+
n+">");n+=1}else c=e.rdf.resource("<"+d.namespaceURI+x(d)+">");f=q(d,"http://www.w3.org/XML/1998/namespace","lang")||f;if(f!==null&&f!==undefined&&f!=="")r={lang:f};if(w(d,"http://www.w3.org/1999/02/22-rdf-syntax-ns#","resource")){g=q(d,"http://www.w3.org/1999/02/22-rdf-syntax-ns#","resource");h=e.rdf.resource("<"+g+">",{base:b})}else if(w(d,"http://www.w3.org/1999/02/22-rdf-syntax-ns#","nodeID")){g=q(d,"http://www.w3.org/1999/02/22-rdf-syntax-ns#","nodeID");h=e.rdf.blank("_:"+g)}else if(w(d,"http://www.w3.org/1999/02/22-rdf-syntax-ns#",
"parseType")){i=q(d,"http://www.w3.org/1999/02/22-rdf-syntax-ns#","parseType");if(i==="Literal"){try{p=new XMLSerializer;g=p.serializeToString(d.getElementsByTagName("*")[0])}catch(z){g="";for(i=0;i<d.childNodes.length;i+=1)g+=d.childNodes[i].xml}h=e.rdf.literal(g,{datatype:"http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral"})}else if(i==="Resource"){m=y(d,false,b,f);if(m.length>0){h=m[m.length-1].subject;j=j.concat(m)}else h=e.rdf.blank("[]")}else if(i==="Collection")if(d.getElementsByTagName("*").length>
0){for(i=0;i<d.childNodes.length;i+=1){g=d.childNodes[i];g.nodeType===1&&v.push(g)}h=s=e.rdf.blank("[]");for(i=0;i<v.length;i+=1){g=v[i];m=y(g,true,b,f);if(m.length>0){l=m[m.length-1].subject;j=j.concat(m)}else l=B(g);j.push(e.rdf.triple(s,e.rdf.first,l));if(i===v.length-1)j.push(e.rdf.triple(s,e.rdf.rest,e.rdf.nil));else{l=e.rdf.blank("[]");j.push(e.rdf.triple(s,e.rdf.rest,l));s=l}}}else h=e.rdf.nil}else if(w(d,"http://www.w3.org/1999/02/22-rdf-syntax-ns#","datatype")){g=d.childNodes[0].nodeValue;
h=e.rdf.literal(g,{datatype:q(d,"http://www.w3.org/1999/02/22-rdf-syntax-ns#","datatype")})}else if(d.getElementsByTagName("*").length>0)for(i=0;i<d.childNodes.length;i+=1){g=d.childNodes[i];if(g.nodeType===1){m=y(g,true,b,f);if(m.length>0){h=m[m.length-1].subject;j=j.concat(m)}else h=B(g)}}else if(d.childNodes.length>0){g=d.childNodes[0].nodeValue;h=e.rdf.literal(r.lang?g:'"'+g+'"',r)}else{m=y(d,false,b,f);if(m.length>0){h=m[m.length-1].subject;j=j.concat(m)}else h=e.rdf.blank("[]")}j.push(e.rdf.triple(k,
c,h));if(w(d,"http://www.w3.org/1999/02/22-rdf-syntax-ns#","ID")){d=e.rdf.resource("<#"+q(d,"http://www.w3.org/1999/02/22-rdf-syntax-ns#","ID")+">",{base:b});j.push(e.rdf.triple(d,e.rdf.subject,k));j.push(e.rdf.triple(d,e.rdf.property,c));j.push(e.rdf.triple(d,e.rdf.object,h))}}}return j};e.rdf.parsers["application/rdf+xml"]={parse:function(a){var c;try{c=new ActiveXObject("Microsoft.XMLDOM");c.async="false";c.loadXML(a)}catch(b){c=(new DOMParser).parseFromString(a,"text/xml")}return c},serialize:function(a){if(a.xml)return a.xml.replace(/\s+$/,
"");else{serializer=new XMLSerializer;return serializer.serializeToString(a)}},triples:function(a){var c,b=[];if(a.documentElement.namespaceURI==="http://www.w3.org/1999/02/22-rdf-syntax-ns#"&&x(a.documentElement)==="RDF"){c=q(a.documentElement,"http://www.w3.org/XML/1998/namespace","lang");base=q(a.documentElement,"http://www.w3.org/XML/1998/namespace","base")||e.uri.base();b=e.map(a.documentElement.childNodes,function(f){return f.nodeType===1?y(f,true,base,c):null})}else b=y(a.documentElement,true);
return b},dump:function(a,c){var b,f="";if(document.implementation&&document.implementation.createDocument)b=document.implementation.createDocument("http://www.w3.org/1999/02/22-rdf-syntax-ns#","rdf:RDF",null);else{b=new ActiveXObject("Microsoft.XMLDOM");b.async="false";f=' xmlns="http://www.w3.org/1999/02/22-rdf-syntax-ns#"';b.loadXML("<rdf:RDF"+f+"/>")}b=b;f=e.rdf.parsers["application/json"].dump(a);var k=c.namespaces||{},d=c.indent||false,g,h,o,i,n,s,l,v,p,r;for(g in k){o=b.documentElement;p=k[g];
p==="http://www.w3.org/XML/1998/namespace"||p==="http://www.w3.org/2000/xmlns/"||(g?t(o,"http://www.w3.org/2000/xmlns/","xmlns:"+g,p):t(o,undefined,"xmlns",p))}for(h in f){if(f[h][e.rdf.type.value]!==undefined){n=/(.+[#\/])([^#\/]+)/.exec(f[h][e.rdf.type.value][0].value);p=n[1];v=n[2];for(g in k)if(k[g].toString()===p){r=g;break}o=A(b.documentElement,p,r+":"+v,d?0:-1)}else o=A(b.documentElement,"http://www.w3.org/1999/02/22-rdf-syntax-ns#","rdf:Description",d?0:-1);/^_:/.test(h)?t(o,"http://www.w3.org/1999/02/22-rdf-syntax-ns#",
"rdf:nodeID",h.substring(2)):t(o,"http://www.w3.org/1999/02/22-rdf-syntax-ns#","rdf:about",h);for(i in f[h])if(i!==e.rdf.type.value.toString()||f[h][i].length>1){n=/(.+[#\/])([^#\/]+)/.exec(i);p=n[1];v=n[2];for(g in k)if(k[g].toString()===p){r=g;break}for(s=i===e.rdf.type.value.toString()?1:0;s<f[h][i].length;s+=1){l=f[h][i][s];n=A(o,p,r+":"+v,d?1:-1);if(l.type==="uri")t(n,"http://www.w3.org/1999/02/22-rdf-syntax-ns#","rdf:resource",l.value);else if(l.type==="literal")if(l.datatype!==undefined)if(l.datatype===
"http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral"){t(n,"http://www.w3.org/1999/02/22-rdf-syntax-ns#","rdf:parseType","Literal");d&&u(n,"\n    ");var m=n;l=l.value;var j=void 0;j=void 0;var z=void 0;try{j=new ActiveXObject("Microsoft.XMLDOM");j.async="false";j.loadXML("<temp>"+l+"</temp>")}catch(D){j=new DOMParser;j=j.parseFromString("<temp>"+l+"</temp>","text/xml")}for(z=0;z<j.documentElement.childNodes.length;z+=1)m.appendChild(j.documentElement.childNodes[z].cloneNode(true));d&&u(n,"\n  ")}else{t(n,
"http://www.w3.org/1999/02/22-rdf-syntax-ns#","rdf:datatype",l.datatype);u(n,l.value)}else{l.lang!==undefined&&t(n,"http://www.w3.org/XML/1998/namespace","xml:lang",l.lang);u(n,l.value)}else t(n,"http://www.w3.org/1999/02/22-rdf-syntax-ns#","rdf:nodeID",l.value.substring(2))}d&&u(o,"\n")}}d&&u(b.documentElement,"\n\n");return b}}})(jQuery);
