import React, { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";

interface DataverseAPIDemoProps {
  connection: ToolBoxAPI.DataverseConnection | null;
  onLog: (
    message: string,
    type?: "info" | "success" | "warning" | "error"
  ) => void;
}

export const DataverseAPIDemo: React.FC<DataverseAPIDemoProps> = ({
  connection,
  onLog,
}) => {
  const [accountName, setAccountName] = useState("Sample Account");
  const [createdAccountId, setCreatedAccountId] = useState<string | null>(null);
  const [queryOutput, setQueryOutput] = useState("");
  const [crudOutput, setCrudOutput] = useState("");
  const [metadataOutput, setMetadataOutput] = useState("");

  const showNotification = useCallback(
    async (
      title: string,
      body: string,
      type: "success" | "info" | "warning" | "error"
    ) => {
      try {
        await window.toolboxAPI.utils.showNotification({
          title,
          body,
          type,
          duration: 3000,
        });
      } catch (error) {
        console.error("Error showing notification:", error);
      }
    },
    []
  );

  const queryAccounts = useCallback(async () => {
    if (!connection) {
      await showNotification(
        "No Connection",
        "Please connect to a Dataverse environment",
        "warning"
      );
      return;
    }

    try {
      setQueryOutput("Querying accounts...\n");

      const fetchXml = `
<fetch top="10">
  <entity name="account">
    <attribute name="name" />
    <attribute name="accountid" />
    <attribute name="emailaddress1" />
    <attribute name="telephone1" />
    <order attribute="name" />
  </entity>
</fetch>
            `.trim();

      const result = await window.dataverseAPI.fetchXmlQuery(fetchXml);

      let output = `Found ${result.value.length} account(s):\n\n`;
      result.value.forEach((account: any, index: number) => {
        output += `${index + 1}. ${account.name}\n`;
        output += `   ID: ${account.accountid}\n`;
        if (account.emailaddress1)
          output += `   Email: ${account.emailaddress1}\n`;
        if (account.telephone1) output += `   Phone: ${account.telephone1}\n`;
        output += "\n";
      });

      setQueryOutput(output);
      onLog(`Queried ${result.value.length} accounts`, "success");
    } catch (error) {
      const errorMsg = `Error: ${(error as Error).message}`;
      setQueryOutput(errorMsg);
      onLog(`Error querying accounts: ${(error as Error).message}`, "error");
    }
  }, [connection, onLog, showNotification]);

  const createAccount = useCallback(async () => {
    if (!connection) {
      await showNotification(
        "No Connection",
        "Please connect to a Dataverse environment",
        "warning"
      );
      return;
    }

    try {
      setCrudOutput("Creating account...\n");

      const result = await window.dataverseAPI.create("account", {
        name: accountName,
        emailaddress1: "sample@example.com",
        telephone1: "555-0100",
        description: "Created by React Sample Tool",
      });

      setCreatedAccountId(result.id);

      const output = `Account created successfully!\n\nID: ${result.id}\nName: ${accountName}\n`;
      setCrudOutput(output);

      await showNotification(
        "Account Created",
        `Account "${accountName}" created successfully`,
        "success"
      );
      onLog(`Account created: ${result.id}`, "success");
    } catch (error) {
      const errorMsg = `Error: ${(error as Error).message}`;
      setCrudOutput(errorMsg);
      onLog(`Error creating account: ${(error as Error).message}`, "error");
    }
  }, [connection, accountName, onLog, showNotification]);

  const updateAccount = useCallback(async () => {
    if (!createdAccountId) {
      await showNotification(
        "No Account",
        "Please create an account first",
        "warning"
      );
      return;
    }

    try {
      setCrudOutput("Updating account...\n");

      await window.dataverseAPI.update("account", createdAccountId, {
        description:
          "Updated by React Sample Tool at " + new Date().toISOString(),
        telephone1: "555-0200",
      });

      const output = `Account updated successfully!\n\nID: ${createdAccountId}\nUpdated fields: description, telephone1\n`;
      setCrudOutput(output);

      await showNotification(
        "Account Updated",
        "Account updated successfully",
        "success"
      );
      onLog(`Account updated: ${createdAccountId}`, "success");
    } catch (error) {
      const errorMsg = `Error: ${(error as Error).message}`;
      setCrudOutput(errorMsg);
      onLog(`Error updating account: ${(error as Error).message}`, "error");
    }
  }, [createdAccountId, onLog, showNotification]);

  const deleteAccount = useCallback(async () => {
    if (!createdAccountId) {
      await showNotification(
        "No Account",
        "Please create an account first",
        "warning"
      );
      return;
    }

    try {
      setCrudOutput("Deleting account...\n");

      await window.dataverseAPI.delete("account", createdAccountId);

      const output = `Account deleted successfully!\n\nID: ${createdAccountId}\n`;
      setCrudOutput(output);

      await showNotification(
        "Account Deleted",
        "Account deleted successfully",
        "success"
      );
      onLog(`Account deleted: ${createdAccountId}`, "success");
      setCreatedAccountId(null);
    } catch (error) {
      const errorMsg = `Error: ${(error as Error).message}`;
      setCrudOutput(errorMsg);
      onLog(`Error deleting account: ${(error as Error).message}`, "error");
    }
  }, [createdAccountId, onLog, showNotification]);

  const getAccountMetadata = useCallback(async () => {
    if (!connection) {
      await showNotification(
        "No Connection",
        "Please connect to a Dataverse environment",
        "warning"
      );
      return;
    }

    try {
      setMetadataOutput("Retrieving metadata...\n");

      const metadata = await window.dataverseAPI.getEntityMetadata(
        "account",
        true
      );

      let output = "Account Entity Metadata:\n\n";
      output += `Logical Name: ${metadata.LogicalName}\n`;
      output += `Metadata ID: ${metadata.MetadataId}\n`;
      output += `Display Name: ${
        metadata.DisplayName?.LocalizedLabels?.[0]?.Label || "N/A"
      }\n`;
      output += `Attributes: ${metadata.Attributes?.length || 0}\n`;

      if (metadata.Attributes && metadata.Attributes.length > 0) {
        output += "\nSample Attributes:\n";
        metadata.Attributes.slice(0, 5).forEach((attr: any) => {
          output += `  - ${attr.LogicalName} (${attr.AttributeType})\n`;
        });
      }

      setMetadataOutput(output);
      onLog("Account metadata retrieved", "success");
    } catch (error) {
      const errorMsg = `Error: ${(error as Error).message}`;
      setMetadataOutput(errorMsg);
      onLog(`Error getting metadata: ${(error as Error).message}`, "error");
    }
  }, [connection, onLog, showNotification]);

  return (
    <Card
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <StorageIcon />
          <Typography variant="h6">Dataverse API Examples</Typography>
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Query Records
          </Typography>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={queryAccounts}
            sx={{ mb: 2 }}
          >
            Query Top 10 Accounts
          </Button>
          {queryOutput && (
            <Paper
              variant="outlined"
              sx={{ p: 2, bgcolor: "background.default" }}
            >
              <Typography
                variant="body2"
                component="pre"
                sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap", m: 0 }}
              >
                {queryOutput}
              </Typography>
            </Paper>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            CRUD Operations
          </Typography>
          <Box mb={2}>
            <TextField
              label="Account Name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Enter account name"
              fullWidth
              size="small"
            />
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mb={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={createAccount}
            >
              Create Account
            </Button>
            <Button
              variant="contained"
              color="info"
              startIcon={<EditIcon />}
              onClick={updateAccount}
              disabled={!createdAccountId}
            >
              Update Account
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={deleteAccount}
              disabled={!createdAccountId}
            >
              Delete Account
            </Button>
          </Stack>
          {crudOutput && (
            <Paper
              variant="outlined"
              sx={{ p: 2, bgcolor: "background.default" }}
            >
              <Typography
                variant="body2"
                component="pre"
                sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap", m: 0 }}
              >
                {crudOutput}
              </Typography>
            </Paper>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Metadata
          </Typography>
          <Button
            variant="outlined"
            startIcon={<InfoIcon />}
            onClick={getAccountMetadata}
            sx={{ mb: 2 }}
          >
            Get Account Metadata
          </Button>
          {metadataOutput && (
            <Paper
              variant="outlined"
              sx={{ p: 2, bgcolor: "background.default" }}
            >
              <Typography
                variant="body2"
                component="pre"
                sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap", m: 0 }}
              >
                {metadataOutput}
              </Typography>
            </Paper>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
