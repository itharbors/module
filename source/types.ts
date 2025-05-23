import type { ModuleData } from './module-data.ts';

// Methods 属性的定义
export type TMethod = Record<string, (...args: any) => any>;

// Data 属性的定义
export type TData = Record<string, any>;

// Stash 属性的定义
export type TStash = Record<string, any>;

// 生命周期的钩子列表
export type TModuleLifeCycleKeys = 'register' | 'unregister' | 'load' | 'unload';

export type TModuleStatus = 'idle' | 'pendding' | 'running';

// 模块生命周期相关函数
export type TModuleLifeCycle = {
    // 生命周期函数
    [lifecycle in TModuleLifeCycleKeys]?: () => void;
}

// 模块扩展数据相关属性
export type TModuleExtraData<C, M, D, S> = {
    // 方法集合
    method: M;

    // 返回实例的数据
    data: D;

    // 暂存区域，一般放一些临时对象，例如 map、array 等缓存
    stash: S;
} & C;

// 聚合模块定义
export type TModule<
    C extends {} = {},
    M = TMethod,
    D extends () => TData = () => TData,
    S extends () => TStash = () => TStash,
> = TModuleLifeCycle & TModuleExtraData<C, M, D, S> & ThisType<ModuleData<ReturnType<D>, ReturnType<S>>>;
