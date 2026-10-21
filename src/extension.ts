import { spawn } from "node:child_process";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext): void {
  const openEditor = vscode.commands.registerCommand("godot.run", async () => {
    const folder = vscode.workspace.workspaceFolders?.[0];
    if (!folder) {
      vscode.window.showErrorMessage("Open a Godot project folder first.");
      return;
    }

    const projectFile = vscode.Uri.joinPath(folder.uri, "project.godot");
    try {
      await vscode.workspace.fs.stat(projectFile);
    } catch {
      vscode.window.showErrorMessage(
        `No project.godot found in ${folder.name}. Open the project root folder.`
      );
      return;
    }

    const configuration = vscode.workspace.getConfiguration("godot", folder.uri);
    const version = configuration.get<"3" | "4">("version", "4");
    const executable = configuration.get<string>(
      `executable${version}`,
      version === "4" ? "godot" : "godot3"
    );
    const process = spawn(executable, ["--editor", "--path", folder.uri.fsPath], {
      cwd: folder.uri.fsPath,
      stdio: "ignore",
      detached: true
    });

    process.once("error", (error) => {
      vscode.window.showErrorMessage(
        `Could not start Godot (${executable}): ${error.message}`
      );
    });
    process.unref();
  });

  const selectVersion = vscode.commands.registerCommand(
    "godot.selectVersion",
    async () => {
      const folder = vscode.workspace.workspaceFolders?.[0];
      if (!folder) {
        vscode.window.showErrorMessage("Open a Godot project folder first.");
        return;
      }

      const selected = await vscode.window.showQuickPick(
        [
          { label: "Godot 4 (latest installed)", value: "4" },
          { label: "Godot 3 (latest installed)", value: "3" }
        ],
        { placeHolder: `Select the editor version for ${folder.name}` }
      );
      if (!selected) {
        return;
      }

      await vscode.workspace
        .getConfiguration("godot", folder.uri)
        .update("version", selected.value, vscode.ConfigurationTarget.WorkspaceFolder);
      vscode.window.showInformationMessage(
        `${folder.name} will use Godot ${selected.value}.`
      );
    }
  );

  context.subscriptions.push(openEditor, selectVersion);
}