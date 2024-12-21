import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('CardLibrary')
export class CardLibrary extends Object {
    // 单例模式的全局对象
    private static _instance: CardLibrary = null;

    // 获取单例对象
    public static getInstance(): CardLibrary {
        if (this._instance == null) {
            this._instance = new CardLibrary();
        }
        return this._instance;
    }

    // 卡片库
    public cardLibrary: number[] = [];

    // 初始化卡片库
    public initCardLibrary() {
        // 先设置100个卡片
        for (let i = 1; i < 100; i++) {
            this.cardLibrary.push(i);
        }
    }

    // 从卡片库中随机N个卡片
    public getRandomCard(type: number, num: number): number[] {
        var temp = this.cardLibrary.slice(0);
        var result = [];
        for (let i = 0; i < num; i++) {
            let index = Math.floor(Math.random() * temp.length);
            // 卡面不重复，但是每个卡需要成对的添加2次
            result.push(temp[index]);
            result.push(temp[index]);
            temp.splice(index, 1);
        }

        console.log("result:", result);

        return result;
    }
}


