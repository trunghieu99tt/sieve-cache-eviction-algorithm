import { SieveCacheLinkedListLib } from "./sieveCacheLinkedListLb";
import { LRUCache } from "lru-cache";
import { LRUCache as MnemonistLRUCache } from "mnemonist";
import { SieveCacheMyLinkedList } from "./sieveCache";
main();

function main() {
    const capacity = 1e5;
    const total = capacity * 10;

    const caches = initCaches(capacity);
    injectDataToCaches(caches, capacity, total);
    const data = createMockDataSet(total);

    const reports = [];
    for (const cache of caches) {
        const benchmarkItem = createBenchmarkForCache(data, cache, total);
        reports.push(benchmarkItem);
    }
    console.table(reports);
}

function createBenchmarkForCache(
    data: string[][],
    cache:
        | SieveCacheLinkedListLib<string, string>
        | LRUCache<{}, {}, unknown>
        | MnemonistLRUCache<string, string>
        | SieveCacheMyLinkedList<string, string>,
    total: number
) {
    const startTime = Date.now();
    let hit = 0;
    let miss = 0;
    for (const element of data) {
        if (cache.get(element[0]) === element[1]) {
            hit += 1;
        } else {
            miss += 1;
            cache.set(element[0], element[1]);
        }
    }
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;
    const qps = Math.round(total / (elapsedTime / 1000));
    const hitRatio = Math.round((hit / (hit + miss)) * 100 * 100) / 100;
    return { cache, hit, miss, hitRatio, qps };
}

function initCaches(capacity: number) {
    const sieveCacheLinkedListLib = new SieveCacheLinkedListLib<string, string>(
        capacity
    );
    const lruCache = new LRUCache({
        max: capacity,
    });
    const mnemonistLRUCache = new MnemonistLRUCache<string, string>(capacity);
    const sieveCache1 = new SieveCacheMyLinkedList<string, string>(capacity);
    return [sieveCacheLinkedListLib, lruCache, mnemonistLRUCache, sieveCache1];
}

function injectDataToCaches(caches: any[], capacity: number, total: number) {
    for (let i = 0; i < capacity; i += 1) {
        const randomIndex = Math.floor(Math.random() * total);
        for (const cache of caches) {
            cache.set(`key${randomIndex}`, `value${randomIndex}`);
        }
    }
}

function createMockDataSet(total: number) {
    const data = [];
    for (let i = 0; i < total; i += 1) {
        const randomIndex = Math.floor(Math.random() * total);
        data.push([`key${randomIndex}`, `value${randomIndex}`]);
    }

    return data;
}
