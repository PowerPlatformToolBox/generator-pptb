import React, { useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  Button,
  Input,
  Text,
  Label,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import {
  Search24Regular,
  Add24Regular,
  Edit24Regular,
  Delete24Regular,
  Database24Regular,
} from "@fluentui/react-icons";

interface DataverseAPIDemoProps {
  connection: ToolBoxAPI.DataverseConnection | null;
  onLog: (
    message: string,
    type?: "info" | "success" | "warning" | "error"
  ) => void;
}

const useStyles = makeStyles({
  card: {
    maxWidth: "100%",
    width: "100%",
  },
  content: {
    padding: tokens.spacingVerticalM,
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalL,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  buttonGroup: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    flexWrap: "wrap",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
    maxWidth: "400px",
  },
  output: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
    backgroundColor: tokens.colorNeutralBackground3,
    padding: tokens.spacingVerticalM,
    borderRadius: tokens.borderRadiusMedium,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    minHeight: "100px",
    maxHeight: "300px",
    overflowY: "auto",
  },
});

export const DataverseAPIDemo: React.FC<DataverseAPIDemoProps> = ({
  connection,
  onLog,
}) => {
  const styles = useStyles();
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
    <Card className={styles.card}>
      <CardHeader
        header={
          <Text weight="semibold" size={400}>
            💾 Dataverse API Examples
          </Text>
        }
      />
      <div className={styles.content}>
        <div className={styles.section}>
          <Text weight="semibold">Query Records</Text>
          <Button
            appearance="primary"
            icon={<Search24Regular />}
            onClick={queryAccounts}
          >
            Query Top 10 Accounts
          </Button>
          {queryOutput && <div className={styles.output}>{queryOutput}</div>}
        </div>

        <div className={styles.section}>
          <Text weight="semibold">CRUD Operations</Text>
          <div className={styles.inputGroup}>
            <Label htmlFor="account-name">Account Name:</Label>
            <Input
              id="account-name"
              value={accountName}
              onChange={(_e, data) => setAccountName(data.value)}
              placeholder="Enter account name"
            />
          </div>
          <div className={styles.buttonGroup}>
            <Button
              appearance="primary"
              icon={<Add24Regular />}
              onClick={createAccount}
            >
              Create Account
            </Button>
            <Button
              icon={<Edit24Regular />}
              onClick={updateAccount}
              disabled={!createdAccountId}
            >
              Update Account
            </Button>
            <Button
              appearance="primary"
              icon={<Delete24Regular />}
              onClick={deleteAccount}
              disabled={!createdAccountId}
            >
              Delete Account
            </Button>
          </div>
          {crudOutput && <div className={styles.output}>{crudOutput}</div>}
        </div>

        <div className={styles.section}>
          <Text weight="semibold">Metadata</Text>
          <Button icon={<Database24Regular />} onClick={getAccountMetadata}>
            Get Account Metadata
          </Button>
          {metadataOutput && (
            <div className={styles.output}>{metadataOutput}</div>
          )}
        </div>
      </div>
    </Card>
  );
};
