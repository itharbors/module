import type { TModule } from './types';

import { ModuleContainer } from './module';

/**
 * 创建于一个模块容器
 * @param module 
 * @returns 
 */
export const generateModule = function<C extends {} = {}>(module: TModule<C>) {
    const container = new ModuleContainer<C>(module);
    return container;
};

export type { TModule} from './types';

export { ModuleContainer } from './module';
