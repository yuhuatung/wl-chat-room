
interface State {
    count: number;
    datas: any[];
    originalMethod: Function;
}

/**
 * 連續執行方法，一次返回結果
 * @param runners 
 */
export function Executes(...runners: Function[]) {

    // function callback(state: State, index: number, data: any) {
    //     state.datas[index] = data;
    //     if (++state.count >= state.datas.length) {
    //         state.originalMethod.apply(this, state.datas);
    //     }
    // }

    // return function (originalMethod) {
    //     let state: State = {
    //         count: 0
    //         , datas: []
    //         , originalMethod: originalMethod
    //     };
    //     state.datas.length = runners.length;
    //     let ajax;
    //     for (let i in runners) {
    //         ajax = runners[i];
    //         if (ajax instanceof Function) {
    //             ajax.call(this, callback.bind(this, state, i));
    //         } else {
    //             callback.call(this, state, i, ajax);
    //         }
    //     }
    // };
}


