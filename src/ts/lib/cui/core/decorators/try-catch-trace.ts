
/**
 * try catch ajax method，發生例外時，將錯誤結果傳給callback
 * @param callbackIndex callback方法的位置
 */
export function TryCatchTrace() {
    return function (target, key, descriptor) {
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }
        let originalMethod = descriptor.value;
        descriptor.value = function () {
            try {
                return originalMethod.apply(this, arguments);
            } catch (e) {
                console.log(arguments);
                console.error(e);
            }
        };
        return descriptor;
    };
}
