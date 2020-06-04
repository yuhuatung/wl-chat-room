import { AjaxManager } from './lib/cui/core/ajax/ajax-manager';
import { DatePicker } from './lib/cui/core/component/date-picker';
import { Loader } from './lib/cui/core/component/loader';
import { Cache } from './lib/cui/core/decorators/cache';
import { Combobox, ComboboxData } from './lib/cui/core/common';
import { CUI } from './lib/cui/core/cui';
import { StoreNodeSource } from './lib/cui/core/decorators/store-source';

import { environment } from '../environments/environment';
// import { getTranslateGO, TranslateConfig } from 'translate-go';

// 開啟翻譯工具
// TranslateConfig.dev = !environment.production;
// 設定預設語系
// TranslateConfig.defaultLanguage = environment.lang;

interface QueryString {
    [key: string]: string[];
}

export class Global {
    public static readonly env = environment;
    // public static readonly translateGO = getTranslateGO();
    public static readonly ajaxManager = new AjaxManager();
    public static readonly datePicker = new DatePicker();
    public static readonly loader = new Loader();
    @Cache.session('Global', '')
    public static currentRoute;
    @Cache.session('Global', '')
    public static currentRouteName;
    public static routeName = {};
    @Cache.session<any>('Global', {})
    private static queryParamters: QueryString;
    @Cache.session('Global', '')
    public static queryString;

    public static outletCount = 1;

    public static outlets = [0];
    public static getQueryParamter(): QueryString {
        return CUI.deepClone(Global.queryParamters);
    }

    public static getParamter(key: string): string {
        let value = Global.queryParamters[key];
        return value ? value.join(',') : null;
    }

    public static getParamters(key: string): string[] {
        return Global.queryParamters[key];
    }

    /**
     * 解析URL Parameters
     */
    public static parseQueryString() {
        if (window.location.search) {
            let queryParameters = {};
            let queryString = window.location.search.substring(1);
            let params = queryString.split('&');
            let values, name, value;
            for (let i in params) {
                values = params[i].split('=');
                name = decodeURIComponent(values[0]);
                value = decodeURIComponent(values[1]);
                if (queryParameters[name]) {
                    queryParameters[name].push(value);
                } else {
                    queryParameters[name] = [value];
                }
            }
            Global.queryString = queryString;
            Global.queryParamters = queryParameters;
        }
    }
}
