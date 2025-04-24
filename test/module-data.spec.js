const { test, it } = require('node:test');
const { equal, deepEqual } = require('node:assert');

const { ModuleData } = require('../dist/module-data');

test('module-data', async function() {

    await test('get', async function() {
        const data = new ModuleData({
            test: 1,
        });
        await it('获取存在的数据', () => {
            equal(data.get('test'), 1);
        });
        await it('获取不存在的数据', () => {
            equal(data.get('test2'), undefined);
        });
    });

    await test('set', async function() {
        const data = new ModuleData({
            test: 1,
        });
        await it('更改存在的数据', () => {
            data.set('test', 2);
            equal(data.get('test'), 2);
        });
        await it('更改不存在的数据', () => {
            data.set('test2', 2);
            equal(data.get('test2'), 2);
        });
    });

    await test('addListener', async function() {
        const data = new ModuleData({
            test: 1,
        });
        const stash = {};
        data.addListener('test', (value, legacy) => {
            stash.test = [value, legacy];
        });
        data.addListener('test2', (value, legacy) => {
            stash.test2 = [value, legacy];
        });

        await it('更改存在的数据', () => {
            data.set('test', 2);
            deepEqual(stash.test, [2, 1]);
        });
        await it('更改不存在的数据', () => {
            data.set('test2', 2);
            deepEqual(stash.test2, [2, undefined]);
        });
    });

    await test('removeListener', async function() {
        const data = new ModuleData({
            test: 1,
        });
        const stash = {};
        function testListener(value, legacy) {
            stash.test = [value, legacy];
        }
        data.addListener('test', testListener);
        data.removeListener('test', testListener);
        function test2Listener(value, legacy) {
            stash.test2 = [value, legacy];
        }
        data.addListener('test2', test2Listener);
        data.removeListener('test2', test2Listener);

        await it('更改存在的数据', () => {
            data.set('test', 2);
            deepEqual(stash.test, undefined);
        });
        await it('更改不存在的数据', () => {
            data.set('test2', 2);
            deepEqual(stash.test2, undefined);
        });
    });

    await test('touch', async function() {
        const data = new ModuleData({
            test: 1,
        });
        const stash = {};
        data.addListener('test', (value, legacy) => {
            stash.test = [value, legacy];
        });
        data.addListener('test2', (value, legacy) => {
            stash.test2 = [value, legacy];
        });

        await it('更改存在的数据', () => {
            data.touch('test');
            deepEqual(stash.test, [1, 1]);
        });
        await it('更改不存在的数据', () => {
            data.touch('test2');
            deepEqual(stash.test2, [undefined, undefined]);
        });
    });
});
