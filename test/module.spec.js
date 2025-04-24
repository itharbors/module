const { test, it } = require('node:test');
const { equal, deepEqual } = require('node:assert');

const { ModuleContainer } = require('../dist/module');

test('module', async function() {

    await test('run', async function() {
        const results = [];
        const module = new ModuleContainer({
            async register() { results.push('register'); },
            async unregister() { results.push('unregister'); },
            async load() { results.push('load'); },
            async unload() { results.push('unload'); },
            data() {
                return {};
            },
            stash() {
                return {};
            },
            method: {},
        });

        await it('register', async () => {
            await module.run('register');
            equal(results[results.length - 1], 'register');
        });
        await it('load', async () => {
            await module.run('load');
            equal(results[results.length - 1], 'load');
        });
        await it('unload', async () => {
            await module.run('unload');
            equal(results[results.length - 1], 'unload');
        });
        await it('unregister', async () => {
            await module.run('unregister');
            equal(results[results.length - 1], 'unregister');
        });
    });

    await test('execture', async function() {
        const results = [];
        const module = new ModuleContainer({
            async register() {},
            async unregister() {},
            async load() {},
            async unload() {},
            data() {
                return {};
            },
            stash() {
                return {};
            },
            method: {
                async test(num) {
                    return num + 1;
                },
            },
        });

        await it('result', async () => {
            const num = await module.execture('test', 1);
            equal(num, 2);
        });
    });
});
