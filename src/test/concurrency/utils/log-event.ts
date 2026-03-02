
export interface LogEvent {
    index: string;
    event: 'start' | 'stop';
    timestamp: ReturnType<Performance["now"]>;
}
