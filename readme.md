# Module System

一个简易的模块管理系统，主要职责：
1. 管理模块列表
2. 管理模块的生命周期
3. 定义模块间的交互方式

# 模块设计文档: Module System

[![NPM](https://img.shields.io/npm/v/@itharbors/module)](https://www.npmjs.com/package/@itharbors/module)
[![CI Status](https://github.com/itharbors/module/actions/workflows/ci.yaml/badge.svg)](https://github.com/itharbors/module/actions/workflows/ci.yaml)

一个简易的模块管理系统，主要职责：
1. 管理模块列表
2. 管理模块的生命周期
3. 定义模块间的交互方式

## 需求分析

### 功能需求

- 管理模块的生命周期函数
    - register、load、unload、unregister
- 管理模块对外暴露的方法
    - 将所有方法收敛到一个出入口
- 简易的数据管理
    - 定义、修改数据
    - 数据变化的监听
- 对象上的缓存数据管理

### 非功能需求

- 无

## 整体架构设计

## 代码范例

### 基础用法

```ts
import { generateModule } from '@itharbors/module';

export const instance = generateModule({
    stash(): {} {
        return {};
    },

    data(): {} {
        return {};
    },

    register() {

    },

    register() {

    },

    load() {

    },

    unload() {

    },

    method: {
        async test(num: string) {
            return num + 1;
        }
    },
});


instance.run('register');
instance.run('load');
instance.run('unload');
instance.run('unregister');

const num = await instance.execture('test', 1); // 2
```

```ts
// params 是 initWorkflow 时传入的那个 params
// 主要用于项目内控制部分流程，比如构建的时候只构建脚本、只构建样式等功能
exports.remove = function(params) {
    return ['./dist'];
};
exports.npm = function(params) {
    return [{
        message: '安装依赖',
        path: './',
        params: ['install'],
        detail: '依赖安装失败，请检查网络和配置',
    }];
};
exports.tsc = function(params) {
    return ['./'];
};
```

### 配置文件

### 注册自定义任务

```ts
import { readFile } from 'fs';
import { ModuleContainer, TModule } from '@itharbors/module';

export class Plugin extends ModuleContainer {
    public info: TPluginInfo;
    public path: string;

    constructor(path: string) {
        const pkg = require(join(path, 'package.json'));
        const module = require(pkg.main) as Partial<TModule>;
        super({
            stash: module.stash || function () { return {}; },
            data: module.data || function () { return {}; },
            method: module.method || {},
        });
    }
}
```

## 决策点

- 无

## 异常处理设计

- 无

## 性能优化

- 无

## 附件与参考文档

- 无