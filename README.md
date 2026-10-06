# Taikisha Map Editor Tool

A web and desktop tool for editing robot maps and planning waypoint routes for Taikisha AMRs. Load an occupancy-grid map (or receive it live from ROS), draw nodes, arrows and zones on it, then export the route as YAML, JSON or PGM or send it straight to the robot.

Built with React, Vite and Tailwind CSS, with an optional Electron wrapper and a Flask backend for sending files to the robot.

## Features

- **Map loading**: load a map from a ZIP containing a `.yaml` and a `.pgm` file, or receive `/map` (`nav_msgs/OccupancyGrid`) live from a ROS robot through rosbridge.
- **Annotation**: place nodes, connect them with arrows, and draw zones on the map.
- **Curved paths**: chain "Waypoint For Corner" nodes to get smooth curves. The tool fills the stretch between two corner nodes with normal waypoints every 1 m.
- **Per-node speed**: right-click a node to set a custom speed (0.0 to 2.0 m/s).
- **Map cleanup**: erase map noise, hand-erase, and crop with a freehand shape.
- **Export**: waypoints as YAML or JSON, the map as PGM or PNG, or everything as one ZIP.
- **Send to robot**: upload the YAML or JSON to a robot by IP address.
- **Workspace autosave**: the map and annotations are restored when you reopen the app.
- **Undo / redo**: up to 100 steps (`Ctrl+Z` / `Ctrl+Y`).
- **Light and dark themes**.

## How to run

### Web (development)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the dev server. The `--host` flag makes it reachable from other devices on the network:
   ```bash
   npm run dev -- --host
   ```

3. Open the URL shown in the terminal (usually http://localhost:5173).

### Backend (needed for "Send to Robot")

The Send YAML / Send JSON buttons.

In the main.js update the username, password and path to save the files in robot and click on send button to send the files. Files will be stored
at desired location.

### Desktop app (Electron)

The Electron entry point is `electron/main.js`. Check the `scripts` section of `package.json` for the exact dev and build commands. A packaged Linux build is an AppImage:

```bash
chmod +x "<name>.AppImage"
./"<name>.AppImage"
```

If it fails to start on Ubuntu, try `--no-sandbox`, or install `libfuse2` (`libfuse2t64` on Ubuntu 24.04).

## Connecting to a ROS robot

The editor connects to rosbridge over WebSocket (default port `9090`) and subscribes to `/map`. Set the robot address in `src/context/ROSContext.jsx`. Make sure rosbridge is running on the robot:

```bash
ros2 launch rosbridge_server rosbridge_websocket_launch.xml
```

If you don't have a live robot, load a map from a ZIP instead.

## Using the editor

The left sidebar has four tabs.

| Tab | What it does |
| --- | --- |
| **Map** | Set the map name, load a map from ZIP, save as PGM, PNG or a complete ZIP. |
| **Annotate** | Choose the yaw calculation method, undo and redo, clear annotations or delete the whole workspace. |
| **Export** | Export YAML or JSON, import annotations from JSON, send YAML or JSON to the robot. |
| **Tools** | Pick a drawing tool and its settings. |

### Drawing tools (Tools tab)

| Tool | Use |
| --- | --- |
| **Pan** | Drag the map to move it. Drag a node to reposition it. Drag a curved arrow to bend it. |
| **Node** | Click a free (white) area of the map to place a node of the selected type. |
| **Arrow** | Click a node to start, then click another node to finish. Clicking empty space finishes with a new node. |
| **Zone** | Click points to outline a polygon, then press **Finish Zone**. Zones can be Normal or Restricted. |
| **Erase** | Remove objects, erase map noise, or hand-erase with an adjustable radius. |
| **Crop** | Draw a freehand shape, then press **Apply** to make everything outside it transparent. |

**Node types:** Station, Docking, Waypoint, Home, Charging, Waypoint For Corner.

**Arrow direction:** Forward (orange) or Reverse (red). Forward arrows become the forward mission and reverse arrows the reverse mission.

### Curved paths

1. Set the node type to **Waypoint For Corner** and place corner nodes.
2. With the **Arrow** tool, click the first corner, click each following corner once to add it as a via-point, and **double-click** the last corner to finish.
3. Between each pair of corners the tool creates regular waypoints about every 1 m along the curve.
4. In **Pan** mode, drag any curved segment to bend it. Dragging across the straight line flips the curve to the other side.

### Canvas controls

The panel at the top right of the canvas has zoom in, zoom out, reset view, rotate 90°, and a rotation angle field. Zoom works around the center of the canvas. The coordinates of the cursor in ROS map frame are shown at the top of the page.

### Shortcuts and mouse

| Action | How |
| --- | --- |
| Undo / Redo | `Ctrl+Z` / `Ctrl+Y` |
| Set node speed | Right-click a node |
| Move a node | Drag it in Pan or Node mode |
| Finish an arrow at a corner | Double-click the corner node |

## Output files

| File | Contents |
| --- | --- |
| `<name>_waypoints.yaml` | Forward and reverse waypoints with x, y, theta, type, mission and optional speed. |
| `<name>_waypoints.json` | Forward waypoints with total node count. |
| `<name>.pgm` and `<name>.yaml` | The edited map with annotations drawn on it, in ROS map-server format. |
| `<name>.png` | A high-resolution image of the map and annotations. |
| `<name>_complete.zip` | PGM, YAML and a `_data.json` with all nodes, arrows and zones, so the full session can be loaded again. |

Yaw is calculated from the direction of each arrow when you save, unless you choose "No calculation" in the Annotate tab.

## Project structure

```
.
├── src/             React app (pages, components, ROS and language contexts)
├── public/          Static files, including roslib.min.js
├── electron/        Electron main process
├── backend/         Flask scripts for sending files to the robot
├── index.html
├── vite.config.js
└── tailwind.config.cjs
```

## Tech stack

React, Vite, Tailwind CSS, Electron, roslib, js-yaml, JSZip, react-icons, Flask.
