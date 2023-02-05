import { Packages } from "./Packages";
import { RuleSet } from "./RuleSet"; 
import { toggle } from "./toggle";

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
function set() {
  return new Set(arguments);
}

// This function returns whether two sets of selected options have the same options selected.
// If needed, you should reimplement it for your own data structure.
function setsEqual(a, b) {
    if (a.size !== b.size) {
        return false;
      }
      for (const n of a) {
        if (!b.has(n)) {
          return false;
        }
      }
      return true;
}
const pkgs = new Packages(ruleset,selected);
selected = new Set();  // Or list, array, etc.

selected = toggle(selected, 'a', s);
console.assert(setsEqual(selected, new Set(['a','b','c'])));
//console.assert(setsEqual(selected, set('a', 'c', 'b')));

s = ruleset.dependsOn('f', 'f', s);
selected = toggle(selected, 'f', s);
console.assert(setsEqual(selected, new Set(['a', 'c', 'b', 'f'])));

selected = toggle(selected, 'e', s);
console.assert(setsEqual(selected, new Set(['e', 'f'])));

selected = toggle(selected, 'b', s);
console.assert(setsEqual(selected, new Set(['a', 'c', 'b', 'f'])));

s = ruleset.dependsOn('b', 'g', s);
selected = toggle(selected, 'g', s);
selected = toggle(selected, 'b', s);
console.assert(setsEqual(selected, new Set(['g', 'f'])));

s = ruleset.makeRelationshipSet();
s = ruleset.dependsOn('a', 'b', s);
s = ruleset.dependsOn('b', 'c', s);
selected = set();
selected = toggle(selected, 'c', s);
console.assert(setsEqual(selected, new Set(['c'])));

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
selected = new Set([]);
selected = toggle(selected, 'd', s);
selected = toggle(selected, 'e', s);
selected = toggle(selected, 'a', s);
console.assert(setsEqual(selected, new Set(['a', 'c', 'b'])), "Error Occured");
console.log(pkgs.stringSlice());
