import { _decorator, Button, Component, director } from 'cc';
const { ccclass, property } = _decorator;

/**
 * App主场景逻辑
 */
@ccclass('Main')
export class Main extends Component {

    // 定义开始游戏按钮
    @property({ type: Button })
    public startBtn: Button = null!;

    start() {
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


