<h1 align="center">SIEVE-JS</h1>

This is a modern cache implementation, **inspired** by the following papers, provides high efficiency.

-   **SIEVE** | [SIEVE is Simpler than LRU: an Efficient Turn-Key Eviction Algorithm for Web Caches](https://junchengyang.com/publication/nsdi24-SIEVE.pdf) (NSDI'24)
-   **S3-FIFO** | [FIFO queues are all you need for cache eviction](https://dl.acm.org/doi/10.1145/3600006.3613147) (SOSP'23)

This offers state-of-the-art efficiency and scalability compared to other LRU-based cache algorithms.

## Basic Usage

```typescript
import { SieveCacheMyLinkedList } from "./sieveCache";

const sieveCache = new SieveCache<string, string>(10);
// set value under key1
sieveCache.set("key1", "value1");

// get value under key1
sieveCache.get("key1");
```
