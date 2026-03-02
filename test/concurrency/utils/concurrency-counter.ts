import { LogEvent } from './log-event';

export class ConcurrencyCounter {

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
