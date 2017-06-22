import { Component } from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {RouterExtensions} from "nativescript-angular/router";

import {Repos} from "../../../platforms/android/src/main/assets/app/pages/reposlist/repos";

@Component({
    selector: "repos-details",
    templateUrl: "pages/reposdetails/repos-details.html",
    styleUrls: ["pages/reposdetails/repos-details.css"]
})

export class ReposDetails {

    avatar:string = "";
    description:string = "";
    name:string = "";

    constructor(private route:ActivatedRoute, private routerExtensions:RouterExtensions) {
        console.log("Detail opened");
        this.route.queryParams.subscribe((repos:Repos) => {
            this.avatar = repos.avatar;
            this.description = repos.description;
            this.name = repos.name;
        })
    }

    goBack() {
        this.routerExtensions.back();
    }
}
