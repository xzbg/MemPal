import { _decorator, Component, Label, SpriteFrame, resources, Sprite, Button, EventHandler, UITransform, Size } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 游戏卡片
 */
@ccclass('CardNode')
export class CardNode extends Component {
    @property({ type: Label })
    public label: Label = null!;
    @property({ type: Button })
    public btnCard: Button = null!;

    /** 卡片上的文字 */
    private cardName: string = "";
    /** 卡片的点击回调函数 */
    private _clickCallback: Function = null!;

    start() {
        // 绑定点击事件
        this.btnCard.node.on(Button.EventType.CLICK, this.onClickCard, this);
        // 加载当前目录下spriteFrame资源 db://assets/GameRes/Images/fruits.plist/fruits_03

    }

    /** 设置文字显示 */
    public setLabel(visible: boolean) {
        this.label.enabled = visible;
    }

    /** 绑定点击监听 */
    public bindClick(callback: Function) {
        this._clickCallback = callback;
    }

    /** 移除监听 */
    public removeClick() {
        this._clickCallback = null!;
    }

    /** 设置卡片的显示文字 */
    public setCardName(name: string) {
        this.cardName = name;
        this.label.string = name;
    }

    /** 设置卡片的大小 */
    public setCardSize(width: number, height: number) {
        let trans = this.getComponent(UITransform)
        trans.contentSize = new Size(width, height)
    }

    /** 设置卡片上的图片 */
    public setImage(imgPath: string) {
        resources.load(imgPath, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.log(err);
                return;
            }
            // 设置卡片的背景
            this.btnCard.getComponent(Sprite)!.spriteFrame = spriteFrame;
        });
    }

    /** 获取卡片的显示文字 */
    public getCardName() {
        return this.cardName;
    }

    /**  私有函数 ---------------------------------------- */

    /** 当前卡片的点击回调处理 */
    private onClickCard() {
        if (this._clickCallback == null) {
            return;
        }
        // 调用点击回调
        this._clickCallback(this);
    }
}


