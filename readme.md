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

export const instance = generateModule<{
    map: Map<string, string>;
}>({
    data() {
        return {
            num: 10,
        };
    },

    register() {
        this.map = new Map();
    },

    unregister() {

    },

    load() {
        this.map.set('a', 'a');
    },

    unload() {

    },

    method: {
        async test(num: number) {
            this.num += num;
            return this.num;
        }
    },
});


instance.run('register');
instance.run('load');
instance.run('unload');
instance.run('unregister');

const num = await instance.execture('test', 2); // 12
```

## 决策点

- 无

## 异常处理设计

- 无

## 性能优化

- 无

## 附件与参考文档

- 无
