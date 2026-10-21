# VSGodot

Open Godot projects in the editor from VS Code:

- In desktop VS Code, `Godot: Open Editor` launches the selected Godot editor with the project.
- Use `Godot: Select Project Version` to choose Godot 3 or 4 for the current project.

## Desktop setup

Install the latest Godot 3 and/or Godot 4 editor you want to use. By default, VSGodot looks for `godot3` and `godot` on `PATH`. Set `godot.executable3` and `godot.executable4` to custom executable paths if needed.

## vscode.dev setup

VS Code for the Web cannot run desktop Godot executables. **Godot: Open Editor** opens the hosted Godot Web Editor for Godot 4; import the project into that page separately. Godot 3 is not available in the hosted editor, so Godot 3 projects must be opened from desktop VS Code.

## Development

Run `npm install`, `npm run compile`, then press F5 in VS Code to launch the Extension Development Host.
