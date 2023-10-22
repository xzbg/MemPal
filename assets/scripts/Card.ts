import { _decorator, Component, Label, Input, EventMouse, input } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Card')
export class Card extends Component {
    @property({ type: Label })
    public label: Label = null!;

    start() {
        this.label.enabled = false;
        input.on(Input.EventType.MOUSE_UP, this.onClick, this);
    }

    onClick(event: EventMouse) {
        if (event.getCurrentTarget() === this.node) {
            console.info("click on card");
            this.label.enabled = !this.label.enabled;
        }
    }

    update(deltaTime: number) {

    }
}


