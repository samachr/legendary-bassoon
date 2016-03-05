/**
 * Created by Dragonman117 on 3/4/16.
 */

//System Imports
import {bootstrap}    from 'angular2/platform/browser';
import { ROUTER_PROVIDERS, APP_BASE_HREF } from 'angular2/router';
import { provide } from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';

//App Imports
import {Main} from './components/main';

bootstrap(Main, [ROUTER_PROVIDERS,
    provide(APP_BASE_HREF, {useValue: '/'}),
    HTTP_PROVIDERS
]);