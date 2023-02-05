"use strict";
const ruleset = new RuleSet();
var s, selected;
s = ruleset.makeRelationshipSet();
s = ruleset.dependsOn('a', 'a', s);
console.assert(ruleset.checkRelationships(s));
s = ruleset.makeRelationshipSet();
s = ruleset.dependsOn('a', 'b', s);
s = ruleset.dependsOn('b', 'a', s);
console.assert(ruleset.checkRelationships(s));
s = ruleset.makeRelationshipSet();
s = ruleset.dependsOn('a', 'b', s);
s = ruleset.areExclusive('a', 'b', s);
console.assert(!ruleset.checkRelationships(s));
s = ruleset.makeRelationshipSet();
s = ruleset.dependsOn('a', 'b', s);
s = ruleset.dependsOn('b', 'c', s);
s = ruleset.areExclusive('a', 'c', s);
console.assert(!ruleset.checkRelationships(s));
s = ruleset.makeRelationshipSet();
s = ruleset.dependsOn('a', 'b', s);
s = ruleset.dependsOn('b', 'c', s);
s = ruleset.dependsOn('c', 'a', s);
s = ruleset.dependsOn('d', 'e', s);
s = ruleset.areExclusive('c', 'e', s);
console.assert(ruleset.checkRelationships(s));
// This function takes some arguments and returns a set of selected options.
// If needed, you should replace it with your own data structure.
function set(data) {
    return new Set(data);
}
// This function returns whether two sets of selected options have the same options selected.
// If needed, you should reimplement it for your own data structure.
function setsEqual(a, b) {
    var ka = Object.keys(a).sort();
    var kb = Object.keys(b).sort();
    if (ka.length != kb.length) {
        return false;
    }
    for (var i in ka) {
        if (kb[i] != ka[i]) {
            return false;
        }
    }
    return true;
}
const pkgs = new Packages(ruleset, selected);
//selected = set();  // Or list, array, etc.
selected = pkgs.toggle('a');
console.assert(setsEqual(selected, new Set(['a', 'b', 'c'])));
//console.assert(setsEqual(selected, set('a', 'c', 'b')));
s = ruleset.dependsOn('f', 'f', s);
selected = pkgs.toggle('f');
console.assert(setsEqual(selected, new Set(['a', 'c', 'b', 'f'])));
selected = pkgs.toggle('e');
console.assert(setsEqual(selected, new Set(['e', 'f'])));
selected = pkgs.toggle('b');
console.assert(setsEqual(selected, set(['a', 'c', 'b', 'f'])));
s = ruleset.dependsOn('b', 'g', s);
selected = pkgs.toggle('g');
selected = pkgs.toggle('b');
console.assert(setsEqual(selected, set(['g', 'f'])));
s = ruleset.makeRelationshipSet();
s = ruleset.dependsOn('a', 'b', s);
s = ruleset.dependsOn('b', 'c', s);
selected = set([]);
selected = pkgs.toggle('c');
console.assert(setsEqual(selected, set(['c'])));
// Deep dependencies
s = ruleset.makeRelationshipSet();
s = ruleset.dependsOn('a', 'b', s);
s = ruleset.dependsOn('b', 'c', s);
s = ruleset.dependsOn('c', 'd', s);
s = ruleset.dependsOn('d', 'e', s);
s = ruleset.dependsOn('a', 'f', s);
s = ruleset.areExclusive('e', 'f', s);
console.assert(!ruleset.checkRelationships(s));
// Multiple dependencies and exclusions.
s = ruleset.makeRelationshipSet();
s = ruleset.dependsOn('a', 'b', s);
s = ruleset.dependsOn('a', 'c', s);
s = ruleset.areExclusive('b', 'd', s);
s = ruleset.areExclusive('b', 'e', s);
console.assert(ruleset.checkRelationships(s));
selected = set([]);
selected = pkgs.toggle('d');
selected = pkgs.toggle('e');
selected = pkgs.toggle('a');
console.assert(setsEqual(selected, set(['a', 'c', 'b'])));
