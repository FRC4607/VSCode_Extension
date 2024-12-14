const vscode = require('vscode');
const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

function activate(context) {
    // Create an output channel
    const outputChannel = vscode.window.createOutputChannel('NetworkTables');
    outputChannel.show();

    // Command to download the file from the robot
    let downloadDisposable = vscode.commands.registerCommand('extension.downloadNetworkTables', async () => {
        await handleDownload(outputChannel);
    });

    // Command to upload the file to the robot
    let uploadDisposable = vscode.commands.registerCommand('extension.uploadNetworkTables', async () => {
        await handleUpload(outputChannel);
    });

    context.subscriptions.push(downloadDisposable, uploadDisposable);
}

/**
 * Handles downloading the file from the robot.
 */
async function handleDownload(outputChannel) {
    const workspaceFolder = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : null;
    if (!workspaceFolder) {
        const message = "No workspace folder is open.";
        outputChannel.appendLine(message);
        vscode.window.showWarningMessage(message);
        return;
    }

    const preferencesFilePath = path.join(workspaceFolder, '.wpilib', 'wpilib_preferences.json');
    outputChannel.appendLine(`Looking for wpilib_preferences.json at: ${preferencesFilePath}`);

    if (!fs.existsSync(preferencesFilePath)) {
        const message = "Could not find wpilib_preferences.json. Please ensure this is an FRC project.";
        outputChannel.appendLine(message);
        vscode.window.showWarningMessage(message);
        return;
    }

    let teamNumber = null;
    try {
        const fileContents = fs.readFileSync(preferencesFilePath, 'utf8');
        const preferences = JSON.parse(fileContents);
        teamNumber = preferences.teamNumber || null;
    } catch (err) {
        const message = `Error reading wpilib_preferences.json: ${err.message}`;
        outputChannel.appendLine(message);
        vscode.window.showWarningMessage(message);
        return;
    }

    if (!teamNumber) {
        const message = "Could not find a valid team number in wpilib_preferences.json.";
        outputChannel.appendLine(message);
        vscode.window.showWarningMessage(message);
        return;
    }

    const remoteHost = `roboRIO-${teamNumber}-frc.local`;
    const remotePath = "/home/lvuser/networktables.json";
    const localPath = `${workspaceFolder}/networktables.json`;

    outputChannel.appendLine(`Connecting to ${remoteHost}...`);

    const conn = new Client();
    conn
        .on('ready', () => {
            conn.sftp((err, sftp) => {
                if (err) {
                    const message = `SFTP error: ${err.message}`;
                    outputChannel.appendLine(message);
                    vscode.window.showWarningMessage(message);
                    conn.end();
                    return;
                }
                const remoteStream = sftp.createReadStream(remotePath);
                const localStream = fs.createWriteStream(localPath);

                remoteStream.pipe(localStream);
                localStream.on('close', () => {
                    const message = `Downloaded networktables.json to ${localPath}`;
                    outputChannel.appendLine(message);
                    vscode.window.showInformationMessage(message);
                    conn.end();
                });
            });
        })
        .on('error', (err) => {
            const message = `Connection error: ${err.message}`;
            outputChannel.appendLine(message);
            vscode.window.showWarningMessage(message);
        })
        .on('timeout', () => {
            const message = "Connection timed out.";
            outputChannel.appendLine(message);
            vscode.window.showWarningMessage(message);
            conn.end();
        })
        .connect({
            host: remoteHost,
            port: 22,
            username: "lvuser",
            password: "",
            readyTimeout: 10000 // 10 seconds
        });
}

/**
 * Handles uploading the file to the robot.
 */
async function handleUpload(outputChannel) {
    const workspaceFolder = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : null;
    if (!workspaceFolder) {
        const message = "No workspace folder is open.";
        outputChannel.appendLine(message);
        vscode.window.showWarningMessage(message);
        return;
    }

    const localPath = `${workspaceFolder}/networktables.json`;

    // Check if the file exists
    if (!fs.existsSync(localPath)) {
        const message = "networktables.json file does not exist. Please make sure it is in the workspace folder.";
        outputChannel.appendLine(message);
        vscode.window.showWarningMessage(message);
        return;
    }

    const preferencesFilePath = path.join(workspaceFolder, '.wpilib', 'wpilib_preferences.json');
    if (!fs.existsSync(preferencesFilePath)) {
        const message = "Could not find wpilib_preferences.json. Please ensure this is an FRC project.";
        outputChannel.appendLine(message);
        vscode.window.showWarningMessage(message);
        return;
    }

    let teamNumber = null;
    try {
        const fileContents = fs.readFileSync(preferencesFilePath, 'utf8');
        const preferences = JSON.parse(fileContents);
        teamNumber = preferences.teamNumber || null;
    } catch (err) {
        const message = `Error reading wpilib_preferences.json: ${err.message}`;
        outputChannel.appendLine(message);
        vscode.window.showWarningMessage(message);
        return;
    }

    if (!teamNumber) {
        const message = "Could not find a valid team number in wpilib_preferences.json.";
        outputChannel.appendLine(message);
        vscode.window.showWarningMessage(message);
        return;
    }

    const remoteHost = `roboRIO-${teamNumber}-frc.local`;
    const remotePath = "/home/lvuser/networktables.json";

    outputChannel.appendLine(`Connecting to ${remoteHost} to upload networktables.json...`);

    const conn = new Client();
    conn
        .on('ready', () => {
            conn.sftp((err, sftp) => {
                if (err) {
                    const message = `SFTP error: ${err.message}`;
                    outputChannel.appendLine(message);
                    vscode.window.showWarningMessage(message);
                    conn.end();
                    return;
                }
                const localStream = fs.createReadStream(localPath);
                const remoteStream = sftp.createWriteStream(remotePath);

                localStream.pipe(remoteStream);
                remoteStream.on('close', () => {
                    const message = `Uploaded networktables.json to ${remoteHost}:${remotePath}`;
                    outputChannel.appendLine(message);
                    vscode.window.showInformationMessage(message);
                    conn.end();
                });
            });
        })
        .on('error', (err) => {
            const message = `Connection error: ${err.message}`;
            outputChannel.appendLine(message);
            vscode.window.showWarningMessage(message);
        })
        .on('timeout', () => {
            const message = "Connection timed out.";
            outputChannel.appendLine(message);
            vscode.window.showWarningMessage(message);
            conn.end();
        })
        .connect({
            host: remoteHost,
            port: 22,
            username: "lvuser",
            password: "",
            readyTimeout: 10000 // 10 seconds
        });
}

function deactivate() {
    console.log('Extension "roborio-networktables" is now deactivated.');
}

module.exports = {
    activate,
    deactivate,
};
