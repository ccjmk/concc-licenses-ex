import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

export async function concurrentFetch(reqs: string[], maxConcurrency: number): Promise<Response[]> {
    if (maxConcurrency < 1) {
        throw new Error("maxConcurrency needs to be a positive integer");
    }
    maxConcurrency = Math.floor(maxConcurrency);

    // not considering invalid URLs / failed fetches for simplicity, focus is on concurrency
    const responses: Response[] = [];

    let lastReq = 0;

    async function worker() {
        while (lastReq < reqs.length) {
            const current = lastReq++;
            if (current >= reqs.length) return;
            responses[current] = await fetch(reqs[current]);
        }
    }

    const poolSize = Math.min(maxConcurrency, reqs.length);
    const pool = Array.from({ length: poolSize }).map(worker);
    await Promise.all(pool); // to consider allSettled

    return responses;
}

// TEST
interface LogEvent {
    index: string;
    event: 'start' | 'stop',
    timestamp: ReturnType<Performance["now"]>
}

class ConcurrencyCounter {

    private count = 0;

    private _max = 0;
    get max() {
        return this._max;
    }

    private _log: LogEvent[] = [];
    get log() {
        return [...this._log];
    }

    reset() {
        this.count = 0;
        this._max = 0;
        this._log = [];
    }

    start(i: string) {
        this._log.push({
            index: i,
            event: 'start',
            timestamp: performance.now()
        });

        this.count++;
        if (this.count > this.max) {
            this._max = this.count;
        }
    }

    stop(i: string) {
        this._log.push({
            index: i,
            event: 'stop',
            timestamp: performance.now()
        });

        this.count--;
    }
}

function pause(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    });
}

describe('Concurrent fetch', () => {
    const concurrencyManager = new ConcurrencyCounter();

    const fetchMock = vi.fn().mockImplementation(async (args) => {
        const i = (args + "").substring(3);
        concurrencyManager.start(i);

        await pause(1);

        const resp = "resp-" + i;
        concurrencyManager.stop(i);

        return {
            ok: true,
            status: 200,
            json: async () => ({ resp }),
        }
    })

    beforeAll(() => {
        vi.stubGlobal(
            'fetch',
            fetchMock,
        )
    })

    beforeEach(() => {
        fetchMock.mockClear();
        concurrencyManager.reset();
    })

    it('throws error if maxConcurrency is not positive', async () => {
        const reqs: string[] = [];
        const ZERO_CONCURRENCY = 0;
        const NEGATIVE_CONCURRENCY = -1;

        await expect(() => concurrentFetch(reqs, ZERO_CONCURRENCY))
            .rejects
            .toThrowError("maxConcurrency needs to be a positive integer");
        await expect(() => concurrentFetch(reqs, NEGATIVE_CONCURRENCY))
            .rejects
            .toThrowError("maxConcurrency needs to be a positive integer");
        expect(fetchMock).toBeCalledTimes(0);
    })

    it('returns empty resp array for empty request array', async () => {
        const reqs: string[] = [];
        const MAX_CONCURRENCY = 2;

        const resps = await concurrentFetch(reqs, MAX_CONCURRENCY);

        expect(resps).lengthOf(0);
        expect(fetchMock).toBeCalledTimes(0);
    })

    it('executes all requests from array', async () => {
        const reqs = ["url1", "url2", "url3", "url4", "url5"];
        const MAX_CONCURRENCY = 2;

        const resps = await concurrentFetch(reqs, MAX_CONCURRENCY);

        expect(resps).lengthOf(reqs.length);
        expect(fetchMock).toBeCalledTimes(reqs.length);
    })

    it('responses are ordered', async () => {
        const reqs = ["url1", "url2", "url3", "url4", "url5"];
        const MAX_CONCURRENCY = 2;

        const resps = await concurrentFetch(reqs, MAX_CONCURRENCY);

        // fetchMock uses indexes, matching by that for test's sake
        for (let i = 0; i < resps.length; i++) {
            const json = await resps[i].json();
            expect(json["resp"]).toBe(`resp-${i + 1}`);
        };
    })

    it('runs two requests at a time from the request array', async () => {
        const reqs = ["url1", "url2", "url3", "url4", "url5"];
        const MAX_CONCURRENCY = 2;

        await concurrentFetch(reqs, MAX_CONCURRENCY);

        expect(concurrencyManager.max).toBe(MAX_CONCURRENCY);
    })

    it('3rd request starts as soon as either 1st or 2nd is finished', async () => {
        const reqs = ["url1", "url2", "url3"];
        const MAX_CONCURRENCY = 2;

        await concurrentFetch(reqs, MAX_CONCURRENCY);

        const eventLog = concurrencyManager.log;
        const firstStopIndex = eventLog.findIndex(ev => ev.event === "stop");
        const stopEvent = eventLog[firstStopIndex];
        const nextEvent = eventLog[firstStopIndex + 1];
        expect(nextEvent.event).toBe("start");
        expect(nextEvent.timestamp - stopEvent.timestamp).toBeLessThanOrEqual(1); //ms
    })

    it('more concurrency than request runs at most all requets', async () => {
        const reqs = ["url1", "url2", "url3"];
        const MAX_CONCURRENCY = 5;

        await concurrentFetch(reqs, MAX_CONCURRENCY);

        expect(concurrencyManager.max).toBe(reqs.length);
    })
});