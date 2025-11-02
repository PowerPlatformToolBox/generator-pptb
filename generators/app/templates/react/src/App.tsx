import { useCallback, useEffect } from "react";
import { ConnectionStatus } from "./components/ConnectionStatus";
import { DataverseAPIDemo } from "./components/DataverseAPIDemo";
import { EventLog } from "./components/EventLog";
import { ToolboxAPIDemo } from "./components/ToolboxAPIDemo";
import { useConnection, useEventLog, useToolboxEvents } from "./hooks/useToolboxAPI";

function App() {
    const { connection, isLoading, refreshConnection } = useConnection();
    const { logs, addLog, clearLogs  } = useEventLog();

    // Handle platform events
    const handleEvent = useCallback(
        (event: string, _data: any) => {
            switch (event) {
                case 'connection:updated':
                case 'connection:created':
                    refreshConnection();
                    break;

                case 'connection:deleted':
                    refreshConnection();
                    break;

                case 'terminal:output':
                case 'terminal:command:completed':
                case 'terminal:error':
                    // Terminal events handled by dedicated components
                    break;
            }
        },
        [refreshConnection]
    );

    useToolboxEvents(handleEvent);

    // Add initial log (run only once on mount)
    useEffect(() => {
        addLog('React Sample Tool initialized', 'success');
    }, [addLog]);

    return (
        <>
            <header className="header">
                <h1>⚛️ React Sample Tool</h1>
                <p className="subtitle">A complete example of building Power Platform Tool Box tools with React & TypeScript</p>
            </header>

            <ConnectionStatus connection={connection} isLoading={isLoading} />
 
            <ToolboxAPIDemo onLog={addLog} />

            <DataverseAPIDemo connection={connection} onLog={addLog} />

            <EventLog logs={logs} onClear={clearLogs} />
        </>
    );
}

export default App;
