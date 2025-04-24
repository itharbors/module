import type { TModule, TMethod, TData, TStash } from './types';

import { ModuleContainer } from './module';

/**
 * 创建于一个模块容器
 * @param module 
 * @returns 
 */
export function generateModule<M extends TMethod, D extends () => TData, S extends () => TStash>(module: TModule<M, D, S>) {
    const container = new ModuleContainer(module);
    return container;
}

export type { TModule, TMethod, TData, TStash } from './types';

export { ModuleContainer } from './module';
