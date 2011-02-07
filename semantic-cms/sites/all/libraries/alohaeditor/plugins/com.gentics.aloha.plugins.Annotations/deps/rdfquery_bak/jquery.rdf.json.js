/*
 MIT license (MIT-LICENSE.txt)
 @version 1.0
*/
(function(c){c.rdf.parsers["application/json"]={parse:c.secureEvalJSON,serialize:c.toJSON,triples:function(f){var b,g,d,e,a,h,i,j=[];for(b in f){g=b.substring(0,2)==="_:"?c.rdf.blank(b):c.rdf.resource("<"+b+">");for(d in f[b]){e=c.rdf.resource("<"+d+">");for(h=0;h<f[b][d].length;h+=1){a=f[b][d][h];if(a.type==="uri")a=c.rdf.resource("<"+a.value+">");else if(a.type==="bnode")a=c.rdf.blank(a.value);else if(a.datatype!==undefined)a=c.rdf.literal(a.value,{datatype:a.datatype});else{i={};if(a.lang!==undefined)i.lang=
a.lang;a=c.rdf.literal('"'+a.value+'"',i)}j.push(c.rdf.triple(g,e,a))}}}return j},dump:function(f){var b={},g,d,e,a;for(g=0;g<f.length;g+=1){d=f[g];e=d.subject.value.toString();a=d.property.value.toString();if(b[e]===undefined)b[e]={};if(b[e][a]===undefined)b[e][a]=[];b[e][a].push(d.object.dump())}return b}}})(jQuery);
