import type { TModuleLifeCycleKeys, TModuleStatus, TModule, TMethod, TData, TStash } from './types';

import { ModuleData } from './module-data';

/**
 * 模块的容器
 */
export class ModuleContainer<M extends TMethod = TMethod, D extends () => TData = () => TData, S extends () => TStash = () => TStash> {
    private _module: TModule<M, D, S>;
    private _intance: ModuleData<D, S>;

    public status: TModuleStatus = 'idle';

    constructor(module: TModule<M, D, S>) {
        this._module = module;
        const data = module.data() as D;
        const stash = module.stash() as S;
        this._intance = new ModuleData<D, S>(data, stash);
    }

    /**
     * 执行一个生命周期函数
     *
     * @param name 
     */
    public async run(name: TModuleLifeCycleKeys) {
        switch (name) {
            case 'register':
                if (this.status !== 'idle') {
                    throw new Error('The life cycle cannot be executed');
                }
                if (this._module[name]) {
                    await this._module[name]?.call(this._intance);
                }
                this.status = 'pendding';
                break;
            
            case 'load':
                if (this.status !== 'pendding') {
                    throw new Error('The life cycle cannot be executed');
                }
                if (this._module[name]) {
                    await this._module[name]?.call(this._intance);
                }
                this.status = 'running';
                break;
            
            case 'unload':
                if (this.status !== 'running') {
                    throw new Error('The life cycle cannot be executed');
                }
                if (this._module[name]) {
                    await this._module[name]?.call(this._intance);
                }
                this.status = 'pendding';
                break;

            case 'unregister':
                if (this.status !== 'pendding') {
                    throw new Error('The life cycle cannot be executed');
                }
                if (this._module[name]) {
                    await this._module[name]?.call(this._intance);
                }
                this.status = 'idle';
                break;
        }
    }

    /**
     * 执行一个 methods 里的函数
     *
     * @param name 
     */
    public async execture<K extends keyof M>(name: K, ...args: Parameters<M[K]>): Promise<ReturnType<M[K]>> {
        const methods = this._module['method'] as M;
        const result = await methods[name].call(this._intance, ...args);
        return result;
    }
}
