"use strict";
class RuleSet {
    constructor() {
        this.addDep = (pkg, dep) => {
            this.addPkg(this.dependencies, pkg, dep);
        };
        this.addConflict = (pkg, dep) => {
            this.addPkg(this.conflicts, pkg, dep);
        };
        this.addPkg = (target, pkg, dep) => {
            if (target.get(pkg)) {
                target.get(pkg).add(dep);
            }
            else {
                target.set(pkg, new Set([dep]));
            }
        };
        this.isCoherent = () => {
            // get deps object with first order deps
            for (let [pkg, deps] of this.dependencies.entries()) {
                // checked dependencies
                const depsChecked = new Set([pkg]);
                // build set that includes all deps, including transitive deps, and excludes circular deps
                let depsToCheck = new Set([...deps].filter(dep => !depsChecked.has(dep)));
                while (depsToCheck.size) {
                    let depToCheck = depsToCheck.values().next().value;
                    // remove
                    depsToCheck.delete(depToCheck);
                    // circular dep check
                    depsChecked.add(depToCheck);
                    const transitiveDeps = this.dependencies.get(depToCheck);
                    if (transitiveDeps) {
                        depsToCheck = new Set([...depsToCheck, ...transitiveDeps].filter(dep => !depsChecked.has(dep)));
                    }
                }
                // check for conflicts, deps cannot have conflicts with pkg or dependencies including transitive
                for (let depChecked of depsChecked.keys()) {
                    const pkgConflicts = this.conflicts.get(depChecked);
                    if (pkgConflicts) {
                        for (let pkgConflict of pkgConflicts) {
                            if (depsChecked.has(pkgConflict)) {
                                return false;
                            }
                        }
                    }
                }
            }
            return true;
        };
        this._dependencies = new Map();
        this._conflicts = new Map();
    }
    makeRelationshipSet() {
        return new RuleSet();
    }
    dependsOn(dep1, dep2, ruleSet) {
        ruleSet.addDep(dep1, dep2);
        return ruleSet;
    }
    areExclusive(dep1, dep2, ruleSet) {
        ruleSet.addConflict(dep1, dep2);
        return ruleSet;
    }
    checkRelationships(ruleSet) {
        return ruleSet.isCoherent();
    }
    get dependencies() {
        return this._dependencies;
    }
    set dependencies(deps) {
        this._dependencies = deps;
    }
    get conflicts() {
        return this._conflicts;
    }
    set conflicts(cfcts) {
        this._conflicts = cfcts;
    }
}
