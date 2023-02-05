import { Packages } from "./Packages";

export function toggle(selected, pkg, ruleSet){
    const pkgs = new Packages(ruleSet, selected);

    return pkgs.toggle(pkg);
}