
export type RecordStorageCompare<T> = (a: T, b: T) => boolean;
export type RecordStorageSort<T> = (a: T, b: T) => number;
export type RecordStorageKey<T> = (a: T) => any;

export interface RecordStorageKeys<T> {
    [key: string]: T;
}
export interface RecordStorageConfig<T> {
    logLimit: number;
    logs: T[];
    key: RecordStorageKey<T>;
    sort: RecordStorageSort<T>;
}


/**
 * 處理紀錄的儲存體
 */
export class RecordStorage<T> {
    private keys: RecordStorageKeys<T> = {};
    public records: T[] = [];
    private logs: T[];

    constructor(private config: RecordStorageConfig<T>) {
        this.logs = config.logs;
        this.logs.forEach((value, index) => {
            if (this.getKey(value)) {
                this.logs.splice(index, 1);
            } else {
                this.records.push(value);
            }
        });
        this.sort();
    }

    public find(key): T {
        return this.keys[key];
    }

    /**
     * 重複則覆寫
     * @param
     */
    public overwrite(r: T): number {
        if (!r) {
            return 0;
        }
        let old = this.getKey(r);
        if (old) {
            let index = this.records.indexOf(old);
            this.records.splice(index, 1, r);
            this.logs.splice(index, 1, r);
            this.setKey(r);
        } else {
            this.records.push(r);
            this.logs.push(r);
        }
        return 1;
    }

    /**
     * 添加訊息在最後面
     * @param r
     */
    public append(r: T): number {
        if (!r) {
            return 0;
        }
        if (this.getKey(r)) {
            return 0;
        }

        if (this.appendOutRange(r) > 0) {
            return 1;
        }

        let t;
        for (let i = this.records.length - 1; i > -1; i--) {
            t = this.records[i];
            if (this.config.sort(r, t) > -1) {
                this.records.splice(i + 1, 0, r);
                this.logs.splice(i + 1, 0, r);
                return 1;
            }
        }
        // 先不處理最大值
        // if (this.logs.length > this.config.logLimit) {
        //     this.logs.shift();
        // }
        return 1;
    }


    public appendArray(rs: T[]): number {
        if (!rs) {
            return 0;
        }
        let c = 0;
        for (let i in rs) {
            c += this.append(rs[i]);
        }
        return c;
    }

    /**
     * 添加訊息在最前面
     * @param records
     */
    public appendFirst(r: T): number {
        if (!r) {
            return 0;
        }
        if (this.getKey(r)) {
            return 0;
        }

        if (this.appendOutRange(r) > 0) {
            return 1;
        }
        let t;
        for (let i = 0, l = this.records.length; i < l; i++) {
            t = this.records[i];
            if (this.config.sort(r, t) < 1) {
                this.records.splice(i, 0, r);
                this.logs.splice(i, 0, r);
                break;
            }
        }
        return 1;
    }

    public appendFirstArray(rs: T[]): number {
        if (!rs) {
            return 0;
        }
        let c = 0;
        for (let i in rs) {
            c += this.appendFirst(rs[i]);
        }
        return c;
    }

    /**
     * 先處理範圍外的資料
     * @param r
     */
    private appendOutRange(r: T) {
        if (this.records.length == 0) {
            this.records.push(r);
            this.logs.push(r);
            return 1;
        }
        let t = this.records[this.records.length - 1];
        // 比較最大值
        if (this.config.sort(r, t) > -1) {
            this.records.push(r);
            this.logs.push(r);
            return 1;
        }
        t = this.records[0];
        // 比較最小值
        if (this.config.sort(r, t) < 1) {
            this.records.splice(0, 0, r);
            this.logs.splice(0, 0, r);
            return 1;
        }
        return 0;
    }

    private getKey(r: T): T {
        let key = this.config.key(r);
        let data = this.keys[key];
        if (!data) {
            this.keys[key] = r;
        }
        return data;
    }

    private setKey(r: T): T {
        let key = this.config.key(r);
        this.keys[key] = r;
        return r;
    }

    public sort() {
        this.logs.sort(this.config.sort);
        this.records.sort(this.config.sort);
    }
}
