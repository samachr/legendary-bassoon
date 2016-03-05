/**
 * Created by Dragonman117 on 3/4/16.
 */

import {Component} from 'angular2/core';
import {RouterOutlet,RouteConfig, RouterLink} from 'angular2/router';

//My Imports


@Component({
    selector: 'lb',
    directives: [RouterOutlet, RouterLink],
    templateUrl: '../template/html/main.html',
    styleUrls: ['../template/css/main.css']
})

@RouteConfig([
    //{path:"/", as:"Home", component:Home }
])

export class Main { }