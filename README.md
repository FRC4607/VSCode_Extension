# Get Preferences Extension

## Description

The **Get Preferences** extension for Visual Studio Code is designed to automatically retrieve the **team number** from the WPILib project and download the `networktables.json` file from the RoboRIO. This file contains the current preferences in the NetworkTables, which is crucial for backing up and working with robot settings and configurations. This extension streamlines the process of ensuring that your robot's NetworkTables data is saved locally, allowing you to make quick backups of essential settings.

The extension now also supports **uploading** configurations back to the RoboRIO, enabling seamless updates to your robot's settings.

## Features

- **Automatic Team Number Retrieval**: The extension automatically fetches the team number from the `.wpilib/wpilib_preferences.json` file in the current project directory.
- **Download NetworkTables**: Downloads the `networktables.json` file from the RoboRIO, which contains critical data related to the robot's preferences.
- **Upload NetworkTables**: **(New in v0.2.0)** Uploads the updated `networktables.json` file from your local machine back to the RoboRIO, enabling quick and easy configuration updates for your robot.
- **Backup Preferences**: Allows easy backup of the robot's preferences from the RoboRIO to the local machine.
- **User Messaging Enhancements**: **(New in v0.2.0)** The extension now provides clear success or error messages for both file downloads and uploads, helping users quickly identify issues or confirm successful operations.

## Installation

To install the extension, follow these steps:

1. Open **Visual Studio Code**.
2. Go to the **Extensions** view by clicking the Extensions icon in the Activity Bar on the side of the window.
3. Search for **Get Preferences** and click the **Install** button.

Alternatively, you can manually install the extension by downloading the `.vsix` file and using the **Install from VSIX** option in VS Code.

## Usage

1. **Ensure Your RoboRIO is Accessible**: Make sure that your RoboRIO is connected to the same network as your computer.
2. **Open Your WPILib Project**: Open your WPILib project in Visual Studio Code. The extension will automatically fetch the team number from the `.wpilib/wpilib_preferences.json` file.
3. **Run the Command**:
   - Right Click any file in the Explorer window and Select **Download networktables.json from RoboRIO**,  
     or
   - You can execute the command by opening the **Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P`) and searching for `Download NetworkTables from roboRIO`.
4. **Download the `networktables.json`**: The extension will connect to your RoboRIO and download the `networktables.json` file into your project's root directory.
5. **Upload the `networktables.json`** **(New)**:
   - Right-click any file in the Explorer window and select **Upload networktables.json to RoboRIO**,  
     or
   - Execute the command by opening the **Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P`) and searching for `Upload NetworkTables to roboRIO`.
6. **Receive Feedback**:
   - Success or failure messages will indicate the status of the file operation (download or upload), making troubleshooting easier.

The downloaded or uploaded `networktables.json` file will be placed in the appropriate directory to keep your project organized.

## Release Notes

### v0.2.0
- **New Major Feature**: Added the ability to upload the `networktables.json` file back to the RoboRIO for configuration updates.
- **User Feedback**: Clear success or error messages for file download and upload operations.

### v0.1.0 (Initial Release)
- Automatically retrieves the team number from the `.wpilib/wpilib_preferences.json` file.
- Downloads the `networktables.json` file from the RoboRIO.
- Provides a backup of the robot's preferences stored in the `networktables.json` file.

## License

This project is licensed under the [MIT License](LICENSE).

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a description of your changes.

## Support

If you encounter any issues or have questions about the extension, please open an issue in the [GitHub repository](https://github.com/FRC4607/VSCode_Extension/issues).

---

**Note**: This extension is designed for use in FRC (FIRST Robotics Competition) projects and requires the RoboRIO to be accessible over the network.
