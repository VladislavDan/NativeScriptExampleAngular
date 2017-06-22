import { Component } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";

import {ReposService} from "./repos-list.service";
import {Repos} from "../../../platforms/android/src/main/assets/app/pages/reposlist/repos";

@Component({
    selector: "repos-list",
    providers: [ReposService],
    templateUrl: "pages/reposlist/repos-list.html",
    styleUrls: ["pages/reposlist/repos-list.css"]
})

export class ReposList {

    reposList:Array<Repos> = [];

    constructor(private router:Router, private reposService:ReposService) {
        console.log("List opened");
    }

    loaded() {
        console.log("Loaded");
        this.reposService.search("").subscribe((repos:Repos) => {
            this.reposList.push(repos);
        })
    }

    reposItemTap(args) {
        console.log("Item tapped");
        let tappedItemIndex = args.index;
        let repos:Repos = this.reposList[tappedItemIndex];
        let navigationExtras:NavigationExtras = <NavigationExtras>{
            queryParams: {
                "avatar": repos.avatar,
                "name": repos.name,
                "description": repos.description
            }
        };
        this.router.navigate(["/repos_details"], navigationExtras);
    }
}
