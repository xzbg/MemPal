import { _decorator, Component, EventMouse, Input, debug, Node, input, Layout, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    @property({ type: Layout })
    public layout: Layout = null!;
    @property({ type: Prefab })
    public cardPrefab: Prefab = null!;
    @property({ type: Number })
    public size_num: number = 0;

    start() {
        console.info('hello world!');
        for (let i = 0; i < this.size_num; i++) {
            const card = instantiate(this.cardPrefab);
            this.layout.node.addChild(card);
        }

    }

    update(deltaTime: number) {

    }

    onMouseUp(event: EventMouse) {
        console.info("onMouseUp");
    }

    onStartBtnClick() {
        // 输出点击日志
        console.info("startBtn clicked");
    }
}


