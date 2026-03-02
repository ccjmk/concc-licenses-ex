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