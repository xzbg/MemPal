import { _decorator, Component, director, Layout, Prefab, instantiate, CCInteger, Label } from 'cc';
import { Card } from './Card';
const { ccclass, property } = _decorator;

/**
 * 游戏主场景
 * 用于管理所有的游戏逻辑
 */
@ccclass('GameScene')
export class GameScene extends Component {
    @property({ type: Layout })// 卡片的布局组件
    public layout: Layout = null!;
    @property({ type: Prefab })// 卡片的预制体
    public cardPrefab: Prefab = null!;
    @property({ type: Label }) // 用户显示倒计时
    public timerLab: Label = null!;
    @property({ type: CCInteger })// 卡片的数量
    public size_num: number = 0;
    @property({ type: Label }) // 用户显示得分
    public scoreLab: Label = null!;
    @property({ type: CCInteger }) // 记忆时间
    public timerLimit: number = 0;


    // 当前的得分
    private _score: number = 0;
    // 所有的卡片列表
    private _cardList: Card[] = [];
    // 选中的卡片列表，长度只有2
    private _selectedCardList: Card[] = [];
    // 当前倒计时计数
    private _timerCount: number = 0;
    // 当前得分上限
    private _scoreLimit: number = 0;
    // 禁止点击标识
    private _forbidClick: boolean = false;



    start() {
        this.timerLab.string = "记忆时间：" + this.timerLimit;
        this._forbidClick = true;
        // 初始化卡片列表
        this._initCardList();
        // 在timerLab上显示倒计时
        this.schedule(this._onLookTimer, 1);
    }

    /** 增加得分 */
    private _addScore() {
        this._score += 1;
        this.scoreLab.string = "得分：" + this._score.toString();
        if (this._score >= this._scoreLimit) {
            // 取消定时器
            this.unschedule(this._onGameTimer);
            // 启动定时器，跳转到游戏开始场景
            this.scheduleOnce(() => {
                director.loadScene('Main');
            }, 3);
        }
    }

    /** 卡片的点击响应函数 */
    onClickCard(card: Card) {
        if (this._forbidClick) return;
        card?.setLabel(true);
        // 将卡片添加到选中列表中
        if (this._selectedCardList.length <= 0) {
            this._selectedCardList.push(card);
        } else if (this._selectedCardList.length == 1) {
            this._selectedCardList.push(card);
            if (this._selectedCardList[0].getCardName() == this._selectedCardList[1].getCardName()) {
                this._selectedCardList[0].removeClick();
                this._selectedCardList[1].removeClick();
                this._selectedCardList = [];
                this._addScore();
            }
        } else if (this._selectedCardList.length == 2) {
            this._selectedCardList[0].setLabel(false);
            this._selectedCardList[1].setLabel(false);
            this._selectedCardList = [];

            this._selectedCardList.push(card);
        }
    }

    /** 初始化当前卡片列表 */
    private _initCardList() {
        // 通过设定的数量，计算卡片上的数字
        let num = Math.floor(this.size_num / 2);
        this._scoreLimit = num;
        // 先按顺序生成卡片，为卡片分配对应的数字
        for (let i = 0; i < num; i++) {
            // 通过卡片的预制体，生成一定数量的卡片，每2个为一组
            let cardA = this._createCard(i.toString());
            // 将卡片添加到卡片列表中
            this._cardList.push(cardA);
            // 通过卡片的预支体，生成一定数量的卡片
            let cardB = this._createCard(i.toString());
            // 将卡片添加到卡片列表中
            this._cardList.push(cardB);
        }
        // 将列表打乱顺序，然后添加到布局中
        this._cardList.sort(() => Math.random() - 0.5);
        this._addCardToLayout();
    }

    /** 将卡片显示到布局组件上 */
    private _addCardToLayout() {
        this._cardList.forEach(card => {
            this.layout.node.addChild(card.node);
        });
    }

    /** 构造一个指定内容的卡片 */
    private _createCard(name: string) {
        const cardNode = instantiate(this.cardPrefab);
        let card = cardNode.getComponent(Card);
        // 绑定一个当前类的函数，用于处理卡片的点击事件
        card?.bindClick(this.onClickCard.bind(this));
        card?.setLabel(true);
        card?.setCardName(name);
        return card;
    }

    /** 定时器回调 */
    private _onLookTimer() {
        this._timerCount += 1;
        const time = this.timerLimit - this._timerCount;
        this.timerLab.string = "记忆时间：" + time;
        if (this._timerCount < this.timerLimit) {
            return;
        }

        // 遍历所有的卡片，将卡片的文字隐藏
        this._cardList.forEach(card => {
            card?.setLabel(false);
        });
        // 取消定时器
        this.unschedule(this._onLookTimer);
        this._forbidClick = false;
        this._timerCount = 0;
        this.schedule(this._onGameTimer, 1);
    }

    // 游戏时间
    private _onGameTimer() {
        this._timerCount += 1;
        this.timerLab.string = "游戏时间：" + this._timerCount;
    }
}


