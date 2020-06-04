import * as _ from 'lodash';

export class FileUtil {
    private static readonly units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    public static getFileSize(size: number): string {
        let count = 0;
        while (size > 1024) {
            size = size / 1024;
            count++;
        }
        return _.round(size, 2).toFixed(2) + FileUtil.units[count];
    }
}