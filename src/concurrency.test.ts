import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

// DEF

export async function concurrentFetch(reqs: string[], max_concurrency: number): Promise<Response[]> {
    const tasks = reqs.map((r) => (() => fetch(r)));
    const responses: Response[] = [];

    let lastReq = 0;

    async function worker() {
        while (lastReq < tasks.length) {
            const current = lastReq++;
            responses[current] = await tasks[current]();
        }
    }

    const pool = Array.from({ length: max_concurrency }).map(worker);
    await Promise.allSettled(pool);

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
            json: { resp },
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

    // could test order

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
});