import { Global } from '../globle';
import { AjaxTryCatch } from '../lib/cui/core/decorators/ajax-try-catch';
import { AjaxMethod } from '../lib/cui/core/ajax/ajax.enums';
import { AjaxUtil } from '../lib/cui/core/ajax/ajax-util';
import { IAjaxCallback  } from '../lib/cui/core/ajax/ajax.interfaces';




export class UserService {

    @AjaxTryCatch(0)
    public static query(callback) {
        Global.ajaxManager.request({
            url: 'user'
            , method: AjaxMethod.GET
            , callback: callback
        });
    }

}
