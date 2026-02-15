export type LogEntry = {
    timestamp: Date;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
};

export class EventLogStore {
    logs = $state<LogEntry[]>([]);

    addLog = (message: string, type: LogEntry['type'] = 'info') => {
        this.logs = [
            { timestamp: new Date(), message, type },
            ...this.logs,
        ].slice(0, 50);

        console.log(`[${type.toUpperCase()}] ${message}`);
    }

    clearLogs = () => {
        this.logs = [];
    }
}
