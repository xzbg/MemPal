import { _decorator } from 'cc';
const { ccclass } = _decorator;


/**
 *  玩家数据存储
 */
@ccclass('PlayerData')
export class PlayerData extends Object {

    // 单例模式的全局对象
    private static _instance: PlayerData = null;

    // 获取单例对象
    public static getInstance(): PlayerData {
        if (this._instance == null) {
            this._instance = new PlayerData();
        }
        return this._instance;
    }

    // 玩家名称
    public payerName: string = null;
    // 当前难度
    public difficulty: number = 0
    // 挑战的关卡数
    public challenge: number = 0
    // 当前积分数
    public score: number = 0
    // 记忆时间
    public timerLimit: number = 0

    /** 游戏数据设置 */
    // 格子显示的行列数
    public row: number = 4;
    public col: number = 4;

    // 卡片类型
    public cardType: number = 0;


    // 增加积分
    public addScore(score: number) {
        this.score += score;
    }

    // 设置名称
    public setName(name: string) {
        this.payerName = name;
    }

    // 选择难度
    public setDifficulty(difficulty: number) {
        this.difficulty = difficulty;
    }

    // 获取格子的行列数
    public getRow(): number {
        return this.row;
    }

    // 获取格子的行列数
    public getCol(): number {
        return this.col;
    }

    // 检查是否通过当前关卡
    public checkPass(): boolean {
        return this.score >= this.challenge;
    }
}


