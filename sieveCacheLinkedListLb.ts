import { LinkList, LinkListIterator } from "@js-sdsl/link-list";

class Item<K, V> {
    key: K;
    value: V;
    visited: boolean;

    constructor(key: K, value: V) {
        this.key = key;
        this.value = value;
        this.visited = false;
    }
}

export class SieveCacheLinkedListLib<K, V> {
    capacity: number;
    cache: Map<K, Item<K, V>>;
    currentQueueSize: number;
    queue: LinkList<Item<K, V>>;
    hand: LinkListIterator<Item<K, V>> | null;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map();
        this.currentQueueSize = 0;
        this.queue = new LinkList();
        this.hand = null;
    }

    evict(): void {
        if (!this.hand?.isAccessible()) {
            this.hand = this.queue.rBegin();
        }
        let i: Item<K, V> = this.hand.pointer;
        while (i?.visited) {
            i.visited = false;
            this.hand.next();
            if (!this.hand.isAccessible()) {
                this.hand = this.queue.rBegin();
            }
            i = this.hand.pointer;
        }
        this.cache.delete(i.key);
        this.queue.eraseElementByIterator(this.hand);
        this.currentQueueSize -= 1;
    }

    set(key: K, value: V): void {
        if (this.cache.has(key)) {
            const item = this.cache.get(key);
            if (item) {
                item.visited = true;
                item.value = value;
                return;
            }
        }

        if (this.currentQueueSize >= this.capacity) {
            this.evict();
        }
        const newItem = new Item<K, V>(key, value);
        this.cache.set(key, newItem);
        this.queue.pushFront(newItem);
        this.currentQueueSize += 1;
    }

    get(key: K): V | null {
        if (this.cache.has(key)) {
            const item = this.cache.get(key);
            if (item) {
                item.visited = true;
                return item.value;
            }
        }

        return null;
    }

    clear(): void {
        this.cache.clear();
        this.queue.clear();
        this.currentQueueSize = 0;
    }
}
