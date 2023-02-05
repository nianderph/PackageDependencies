"use strict";
class Packages {
    constructor(ruleSet, selected) {
        this.ruleSet = ruleSet;
        this.selected = selected || new Set();
    }
    addSelected(p) {
        const depsToAdd = new Set([p]);
        // check transitive deps
        if (!this.ruleSet.dependencies) {
            return;
        }
        const transitiveDepsSet = this.ruleSet.dependencies.get(p);
        if (transitiveDepsSet) {
            let transitiveDeps = new Set([...transitiveDepsSet]);
            // add transitive deps
            while (transitiveDeps.size) {
                const transitiveDep = transitiveDeps.values().next().value;
                // add transitive
                depsToAdd.add(transitiveDep);
                // remove current transitive dep
                transitiveDeps.delete(transitiveDep);
                // get more transitive deps
                const moreTransitiveDeps = this.ruleSet.dependencies.get(transitiveDep) || [];
                // merge and filter transitive deps
                transitiveDeps = new Set([...transitiveDeps, ...moreTransitiveDeps].filter(dep => !depsToAdd.has(dep)));
            }
        }
        // exclude deps that depend on p or any of these newly excluded deps
        // remove all deps that conflict with p
        const depsToRemove = new Set();
        for (let depSelected of this.selected) {
            for (let depToAdd of depsToAdd) {
                // check if selected deps have conflicts with new deps
                let conflicts = this.ruleSet.conflicts.get(depSelected);
                if (conflicts && conflicts.has(depToAdd)) {
                    depsToRemove.add(depSelected);
                }
                // check if new deps have conflicts with previously selected
                conflicts = this.ruleSet.conflicts.get(depToAdd);
                if (conflicts && conflicts.has(depSelected)) {
                    depsToRemove.add(depSelected);
                }
            }
        }
        this.removeSelected(p, depsToRemove);
        // add new deps
        for (let depToAdd of depsToAdd) {
            this.selected.add(depToAdd);
        }
    }
    removeSelected(p, deps) {
        const depsToRemove = deps || new Set([p]);
        // remove deps that depend on p
        while (depsToRemove.size) {
            let depToRemove = depsToRemove.values().next().value;
            // remove
            depsToRemove.delete(depToRemove);
            this.selected.delete(depToRemove);
            // check if other deps depend on newly removed dep (depToRemove)
            for (let [pkg, deps] of this.ruleSet.dependencies.entries()) {
                if (deps.has(depToRemove) && this.selected.has(pkg)) {
                    depsToRemove.add(pkg);
                }
            }
        }
    }
    toggle(p) {
        // check if package exists
        if (this.selected.has(p)) {
            this.removeSelected(p);
        }
        else {
            this.addSelected(p);
        }
        return this.selected;
    }
    stringSlice() {
        return `[${[...this.selected].join(' ')}]`;
    }
}
