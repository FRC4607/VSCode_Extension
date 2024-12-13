const vscode = require('vscode');
const { Client } = require('ssh2'); // Optional for SFTP implementation
const fs = require('fs');
const path = require('path');

function activate(context) {
    // Create an output channel
    const outputChannel = vscode.window.createOutputChannel('NetworkTables Download');

    let disposable = vscode.commands.registerCommand('extension.downloadNetworkTables', async () => {
        // Get the workspace folder path
        const workspaceFolder = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : null;
        if (!workspaceFolder) {
            outputChannel.appendLine("No workspace folder is open.");
            outputChannel.show();
            return;
        }

        // Path to the .wpilib/wpilib_preferences.json file
        const preferencesFilePath = path.join(workspaceFolder, '.wpilib', 'wpilib_preferences.json');

        // Log the preferences path to check if it's correct
        outputChannel.appendLine(`Looking for wpilib_preferences.json at: ${preferencesFilePath}`);

        // Check if the file exists
        if (!fs.existsSync(preferencesFilePath)) {
            outputChannel.appendLine("Could not find wpilib_preferences.json. Please ensure this is an FRC project.");
            outputChannel.show();
            return;
        }

        // Read and parse the JSON file
        let teamNumber = null;
        try {
            const fileContents = fs.readFileSync(preferencesFilePath, 'utf8');
            const preferences = JSON.parse(fileContents);

            // Retrieve the team number from the JSON file
            teamNumber = preferences.teamNumber || null; // Corrected key is 'teamNumber'
        } catch (err) {
            outputChannel.appendLine(`Error reading wpilib_preferences.json: ${err.message}`);
            outputChannel.show();
            return;
        }

        // If team number isn't found in the file, show an error
        if (!teamNumber) {
            outputChannel.appendLine("Could not find a valid team number in wpilib_preferences.json.");
            outputChannel.show();
            return;
        }

        // Proceed with SFTP download
        const remoteHost = `roboRIO-${teamNumber}-frc.local`;
        const remotePath = "/home/lvuser/networktables.json";
        const localPath = `${workspaceFolder}/networktables.json`;

        outputChannel.appendLine(`Connecting to ${remoteHost}...`);

        const conn = new Client();
        conn
            .on('ready', () => {
                conn.sftp((err, sftp) => {
                    if (err) {
                        outputChannel.appendLine(`SFTP error: ${err.message}`);
                        conn.end();
                        return;
                    }
                    const remoteStream = sftp.createReadStream(remotePath);
                    const localStream = fs.createWriteStream(localPath);

                    remoteStream.pipe(localStream);
                    localStream.on('close', () => {
                        outputChannel.appendLine(`Downloaded networktables.json to ${localPath}`);
                        conn.end();
                    });
                });
            })
            .connect({
                host: remoteHost,
                port: 22,
                username: "lvuser",
                password: "" // Optional if no password is required
            });
    });

    context.subscriptions.push(disposable);
}


/**
 * Deactivates the extension.
 */
function deactivate() {
    console.log('Extension "roborio-networktables" is now deactivated.');
}

module.exports = {
    activate,
    deactivate,
};
