type FetchResult =
    | { ok: true; response: Response }
    | { ok: false; error: unknown }
    | { ok: false; response: Response };

export async function concurrentFetch(reqs: string[], maxConcurrency: number): Promise<FetchResult[]> {
    const concurrency = Math.floor(maxConcurrency);
    if (concurrency < 1) {
        throw new Error("maxConcurrency needs to be a positive integer");
    }

    const responses: FetchResult[] = new Array(reqs.length);

    let lastReq = 0;

    async function worker() {
        while (lastReq < reqs.length) {
            const current = lastReq++;
            if (current >= reqs.length) return;
            try {
                const response = await fetch(reqs[current]);
                if (!response.ok) {
                    responses[current] = { ok: false, response };
                } else {
                    responses[current] = { ok: true, response };
                }
            } catch (error) {
                responses[current] = { ok: false, error };
            }

        }
    }

    const poolSize = Math.min(concurrency, reqs.length);
    const pool = Array.from({ length: poolSize }, worker);
    await Promise.all(pool);

    return responses;
}
