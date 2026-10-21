import * as vscode from "vscode";

const GODOT_WEB_EDITOR = "https://editor.godotengine.org/";

export function activate(context: vscode.ExtensionContext): void {
  const openEditor = vscode.commands.registerCommand("godot.run", async () => {
    const folder = vscode.workspace.workspaceFolders?.[0];
    if (!folder) {
      vscode.window.showErrorMessage("Open a Godot project folder first.");
      return;
    }

    const version = vscode.workspace
      .getConfiguration("godot", folder.uri)
      .get<"3" | "4">("version", "4");
    if (version === "3") {
      vscode.window.showWarningMessage(
        "The Godot Web Editor does not provide a Godot 3 editor. Open this project in desktop VS Code with Godot 3 installed."
      );
      return;
    }

    vscode.window.showInformationMessage(
      "The Godot Web Editor opens in a separate tab; import this project there."
    );
    await vscode.env.openExternal(vscode.Uri.parse(GODOT_WEB_EDITOR));
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