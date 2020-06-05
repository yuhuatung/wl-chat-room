import { Global } from '../globle';
import { AjaxTryCatch } from '../lib/cui/core/decorators/ajax-try-catch';
import { AjaxMethod } from '../lib/cui/core/ajax/ajax.enums';
import { AjaxUtil } from '../lib/cui/core/ajax/ajax-util';
import { IAjaxCallback  } from '../lib/cui/core/ajax/ajax.interfaces';

export class BotService {

    @AjaxTryCatch(1)
    public static send(formData, callback) {
        Global.ajaxManager.request({
            url: 'bot/message'
            , background: true
            , method: AjaxMethod.POST
            , headers: AjaxUtil.ContentTypeJson
            , data: JSON.stringify(formData)
            , callback: callback
        });
    }

    @AjaxTryCatch(1)
    public static getKnowledgeSolution(id: number, callback) {
        Global.ajaxManager.request({
            url: 'bot/knowledge/solution'
            , background: true
            , method: AjaxMethod.GET
            , data: { id: id }
            , callback: callback
        });
    }
}
