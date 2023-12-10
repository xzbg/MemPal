import { _decorator, debug, resources } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ConfigLoader')
export class ConfigLoader extends Object {
    private static _instance: ConfigLoader = null!;
    private _configMap: Map<string, any> = new Map<string, any>();

    public static getInstance(): ConfigLoader {
        if (this._instance == null) {
            this._instance = new ConfigLoader();
        }
        return this._instance;
    }

    /** 加载配置文件 */
    public loadConfig(configName: string, callback: Function) {
        console.log("loadConfig: " + configName);
        if (this._configMap.has(configName)) {
            callback(this._configMap.get(configName));
            return;
        }
        resources.load("Config/" + configName, (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            this._configMap.set(configName, data);
            callback(data);
        });
    }
}