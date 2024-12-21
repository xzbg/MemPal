import { _decorator, Button, Component, director } from 'cc';
import { PlayerData } from './Data/PlayerData';
import { CardLibrary } from './Data/CardLibrary';
const { ccclass, property } = _decorator;

/**
 * App主场景逻辑
 */
@ccclass('Main')
export class Main extends Component {

    // 定义开始游戏按钮
    @property({ type: Button })
    public startBtn: Button = null!;

    // 玩家数据对象
    private _playerData: PlayerData = PlayerData.getInstance();
    // 卡池数据对象
    private _cardLibrary: CardLibrary = CardLibrary.getInstance();

    start() {
        // 初始化卡片库
        this._cardLibrary.initCardLibrary();
        // 监听开始游戏按钮的点击事件
        this.startBtn.node.on('click', this.onStartBtnClick, this);
    }

    update(deltaTime: number) {

    }

    /** 开始游戏按钮点击响应 */
    onStartBtnClick() {
        // 进入游戏场景 GameScene
        director.loadScene('GameScene');
    }

}


