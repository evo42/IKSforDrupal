(function(d){var c={rdf:"http://www.w3.org/1999/02/22-rdf-syntax-ns#",rdfs:"http://www.w3.org/2000/01/rdf-schema#",xsd:"http://www.w3.org/2001/XMLSchema#",dc:"http://purl.org/dc/elements/1.1/",foaf:"http://xmlns.com/foaf/0.1/",cc:"http://creativecommons.org/ns#",vcard:"http://www.w3.org/2001/vcard-rdf/3.0#",ex:"http://www.example.com/"};module("Basic Rule Creation");test("when creating a rule with strings",function(){var a=d.rdf.rule("?person a foaf:Person","?person a foaf:Agent",{namespaces:c});
equals(a.lhs.length,1);equals(a.lhs[0],"?person <"+c.rdf+"type> <"+c.foaf+"Person>");equals(a.rhs.length,1);equals(a.rhs[0],"?person <"+c.rdf+"type> <"+c.foaf+"Agent>")});test("when creating a rule with arrays",function(){var a=d.rdf.rule(["?person a vcard:VCard","?person vcard:fn ?name"],["?person a foaf:Person","?person foaf:name ?name"],{namespaces:c});equals(a.lhs.length,2);equals(a.lhs[0],"?person <"+c.rdf+"type> <"+c.vcard+"VCard>");equals(a.lhs[1],"?person <"+c.vcard+"fn> ?name");equals(a.rhs.length,
2);equals(a.rhs[0],"?person <"+c.rdf+"type> <"+c.foaf+"Person>");equals(a.rhs[1],"?person <"+c.foaf+"name> ?name")});test("when creating another rule that contains wildcards in the rhs that don't exist in the left",function(){try{d.rdf.rule(["?person a foaf:Person","?person foaf:firstName ?fn"],["?person a vcard:VCard","?person vcard:n ?name","?name a vcard:Name","?name vcard:given-name ?fn"],{namespaces:c});ok(false,"it should generate an error")}catch(a){ok(true,"it should generate an error")}});
test("when creating a rule where the rhs contains blank nodes",function(){var a=d.rdf.rule(["?person a foaf:Person","?person foaf:firstName ?fn"],["?person a vcard:VCard","?person vcard:n _:name","_:name a vcard:Name","_:name vcard:given-name ?fn"],{namespaces:c});equals(a.lhs.length,2);equals(a.rhs.length,4)});module("Executing individual rules");test("when executing a simple inheritance-type rule using rule.run()",function(){var a=d.rdf.rule("?person a foaf:Person","?person a foaf:Agent",{namespaces:c}),
b=d.rdf.databank().prefix("foaf",c.foaf);b.add("<#me> a foaf:Person");equals(b.size(),1);a.run(b);equals(b.size(),2);equals(b.triples()[0],d.rdf.triple("<#me> a foaf:Person",{namespaces:c}));equals(b.triples()[1],d.rdf.triple("<#me> a foaf:Agent",{namespaces:c}))});test("when executing a more complex mapping rule using rule.run()",function(){var a=d.rdf.rule(["?person a vcard:VCard","?person vcard:fn ?name"],["?person a foaf:Person","?person foaf:name ?name"],{namespaces:c}),b=d.rdf.databank().prefix("foaf",
c.foaf).prefix("vcard",c.vcard),e=d.rdf({databank:b});b.add("<#me> a vcard:VCard").add('<#me> vcard:fn "Jeni Tennison"');equals(b.size(),2);a.run(b);equals(b.size(),4);equals(e.where("<#me> a foaf:Person").length,1);equals(e.where('<#me> foaf:name "Jeni Tennison"').length,1)});test("when executing a rule where one of the conditions is a regular expression",function(){var a,b=d.rdf.rule(["?person foaf:name ?name",["name",/^J.+/]],function(){a=this.name},{namespaces:c}),e=d.rdf.databank().prefix("foaf",
c.foaf);e.add('<#me> foaf:name "Jeni"');b.run(e);equals(a.value,"Jeni")});test("when executing a rule where one of the conditions is a function",function(){var a=0,b,e=d.rdf.rule(["?person foaf:name ?name",function(){return this.name.value.length===4}],function(){a+=1;b=this.name},{namespaces:c}),f=d.rdf.databank().prefix("foaf",c.foaf);f.add('<#me> foaf:name "Jeni"').add('<#you> foaf:name "Someone"');e.run(f);equals(a,1);equals(b.value,"Jeni")});test("when executing a rule where one of the conditions is a function on a resource",
function(){var a=0,b=d.rdf.resource("<#me>"),e=d.rdf.rule(["?person foaf:name ?name",function(){return this.person===b}],function(){a+=1},{namespaces:c}),f=d.rdf.databank().prefix("foaf",c.foaf);f.add('<#me> foaf:name "Jeni"').add('<#you> foaf:name "Someone"');e.run(f);equals(a,1)});test("when executing a rule where one of the conditions is a function comparing two resources",function(){var a=0;d.rdf.resource("<#me>");var b=d.rdf.rule(["?vintage ex:hasVintageYear ?vintageYear1","?vintage ex:hasVintageYear ?vintageYear2",
function(){return this.vintageYear1.type==="uri"&&this.vintageYear2.type==="uri"}],function(){a+=1},{namespaces:c}),e=d.rdf.databank();e.prefix("ex",c.ex).add("ex:SomeVintage ex:hasVintageYear ex:2007").add("ex:SomeVintage ex:hasVintageYear ex:TwoThousandSeven");b.run(e);equals(a,3)});test("when executing a rule where the rhs contains blank nodes",function(){var a=d.rdf.rule(["?person a foaf:Person","?person foaf:firstName ?fn"],["?person a vcard:VCard","?person vcard:n _:name","_:name a vcard:Name",
"_:name vcard:given-name ?fn"],{namespaces:c}),b=d.rdf.databank().prefix("foaf",c.foaf).prefix("vcard",c.vcard),e=d.rdf({databank:b});ok(a.rhsBlanks,"the rule should be recognised as containing blank nodes");b.add("<#me> a foaf:Person").add('<#me> foaf:firstName "Jeni"').add("<#fred> a foaf:Person").add('<#fred> foaf:firstName "Fred"');equals(b.size(),4);a.run(b);equals(b.size(),12);equals(e.where("<#me> a vcard:VCard").length,1);equals(e.where("<#me> vcard:n ?name").where("?name a vcard:Name").length,
1);equals(e.where("<#me> vcard:n ?name").where('?name vcard:given-name "Jeni"').length,1);equals(e.where("<#fred> vcard:n ?name").where("?name a vcard:Name").length,1);equals(e.where("<#fred> vcard:n ?name").where('?name vcard:given-name "Fred"').length,1);equals(e.where("<#me> vcard:n ?name").where("<#fred> vcard:n ?name").length,0,"my name and fred's name shouldn't be the same node")});test("when executing a rule where the rhs is a function",function(){var a=false,b=d.rdf.rule("?person a foaf:Person",
function(){a=true},{namespaces:c}),e=d.rdf.databank().prefix("foaf",c.foaf).add("<#me> a foaf:Person");equals(e.size(),1);b.run(e);equals(e.size(),1);ok(a,"the function on the rhs should be called")});test("when executing a rule where the rhs is a function executed a number of times",function(){var a=0,b=d.rdf.rule("?person a foaf:Person",function(){a+=1},{namespaces:c}),e=d.rdf.databank().prefix("foaf",c.foaf).add("<#me> a foaf:Person").add("<#you> a foaf:Person");b.run(e);equals(a,2,"the function on the rhs should be called twice")});
test("when executing a rule where the rhs is a function with arguments",function(){var a,b,e,f=d.rdf.rule("?person a foaf:Person",function(h,j,i){a=this.person;b=h;e=i[0]},{namespaces:c}),g=d.rdf.databank().prefix("foaf",c.foaf).add("<#me> a foaf:Person");equals(g.size(),1);f.run(g);equals(a,d.rdf.resource("<#me>"));equals(b,0);equals(e,d.rdf.triple("<#me> a foaf:Person",{namespaces:c}))});test("when executing a rule that could lead to an infinite recursion",function(){var a=d.rdf.rule("?person a foaf:Person",
["?person ex:mother _:mother","_:mother a foaf:Person"],{namespaces:c}),b=d.rdf.databank().prefix("foaf",c.foaf).add("<#me> a foaf:Person");equals(b.size(),1);a.run(b);equals(b.size(),101)});module("Rulesets");test("when creating an empty ruleset",function(){var a=d.rdf.ruleset();equals(a.size(),0);equals(a.base(),d.uri.base())});test("when adding rules to a ruleset",function(){var a=d.rdf.ruleset();a.add(d.rdf.rule("?person a foaf:Person","?person a foaf:Agent",{namespaces:c}));equals(a.size(),1)});
test("when adding the same rule to a ruleset twice",function(){var a=d.rdf.ruleset(),b=d.rdf.rule("?person a foaf:Person","?person a foaf:Agent",{namespaces:c});a.add(b).add(b);equals(a.size(),1)});test("when adding something that isn't a rule object to a ruleset",function(){var a=d.rdf.ruleset().prefix("foaf",c.foaf).add("?person a foaf:Person","?person a foaf:Agent"),b=d.rdf.databank().prefix("foaf",c.foaf).add("<#me> a foaf:Person");equals(a.size(),1);equals(b.size(),1);b.reason(a);equals(b.size(),
2)});test("when creating a ruleset with some rules ready-added",function(){var a=d.rdf.ruleset([["?person a foaf:Person","?person a foaf:Agent"]],{namespaces:c}),b=d.rdf.databank().prefix("foaf",c.foaf).add("<#me> a foaf:Person");equals(a.size(),1);equals(b.size(),1);b.reason(a);equals(b.size(),2)});test("when running rules where the result of one rule makes the other's conditions satisfied",function(){var a=d.rdf.ruleset().prefix("foaf",c.foaf).prefix("rdf",c.rdf).add(["?person a foaf:Agent","?person foaf:name ?name"],
"?person rdf:label ?name").add("?person a foaf:Person","?person a foaf:Agent"),b=d.rdf.databank().prefix("foaf",c.foaf).add("<#me> a foaf:Person").add('<#me> foaf:name "Jeni"');equals(a.size(),2);equals(b.size(),2);b.reason(a);equals(b.size(),4)});test("when running rules which could result in an infinite loop",function(){var a=d.rdf.ruleset().prefix("foaf",c.foaf).prefix("rdf",c.rdf).prefix("ex",c.ex).add("?person a foaf:Person","?person ex:mother _:mother").add("?person ex:mother ?mother","?mother a foaf:Person"),
b=d.rdf.databank().prefix("foaf",c.foaf).add("<#me> a foaf:Person");equals(a.size(),2);equals(b.size(),1);b.reason(a);ok(true,"it should not cause infinite recursion");equals(b.size(),101)});test("when providing a recursion limit",function(){var a=d.rdf.ruleset().prefix("foaf",c.foaf).prefix("rdf",c.rdf).prefix("ex",c.ex).add("?person a foaf:Person","?person ex:mother _:mother").add("?person ex:mother ?mother","?mother a foaf:Person"),b=d.rdf.databank().prefix("foaf",c.foaf).add("<#me> a foaf:Person");
equals(a.size(),2);equals(b.size(),1);b.reason(a,{limit:20});equals(b.size(),41)});module("Extensions to $.rdf.databank");test("when executing a simple inheritance-type rule using data.reason()",function(){var a=d.rdf.rule("?person a foaf:Person","?person a foaf:Agent",{namespaces:c}),b=d.rdf.databank().prefix("foaf",c.foaf);b.add("<#me> a foaf:Person");equals(b.size(),1);b.reason(a);equals(b.size(),2);equals(b.triples()[0],d.rdf.triple("<#me> a foaf:Person",{namespaces:c}));equals(b.triples()[1],
d.rdf.triple("<#me> a foaf:Agent",{namespaces:c}))});test("when executing a ruleset using data.reason()",function(){var a=d.rdf.rule("?person a foaf:Person","?person a foaf:Agent",{namespaces:c});a=d.rdf.ruleset().add(a);var b=d.rdf.databank().prefix("foaf",c.foaf);b.add("<#me> a foaf:Person").add("<#you> a foaf:Person");equals(b.size(),2);b.reason(a);equals(b.size(),4);equals(b.triples()[0],d.rdf.triple("<#me> a foaf:Person",{namespaces:c}));equals(b.triples()[1],d.rdf.triple("<#you> a foaf:Person",
{namespaces:c}));equals(b.triples()[2],d.rdf.triple("<#me> a foaf:Agent",{namespaces:c}));equals(b.triples()[3],d.rdf.triple("<#you> a foaf:Agent",{namespaces:c}))});module("RDFS rules");test("when running RDFS rules on a single statement",function(){var a=d.rdf.databank().prefix("foaf",c.foaf).prefix("rdfs",c.rdfs).add('<#me> foaf:surname "Tennison" .').add("foaf:surname rdfs:domain foaf:Person .").add("foaf:Person rdfs:subClassOf foaf:Agent .");equals(a.size(),3);a.reason(d.rdf.ruleset.rdfs);equals(a.size(),
13);console.log(a.dump({format:"text/turtle",indent:true}))})})(jQuery);
