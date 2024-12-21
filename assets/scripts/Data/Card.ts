import { _decorator, Node } from 'cc';
const { ccclass } = _decorator;

/**
 * 卡片数据对象
 */
@ccclass('Card')
export class Card extends Object {

    // 定义卡片的类型枚举
    public static CardType = {
        Normal: 0,  // 常规的文字卡片
        Image: 1,  // 图片卡片
    }


    /** 配置属性 */
    // 卡片的唯一id
    public uid: number = 0;
    // 卡片的定义id
    public id = 0;
    // 卡片的类型
    public type: number = Card.CardType.Normal;
    // 卡片的状态
    public state: number = 0;
    // 卡片的文字标签
    public label: string = "";
    // 卡片的图片路径
    public imgPath: string = "";
    // 卡片的背景颜色
    public bgColor: string = "";
    // 卡片的字体颜色
    public fontColor: string = "";

    /** 过程缓存 */
    // 卡片的节点
    public node: Node = null;

    // 卡片信息的克隆方法，从当前的数据中克隆一个新的数据
    public clone(): Card {
        let card = new Card();
        card.uid = this.uid;
        card.id = this.id;
        card.type = this.type;
        card.state = this.state;
        card.label = this.label;
        card.imgPath = this.imgPath;
        card.bgColor = this.bgColor;
        card.fontColor = this.fontColor;
        return card;
    }


}


