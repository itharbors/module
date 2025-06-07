import type { TModuleLifeCycleKeys, TModuleStatus, TModule, TMethod, TData } from './types';

import { ModuleData } from './module-data';

/**
 * 模块的容器
 */
export class ModuleContainer<C extends {} = {}, M extends TMethod = TMethod, D extends () => TData = () => TData> {
    private _module: TModule<C, M, D>;
    private _data: ModuleData<D>;

    // 暂存区域，一般放一些临时对象，例如 map、array 等缓存
    // 生命周期函数、method 函数里可以使用 this 来访问
    public stash: C = {} as C;

    // 模块容器状态
    public status: TModuleStatus = 'idle';

    constructor(module: TModule<C, M, D>) {
        this._module = module;
        const data = module.data() as D;
        this._data = new ModuleData<D>(data);
        // @ts-ignore
        this.stash.data = this._data;
    }

    /**
     * 执行一个生命周期函数
     * @param name 
     */
    public async run(name: TModuleLifeCycleKeys) {
        switch (name) {
            case 'register':
                if (this.status !== 'idle') {
                    throw new Error('The life cycle cannot be executed');
                }
                if (this._module.register) {
                    await this._module.register?.call(this.stash);
                }
                this.status = 'pendding';
                break;
            
            case 'load':
                if (this.status !== 'pendding') {
                    throw new Error('The life cycle cannot be executed');
                }
                if (this._module.load) {
                    await this._module.load?.call(this.stash);
                }
                this.status = 'running';
                break;
            
            case 'unload':
                if (this.status !== 'running') {
                    throw new Error('The life cycle cannot be executed');
                }
                if (this._module.unload) {
                    await this._module.unload?.call(this.stash);
                }
                this.status = 'pendding';
                break;

            case 'unregister':
                if (this.status !== 'pendding') {
                    throw new Error('The life cycle cannot be executed');
                }
                if (this._module.unregister) {
                    await this._module.unregister?.call(this.stash);
                }
                this.status = 'idle';
                break;
        }
    }

    /**
     * 执行一个 methods 里的函数
     * @param name 
     */
    public async execture<K extends keyof M>(name: K, ...args: Parameters<M[K]>): Promise<ReturnType<M[K]>> {
        const methods = this._module['method'] as M;
        const result = await methods[name].call(this.stash, ...args);
        return result;
    }
}
