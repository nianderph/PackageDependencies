export class RuleSet{
 public _dependencies: Map<string, Set<string>>;
 public _conflicts: Map<string, Set<string>>;

 constructor(){
     this._dependencies = new Map();
     this._conflicts = new Map();
 }

  addDep = (pkg, dep) => {
    this.addPkg(this.dependencies, pkg, dep);
  }

  addConflict = (pkg, dep) => {
    this.addPkg(this.conflicts, pkg, dep);
  }

  addPkg = (target, pkg, dep) => {
    if (target.get(pkg)) {
      target.get(pkg).add(dep);
    } else {
      target.set(pkg, new Set([dep]));
    }
  }

  isCoherent = () => {
    for (let [pkg, deps] of this.dependencies.entries()) {

      const depsChecked = new Set([pkg]);

      let depsToCheck = new Set([...deps].filter(dep => !depsChecked.has(dep)));

      while (depsToCheck.size) {
        let depToCheck = depsToCheck.values().next().value;

        depsToCheck.delete(depToCheck);

        depsChecked.add(depToCheck);

        const transitiveDeps = this.dependencies.get(depToCheck);

        if (transitiveDeps) {
          depsToCheck = new Set([...depsToCheck, ...transitiveDeps].filter(dep => !depsChecked.has(dep)));
        }
      }

      // Checking for conflicts as dependencies cant have conflict
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
  }

  
public makeRelationshipSet() : RuleSet {
    return new RuleSet();
  }
  
public dependsOn(dep1, dep2, ruleSet) :RuleSet {
    ruleSet.addDep(dep1, dep2);
  
    return ruleSet;
  }

  public areExclusive(dep1, dep2, ruleSet) : RuleSet{
    ruleSet.addConflict(dep1, dep2);
  
    return ruleSet;
  }
  
  public checkRelationships(ruleSet) : boolean {
    return ruleSet.isCoherent();
  }

  public get dependencies(){
      return this._dependencies;
  }

  public set dependencies(deps){
      this._dependencies = deps;
  }

  public get conflicts(){
      return this._conflicts;
  }

  public set conflicts(cfcts){
      this._conflicts = cfcts;
  }

}
