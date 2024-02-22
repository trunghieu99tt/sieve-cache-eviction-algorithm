class Item<K, V> {
    key: K;
    value: V;
    visited: boolean;
    prev: Item<K, V> | null;
    next: Item<K, V> | null;

    constructor(key: K, value: V) {
        this.key = key;
        this.value = value;
        this.visited = false;
        this.prev = null;
        this.next = null;
    }
}

export class SieveCacheMyLinkedList<K, V> {
    capacity: number;
    cache: Map<K, Item<K, V>>;
    head: Item<K, V> | null;
    tail: Item<K, V> | null;
    hand: Item<K, V> | null;
    currentSize: number;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map();
        this.head = null;
        this.tail = null;
        this.hand = null;
        this.currentSize = 0;
    }

    removeNode(node: Item<K, V>) {
        if (node.prev) {
            node.prev.next = node.next;
        } else {
            this.head = node.next;
        }

        if (node.next) {
            node.next.prev = node.prev;
        } else {
            this.tail = node.prev;
        }
    }

    addToHead(node: Item<K, V>) {
        node.prev = null;
        node.next = this.head;
        if (this.head) {
            this.head.prev = node;
        }
        if (!this.tail) {
            this.tail = node;
        }
        this.head = node;
        this.currentSize += 1;
    }

    evict() {
        let obj = this.hand ?? this.tail;
        while (obj?.visited) {
            obj.visited = false;
            obj = obj.prev;
        }
        this.hand = obj?.prev ?? null;
        if (obj) {
            this.cache.delete(obj.key);
            this.removeNode(obj);
            this.currentSize -= 1;
        }
    }

    get(key: K) {
        if (this.cache.has(key)) {
            const node = this.cache.get(key);
            if (node) {
                node.visited = true;
                return node.value;
            }
        }

        return null;
    }

    set(key: K, value: V) {
        if (this.cache.has(key)) {
            const node = this.cache.get(key);
            if (node) {
                node.visited = true;
                node.value = value;
                return;
            }
        }

        if (this.currentSize >= this.capacity) {
            this.evict();
        }
        const newNode = new Item(key, value);
        this.cache.set(key, newNode);
        this.addToHead(newNode);
    }
}
