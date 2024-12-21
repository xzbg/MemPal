import { _decorator, Component, director, Layout, Prefab, instantiate, CCInteger, Label, Size, UITransform, math, Button } from 'cc';
import { PlayerData } from '../Data/PlayerData';
import { CardNode } from './CardNode';
import { ConfigLoader } from '../Config/ConfigLoader';
import { CardLibrary } from '../Data/CardLibrary';
import { Card } from '../Data/Card';
const { ccclass, property } = _decorator;

/**
 * 游戏主场景
 * 用于管理所有的游戏逻辑
 */
@ccclass('GameScene')
export class GameScene extends Component {
    @property({ type: Layout })// 卡片的展示父节点
    public cardGrid: Layout = null!;
    @property({ type: Prefab })// 卡片的预制体
    public cardPrefab: Prefab = null!;
    @property({ type: Label }) // 用户显示倒计时
    public timerLab: Label = null!;
    @property({ type: Label }) // 用户显示得分
    public scoreLab: Label = null!;
    @property({ type: UITransform }) // 结束界面
    public endGame: UITransform = null!;
    @property({ type: Button }) // 重新开始按钮
    public restartBtn: Button = null!;


    // 当前的得分
    private _score: number = 0;
    // 所有的卡片列表
    private _cardNodeList: CardNode[] = [];
    // 选中的卡片列表，长度只有2
    private _selectedCardList: CardNode[] = [];
    // 当前倒计时计数/*  */
    private _timerCount: number = 0;
    // 当前得分上限
    private _scoreLimit: number = 0;
    // 禁止点击标识
    private _forbidClick: boolean = false;
    // 玩家数据对象
    private _playerData: PlayerData = PlayerData.getInstance();
    // 卡片库对象
    private _cardLibrary: CardLibrary = CardLibrary.getInstance();


    start() {
        this.endGame.node.active = false;
        this.timerLab.string = "记忆时间：" + this._playerData.timerLimit;
        // 开启界面禁止点击
        this._forbidClick = true;
        // 初始化卡片列表
        this._initCardList();
        // 在timerLab上显示倒计时
        this.schedule(this._onLookTimer, 1);
    }
    /** 内部函数 ------------------------------- */

    /** 增加得分 */
    private _addScore() {
        this._score += 1;
        this.scoreLab.string = "得分：" + this._score.toString();
    }

    /** 卡片的点击响应函数 */
    private onClickCard(cardNode: CardNode) {
        if (this._forbidClick) return;

        if (this._selectedCardList.length >= 2) {
            // 如果已经选中了2张卡片，那么将之前选中的卡片翻转回去
            this._selectedCardList[0].setVisible(false);
            this._selectedCardList[1].setVisible(false);
            this._selectedCardList[0].disableClick(false);
            this._selectedCardList[1].disableClick(false);
            this._selectedCardList = [];
        }

        // 将卡片添加到选中列表中
        cardNode?.setVisible(true);
        this._selectedCardList.push(cardNode);
        cardNode.disableClick(true);

        console.log("选中卡片数量", this._selectedCardList.length);
        // 还未选中2张卡片，直接返回
        if (this._selectedCardList.length < 2) return;

        // 如果选中了2张卡片，那么进行比较,如果不相同，那么翻转回去
        if (this._selectedCardList[0].getId() == this._selectedCardList[1].getId()) {
            this._selectedCardList[0].setSelected();
            this._selectedCardList[1].setSelected();
            this._addScore();

            this._selectedCardList = [];

            // 检查游戏是否结束，如果所有的卡都反过来了，那么游戏结束
            let isAllCardVisible = true;
            this._cardNodeList.forEach(cardNode => {
                if (!cardNode.isSelected()) {
                    isAllCardVisible = false;
                    return;
                }
            });
            if (isAllCardVisible) {
                this.unschedule(this._onGameTimer);
                this._forbidClick = true;
                console.log("游戏结束");
                this.endGame.node.active = true;
                // 弹出确认提示框，点击确认回到Main场景
                this.restartBtn.node.on(Button.EventType.CLICK, () => {
                    director.loadScene('Main');
                }, this);
            }
        }
    }

    /** 初始化当前卡片列表 */
    private _initCardList() {
        // 按照行列，将卡片排列到屏幕上
        let gridRow = this._playerData.getRow();
        let gridCol = this._playerData.getCol();

        let transform = this.cardGrid.getComponent(UITransform)
        let gridWidth = transform.width;
        let gridHeight = transform.height;

        // 设置卡片的大小
        gridWidth = gridWidth - this.cardGrid.spacingX * (gridCol - 1);
        gridHeight = gridHeight - this.cardGrid.spacingY * (gridRow - 1);

        let cardWidth = Math.floor(gridWidth / gridCol);
        let cardHeight = Math.floor(gridHeight / gridRow);

        // 设置grid容器的属性
        this.cardGrid.constraintNum = gridCol;


        let sizeNum = gridCol * gridRow / 2;
        let cardDataList = this._cardLibrary.getRandomCard(this._playerData.cardType, sizeNum);
        console.log("sizeNum", sizeNum);

        // 便利卡片数据列表，生成卡片
        cardDataList.forEach((card) => {
            let cardNode = this._createCard(card);
            cardNode.setCardSize(cardWidth, cardHeight);
            this._cardNodeList.push(cardNode);
        });


        // 将列表打乱顺序，然后添加到布局中
        this._cardNodeList.sort(() => Math.random() - 0.5);
        this._addCardToLayout();
    }

    /** 将卡片显示到布局组件上 */
    private _addCardToLayout() {
        this._cardNodeList.forEach(card => {
            this.cardGrid.node.addChild(card.node);
        });
    }

    /** 构造一个指定内容的卡片 */
    private _createCard(card: Card) {
        const cardPrefab = instantiate(this.cardPrefab);
        let cardNode = cardPrefab.getComponent(CardNode);
        // 绑定一个当前类的函数，用于处理卡片的点击事件
        cardNode?.bindClick(this.onClickCard.bind(this));
        cardNode?.init(card);
        return cardNode;
    }

    /** 定时器回调 */
    private _onLookTimer() {
        this._timerCount += 1;
        const time = this._playerData.timerLimit - this._timerCount;
        this.timerLab.string = "记忆时间：" + time;
        if (this._timerCount < this._playerData.timerLimit) {
            return;
        }

        // 遍历所有的卡片，将卡片的文字隐藏
        this._cardNodeList.forEach(cardNode => {
            cardNode?.setVisible(false);
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


