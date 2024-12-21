import { _decorator } from 'cc';
import { Card } from './Card';
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
    public cardLibrary: Card[] = [];

    // 初始化卡片库
    public initCardLibrary() {
        // 先设置100个卡片
        for (let i = 1; i < 100; i++) {
            let card = new Card();
            card.id = i;
            card.type = Card.CardType.Normal;
            card.label = i.toString();
            // 随机一种比较好看的颜色
            card.bgColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
            // 在背景色的基础上，随机一个字体颜色，保证对比度
            card.fontColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
            this.cardLibrary.push(card);
        }
    }

    // 从卡片库中随机N个卡片
    public getRandomCard(type: number, num: number): Card[] {
        var temp = this.cardLibrary.slice(0);
        var result = [];
        for (let i = 1; i <= num; i++) {
            let index = Math.floor(Math.random() * temp.length);
            // 卡面不重复，但是每个卡需要成对的添加2次
            let card = temp[index].clone()
            card.uid = i * 100 + 1;
            result.push(card);
            card = temp[index].clone()

            card.uid = i * 100 + 2;
            result.push(card);
            temp.splice(index, 1);
        }
        return result;
    }
}


