import { Injectable } from "@angular/core";
import {Observable, BehaviorSubject} from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
var Sqlite = require("nativescript-sqlite");

import { Repos } from "./repos";

@Injectable()
export class ReposService {

    static DATA_BASE:string = "repos.db";

    static TABLE:string = "ReposTable";

    constructor() {
        this.response();
        this.createTable();
        this.cacheRepos(this.response);
    }

    search(searchText) {
        let resultChannel;
        new Sqlite(ReposService.DATA_BASE,
            function (err, db) {
                resultChannel = ReposService.createResultChannel(searchText, db);
            }
        );
        return resultChannel;
    }

    private static createResultChannel(searchText, db) {
        return Observable.from(db.all("SELECT * FROM " + ReposService.TABLE + " ORDER BY id", []))
            .concatMap((repos:Array<any>) => repos)
            .map((repos) => {
                return {
                    id: repos[0],
                    name: repos[1],
                    avatar: repos[2],
                    description: repos[3],
                    url: repos[4]
                }
            })
            .filter((repos:Repos) => {
                return searchText != ""
                    ? repos.name.indexOf(searchText) != -1
                    : true;
            })
            .catch((error:any) => {
                console.log("caught error" + error);
                return Observable.throw(error.statusText);
            });
    }

    private response() {
        return Observable.ajax('https://api.github.com/repositories')
            .map((result:any) => {
                return result.response;
            })
            .catch((error:any) => {
                console.log("caught error" + error);
                return Observable.throw(error.statusText);
            });
    };

    private createTable() {
        new Sqlite(ReposService.DATA_BASE, function (err, db) {
            db.execSQL("CREATE TABLE IF NOT EXISTS " + ReposService.TABLE + " (id INTEGER PRIMARY KEY ASC, name TEXT, avatar TEXT, description TEXT, url TEXT)", [], function (err) {
                console.log("TABLE CREATED");
            });
        });
    };

    private cacheRepos(response) {
        new Sqlite(ReposService.DATA_BASE, function (err, db) {
            db.all("SELECT * FROM " + ReposService.TABLE + " ORDER BY id", [], function (err, rs) {
                rs.length > 0 ? ReposService.updateRepos(response(), db) : ReposService.insertRepos(response(), db);
            });
        });
    };

    private static insertRepos(response, db) {
        return Observable.from(response)
            .concatMap((repos:any) => repos)
            .catch((error:any) => {
                console.log("caught error" + error);
                return Observable.throw(error.statusText);
            })
            .subscribe((repos:any) => {
                ReposService.insertReposDatabase(repos, db);
            });
    }

    private static updateRepos(response, db) {
        return Observable.from(response)
            .concatMap((repos:any) => repos)
            .catch((error:(any)) => {
                console.log("caught error" + error);
                return Observable.throw(error.statusText);
            })
            .subscribe((repos:any) => {
                ReposService.updateReposDatabase(repos, db);
            });
    }

    private static insertReposDatabase(repos, db) {
        db.execSQL("INSERT INTO " + ReposService.TABLE + " (id, name, avatar, description, url) VALUES (?,?,?,?,?)",
            [repos.id, repos.name, repos.owner.avatar_url, repos.description, repos.html_url], function (err, id) {
                console.log("The new record id is inserted: " + id);
            });
    }

    private static updateReposDatabase(repos, db) {
        db.execSQL("UPDATE " + ReposService.TABLE + " SET name = ?, avatar = ?, description = ?, url = ? WHERE id = ?",
            [repos.name, repos.owner.avatar_url, repos.description, repos.html_url, repos.id], function (err, count) {
                console.log("The new record updated: " + repos.id);
            });
    };
}
