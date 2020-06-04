import { Global } from '../globle';
import { AjaxTryCatch } from '../lib/cui/core/decorators/ajax-try-catch';
import { AjaxMethod } from '../lib/cui/core/ajax/ajax.enums';
import { AjaxUtil } from '../lib/cui/core/ajax/ajax-util';
import { IAjaxCallback , IAjaxManagerResultCallback } from '../lib/cui/core/ajax/ajax.interfaces';
import { ExtendChatRecord, Chat, Consultant, Customer, SubProduct } from '../constant/chat';

interface InitAdded {
    subProduct: SubProduct;
    chat: Chat;
    consultant: Consultant;
    records: ExtendChatRecord[];
}

export class ChatService {

    @AjaxTryCatch(1)
    public static init(formData, callback: IAjaxManagerResultCallback<Customer, any, InitAdded>) {
        Global.ajaxManager.request({
            url: 'init'
            , method: AjaxMethod.GET
            , data: formData
            , callback: callback
        });
    }

    @AjaxTryCatch(1)
    public static query(formData, callback) {
        Global.ajaxManager.request({
            url: 'chat/record'
            , method: AjaxMethod.GET
            , data: formData
            , callback: callback
        });
    }

    @AjaxTryCatch(1)
    public static queryLog(formData, callback: IAjaxManagerResultCallback<ExtendChatRecord[], any, Chat[]>) {
        Global.ajaxManager.request({
            url: 'chat/record/old'
            , method: AjaxMethod.GET
            , data: formData
            , callback: callback
        });
    }

    @AjaxTryCatch(1)
    public static send(formData, callback) {
        Global.ajaxManager.request({
            url: 'chat/message'
            , background: true
            , method: AjaxMethod.POST
            , headers: AjaxUtil.ContentTypeJson
            , data: JSON.stringify(formData)
            , callback: callback
        });
    }

    @AjaxTryCatch(1)
    public static upload(formData, progress: IAjaxCallback, callback) {
        Global.ajaxManager.request({
            url: 'chat/file'
            , background: true
            , upload: true
            , method: AjaxMethod.POST
            , data: formData
            , progress: progress
            , callback: callback
        });
    }

    @AjaxTryCatch(1)
    public static typing(formData, callback) {
        Global.ajaxManager.request({
            url: 'chat/typing'
            , background: true
            , method: AjaxMethod.POST
            , headers: AjaxUtil.ContentTypeJson
            , data: JSON.stringify(formData)
            , callback: callback
        });
    }


    @AjaxTryCatch(1)
    public static score(body, callback) {
        Global.ajaxManager.request({
            url: 'chat/score'
            , background: true
            , method: AjaxMethod.POST
            , headers: AjaxUtil.ContentTypeJson
            , data: JSON.stringify(body)
            , callback: callback
        });
    }

    @AjaxTryCatch(1)
    public static complaint(form, callback) {
        Global.ajaxManager.request({
            url: 'complaint'
            , method: AjaxMethod.POST
            , data: form
            , upload: true
            , callback: callback
        });
    }
}
