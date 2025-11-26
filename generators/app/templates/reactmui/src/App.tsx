import { useCallback, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  Stack,
} from "@mui/material";
import { ConnectionStatus } from "./components/ConnectionStatus";
import { DataverseAPIDemo } from "./components/DataverseAPIDemo";
import { EventLog } from "./components/EventLog";
import { ToolboxAPIDemo } from "./components/ToolboxAPIDemo";
import {
  useConnection,
  useEventLog,
  useToolboxEvents,
} from "./hooks/useToolboxAPI";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  const { connection, isLoading, refreshConnection } = useConnection();
  const { logs, addLog, clearLogs } = useEventLog();

  // Handle platform events
  const handleEvent = useCallback(
    (event: string, _data: any) => {
      switch (event) {
        case "connection:updated":
        case "connection:created":
          refreshConnection();
          break;

        case "connection:deleted":
          refreshConnection();
          break;

        case "terminal:output":
        case "terminal:command:completed":
        case "terminal:error":
          // Terminal events handled by dedicated components
          break;
      }
    },
    [refreshConnection]
  );

  useToolboxEvents(handleEvent);

  // Add initial log (run only once on mount)
  useEffect(() => {
    addLog("React Sample Tool initialized", "success");
  }, [addLog]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{ bgcolor: "background.default", minHeight: "100vh", p: "10px" }}
      >
        <Box sx={{ width: "calc(100% - 10px)", mx: "auto" }}>
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h3" component="h1" gutterBottom>
              ⚛️ React Sample Tool
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              A complete example of building Power Platform Tool Box tools with
              React & TypeScript
            </Typography>
          </Box>

          <Stack spacing={4}>
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexDirection: { xs: "column", md: "row" },
                alignItems: "stretch",
              }}
            >
              <Box sx={{ flex: "1 1 0", minWidth: 0, display: "flex" }}>
                <ConnectionStatus
                  connection={connection}
                  isLoading={isLoading}
                />
              </Box>
              <Box sx={{ flex: "1 1 0", minWidth: 0, display: "flex" }}>
                <ToolboxAPIDemo onLog={addLog} />
              </Box>
            </Box>
            <DataverseAPIDemo connection={connection} onLog={addLog} />
            <EventLog logs={logs} onClear={clearLogs} />
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
