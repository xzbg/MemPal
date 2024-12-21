import { _decorator, Component, Label, SpriteFrame, resources, Sprite, Button, EventHandler, UITransform, Size, Color } from 'cc';
import { Card } from '../Data/Card';
const { ccclass, property } = _decorator;

/**
 * 游戏卡片
 */
@ccclass('CardNode')
export class CardNode extends Component {
    @property({ type: Sprite }) // 卡片的背景
    public imgBg: Sprite = null!;
    @property({ type: Label }) // 卡片的文字
    public labText: Label = null!;
    @property({ type: Sprite }) // 卡片的图标
    public imgIcon: Sprite = null!;
    @property({ type: Sprite }) // 卡片的纯色图标
    public imgColor: Sprite = null!;
    @property({ type: Button }) // 卡片的按钮
    public btnClick: Button = null!;

    // 当前的卡片数据
    private _card: Card = null!;


    /** 卡片的点击回调函数 */
    private _clickCallback: Function = null!;

    start() {
        // 绑定点击事件
        this.btnClick.node.on(Button.EventType.CLICK, this.onClickCard, this);
        // 加载当前目录下spriteFrame资源 db://assets/GameRes/Images/fruits.plist/fruits_03
    }

    /** 节点初始化 */
    public init(card: Card) {
        this._card = card;
        if (this._card.type == Card.CardType.Normal) {
            // 数字卡片，设置一个纯色的icon
            this.setText(card.label);
            this.labText.color = new Color().fromHEX(card.fontColor);
            this.imgColor.color = new Color().fromHEX(card.bgColor);
            this.imgIcon.enabled = false;
        } else if (this._card.type == Card.CardType.Image) {
            this.labText.enabled = false;
            this.imgColor.enabled = false;
            this.imgIcon.color = new Color().fromHEX(card.bgColor);
        }
    }

    /** 绑定点击监听 */
    public bindClick(callback: Function) {
        this._clickCallback = callback;
    }

    /** 禁用点击 */
    public disableClick(enable: boolean) {
        this.btnClick.interactable = !enable;
    }

    /** 移除监听函数 */
    public removeClick() {
        this._clickCallback = null!;
    }

    /** 设置卡片的显示文字 */
    public setText(text: string) {
        this.labText.string = text;
    }

    /** 设置文字显示 */
    public setVisible(visible: boolean) {
        if (this._card.type == Card.CardType.Normal) {
            this.labText.enabled = visible;
            this.imgColor.enabled = visible;
        } else if (this._card.type == Card.CardType.Image) {
            this.imgIcon.enabled = visible;
        }
    }

    /** 设置卡片已被选中 */
    public setSelected() {
        this._card.setState(Card.CardState.Selected);
    }

    /** 卡片是否已被选中 */
    public isSelected() {
        return this._card.state == Card.CardState.Selected;
    }

    /** 设置卡片的大小 */
    public setCardSize(width: number, height: number) {
        let trans = this.getComponent(UITransform)
        trans.contentSize = new Size(width, height)
    }

    /** 设置卡片上的图片 */
    public setIcon(imgPath: string) {
        resources.load(imgPath, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.log(err);
                return;
            }
            // 设置卡片的背景
            this.imgIcon.getComponent(Sprite)!.spriteFrame = spriteFrame;
        });
    }

    /** 获取卡片的配置id */
    public getId() {
        return this._card.id;
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


