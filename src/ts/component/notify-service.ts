import { ChatEvent, ChatEventType } from '../constant/chat';
import { Delay } from '../lib/cui/core/decorators/async';

type Listener<T = ChatEvent> = (message: T) => void;

interface Listeners {
    [key: string]: Listener<any>[];
}


export class NotifyService {
    private static eventSource: EventSource;
    private static reOpenListeners: Function[] = [];
    private static listeners: Listeners = { 'open': [] };
    private static _open = false;

    public static isOpen(): boolean {
        return NotifyService._open;
    }

    public static close() {
        NotifyService._open = false;
        NotifyService.doClose();
    }
    /**
     * 开启连线 同时关闭前一个连线
     *
     */
    public static open(url: string, reOpenUrl?: string, firstCallback?: Function) {
        NotifyService.doClose();
        NotifyService.doOpen(url, reOpenUrl, firstCallback);
    }


    private static doClose() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = undefined;
        }
    }

    private static doOpen(url: string, reOpenUrl?: string, firstCallback?: Function) {
        if (!reOpenUrl) {
            reOpenUrl = url;
        }
        NotifyService.eventSource = new EventSource(url);
        // 斷線後，Chrome 會嘗試重連，改為自己關閉10秒後重連
        NotifyService.eventSource.onerror = (e) => {
            console.log('onerror', NotifyService.eventSource);
            NotifyService.doClose();
            if (NotifyService._open) {
                NotifyService.tryOpen(reOpenUrl);
            }
        };
        NotifyService.eventSource.onopen = () => {
            console.log('onopen', NotifyService.eventSource);
            NotifyService._open = true;
            if (firstCallback) {
                firstCallback();
                firstCallback = undefined;
            }
        };
        NotifyService.eventSource.addEventListener('message', (e: any) => {
            if (!e.data) {
                return;
            }
            let message: ChatEvent = JSON.parse(e.data);
            console.log('message', message);
            let array = NotifyService.listeners[message.event];
            if (!array) {
                array = NotifyService.listeners[message.event] = [];
            }
            for (let i in array) {
                array[i](message);
            }
        });
    }

    /**
     * 10秒後重連
     */
    @Delay(10000)
    private static tryOpen(url: string) {
        NotifyService.doOpen(url, url, () => {
            let array = NotifyService.reOpenListeners;
            for (let i in array) {
                array[i]();
            }
        });
    }

    /**
     * 連線成功事件
     * @param callback
     */
    public static reOpenlistener(callback: Function): Function {
        NotifyService.reOpenListeners.push(callback);
        if (this._open) {
            callback();
        }
        return callback;
    }

    /**
     * 註銷連線成功事件
     * @param callback
     */
    public static interruptOpen(callback: Function) {
        let array = NotifyService.reOpenListeners;
        if (array) {
            let index = array.indexOf(callback);
            if (index != -1) {
                array.splice(index, 1);
            }
        }
    }

    /**
     * 訊息事件
     * @param eventType
     * @param callback
     */
    public static listener<T>(eventType: ChatEventType, callback: Listener<T>): Listener<T> {
        let array = NotifyService.listeners[eventType];
        if (!array) {
            array = NotifyService.listeners[eventType] = [];
        }
        let index = array.indexOf(callback);
        if (index == -1) {
            array.push(callback);
        }
        console.log(array)
        return callback;
    }


    /**
     * 註銷訊息事件
     * @param eventType
     * @param callback
     */
    public static interrupt(eventType: ChatEventType, callback: Listener) {
        let array = NotifyService.listeners[eventType];
        if (array) {
            let index = array.indexOf(callback);
            if (index != -1) {
                array.splice(index, 1);
            }
        }
    }
}
