/**
 * 简单的数据管理器
 * 负责管理数据，修改数据以及发送数据的修改事件
 */
export class ModuleData<Data, Stash> {

    public stash: Stash;

    constructor(data: Data, stash: Stash) {
        this._data = data as Data;
        this.stash = stash;

    }

    private propertyEventMap: Partial<Record<keyof Data, ((value: any, legacy: any) => void)[]>> = {};

    // _data data

    private _data: Data;

    /**
     * 触发一个属性的变更事件
     * 
     * 此方法用于触发特定属性的变更事件它通过获取当前属性的值，并以该值为参数，
     * 触发该属性的变更事件，以便界面或其他监听此事件的组件能够做出相应的更新
     * 
     * @param key 要触发变更事件的属性键名，该属性键名是泛型K的一个实例，K是T对象的键的子集
     */
    public touch<K extends keyof Data>(key: K) {
        // 获取当前属性的值
        const legacy = this.get(key);
        // 使用获取的值触发属性的变更事件
        this._emit(key, legacy, legacy);
    }

    /**
     * 根据给定的键获取默认数据中的值
     * 
     * 此函数的作用是从默认数据中提取特定的值，通过键来访问
     * 它确保了类型安全，通过泛型K指定键的类型，保证了只能够访问默认数据中已定义的键
     * 
     * @param key 要访问的键，必须是默认数据中的一个有效键
     * @returns 返回对应键的值，类型由默认数据中该键的定义决定
     */
    public get<K extends keyof Data>(key: K): Data[K] {
        return this._data[key];
    }


    /**
     * 设置属性值
     * 
     * 此方法用于更新对象的属性值，只有当新值与旧值不相同时才会更新
     * 并且会触发属性变化的事件
     * 
     * @param key 要设置的属性名称
     * @param value 要设置的属性值
     */
    public set<K extends keyof Data>(key: K, value: Data[K]) {
        const legacy = this._data[key];
        if (this._data[key] === value) {
            return;
        }
        this._data[key] = value;
        this._emit(key, value, legacy);
    }

    /**
     * 为指定的属性添加一个监听器，当属性值发生变化时执行监听器中的处理函数
     * 
     * @param key 要监听的属性名称
     * @param handle 当属性值变化时的处理函数，接收新旧值作为参数
     */
    public addListener<K extends keyof Data>(key: K, handle: (value: Data[K], legacy: Data[K]) => void) {
        // 获取当前属性的事件监听列表，如果不存在则初始化为空数组
        const list = this.propertyEventMap[key] = this.propertyEventMap[key] || [];
        // 将新的监听器函数添加到事件监听列表中
        list.push(handle);
    }

    /**
     * 移除指定属性的变更监听器
     * 
     * 此方法用于从属性监听器列表中移除指定的监听函数当属性发生变更时，系统将不再调用被移除的监听函数
     * 
     * @param key 要移除监听器的属性名称泛型K用于指定属性的类型，必须是组件默认数据对象中的一个属性键
     * @param handle 要移除的监听函数，当属性变更时，该函数将被调用
     *               监听函数接收两个参数：当前值和前一个值
     */
    public removeListener<K extends keyof Data>(key: K, handle: (value: Data[K], legacy: Data[K]) => void) {
        // 获取指定属性的监听器列表
        const list = this.propertyEventMap[key];
        if (!list) {
            // 如果没有找到指定属性的监听器列表，则直接返回，不作任何操作
            return;
        }
        // 找到要移除的监听函数在列表中的位置
        const index = list.indexOf(handle);
        if (index !== -1) {
            // 如果找到了要移除的监听函数，则从列表中将其移除
            list.splice(index, 1);
        }
    }

    /**
     * 发送属性变化事件
     * 
     * 此方法用于触发属性变化事件，它会查找与属性相关联的事件监听函数列表，
     * 并逐一调用这些函数，使它们能够响应属性的变化
     * 
     * @param key 变化的属性名称，限定于T对象的键
     * @param value 属性的新值，类型为T[K]
     * @param legacy 属性的旧值，类型为T[K]
     */
    private _emit<K extends keyof Data>(key: K, value: Data[K], legacy: Data[K]) {
        // 根据属性名获取该属性关联的事件监听函数列表
        const list = this.propertyEventMap[key];
        // 如果没有找到对应的监听函数列表，则不执行任何操作，直接返回
        if (!list) {
            return;
        }
        // 遍历并调用每一个监听函数，传递新旧值作为参数
        list.forEach((func) => {
            // 使用组件或对象的根元素作为上下文调用监听函数
            func.call(this, value, legacy);
        });
    }
}
