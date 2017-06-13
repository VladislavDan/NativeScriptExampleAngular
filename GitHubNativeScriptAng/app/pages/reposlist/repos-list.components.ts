import { Component } from "@angular/core";

import {ReposService} from "./repos-list.service";
import {Repos} from "../../../platforms/android/src/main/assets/app/pages/reposlist/repos";

@Component({
    selector: "repos-list",
    providers: [ReposService],
    templateUrl: "pages/reposlist/repos-list.html",
    styleUrls: ["pages/reposlist/repos-list.css"]
})

export class ReposList {

    reposList:Array<Object> = [];

    constructor(private reposService:ReposService) {
        console.log("List opened");
    }

    loaded() {
        console.log("Loaded");
        this.reposService.search("").subscribe((repos:Repos) => {
            this.reposList.push(repos);
        })
    }
}
