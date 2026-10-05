// import React, { useEffect, useRef, useState, useCallback } from "react";
// import { useLanguage } from "../context/LanguageContext";
// import yaml from "js-yaml";
// import JSZip from 'jszip';
// import { FaRocket } from "react-icons/fa";
// import { useROS } from "../context/ROSContext";
// import {
//   FaSearchPlus, FaSearchMinus, FaExpand, FaTrashAlt, FaMapMarkerAlt,
//   FaArrowRight, FaDrawPolygon, FaEraser, FaUpload, FaDownload, FaRedo,
//   FaCropAlt, FaImage, FaMoon, FaSun, FaBan, FaHandPaper, FaBrush,
//   FaUndo, FaRedoAlt, FaTimes, FaCheck, FaPalette, FaTools, FaFileExport, FaDatabase,
//   FaWrench, FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaTachometerAlt,
//   FaEdit
// } from "react-icons/fa";

// // Persistence helpers
// const compressMapData = (mapData) => {
//   if (!mapData || !mapData.data) return null;
//   try {
//     return {
//       ...mapData,
//       data: Array.from(mapData.data),
//       _compressed: true,
//       _type: 'Int8Array'
//     };
//   } catch (e) { console.error("compress:", e); return null; }
// };

// const saveWorkspaceState = (state) => {
//   try {
//     const toSave = {
//       ...state,
//       mapMsg:      state.mapMsg      ? compressMapData(state.mapMsg)      : null,
//       editableMap: state.editableMap ? compressMapData(state.editableMap) : null,
//       nodes:       state.nodes || [],
//       arrows:      state.arrows || [],
//       zones:       state.zones || [],
//       mapName:     state.mapName || "",
//       rotation:    state.rotation || 0,
//       tool:        state.tool || "pan",
//       nodeType:    state.nodeType || "waypoint",
//       eraseMode:   state.eraseMode || "objects",
//       eraseRadius: state.eraseRadius || 3,
//       zoomState:   state.zoomState || { scale: 1, offsetX: 0, offsetY: 0, isDragging: false, lastX: 0, lastY: 0 },
//       mapParams:   state.mapParams,
//       timestamp:   Date.now(),
//     };
//     localStorage.setItem("mapEditorWorkspace", JSON.stringify(toSave));
//     return true;
//   } catch (e) { console.error("save workspace:", e); return false; }
// };

// const loadWorkspaceState = () => {
//   try {
//     const saved = localStorage.getItem("mapEditorWorkspace");
//     if (!saved) return null;
//     const parsed = JSON.parse(saved);
//     let mapMsg = null, editableMap = null;
//     if (parsed.mapMsg) {
//       mapMsg = Array.isArray(parsed.mapMsg.data)
//         ? { ...parsed.mapMsg, data: new Int8Array(parsed.mapMsg.data), _compressed: false }
//         : parsed.mapMsg;
//     }
//     if (parsed.editableMap) {
//       editableMap = Array.isArray(parsed.editableMap.data)
//         ? { ...parsed.editableMap, data: new Int8Array(parsed.editableMap.data), _compressed: false }
//         : parsed.editableMap;
//     }
//     return {
//       ...parsed, mapMsg, editableMap: editableMap || mapMsg,
//       nodes: parsed.nodes || [], arrows: parsed.arrows || [], zones: parsed.zones || [],
//       mapName: parsed.mapName || "", rotation: parsed.rotation || 0,
//       tool: parsed.tool || "pan", nodeType: parsed.nodeType || "waypoint",
//       eraseMode: parsed.eraseMode || "objects", eraseRadius: parsed.eraseRadius || 3,
//       zoomState: parsed.zoomState || { scale: 1, offsetX: 0, offsetY: 0, isDragging: false, lastX: 0, lastY: 0 },
//       mapParams: parsed.mapParams, currentZonePoints: parsed.currentZonePoints || [],
//     };
//   } catch (e) { console.error("load workspace:", e); return null; }
// };

// // Modal System
// function useModalSystem(T) {
//   const [modal, setModal] = useState(null);

//   const showAlert = useCallback((message, type = 'info') => {
//     return new Promise(resolve => {
//       setModal({ kind: 'alert', message, type, onOk: () => { setModal(null); resolve(); } });
//     });
//   }, []);

//   const showConfirm = useCallback((message, type = 'warning') => {
//     return new Promise(resolve => {
//       setModal({
//         kind: 'confirm', message, type,
//         onConfirm: () => { setModal(null); resolve(true); },
//         onCancel:  () => { setModal(null); resolve(false); }
//       });
//     });
//   }, []);

//   const ModalComponent = modal ? (() => {
//     const icons = {
//       info:    <FaInfoCircle size={22} style={{ color: '#60a5fa' }} />,
//       success: <FaCheckCircle size={22} style={{ color: '#34d399' }} />,
//       warning: <FaExclamationTriangle size={22} style={{ color: '#fbbf24' }} />,
//       error:   <FaExclamationTriangle size={22} style={{ color: '#f87171' }} />,
//     };
//     const accentColors = {
//       info: '#60a5fa', success: '#34d399', warning: '#fbbf24', error: '#f87171'
//     };
//     const accent = accentColors[modal.type] || '#60a5fa';
//     return (
//       <div style={{
//         position: 'fixed', inset: 0,
//         background: 'rgba(0,0,0,0.65)',
//         backdropFilter: 'blur(4px)',
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         zIndex: 9999, padding: 16
//       }}>
//         <div style={{
//           background: T ? T.card : '#1e293b',
//           border: `1px solid ${T ? T.border : '#334155'}`,
//           borderTop: `3px solid ${accent}`,
//           borderRadius: 14,
//           padding: 28, maxWidth: 460, width: '100%',
//           boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
//           animation: 'modalIn 0.18s ease'
//         }}>
//           <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.94) translateY(-8px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
//           <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
//             <div style={{ flexShrink: 0, marginTop: 2 }}>{icons[modal.type] || icons.info}</div>
//             <p style={{
//               margin: 0, color: T ? T.text : '#f1f5f9',
//               fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-line', flex: 1
//             }}>{modal.message}</p>
//           </div>
//           <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
//             {modal.kind === 'confirm' && (
//               <button onClick={modal.onCancel} style={{
//                 padding: '8px 18px', borderRadius: 8,
//                 border: `1px solid ${T ? T.border : '#334155'}`,
//                 background: 'transparent', color: T ? T.textSecondary : '#94a3b8',
//                 cursor: 'pointer', fontSize: 13, fontWeight: 500
//               }}>Cancel</button>
//             )}
//             <button onClick={modal.kind === 'confirm' ? modal.onConfirm : modal.onOk} style={{
//               padding: '8px 22px', borderRadius: 8, border: 'none',
//               background: accent, color: '#fff',
//               cursor: 'pointer', fontSize: 13, fontWeight: 600,
//               boxShadow: `0 2px 8px ${accent}55`
//             }}>
//               {modal.kind === 'confirm' ? 'Confirm' : 'OK'}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   })() : null;

//   return { showAlert, showConfirm, ModalComponent };
// }

// export default function MapEditor() {
//   const { t } = useLanguage();
//   const { connected: rosConnected, ros } = useROS();

//   // UI State
//   const [darkMode, setDarkMode] = useState(() => {
//     const saved = localStorage.getItem("mapEditorDarkMode");
//     if (saved !== null) return JSON.parse(saved);
//     return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
//   });
//   const [mapLoaderActive, setMapLoaderActive] = useState(false);
//   const [activeTab, setActiveTab] = useState("map");

//   // Map State
//   const [mapMsg, setMapMsg] = useState(null);
//   const [editableMap, setEditableMap] = useState(null);
//   const mapParamsRef = useRef(null);
//   const canvasInitializedRef = useRef(false);
//   const toolInitializedRef = useRef(false);
//   const [canvasInitialized, setCanvasInitialized] = useState(false);
//   useEffect(() => { canvasInitializedRef.current = canvasInitialized; }, [canvasInitialized]);

//   // Speed Configuration
//   const [speedModalNode, setSpeedModalNode] = useState(null);

//   // Annotation State
//   const [tool, setTool] = useState("pan");
//   const [nodeType, setNodeType] = useState("waypoint");
//   const [mapName, setMapName] = useState("");
//   const [zoneName, setZoneName] = useState("");
//   const [zoneType, setZoneType] = useState("normal");
//   const [nodes, setNodes] = useState([]);
//   const [arrows, setArrows] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [currentZonePoints, setCurrentZonePoints] = useState([]);
//   const [arrowDirection, setArrowDirection] = useState("forward");
//   const [arrowDrawing, setArrowDrawing] = useState({ isDrawing: false, fromId: null, points: [] });

//   // Edit State
//   const [rotation, setRotation] = useState(0);
//   const [cropState, setCropState] = useState({ isCropping: false, startX: 0, startY: 0, endX: 0, endY: 0, isDragging: false, freehandPoints: [] });
//   const [eraseMode, setEraseMode] = useState("objects");
//   const [eraseRadius, setEraseRadius] = useState(3);
//   const [handEraseState, setHandEraseState] = useState({ isErasing: false, lastX: 0, lastY: 0 });

//   // Canvas / Zoom
//   const canvasRef = useRef(null);
//   const [zoomState, setZoomState] = useState({ scale: 1, offsetX: 0, offsetY: 0, isDragging: false, lastX: 0, lastY: 0 });
//   const [cursorCoords, setCursorCoords] = useState(null);
//   const idCounter = useRef(1);

//   // Node Dragging State
//   const draggingNodeRef = useRef(null);
//   const [draggingNodeId, setDraggingNodeId] = useState(null);
//   const [hoveredNodeId, setHoveredNodeId] = useState(null);

//   // Arrow Curve-Handle Dragging State
//   // draggingArrowRef holds { arrowId, segmentIndex, mx, my, px, py, len } captured at mousedown time.
//   // While dragging, we project the cursor onto the perpendicular of the segment's straight line;
//   // the *signed* projection becomes the new bend amount for that segment, so crossing the
//   // straight line naturally flips the curve to the other side.
//   const draggingArrowRef = useRef(null);
//   const [draggingArrowInfo, setDraggingArrowInfo] = useState(null);
//   const [hoveredArrowControl, setHoveredArrowControl] = useState(null);

//   // ✅ FIX #2: Arrow Drawing State - track corner node clicks for finishing detection
//   const [lastClickedCornerNodeId, setLastClickedCornerNodeId] = useState(null);
//   const cornerClickTimeRef = useRef(0);

//   // DB / Export State
//   const [dbStatus, setDbStatus] = useState("Ready");
//   const [isSaving, setIsSaving] = useState(false);
//   const [isSavingYAML, setIsSavingYAML] = useState(false);
//   const [isSavingJSON, setIsSavingJSON] = useState(false);

//   // Yaw Settings
//   const [yawCalculationMethod, setYawCalculationMethod] = useState("direction");
//   const [showYawTooltip, setShowYawTooltip] = useState(false);

//   // IMPROVED History - Track individual actions
//   const initialState = { nodes: [], arrows: [], zones: [], rotation: 0, editableMapData: null };
//   const historyRef = useRef([initialState]);
//   const historyIndexRef = useRef(0);
//   const [history, setHistory] = useState([initialState]);
//   const [historyIndex, setHistoryIndex] = useState(0);
//   useEffect(() => { historyRef.current = history; }, [history]);
//   useEffect(() => { historyIndexRef.current = historyIndex; }, [historyIndex]);

//   const nodesRef = useRef(nodes);
//   const arrowsRef = useRef(arrows);
//   const zonesRef = useRef(zones);
//   const rotationRef = useRef(rotation);
//   const mapMsgRef = useRef(mapMsg);
//   const editableMapRef = useRef(editableMap);
//   useEffect(() => { nodesRef.current = nodes; }, [nodes]);
//   useEffect(() => { arrowsRef.current = arrows; }, [arrows]);
//   useEffect(() => { zonesRef.current = zones; }, [zones]);
//   useEffect(() => { rotationRef.current = rotation; }, [rotation]);
//   useEffect(() => { mapMsgRef.current = mapMsg; }, [mapMsg]);
//   useEffect(() => { editableMapRef.current = editableMap; }, [editableMap]);

//   // Robot IP Modal State
//   const [showRobotIpModal, setShowRobotIpModal] = useState(false);
//   const [robotIp, setRobotIp] = useState("");
//   const [sendingStatus, setSendingStatus] = useState("");
//   const [currentSendType, setCurrentSendType] = useState(null);

//   // Theme
//   const theme = {
//     light: {
//       background: '#ffffff', surface: '#f8fafc', card: '#ffffff',
//       text: '#1e293b', textSecondary: '#64748b', border: '#e2e8f0',
//       accent: '#3b82f6', danger: '#ef4444', success: '#10b981', warning: '#f59e0b',
//       nodeColors: { station: '#8b5cf6', docking: '#06b6d4', waypoint: '#f59e0b', home: '#10b981', charging: '#ef4444', waypointforcorner: '#ec4899' }
//     },
//     dark: {
//       background: '#0f172a', surface: '#1e293b', card: '#1e293b',
//       text: '#f1f5f9', textSecondary: '#94a3b8', border: '#334155',
//       accent: '#60a5fa', danger: '#f87171', success: '#34d399', warning: '#fbbf24',
//       nodeColors: { station: '#a78bfa', docking: '#22d3ee', waypoint: '#fbbf24', home: '#34d399', charging: '#f87171', waypointforcorner: '#f472b6' }
//     }
//   };
//   const T = darkMode ? theme.dark : theme.light;

//   const { showAlert, showConfirm, ModalComponent } = useModalSystem(T);

//   const styles = {
//     container: { display: "flex", flexDirection: "column", gap: 12, padding: 12, width: "100%", boxSizing: "border-box", background: T.background, color: T.text, minHeight: '100vh', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' },
//     mainContent: { display: "flex", gap: 12, flex: 1, minHeight: 'calc(100vh - 100px)' },
//     sidebar: { width: 300, background: T.card, borderRadius: 12, padding: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", border: `1px solid ${T.border}`, height: 'fit-content', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' },
//     mapContainer: { flex: 1, display: "flex", flexDirection: "column", gap: 12, minHeight: '600px' },
//     canvasContainer: { flex: 1, border: `2px solid ${T.border}`, borderRadius: 12, background: T.surface, position: "relative", overflow: "hidden", minHeight: 400 },
//     buttonGroup: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 },
//     button: { padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.card, color: T.text, cursor: "pointer", fontSize: '13px', fontWeight: '500', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' },
//     buttonAction: { padding: "8px 12px", borderRadius: 8, border: "none", background: T.accent, color: "white", cursor: "pointer", fontSize: '13px', fontWeight: '500', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' },
//     buttonDanger: { padding: "8px 12px", borderRadius: 8, border: "none", background: T.danger, color: "white", cursor: "pointer", fontSize: '13px', fontWeight: '500', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' },
//     buttonSmall: { padding: "6px 10px", borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, color: T.text, cursor: "pointer", fontSize: '12px', fontWeight: '500', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', whiteSpace: 'nowrap' },
//     buttonSmallActive: { padding: "6px 10px", borderRadius: 6, border: `1px solid ${T.accent}`, background: T.accent, color: "white", cursor: "pointer", fontSize: '12px', fontWeight: '500', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', whiteSpace: 'nowrap' },
//     input: { width: "100%", padding: "8px 10px", margin: "4px 0 8px 0", borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, color: T.text, fontSize: '13px', boxSizing: 'border-box' },
//     select: { width: "100%", padding: "8px 10px", marginTop: 4, borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, color: T.text, fontSize: '13px' },
//     label: { fontSize: "13px", color: T.text, fontWeight: '600', marginBottom: 2, display: 'block' },
//     hint: { fontSize: "11px", color: T.textSecondary, marginTop: 4, lineHeight: '1.3' },
//     hud: { background: T.accent, color: "#fff", padding: "6px 10px", borderRadius: 6, fontSize: 12, fontWeight: '500', fontFamily: 'monospace' },
//     mapInfo: { padding: "6px 10px", background: T.card, color: T.text, borderRadius: 6, fontSize: 12, fontWeight: '500', border: `1px solid ${T.border}` },
//     zoomControls: { position: "absolute", top: 12, right: 12, display: "flex", flexDirection: "column", gap: 8, zIndex: 20, background: T.card, padding: 10, borderRadius: 10, boxShadow: "0 6px 18px rgba(0,0,0,0.15)", border: `1px solid ${T.border}` },
//     zoomButton: { padding: 8, borderRadius: 6, border: "none", background: T.accent, color: "#fff", cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' },
//     yawTooltip: { position: "absolute", top: 50, right: 12, zIndex: 21, background: T.card, padding: 12, borderRadius: 8, border: `1px solid ${T.border}`, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", maxWidth: 300 },
//     toolGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8 },
//   };

//   const downloadFile = (blob, filename) => {
//     return new Promise((resolve) => {
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = filename;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       setTimeout(() => {
//         URL.revokeObjectURL(url);
//         resolve();
//       }, 150);
//     });
//   };

//   const rosToCanvasCoords = (rosX, rosY) => {
//     if (!mapParamsRef.current) return { x: 0, y: 0 };
//     const { resolution, originX, originY, height } = mapParamsRef.current;
//     return { x: (rosX - originX) / resolution, y: height - (rosY - originY) / resolution };
//   };

//   const canvasToRosCoords = (canvasX, canvasY) => {
//     if (!mapParamsRef.current) return null;
//     const { resolution, originX, originY, height } = mapParamsRef.current;
//     return {
//       x: +(originX + canvasX * resolution).toFixed(2),
//       y: +(originY + (height - canvasY) * resolution).toFixed(2)
//     };
//   };

//   const clientToCanvasCoords = (clientX, clientY) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return { x: 0, y: 0 };
//     const rect = canvas.getBoundingClientRect();
//     const mouseX = clientX - rect.left, mouseY = clientY - rect.top;
//     if (rotation === 0) return { x: (mouseX - zoomState.offsetX) / zoomState.scale, y: (mouseY - zoomState.offsetY) / zoomState.scale };
//     const cX = rect.width / 2, cY = rect.height / 2;
//     const tX = mouseX - cX, tY = mouseY - cY;
//     const angle = -rotation * Math.PI / 180;
//     return {
//       x: (tX * Math.cos(angle) - tY * Math.sin(angle) + cX - zoomState.offsetX) / zoomState.scale,
//       y: (tX * Math.sin(angle) + tY * Math.cos(angle) + cY - zoomState.offsetY) / zoomState.scale
//     };
//   };

//   const clientToRosCoords = (clientX, clientY) => {
//     const { x, y } = clientToCanvasCoords(clientX, clientY);
//     return canvasToRosCoords(x, y);
//   };

//   const isWithinMapBounds = (rosX, rosY) => {
//     if (!mapParamsRef.current) return false;
//     const { resolution, width, height, originX, originY } = mapParamsRef.current;
//     return rosX >= originX && rosX <= originX + width * resolution && rosY >= originY && rosY <= originY + height * resolution;
//   };

//   const isWithinPlaceableArea = (canvasX, canvasY) => {
//     if (!editableMap || !mapParamsRef.current) return false;
//     const { width, height, data } = editableMap;
//     const px = Math.floor(canvasX), py = Math.floor(canvasY);
//     if (px < 0 || px >= width || py < 0 || py >= height) return false;
//     const my = height - 1 - py;
//     if (my < 0 || my >= height) return false;
//     return data[my * width + px] === 0;
//   };

//   const makeId = (prefix = "n") => `${prefix}_${idCounter.current++}`;

//   const isPointInPolygon = (point, polygon) => {
//     const x = point.x, y = point.y;
//     if (!polygon || polygon.length < 3) return false;
//     let inside = false;
//     for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
//       const xi = polygon[i].x, yi = polygon[i].y;
//       const xj = polygon[j].x, yj = polygon[j].y;
//       const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi + 0.0000001) + xi);
//       if (intersect) inside = !inside;
//     }
//     return inside;
//   };

//   const pointInPolygon = (point, vs) => {
//     if (!vs.length) return false;
//     const x = point[0], y = point[1];
//     let inside = false;
//     for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
//       const xi = vs[i][0], yi = vs[i][1];
//       const xj = vs[j][0], yj = vs[j][1];
//       const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi + 0.0000001) + xi);
//       if (intersect) inside = !inside;
//     }
//     return inside;
//   };

//   // ✅ Curve control-point math, shared by the renderer, the hit-tester, and the drag handler.
//   // `bends` is an object keyed by segment index -> a signed canvas-space bow amount.
//   // If a segment has no entry in `bends`, we fall back to the original alternating bow so
//   // arrows look exactly the same as before until the user actually drags a handle.
//   const getSegmentControlPoint = (p1, p2, segmentIndex, bends = {}) => {
//     const dx = p2.canvasX - p1.canvasX, dy = p2.canvasY - p1.canvasY;
//     const len = Math.hypot(dx, dy) || 1;
//     const px = -dy / len, py = dx / len;
//     const mx = (p1.canvasX + p2.canvasX) / 2, my = (p1.canvasY + p2.canvasY) / 2;
//     let bowSigned;
//     if (bends[segmentIndex] !== undefined) {
//       bowSigned = bends[segmentIndex];
//     } else {
//       const bowMag = Math.min(25, len * 0.3);
//       bowSigned = bowMag * ((segmentIndex % 2 === 0) ? 1 : -1);
//     }
//     return { x: mx + px * bowSigned, y: my + py * bowSigned, len, px, py, mx, my, bowSigned };
//   };

//   // ✅ FIX #1: IMPROVED CURVE DIRECTION CALCULATION (now also drag-overridable per segment)
//   const drawSmoothArrowPath = (ctx, pts, bends = {}, curveAllSegments = false) => {
//     if (!pts || pts.length < 2) return;
//     ctx.beginPath();
//     ctx.moveTo(pts[0].canvasX, pts[0].canvasY);

//     for (let i = 0; i < pts.length - 1; i++) {
//       const p1 = pts[i], p2 = pts[i + 1];
//       const shouldCurve = curveAllSegments || (p1.isCorner && p2.isCorner);

//       if (shouldCurve) {
//         const ctrl = getSegmentControlPoint(p1, p2, i, bends);
//         ctx.quadraticCurveTo(ctrl.x, ctrl.y, p2.canvasX, p2.canvasY);
//       } else {
//         ctx.lineTo(p2.canvasX, p2.canvasY);
//       }
//     }
//     ctx.stroke();
//   };

//   // Walks the arrow graph to produce an ordered node sequence for export.
//   //
//   // ⚠️ FIXED (export truncation bug): the previous version walked every
//   // disconnected chain/loop in the arrow graph, but then kept ONLY the single
//   // longest chain and silently discarded every other chain — on the theory
//   // that a shorter chain was "almost always a stray/duplicate connection".
//   // In practice, a route is very often drawn in more than one "connect" tool
//   // session (e.g. corner1→wp1→wp2→corner2, then later corner2→wp3→wp4→corner3).
//   // If the two segments end up as two graph-disconnected chains for any
//   // reason (a missing/duplicate arrow at the join, editing history, etc.),
//   // the old code would export only the first, longer chain and silently drop
//   // the rest of the route — exactly the truncated-JSON bug being fixed here.
//   //
//   // This version still finds every disconnected chain/loop, but instead of
//   // discarding all but the longest, it concatenates ALL of them, in the order
//   // they were discovered (which follows arrow-creation order). That preserves
//   // every node the user actually placed and connected, even if the graph has
//   // more than one component.
//   const getOrderedNodesFromArrows = (arrowList, allNodes) => {
//     if (arrowList.length === 0) return [];

//     // Only the first outgoing arrow per node is followed. If a node has more than one
//     // (branching — almost always a leftover duplicate connection), the others are
//     // ignored for this walk rather than silently merged into one path.
//     const nextByFrom = new Map();
//     arrowList.forEach(a => { if (!nextByFrom.has(a.fromId)) nextByFrom.set(a.fromId, a.toId); });

//     const toIds = new Set(arrowList.map(a => a.toId));
//     const fromIds = new Set(arrowList.map(a => a.fromId));
//     const allIds = new Set([...fromIds, ...toIds]);

//     const visitedGlobal = new Set();
//     const chains = [];

//     const walkFrom = (startId) => {
//       const ordered = [], localVisited = new Set();
//       let currentId = startId;

//       while (currentId && !localVisited.has(currentId)) {
//         const node = allNodes.find(n => n.id === currentId);
//         if (node) ordered.push(node);

//         localVisited.add(currentId);
//         visitedGlobal.add(currentId);
//         currentId = nextByFrom.get(currentId) ?? null;
//       }

//       // A route may intentionally be a closed loop, for example:
//       // waypointforcorner_8 -> waypoint_4 -> waypointforcorner_1
//       // while waypointforcorner_1 is also the first node in the exported path.
//       //
//       // The old exporter stopped as soon as it saw the already-visited start
//       // node, so the final closing connection was present on the canvas but
//       // waypointforcorner_1 was NOT emitted after waypoint_4 in JSON/YAML.
//       //
//       // For a genuine loop, repeat the starting node once at the end. This
//       // makes the exported linear waypoint sequence explicitly represent the
//       // final edge back to the start:
//       //   ... -> waypoint_4 -> waypointforcorner_1
//       //
//       // Do NOT do this for an open chain that merely ends at another node.
//       if (currentId === startId && ordered.length > 1) {
//         const startNode = allNodes.find(n => n.id === startId);
//         if (startNode) ordered.push(startNode);
//       }

//       return ordered;
//     };

//     // Walk every open-ended chain first (a source with no incoming arrow — a true start),
//     // in the order those "from" ids were first seen (i.e. arrow-creation order).
//     fromIds.forEach(id => {
//       if (!toIds.has(id) && !visitedGlobal.has(id)) chains.push(walkFrom(id));
//     });
//     // Anything left over belongs to a closed loop with no natural start — walk those too.
//     // walkFrom() also repeats the start node once when it detects a true closed loop,
//     // so the closing edge is explicitly represented in JSON/YAML.
//     allIds.forEach(id => {
//       if (!visitedGlobal.has(id)) chains.push(walkFrom(id));
//     });

//     if (chains.length === 0) return [];

//     // Concatenate every chain, in discovery order, instead of keeping only the
//     // longest one. This is what makes a route that was drawn across multiple
//     // "connect" sessions (and ended up graph-disconnected) export in full,
//     // rather than having its later segments silently dropped.
//     return chains.flat();
//   };

//   const buildNodesWithYaw = (nodesList, arrowsList) => {
//     if (yawCalculationMethod === "direction" && arrowsList.length > 0) {
//       return nodesList.map((node, idx) => {
//         const nextNode = idx < nodesList.length - 1 ? nodesList[idx + 1] : null;
//         if (!nextNode) return { ...node, yaw: node.yaw || 0.0 };
//         let yawDeg = Math.atan2(nextNode.rosY - node.rosY, nextNode.rosX - node.rosX) * (180 / Math.PI);
//         if (yawDeg < 0) yawDeg += 360;
//         return { ...node, yaw: parseFloat(yawDeg.toFixed(2)) };
//       });
//     }
//     return nodesList.map(n => ({ ...n, yaw: n.yaw || 0.0 }));
//   };

//   const buildWaypointsArray = (nodesWithYaw, missionType) => {
//     let stationCount = 0;
//     return nodesWithYaw.map(node => {
//       const waypoint = { 
//         x: parseFloat(node.rosX.toFixed(2)), 
//         y: parseFloat(node.rosY.toFixed(2)), 
//         theta: parseFloat((node.yaw * Math.PI / 180).toFixed(6)), 
//         type: node.type, 
//         mission: missionType, 
//         rotation: "auto",
//         label: node.label
//       };
//       if (node.speed !== undefined && node.speed !== null) {
//         waypoint.speed = node.speed;
//       }
//       if (node.type === "station") { 
//         stationCount++; 
//         waypoint.name = node.label || `station_${stationCount}`; 
//         waypoint.plc_feedback = `I0.${stationCount}`; 
//       }
//       return waypoint;
//     });
//   };

//   const buildYAMLString = (forwardWaypoints, reverseWaypoints = []) => {
//     const renderSection = (wps, label) => {
//       let s = `\n# ${"=".repeat(60)}\n#  ${label}\n# ${"=".repeat(60)}\n`;
//       wps.forEach((wp) => {
//         const nodeNumber = wp.label ? wp.label.split('_')[1] : "?";
//         // Use WPC for waypoint-for-corner nodes so the YAML comments are
//         // unambiguous: WPC1, WPC2, WPC3... instead of WP1, WP2, WP3.
//         const wpLabel = wp.type === "waypointforcorner"
//           ? `WPC${nodeNumber}`
//           : `WP${nodeNumber}`;
        
//         s += `\n# ── ${wpLabel}: (${wp.x}, ${wp.y}) ──────────────────────────────\n`;
//         s += `- x:           ${wp.x}\n`;
//         s += `  y:           ${wp.y}\n`;
//         s += `  theta:       ${wp.theta}\n`;
//         s += `  type:        ${wp.type}\n`;
//         s += `  mission:     ${wp.mission}\n`;
//         s += `  rotation:    ${wp.rotation}\n`;
//         if (wp.speed !== undefined) {
//           s += `  speed:       ${wp.speed}\n`;
//         }
//         if (wp.type === "station") { 
//           if (wp.name) s += `  name:        "${wp.name}"\n`; 
//           if (wp.plc_feedback) s += `  plc_feedback: "${wp.plc_feedback}"\n`; 
//         }
//       });
//       return s;
//     };
    
//     let result = `# Waypoint configuration\n\nwaypoints:`;
//     result += renderSection(forwardWaypoints, "FORWARD PATH");
//     if (reverseWaypoints.length > 0) {
//       result += renderSection(reverseWaypoints, "REVERSE PATH");
//     }
//     return result;
//   };

//   const handleSaveYAML = async () => {
//     if (!mapMsg || !mapParamsRef.current) { 
//       await showAlert("No map loaded!", 'warning'); 
//       return; 
//     }
//     if (nodes.length === 0) { 
//       await showAlert("No nodes to export!", 'warning'); 
//       return; 
//     }

//     try {
//       const forwardArrows = arrows.filter(a => a.direction !== "reverse");
//       const reverseArrows = arrows.filter(a => a.direction === "reverse");
      
//       let forwardNodes = forwardArrows.length > 0 
//         ? getOrderedNodesFromArrows(forwardArrows, nodes) 
//         : nodes;
      
//       let reverseNodes = [];
      
//       if (reverseArrows.length > 0) {
//         reverseNodes = getOrderedNodesFromArrows(reverseArrows, nodes);
//       } else if (forwardNodes.length > 1) {
//         reverseNodes = [...forwardNodes].reverse();
//       }
      
//       const forwardWPs = forwardNodes.length > 0 
//         ? buildWaypointsArray(buildNodesWithYaw(forwardNodes, forwardArrows), "forward")
//         : [];
      
//       let reverseWPs = [];
//       if (reverseNodes.length > 0) {
//         const reverseNodesWithYaw = buildNodesWithYaw(reverseNodes, reverseArrows);
//         reverseWPs = buildWaypointsArray(reverseNodesWithYaw, "reverse");
//       }
      
//       const yamlContent = buildYAMLString(forwardWPs, reverseWPs);
//       const blob = new Blob([yamlContent], { type: 'application/x-yaml' });
//       await downloadFile(blob, `${mapName || 'map'}_waypoints.yaml`);
      
//       const speedCount = [...forwardWPs, ...reverseWPs].filter(wp => wp.speed !== undefined).length;
//       await showAlert(`✅ YAML exported!\n📍 ${forwardWPs.length} forward, ${reverseWPs.length} reverse waypoints\n⚡ ${speedCount} nodes have custom speeds`, 'success');
//     } catch (err) {
//       console.error(err);
//       await showAlert(`Error exporting YAML:\n${err.message}`, 'error');
//     }
//   };

//   const handleSaveJSON = async () => {
//     if (!mapMsg || !mapParamsRef.current) { 
//       await showAlert("No map loaded!", 'warning'); 
//       return; 
//     }
//     if (nodes.length === 0) { 
//       await showAlert("No nodes to export!", 'warning'); 
//       return; 
//     }

//     try {
//       const forwardArrows = arrows.filter(a => a.direction !== "reverse");
//       let forwardNodes = forwardArrows.length > 0 ? getOrderedNodesFromArrows(forwardArrows, nodes) : nodes;
//       const forwardWPs = buildWaypointsArray(buildNodesWithYaw(forwardNodes, forwardArrows), "forward");
      
//       const jsonOutput = {
//         waypoints: forwardWPs,
//         total_nodes: forwardWPs.length,
//         timestamp: Date.now(),
//         map_name: mapName || 'map'
//       };
      
//       const blob = new Blob([JSON.stringify(jsonOutput, null, 2)], { type: 'application/json' });
//       await downloadFile(blob, `${mapName || 'map'}_waypoints.json`);
      
//       const speedCount = forwardWPs.filter(wp => wp.speed !== undefined).length;
//       await showAlert(`✅ JSON exported!\n📍 ${forwardWPs.length} waypoints\n⚡ ${speedCount} nodes have custom speeds`, 'success');
//     } catch (err) {
//       console.error(err);
//       await showAlert(`Error exporting JSON:\n${err.message}`, 'error');
//     }
//   };

//   // History stores COMPLETE post-action snapshots.
//   // Every user action appends its resulting state; Undo moves to the previous
//   // snapshot and Redo moves forward again. This prevents the old bug where
//   // saveToHistory() captured the state BEFORE deletion, causing Undo/Redo to
//   // appear reversed.
//   const cloneHistoryState = (state) => ({
//     nodes: JSON.parse(JSON.stringify(state.nodes || [])),
//     arrows: JSON.parse(JSON.stringify(state.arrows || [])),
//     zones: JSON.parse(JSON.stringify(state.zones || [])),
//     editableMapData: state.editableMapData == null ? null : Array.from(state.editableMapData),
//     rotation: state.rotation || 0,
//   });

//   const recordHistoryState = (override = {}) => {
//     try {
//       const current = {
//         nodes: override.nodes !== undefined ? override.nodes : nodesRef.current,
//         arrows: override.arrows !== undefined ? override.arrows : arrowsRef.current,
//         zones: override.zones !== undefined ? override.zones : zonesRef.current,
//         editableMapData: override.editableMapData !== undefined
//           ? override.editableMapData
//           : (editableMapRef.current ? editableMapRef.current.data : null),
//         rotation: override.rotation !== undefined ? override.rotation : rotationRef.current,
//       };
//       const entry = cloneHistoryState(current);
//       const hist = historyRef.current;
//       const idx = historyIndexRef.current;
//       const last = hist[idx];
//       if (last && JSON.stringify(last) === JSON.stringify(entry)) return;

//       const nh = hist.slice(0, idx + 1);
//       nh.push(entry);
//       if (nh.length > 100) nh.shift();
//       const ni = nh.length - 1;
//       historyRef.current = nh;
//       historyIndexRef.current = ni;
//       setHistory(nh);
//       setHistoryIndex(ni);
//     } catch (err) {
//       console.error('Record history error:', err);
//     }
//   };

//   const resetHistoryToCurrent = (override = {}) => {
//     const current = {
//       nodes: override.nodes !== undefined ? override.nodes : nodesRef.current,
//       arrows: override.arrows !== undefined ? override.arrows : arrowsRef.current,
//       zones: override.zones !== undefined ? override.zones : zonesRef.current,
//       editableMapData: override.editableMapData !== undefined
//         ? override.editableMapData
//         : (editableMapRef.current ? editableMapRef.current.data : null),
//       rotation: override.rotation !== undefined ? override.rotation : rotationRef.current,
//     };
//     const entry = cloneHistoryState(current);
//     historyRef.current = [entry];
//     historyIndexRef.current = 0;
//     setHistory([entry]);
//     setHistoryIndex(0);
//   };

//   // Backward-compatible alias for older call sites; new editing operations
//   // should call recordHistoryState AFTER computing their new state.
//   const saveToHistory = () => recordHistoryState();

//   const applyHistorySnapshot = (state) => {
//     const nextNodes = JSON.parse(JSON.stringify(state.nodes || []));
//     const nextArrows = JSON.parse(JSON.stringify(state.arrows || []));
//     const nextZones = JSON.parse(JSON.stringify(state.zones || []));
//     const nextRotation = state.rotation || 0;

//     nodesRef.current = nextNodes;
//     arrowsRef.current = nextArrows;
//     zonesRef.current = nextZones;
//     rotationRef.current = nextRotation;

//     setNodes(nextNodes);
//     setArrows(nextArrows);
//     setZones(nextZones);
//     setRotation(nextRotation);

//     if (state.editableMapData != null) {
//       const nd = Array.from(state.editableMapData);
//       if (editableMapRef.current) {
//         editableMapRef.current = { ...editableMapRef.current, data: nd };
//         setEditableMap(p => p ? { ...p, data: Array.from(nd) } : null);
//       }
//       if (mapMsgRef.current) {
//         mapMsgRef.current = { ...mapMsgRef.current, data: nd };
//         setMapMsg(p => p ? { ...p, data: Array.from(nd) } : null);
//       }
//     }
//   };

//   const handleUndo = () => {
//     try {
//       const idx = historyIndexRef.current, hist = historyRef.current;
//       if (idx <= 0) return;
//       const ni = idx - 1;
//       historyIndexRef.current = ni;
//       setHistoryIndex(ni);
//       applyHistorySnapshot(hist[ni]);
//     } catch (err) { console.error("Undo error:", err); }
//   };

//   const handleRedo = () => {
//     try {
//       const idx = historyIndexRef.current, hist = historyRef.current;
//       if (idx >= hist.length - 1) return;
//       const ni = idx + 1;
//       historyIndexRef.current = ni;
//       setHistoryIndex(ni);
//       applyHistorySnapshot(hist[ni]);
//     } catch (err) { console.error("Redo error:", err); }
//   };

//   const clearHistory = () => {
//     const entry = cloneHistoryState({ nodes: [], arrows: [], zones: [], rotation: 0, editableMapData: null });
//     historyRef.current = [entry];
//     historyIndexRef.current = 0;
//     setHistory([entry]);
//     setHistoryIndex(0);
//   };

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
//         e.preventDefault();
//         handleUndo();
//       }
//       else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
//         e.preventDefault();
//         handleRedo();
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [historyIndex, history]);

//   useEffect(() => {
//     const mq = window.matchMedia('(prefers-color-scheme: dark)');
//     const h = e => { if (!localStorage.getItem("mapEditorDarkMode")) setDarkMode(e.matches); };
//     mq.addEventListener('change', h);
//     return () => mq.removeEventListener('change', h);
//   }, []);
  
//   const toggleDarkMode = () => setDarkMode(p => !p);
//   useEffect(() => { localStorage.setItem("mapEditorDarkMode", JSON.stringify(darkMode)); }, [darkMode]);

//   useEffect(() => {
//     if (canvasInitialized && mapMsg && !toolInitializedRef.current) {
//       toolInitializedRef.current = true;
//       setTool("pan");
//     }
//   }, [canvasInitialized, mapMsg]);

//   useEffect(() => {
//     try {
//       const ws = loadWorkspaceState();
//       if (!ws) { console.log("No saved workspace"); return; }
//       if (ws.mapMsg) {
//         setMapMsg(ws.mapMsg);
//         setEditableMap(ws.editableMap || ws.mapMsg);
//         mapParamsRef.current = ws.mapParams || {
//           width: ws.mapMsg.width, height: ws.mapMsg.height,
//           resolution: ws.mapMsg.resolution || 0.05,
//           originX: ws.mapMsg.origin?.x || 0, originY: ws.mapMsg.origin?.y || 0
//         };
//         setCanvasInitialized(true);
//         toolInitializedRef.current = true;
//         setTimeout(() => {
//           if (canvasRef.current) {
//             const container = canvasRef.current.parentElement;
//             if (container && ws.mapMsg.width && ws.mapMsg.height) {
//               setZoomState(prev => ({
//                 ...prev,
//                 offsetX: Math.max(0, (container.clientWidth - ws.mapMsg.width) / 2),
//                 offsetY: Math.max(0, (container.clientHeight - ws.mapMsg.height) / 2),
//                 scale: ws.zoomState?.scale || 1
//               }));
//             }
//           }
//         }, 100);
//       }
//       setNodes(ws.nodes || []); setArrows(ws.arrows || []); setZones(ws.zones || []);
//       setMapName(ws.mapName || ""); setRotation(ws.rotation || 0);
//       setTool(ws.tool || "pan"); setNodeType(ws.nodeType || "waypoint");
//       setEraseMode(ws.eraseMode || "objects"); setEraseRadius(ws.eraseRadius || 3);
//       if (ws.zoomState) setZoomState(prev => ({ ...prev, ...ws.zoomState }));
//       if (ws.currentZonePoints) setCurrentZonePoints(ws.currentZonePoints);
//       const allIds = [...(ws.nodes || []), ...(ws.arrows || []), ...(ws.zones || [])];
//       const maxId = allIds.reduce((max, item) => Math.max(max, parseInt(item.id?.split('_')[1]) || 0), 0);
//       idCounter.current = maxId + 1;
//     } catch (err) { console.error("Error restoring workspace:", err); }
//   }, []);

//   useEffect(() => {
//     const tid = setTimeout(() => {
//       try {
//         if (mapMsg || nodes.length > 0 || arrows.length > 0 || zones.length > 0) {
//           saveWorkspaceState({ mapMsg, editableMap, mapParams: mapParamsRef.current, nodes, arrows, zones, currentZonePoints, mapName, rotation, tool, nodeType, eraseMode, eraseRadius, zoomState });
//         }
//       } catch (err) { console.error("Auto-save error:", err); }
//     }, 500);
//     return () => clearTimeout(tid);
//   }, [mapMsg, editableMap, nodes, arrows, zones, currentZonePoints, mapName, rotation, tool, nodeType, eraseMode, eraseRadius, zoomState]);

//   const openSpeedModal = (node) => {
//     setSpeedModalNode({ ...node, speed: node.speed !== undefined ? node.speed : 0.0 });
//   };

//   const SpeedModal = () => {
//     if (!speedModalNode) return null;
//     const [tempSpeed, setTempSpeed] = useState(speedModalNode.speed !== undefined ? speedModalNode.speed : 0.0);
    
//     return (
//       <div style={{
//         position: 'fixed', inset: 0,
//         background: 'rgba(0,0,0,0.65)',
//         backdropFilter: 'blur(4px)',
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         zIndex: 10000, padding: 16
//       }}>
//         <div style={{
//           background: T.card,
//           border: `1px solid ${T.border}`,
//           borderTop: `3px solid ${T.accent}`,
//           borderRadius: 14,
//           padding: 28, maxWidth: 400, width: '100%'
//         }}>
//           <h3 style={{ margin: '0 0 20px 0', color: T.text }}>
//             <FaTachometerAlt style={{ marginRight: 8 }} />
//             Set Speed for {speedModalNode.label}
//           </h3>
//           <div style={{ marginBottom: 20 }}>
//             <label style={styles.label}>Speed (m/s)</label>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//               <input
//                 type="range"
//                 min="0.0"
//                 max="2.0"
//                 step="0.01"
//                 value={tempSpeed}
//                 onChange={e => setTempSpeed(parseFloat(e.target.value))}
//                 style={{ flex: 1 }}
//               />
//               <input
//                 type="number"
//                 min="0.0"
//                 max="2.0"
//                 step="0.01"
//                 value={tempSpeed}
//                 onChange={e => setTempSpeed(parseFloat(e.target.value))}
//                 style={{ ...styles.input, width: '80px', margin: 0 }}
//               />
//               <span>m/s</span>
//             </div>
//             <div style={styles.hint}>Set to 0.0 to remove speed (will not appear in YAML)</div>
//           </div>
//           <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
//             <button onClick={() => setSpeedModalNode(null)} style={styles.button}>Cancel</button>
//             <button onClick={() => {
//               if (speedModalNode) {
//                 const finalSpeed = tempSpeed === 0.0 ? undefined : tempSpeed;
//                 const nextNodes = nodesRef.current.map(n =>
//                   n.id === speedModalNode.id ? { ...n, speed: finalSpeed } : n
//                 );
//                 setNodes(nextNodes);
//                 recordHistoryState({ nodes: nextNodes });
//                 setSpeedModalNode(null);
//               }
//             }} style={{ ...styles.buttonAction, background: T.success }}>Save</button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const eraseAtClient = (clientX, clientY) => {
//     if (!mapMsg) return;
//     if (eraseMode === "objects") { 
//       const c = clientToCanvasCoords(clientX, clientY); 
//       eraseObjectsAt(c.x, c.y); 
//     }
//     else if (eraseMode === "noise") { 
//       eraseNoiseAt(clientX, clientY); 
//     }
//     else if (eraseMode === "hand") { 
//       startHandErase(clientX, clientY); 
//     }
//   };

//   const eraseObjectsAt = (canvasX, canvasY) => {
//     const currentNodes = nodesRef.current;
//     const currentArrows = arrowsRef.current;
//     const currentZones = zonesRef.current;

//     const node = findNodeAtCanvas(canvasX, canvasY, 8 / zoomState.scale);
//     if (node) {
//       const nextNodes = currentNodes.filter(p => p.id !== node.id);
//       const nextArrows = currentArrows.filter(a => a.fromId !== node.id && a.toId !== node.id);
//       nodesRef.current = nextNodes;
//       arrowsRef.current = nextArrows;
//       setNodes(nextNodes);
//       setArrows(nextArrows);
//       recordHistoryState({ nodes: nextNodes, arrows: nextArrows });
//       return;
//     }

//     for (const arrow of currentArrows) {
//       const fromNode = currentNodes.find(n => n.id === arrow.fromId);
//       const toNode = currentNodes.find(n => n.id === arrow.toId);
//       if (fromNode && toNode) {
//         const dx = toNode.canvasX - canvasX, dy = toNode.canvasY - canvasY;
//         if (Math.sqrt(dx*dx + dy*dy) <= 12 / zoomState.scale) {
//           const nextArrows = currentArrows.filter(a => a.id !== arrow.id);
//           setArrows(nextArrows);
//           recordHistoryState({ arrows: nextArrows });
//           return;
//         }
//         const allPoints = [fromNode, ...(arrow.points || []), toNode];
//         for (let i = 0; i < allPoints.length - 1; i++) {
//           const p1 = allPoints[i], p2 = allPoints[i+1];
//           const A = canvasX-p1.canvasX, B = canvasY-p1.canvasY, C = p2.canvasX-p1.canvasX, D = p2.canvasY-p1.canvasY;
//           const dot = A*C + B*D, lenSq = C*C + D*D;
//           const param = lenSq !== 0 ? dot/lenSq : -1;
//           const xx = param < 0 ? p1.canvasX : param > 1 ? p2.canvasX : p1.canvasX + param*C;
//           const yy = param < 0 ? p1.canvasY : param > 1 ? p2.canvasY : p1.canvasY + param*D;
//           if (Math.sqrt((canvasX-xx)**2 + (canvasY-yy)**2) <= 6/zoomState.scale) {
//             const nextArrows = currentArrows.filter(a => a.id !== arrow.id);
//             setArrows(nextArrows);
//             recordHistoryState({ arrows: nextArrows });
//             return;
//           }
//         }
//       }
//     }

//     for (const z of currentZones) {
//       if (pointInPolygon([canvasX, canvasY], z.points.map(p => [p.canvasX, p.canvasY]))) {
//         const nextZones = currentZones.filter(pz => pz.id !== z.id);
//         setZones(nextZones);
//         recordHistoryState({ zones: nextZones });
//         return;
//       }
//     }
//   };

//   const eraseNoiseAt = (clientX, clientY) => {
//     const currentMap = editableMapRef.current;
//     const currentMapMsg = mapMsgRef.current;
//     if (!currentMap || !canvasRef.current) return;

//     const canvasCoords = clientToCanvasCoords(clientX, clientY);
//     const mapX = Math.floor(canvasCoords.x);
//     const mapY = Math.floor(currentMap.height - canvasCoords.y);
//     const { width, height, data } = currentMap;
//     if (mapX < 0 || mapX >= width || mapY < 0 || mapY >= height) return;

//     const newData = Array.from(data);
//     let erased = 0;
//     for (let y = mapY - eraseRadius; y <= mapY + eraseRadius; y++) {
//       for (let x = mapX - eraseRadius; x <= mapX + eraseRadius; x++) {
//         if (x >= 0 && x < width && y >= 0 && y < height &&
//             Math.sqrt((x-mapX)**2 + (y-mapY)**2) <= eraseRadius) {
//           const idx = y * width + x;
//           if (newData[idx] === 100 || newData[idx] === -1) {
//             newData[idx] = 0;
//             erased++;
//           }
//         }
//       }
//     }
//     if (erased > 0) {
//       const nextMap = { ...currentMap, data: newData };
//       const nextMsg = currentMapMsg ? { ...currentMapMsg, data: newData } : null;
//       editableMapRef.current = nextMap;
//       mapMsgRef.current = nextMsg;
//       setEditableMap(nextMap);
//       if (nextMsg) setMapMsg(nextMsg);
//       recordHistoryState({ editableMapData: newData });
//     }
//   };

//   const startHandErase = (clientX, clientY) => {
//     if (!editableMap || !canvasRef.current) return;
//     const canvasCoords = clientToCanvasCoords(clientX, clientY);
//     const mapX = Math.floor(canvasCoords.x), mapY = Math.floor(editableMap.height - canvasCoords.y);
//     const { width, height } = editableMap;
//     if (mapX < 0 || mapX >= width || mapY < 0 || mapY >= height) return;
//     setHandEraseState({ isErasing: true, lastX: mapX, lastY: mapY });
//     eraseNoiseInLine(mapX, mapY, mapX, mapY);
//   };

//   const continueHandErase = (clientX, clientY) => {
//     if (!handEraseState.isErasing || !editableMap || !canvasRef.current) return;
//     const canvasCoords = clientToCanvasCoords(clientX, clientY);
//     const currentX = Math.floor(canvasCoords.x), currentY = Math.floor(editableMap.height - canvasCoords.y);
//     const { width, height } = editableMap;
//     if (currentX < 0 || currentX >= width || currentY < 0 || currentY >= height) {
//       setHandEraseState(prev => ({ ...prev, lastX: currentX, lastY: currentY })); return;
//     }
//     eraseNoiseInLine(handEraseState.lastX, handEraseState.lastY, currentX, currentY);
//     setHandEraseState(prev => ({ ...prev, lastX: currentX, lastY: currentY }));
//   };

//   const stopHandErase = () => {
//     if (handEraseState.isErasing && editableMapRef.current) {
//       recordHistoryState({ editableMapData: editableMapRef.current.data });
//     }
//     setHandEraseState({ isErasing: false, lastX: 0, lastY: 0 });
//   };

//   const getLinePoints = (x0, y0, x1, y1) => {
//     const points = [];
//     const dx = Math.abs(x1-x0), dy = Math.abs(y1-y0);
//     const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
//     let err = dx - dy, x = x0, y = y0;
//     while (true) {
//       points.push({ x, y });
//       if (x === x1 && y === y1) break;
//       const e2 = 2 * err;
//       if (e2 > -dy) { err -= dy; x += sx; }
//       if (e2 < dx)  { err += dx; y += sy; }
//     }
//     return points;
//   };

//   const eraseNoiseInLine = (x0, y0, x1, y1) => {
//     const currentMap = editableMapRef.current;
//     const currentMapMsg = mapMsgRef.current;
//     if (!currentMap) return;

//     const { width, height, data } = currentMap;
//     const newData = Array.from(data);
//     let erased = 0;
//     getLinePoints(x0, y0, x1, y1).forEach(({ x, y }) => {
//       if (x < 0 || x >= width || y < 0 || y >= height) return;
//       for (let dy = -eraseRadius; dy <= eraseRadius; dy++) {
//         for (let dx = -eraseRadius; dx <= eraseRadius; dx++) {
//           const nx = x + dx, ny = y + dy;
//           if (nx >= 0 && nx < width && ny >= 0 && ny < height &&
//               Math.sqrt(dx*dx + dy*dy) <= eraseRadius) {
//             const idx = ny * width + nx;
//             if (newData[idx] === 100 || newData[idx] === -1) {
//               newData[idx] = 0;
//               erased++;
//             }
//           }
//         }
//       }
//     });
//     if (erased > 0) {
//       const nextMap = { ...currentMap, data: newData };
//       const nextMsg = currentMapMsg ? { ...currentMapMsg, data: newData } : null;
//       editableMapRef.current = nextMap;
//       mapMsgRef.current = nextMsg;
//       setEditableMap(nextMap);
//       if (nextMsg) setMapMsg(nextMsg);
//     }
//   };

//   const startCrop = () => {
//     setCropState({ isCropping: true, startX: 0, startY: 0, endX: 0, endY: 0, isDragging: false, freehandPoints: [] });
//     setTool("crop");
//   };

//   const cancelCrop = () => {
//     setCropState({ isCropping: false, startX: 0, startY: 0, endX: 0, endY: 0, isDragging: false, freehandPoints: [] });
//     setTool("pan");
//   };

//   const handleApplyCrop = async () => {
//     if (!mapMsg || !mapParamsRef.current) { await showAlert("No map loaded!", 'error'); return; }
//     if (!cropState.freehandPoints || cropState.freehandPoints.length < 3) { await showAlert("Draw a closed freehand shape first!", 'warning'); return; }
//     const { width, height } = mapParamsRef.current;
//     const mapPolygon = cropState.freehandPoints.map(p => ({ x: p.x, y: height - 1 - p.y }));
//     const newData = new Int8Array([...mapMsg.data]);
//     let keptPixels = 0, deletedPixels = 0;
//     for (let y = 0; y < height; y++) {
//       for (let x = 0; x < width; x++) {
//         const idx = y * width + x;
//         if (isPointInPolygon({ x, y }, mapPolygon)) { if (newData[idx] !== -2 && newData[idx] !== -3) keptPixels++; }
//         else { newData[idx] = -3; deletedPixels++; }
//       }
//     }
//     setMapMsg(prev => prev ? { ...prev, data: newData } : null);
//     setEditableMap(prev => prev ? { ...prev, data: [...newData] } : null);
//     recordHistoryState({ editableMapData: newData });
//     setCropState({ isCropping: false, startX: 0, startY: 0, endX: 0, endY: 0, isDragging: false, freehandPoints: [] });
//     setTool("pan");
//     await showAlert(`Crop applied!\n✅ Kept ${keptPixels} pixels inside selection\n🌫️ Made ${deletedPixels} pixels transparent`, 'success');
//   };

//   const loadMapFromZip = async (file) => {
//     try {
//       const jsZip = new JSZip();
//       const zip = await jsZip.loadAsync(file);
//       const yamlFiles = Object.keys(zip.files).filter(n => n.toLowerCase().endsWith('.yaml') || n.toLowerCase().endsWith('.yml'));
//       const pgmFiles = Object.keys(zip.files).filter(n => n.toLowerCase().endsWith('.pgm'));
//       if (!yamlFiles.length) { await showAlert("No YAML files in ZIP", 'error'); return; }
//       if (!pgmFiles.length) { await showAlert("No PGM files in ZIP", 'error'); return; }
//       const yamlText = await zip.files[yamlFiles[0]].async('text');
//       const parsedYaml = yaml.load(yamlText);
//       let pgmEntry = null;
//       if (parsedYaml.image) {
//         const possible = [parsedYaml.image, `${parsedYaml.image}.pgm`, parsedYaml.image.replace(/\.(png|jpg|jpeg)$/, '.pgm'), ...pgmFiles.filter(n => n.toLowerCase().includes(parsedYaml.image.toLowerCase()))];
//         for (const name of possible) { if (zip.files[name]) { pgmEntry = zip.files[name]; break; } }
//       }
//       if (!pgmEntry && pgmFiles.length) pgmEntry = zip.files[pgmFiles[0]];
//       if (!pgmEntry) { await showAlert("Could not find PGM file in ZIP", 'error'); return; }
//       const pgmBuf = await pgmEntry.async('arraybuffer');
//       await loadMapFromPGM(pgmBuf, parsedYaml, yamlFiles[0].replace(/\.(yaml|yml)$/, ''));
//       setNodes([]); setArrows([]); setZones([]); setCurrentZonePoints([]);
//       setArrowDrawing({ isDrawing: false, fromId: null, points: [] });
//       setRotation(0); clearHistory(); idCounter.current = 1;
//     } catch (err) {
//       console.error(err);
//       await showAlert("Failed to process ZIP.", 'error');
//     }
//   };

//   const loadMapFromPGM = async (pgmBuffer, yamlConfig, mapNameFromFile) => {
//     try {
//       const bytes = new Uint8Array(pgmBuffer);
//       const textHeader = new TextDecoder("ascii").decode(bytes.slice(0, 1000));
//       const headerLines = textHeader.split(/\s+/).filter(l => l.length > 0);
//       const magic = headerLines[0];
//       if (magic !== "P5" && magic !== "P2") throw new Error("Unsupported PGM format");
//       const width = parseInt(headerLines[1]), height = parseInt(headerLines[2]), maxVal = parseInt(headerLines[3]);
//       const headerLength = textHeader.indexOf(maxVal.toString()) + maxVal.toString().length;
//       const pixelBytes = bytes.slice(textHeader.slice(0, headerLength).length + 1);
//       const occupancyData = new Int8Array(width * height);
//       const negate = yamlConfig.negate || 0;
//       for (let y = 0; y < height; y++) {
//         for (let x = 0; x < width; x++) {
//           let v = pixelBytes[y * width + x];
//           if (negate === 1) v = 255 - v;
//           occupancyData[(height - 1 - y) * width + x] = (v >= 0 && v <= 10) ? 100 : (v >= 250 ? 0 : -1);
//         }
//       }
//       const loadedMap = { width, height, resolution: yamlConfig.resolution || 0.05, data: occupancyData, origin: { x: yamlConfig.origin?.[0] || 0, y: yamlConfig.origin?.[1] || 0, z: 0 } };
//       mapParamsRef.current = { width, height, resolution: yamlConfig.resolution || 0.05, originX: yamlConfig.origin?.[0] || 0, originY: yamlConfig.origin?.[1] || 0 };
//       setMapMsg(loadedMap);
//       setEditableMap({ ...loadedMap, data: [...occupancyData] });
//       setCanvasInitialized(true); toolInitializedRef.current = false; setMapLoaderActive(false);
//       if (mapNameFromFile && !mapName) setMapName(mapNameFromFile);
//       if (canvasRef.current) {
//         const c = canvasRef.current.parentElement;
//         if (c) setZoomState(p => ({ ...p, offsetX: Math.max(0, (c.clientWidth - width) / 2), offsetY: Math.max(0, (c.clientHeight - height) / 2), scale: 1 }));
//       }
//       await showAlert(`Map loaded!\n📊 ${width}×${height} pixels`, 'success');
//     } catch (err) {
//       console.error(err);
//       await showAlert("Failed to load map.", 'error');
//     }
//   };

//   useEffect(() => {
//     if (!ros || !rosConnected) return;

//     const mapListener = new window.ROSLIB.Topic({
//       ros,
//       name: "/map",
//       messageType: "nav_msgs/OccupancyGrid",
//     });

//     mapListener.subscribe((msg) => {
//       if (canvasInitializedRef.current) return;

//       const mapData = {
//         width: msg.info.width,
//         height: msg.info.height,
//         resolution: msg.info.resolution,
//         data: msg.data,
//         origin: msg.info.origin.position,
//       };

//       mapParamsRef.current = {
//         width: msg.info.width,
//         height: msg.info.height,
//         resolution: msg.info.resolution,
//         originX: msg.info.origin.position.x,
//         originY: msg.info.origin.position.y,
//       };

//       setMapMsg(mapData);
//       setEditableMap({
//         ...mapData,
//         data: [...msg.data],
//       });
//       setCanvasInitialized(true);
//       toolInitializedRef.current = false;

//       if (canvasRef.current) {
//         const c = canvasRef.current.parentElement;
//         if (c) {
//           setZoomState((p) => ({
//             ...p,
//             offsetX: Math.max(0, (c.clientWidth - msg.info.width) / 2),
//             offsetY: Math.max(0, (c.clientHeight - msg.info.height) / 2),
//             scale: 1,
//           }));
//         }
//       }
//     });

//     return () => {
//       mapListener.unsubscribe();
//     };
//   }, [ros, rosConnected]);

//   const saveMapToComputer = async () => {
//     if (!mapMsg || !mapParamsRef.current) { 
//       await showAlert("No map loaded!", 'warning'); 
//       return; 
//     }
    
//     try {
//       const { width, height } = mapMsg, { resolution, originX, originY } = mapParamsRef.current, SF = 1;
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
//       canvas.width = (rotation === 90 || rotation === 270) ? height*SF : width*SF;
//       canvas.height = (rotation === 90 || rotation === 270) ? width*SF : height*SF;
//       ctx.fillStyle = 'white'; 
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//       ctx.save(); 
//       ctx.scale(SF, SF);
      
//       if (rotation !== 0) {
//         const cX = canvas.width/(2*SF), cY = canvas.height/(2*SF);
//         ctx.translate(cX, cY); 
//         ctx.rotate(rotation * Math.PI / 180);
//         ctx.translate(rotation===90||rotation===270 ? -cY : -cX, rotation===90||rotation===270 ? -cX : -cY);
//       }
      
//       drawMapToCanvas(ctx, mapMsg.data, width, height, SF);
//       drawAnnotations(ctx, SF);
//       ctx.restore();
      
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       const pgmData = new Uint8Array(canvas.width * canvas.height);
      
//       for (let y = 0; y < canvas.height; y++) {
//         for (let x = 0; x < canvas.width; x++) {
//           const i = (y*canvas.width+x)*4;
//           pgmData[y*canvas.width+x] = Math.round(
//             (imageData.data[i] * 0.299 + imageData.data[i+1] * 0.587 + imageData.data[i+2] * 0.114)
//           );
//         }
//       }
      
//       const pgmHeader = `P5\n${canvas.width} ${canvas.height}\n255\n`;
//       const pgmBlob = new Blob([new TextEncoder().encode(pgmHeader), pgmData], { type: 'image/x-portable-graymap' });
      
//       let yamlContent = `image: ${mapName || 'map'}.pgm\nmode: trinary\nresolution: ${(resolution/SF).toFixed(6)}\norigin: [${originX.toFixed(6)}, ${originY.toFixed(6)}, 0]\nnegate: 0\noccupied_thresh: 0.65\nfree_thresh: 0.25\n`;
      
//       const forwardArrows = arrows.filter(a => a.direction !== "reverse");
//       let forwardNodes = forwardArrows.length > 0 ? getOrderedNodesFromArrows(forwardArrows, nodes) : nodes;
//       const forwardWPs = buildWaypointsArray(buildNodesWithYaw(forwardNodes, forwardArrows), "forward");
      
//       const jsonOutput = { waypoints: forwardWPs, total_nodes: forwardWPs.length };
      
//       await downloadFile(pgmBlob, `${mapName||'map'}.pgm`);
//       await new Promise(resolve => setTimeout(resolve, 250));
//       await downloadFile(new Blob([yamlContent], { type: 'application/x-yaml' }), `${mapName||'map'}.yaml`);
//       await new Promise(resolve => setTimeout(resolve, 250));
//       await downloadFile(new Blob([JSON.stringify(jsonOutput, null, 2)], { type: 'application/json' }), `${mapName||'map'}_waypoints.json`);
      
//       const speedCount = forwardWPs.filter(wp => wp.speed !== undefined).length;
//       await showAlert(`✅ Map exported successfully!\n📄 PGM + YAML + JSON saved\n📍 ${nodes.length} nodes on map\n⚡ ${speedCount} nodes have custom speeds`, 'success');
//     } catch (e) { 
//       console.error("Export error:", e); 
//       await showAlert(`Error exporting map:\n${e.message}`, 'error'); 
//     }
//   };

//   const saveCompleteMap = async () => {
//     if (!mapMsg || !mapParamsRef.current) { 
//       await showAlert("No map loaded!", 'warning'); 
//       return; 
//     }
    
//     try {
//       const { width, height } = mapMsg, { resolution, originX, originY } = mapParamsRef.current, SF = 1;
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
//       canvas.width = (rotation===90||rotation===270)?height*SF:width*SF;
//       canvas.height = (rotation===90||rotation===270)?width*SF:height*SF;
//       ctx.fillStyle = 'white'; 
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//       ctx.save(); 
//       ctx.scale(SF, SF);
      
//       if (rotation !== 0) {
//         const cX = canvas.width/(2*SF), cY = canvas.height/(2*SF);
//         ctx.translate(cX, cY); 
//         ctx.rotate(rotation * Math.PI / 180);
//         ctx.translate(rotation===90||rotation===270?-cY:-cX, rotation===90||rotation===270?-cX:-cY);
//       }
      
//       drawMapToCanvas(ctx, mapMsg.data, width, height, SF);
//       drawAnnotations(ctx, SF);
//       ctx.restore();
      
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       const pgmData = new Uint8Array(canvas.width * canvas.height);
      
//       for (let y = 0; y < canvas.height; y++) {
//         for (let x = 0; x < canvas.width; x++) {
//           const i = (y*canvas.width+x)*4;
//           pgmData[y*canvas.width+x] = Math.round(
//             (imageData.data[i] * 0.299 + imageData.data[i+1] * 0.587 + imageData.data[i+2] * 0.114)
//           );
//         }
//       }
      
//       const pgmHeader = `P5\n${canvas.width} ${canvas.height}\n255\n`;
//       const pgmBlob = new Blob([new TextEncoder().encode(pgmHeader), pgmData], { type: 'image/x-portable-graymap' });
      
//       let yamlContent = `image: ${mapName||'map'}.pgm\nmode: trinary\nresolution: ${(resolution/SF).toFixed(6)}\norigin: [${originX.toFixed(6)}, ${originY.toFixed(6)}, 0]\nnegate: 0\noccupied_thresh: 0.65\nfree_thresh: 0.25\n`;
      
//       const completeMapData = {
//         version: "2.0", 
//         mapName, 
//         rotation, 
//         timestamp: Date.now(),
//         nodes: nodes.map(n => ({ id: n.id, type: n.type, label: n.label, rosX: n.rosX, rosY: n.rosY, yaw: n.yaw || 0, speed: n.speed })),
//         arrows: arrows.map(a => ({ id: a.id, fromId: a.fromId, toId: a.toId, points: a.points || [], direction: a.direction, curved: a.curved === true, bends: a.bends || {} })),
//         zones: zones.map(z => ({ id: z.id, name: z.name, type: z.type, points: z.points.map(p => ({ rosX: p.rosX, rosY: p.rosY, canvasX: p.canvasX, canvasY: p.canvasY })) }))
//       };
      
//       const zip = new JSZip();
//       zip.file(`${mapName||'map'}.pgm`, pgmBlob);
//       zip.file(`${mapName||'map'}.yaml`, yamlContent);
//       zip.file(`${mapName||'map'}_data.json`, JSON.stringify(completeMapData, null, 2));
      
//       const zipBlob = await zip.generateAsync({ type: 'blob' });
//       await downloadFile(zipBlob, `${mapName||'map'}_complete.zip`);
      
//       const speedCount = nodes.filter(n => n.speed !== undefined && n.speed !== null).length;
//       await showAlert(`✅ Complete map saved!\n📦 ZIP archive created\n📍 ${nodes.length} nodes, ${arrows.length} arrows, ${zones.length} zones\n⚡ ${speedCount} nodes have custom speeds`, 'success');
//     } catch (e) { 
//       console.error("Save error:", e); 
//       await showAlert(`Error saving complete map:\n${e.message}`, 'error'); 
//     }
//   };

//   const loadCompleteMap = async (file) => {
//     try {
//       const zip = new JSZip(), zipData = await zip.loadAsync(file);
//       const pgmFiles = Object.keys(zipData.files).filter(n => n.toLowerCase().endsWith('.pgm'));
//       const yamlFiles = Object.keys(zipData.files).filter(n => n.toLowerCase().endsWith('.yaml'));
//       const dataFiles = Object.keys(zipData.files).filter(n => n.toLowerCase().endsWith('_data.json') || n.toLowerCase().endsWith('data.json'));
//       if (!pgmFiles.length) { await showAlert("No PGM file found in ZIP", 'error'); return; }
//       if (!yamlFiles.length) { await showAlert("No YAML file found in ZIP", 'error'); return; }
//       const yamlText = await zipData.files[yamlFiles[0]].async('text');
//       const parsedYaml = yaml.load(yamlText);
//       const pgmBuf = await zipData.files[pgmFiles[0]].async('arraybuffer');
//       await loadMapFromPGM(pgmBuf, parsedYaml, yamlFiles[0].replace(/\.(yaml|yml)$/, ''));
//       if (dataFiles.length > 0) {
//         const mapData = JSON.parse(await zipData.files[dataFiles[0]].async('text'));
//         const loadedNodes = mapData.nodes.map(node => { const canvas = rosToCanvasCoords(node.rosX, node.rosY); return { ...node, canvasX: canvas.x, canvasY: canvas.y }; });
//         const loadedArrows = mapData.arrows.map(arrow => ({ ...arrow, points: arrow.points || [], curved: arrow.curved === true, bends: arrow.bends || {} }));
//         const loadedZones = mapData.zones.map(zone => ({ ...zone, points: zone.points.map(p => ({ ...p })) }));
//         setNodes(loadedNodes); setArrows(loadedArrows); setZones(loadedZones);
//         if (mapData.rotation !== undefined) setRotation(mapData.rotation);
//         if (mapData.mapName) setMapName(mapData.mapName);
//         const allIds = [...loadedNodes, ...loadedArrows, ...loadedZones];
//         idCounter.current = allIds.reduce((max, item) => Math.max(max, parseInt(item.id?.split('_')[1]) || 0), 0) + 1;
//         resetHistoryToCurrent({ nodes: loadedNodes, arrows: loadedArrows, zones: loadedZones, rotation: mapData.rotation !== undefined ? mapData.rotation : 0 });
//         const speedCount = loadedNodes.filter(n => n.speed !== undefined && n.speed !== null).length;
//         await showAlert(`Complete map loaded!\n📍 ${loadedNodes.length} nodes, ${loadedArrows.length} arrows, ${loadedZones.length} zones restored!\n⚡ ${speedCount} nodes have custom speeds`, 'success');
//       } else { await showAlert("Map loaded but no node data found in ZIP", 'info'); }
//     } catch (err) { console.error(err); await showAlert(`Failed to load complete map:\n${err.message}`, 'error'); }
//   };

//   const loadJSONWithMap = async () => {
//     if (!mapMsg) { 
//       await showAlert("Please load a map first before importing JSON!", 'warning'); 
//       return; 
//     }
    
//     const fileInput = document.createElement('input');
//     fileInput.type = 'file'; 
//     fileInput.accept = '.json';
//     fileInput.onchange = async (e) => {
//       const file = e.target.files[0]; 
//       if (!file) return;
      
//       try {
//         const data = JSON.parse(await file.text());
//         let loadedNodes = [];
        
//         if (data.waypoints && Array.isArray(data.waypoints)) {
//           loadedNodes = data.waypoints.map((wp, idx) => {
//             const canvas = rosToCanvasCoords(wp.x, wp.y);
//             let label = wp.label;
//             if (!label) {
//               const typeCount = loadedNodes.filter(n => n.type === wp.type).length + 1;
//               label = `${wp.type}_${typeCount}`;
//             }
//             const yawDegrees = wp.theta ? (wp.theta * 180 / Math.PI) : 0;
//             return { 
//               id: makeId("node"), 
//               type: wp.type || "waypoint", 
//               label: label,
//               rosX: wp.x, 
//               rosY: wp.y, 
//               canvasX: canvas.x, 
//               canvasY: canvas.y, 
//               yaw: yawDegrees,
//               speed: wp.speed,
//               ...(wp.name && { name: wp.name }),
//               ...(wp.plc_feedback && { plc_feedback: wp.plc_feedback })
//             };
//           });
          
//           const loadedArrows = [];
//           if (loadedNodes.length > 1) {
//             for (let i = 0; i < loadedNodes.length - 1; i++) {
//               loadedArrows.push({ 
//                 id: makeId("arrow"), 
//                 fromId: loadedNodes[i].id, 
//                 toId: loadedNodes[i+1].id, 
//                 points: [], 
//                 direction: "forward" 
//               });
//             }
//           }
//           setArrows(loadedArrows);
//         } 
//         else if (data.nodes && Array.isArray(data.nodes)) {
//           loadedNodes = data.nodes.map(node => {
//             let canvasX = node.canvasX, canvasY = node.canvasY;
//             if (!canvasX || !canvasY) {
//               const canvas = rosToCanvasCoords(node.rosX, node.rosY);
//               canvasX = canvas.x;
//               canvasY = canvas.y;
//             }
//             return { 
//               ...node, 
//               canvasX, 
//               canvasY,
//               yaw: node.yaw || 0,
//               speed: node.speed
//             };
//           });
//           if (data.arrows) setArrows(data.arrows);
//         }
        
//         if (loadedNodes.length === 0) {
//           await showAlert("No valid waypoints or nodes found in JSON file", 'warning');
//           return;
//         }
        
//         const validNodes = [];
//         for (const node of loadedNodes) {
//           if (isWithinMapBounds(node.rosX, node.rosY)) {
//             validNodes.push(node);
//           } else {
//             console.warn(`Node ${node.label} at (${node.rosX}, ${node.rosY}) is outside map bounds`);
//           }
//         }
        
//         if (validNodes.length === 0) {
//           await showAlert("No nodes are within the map bounds!", 'warning');
//           return;
//         }
        
//         if (validNodes.length !== loadedNodes.length) {
//           await showAlert(`⚠️ ${loadedNodes.length - validNodes.length} node(s) were outside map bounds and were skipped.\n\n✅ Imported ${validNodes.length} valid nodes.`, 'warning');
//         }
        
//         setNodes(validNodes);
//         nodesRef.current = validNodes;
        
//         const allIds = [...validNodes, ...arrows];
//         const maxId = allIds.reduce((max, item) => {
//           const idNum = parseInt(item.id?.split('_')[1]) || 0;
//           return Math.max(max, idNum);
//         }, 0);
//         idCounter.current = maxId + 1;
        
//         let importedZones = [];
//         if (data.zones) {
//           importedZones = data.zones.filter(zone =>
//             zone.points.every(point => isWithinMapBounds(point.rosX, point.rosY))
//           );
//         }
//         zonesRef.current = importedZones;
//         setZones(importedZones);

//         const importedArrows = data.arrows
//           ? data.arrows.map(arrow => ({
//               ...arrow,
//               points: arrow.points || [],
//               curved: arrow.curved === true,
//               bends: arrow.bends || {}
//             }))
//           : arrowsRef.current;
//         arrowsRef.current = importedArrows;
//         setArrows(importedArrows);

//         // JSON import is one atomic history action.
//         recordHistoryState({
//           nodes: validNodes,
//           arrows: importedArrows,
//           zones: importedZones
//         });

//         const speedCount = validNodes.filter(n => n.speed !== undefined && n.speed !== null).length;
//         await showAlert(`✅ JSON imported successfully!\n📍 ${validNodes.length} nodes\n⚡ ${speedCount} nodes have custom speeds`, 'success');
        
//       } catch (err) { 
//         console.error(err); 
//         await showAlert(`Failed to load JSON:\n${err.message}`, 'error'); 
//       }
//     };
//     fileInput.click();
//   };

//   const saveMapAsPNG = async () => {
//     if (!mapMsg || !mapParamsRef.current) { await showAlert("No map loaded!", 'warning'); return; }
//     try {
//       const { width, height } = mapMsg, SF = 4;
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
//       canvas.width = width*SF; canvas.height = height*SF;
//       ctx.fillStyle = '#f0f0f0'; ctx.fillRect(0, 0, canvas.width, canvas.height);
//       ctx.save(); ctx.scale(SF, SF);
//       if (rotation !== 0) { ctx.translate(width/2, height/2); ctx.rotate(rotation * Math.PI / 180); ctx.translate(-width/2, -height/2); }
//       const imgData = ctx.createImageData(width, height);
//       for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
//         const val = mapMsg.data[y*width+x], py = height-1-y, i = (py*width+x)*4;
//         let gray = 205, alpha = 255;
//         if (val === -3 || val === -2) { gray = 255; alpha = 0; }
//         else if (val === 0) gray = 255;
//         else if (val === 100) gray = 0;
//         else if (val !== -1) gray = 255 - Math.floor((val/100)*255);
//         imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] = gray; imgData.data[i+3] = alpha;
//       }
//       const offCanvas = document.createElement("canvas"); offCanvas.width = width; offCanvas.height = height;
//       offCanvas.getContext("2d").putImageData(imgData, 0, 0); ctx.drawImage(offCanvas, 0, 0, width, height);
//       drawAnnotations(ctx, SF);
//       ctx.restore();
//       canvas.toBlob(blob => {
//         const url = URL.createObjectURL(blob), a = document.createElement('a');
//         a.href = url; a.download = `${mapName||'map'}_rotated_${rotation}_${SF}x.png`;
//         a.click(); URL.revokeObjectURL(url);
//         showAlert(`PNG saved!\n(${nodes.length} nodes, ${arrows.length} arrows, ${zones.length} zones)`, 'success');
//       }, 'image/png');
//     } catch (e) { console.error(e); showAlert(`Error saving PNG:\n${e.message}`, 'error'); }
//   };

//   const placeNodeAtClient = (clientX, clientY) => {
//     if (!mapParamsRef.current) return;
//     const ros = clientToRosCoords(clientX, clientY);
//     if (!ros) return;
//     const canvas = rosToCanvasCoords(ros.x, ros.y);
//     if (!isWithinMapBounds(ros.x, ros.y)) return;
//     if (!isWithinPlaceableArea(canvas.x, canvas.y)) return;
    
//     const existingOfType = nodesRef.current.filter(n => n.type === nodeType);
//     const nextNumber = existingOfType.length + 1;
    
//     let label = `${nodeType}_${nextNumber}`;
//     let counter = nextNumber;
//     while (nodesRef.current.some(n => n.label === label)) {
//       counter++;
//       label = `${nodeType}_${counter}`;
//     }
    
//     const newNode = { 
//       id: makeId("node"), 
//       type: nodeType, 
//       label: label,
//       rosX: ros.x, 
//       rosY: ros.y, 
//       canvasX: canvas.x, 
//       canvasY: canvas.y, 
//       yaw: 0.0,
//       speed: undefined
//     };
    
//     const nextNodes = [...nodesRef.current, newNode];
//     setNodes(nextNodes);
//     recordHistoryState({ nodes: nextNodes });
//   };

//   const findNodeAtCanvas = (cx, cy, radius = 10) => {
//     for (let i = nodesRef.current.length - 1; i >= 0; --i) {
//       const n = nodesRef.current[i];
//       if (Math.hypot(n.canvasX - cx, n.canvasY - cy) <= radius) return n;
//     }
//     return null;
//   };

//   // Point on a quadratic bezier at parameter t (0..1), used to hit-test along the curve.
//   const pointOnQuadratic = (p0x, p0y, cx, cy, p2x, p2y, t) => {
//     const mt = 1 - t;
//     return {
//       x: mt * mt * p0x + 2 * mt * t * cx + t * t * p2x,
//       y: mt * mt * p0y + 2 * mt * t * cy + t * t * p2y
//     };
//   };

//   // Return the control point for a quadratic sub-segment [t0,t1] of an
//   // original quadratic Bezier. This is used when a corner-to-corner curve
//   // is automatically split into normal waypoint nodes: every generated
//   // arrow segment keeps the exact same curve instead of becoming straight.
//   const getQuadraticSubsegmentControlPoint = (p0, control, p2, t0, t1) => {
//     const tm = (t0 + t1) / 2;
//     const a = pointOnQuadratic(p0.x, p0.y, control.x, control.y, p2.x, p2.y, t0);
//     const m = pointOnQuadratic(p0.x, p0.y, control.x, control.y, p2.x, p2.y, tm);
//     const b = pointOnQuadratic(p0.x, p0.y, control.x, control.y, p2.x, p2.y, t1);

//     // For a quadratic Bezier, B(0.5) = (A + 2C + B) / 4,
//     // therefore C = 2*M - (A+B)/2.
//     return {
//       x: 2 * m.x - (a.x + b.x) / 2,
//       y: 2 * m.y - (a.y + b.y) / 2
//     };
//   };

//   // Convert a Bezier control point into the signed "bend" value used by
//   // getSegmentControlPoint(). This makes stored bends independent of zoom.
//   const controlPointToSignedBend = (p1, p2, control) => {
//     const dx = p2.x - p1.x;
//     const dy = p2.y - p1.y;
//     const len = Math.hypot(dx, dy) || 1;
//     const px = -dy / len;
//     const py = dx / len;
//     const mx = (p1.x + p2.x) / 2;
//     const my = (p1.y + p2.y) / 2;
//     return (control.x - mx) * px + (control.y - my) * py;
//   };

//   // Locate the curved arrow segment (if any) whose *drawn curve* passes near a canvas point,
//   // by sampling the quadratic bezier along its length. Only segments between two "corner"
//   // points (waypointforcorner nodes / mid-arrow control points) are curved, so only those
//   // are draggable. Lets the user grab the visible arrow line directly, anywhere along it,
//   // rather than needing to find a small fixed handle.
//   const findArrowCurveHitAtCanvas = (cx, cy, radius = 8) => {
//     const SAMPLES = 24;
//     for (let ai = arrowsRef.current.length - 1; ai >= 0; --ai) {
//       const a = arrowsRef.current[ai];
//       const from = nodesRef.current.find(n => n.id === a.fromId);
//       const to = nodesRef.current.find(n => n.id === a.toId);
//       if (!from || !to) continue;
//       const ap = [
//         { ...from, isCorner: from.type === "waypointforcorner" },
//         ...(a.points || []).map(p => ({ ...p, isCorner: true })),
//         { ...to, isCorner: to.type === "waypointforcorner" }
//       ];
//       const bends = a.bends || {};
//       for (let i = 0; i < ap.length - 1; i++) {
//         const p1 = ap[i], p2 = ap[i + 1];
//         if (!(a.curved === true || (Object.keys(bends).length > 0 && ap.length === 2) || (p1.isCorner && p2.isCorner))) continue;
//         const ctrl = getSegmentControlPoint(p1, p2, i, bends);
//         let minDist = Infinity;
//         for (let s = 0; s <= SAMPLES; s++) {
//           const t = s / SAMPLES;
//           const pt = pointOnQuadratic(p1.canvasX, p1.canvasY, ctrl.x, ctrl.y, p2.canvasX, p2.canvasY, t);
//           const d = Math.hypot(cx - pt.x, cy - pt.y);
//           if (d < minDist) minDist = d;
//         }
//         if (minDist <= radius) {
//           return { arrowId: a.id, segmentIndex: i, mx: ctrl.mx, my: ctrl.my, px: ctrl.px, py: ctrl.py, len: ctrl.len };
//         }
//       }
//     }
//     return null;
//   };

//   const AUTO_WAYPOINT_SPACING = 1.0; // meters

//   // Generates a chain of normal "waypoint" nodes ~1m apart between two corner points
//   // (each either a real waypointforcorner node, or a via-point captured from one — both
//   // shapes carry {id, rosX, rosY, canvasX, canvasY}), plus the arrows connecting them
//   // end-to-end. Rather than walking the straight line between the two points, the
//   // waypoints are sampled ALONG the same quadratic curve a direct corner-to-corner arrow
//   // used to be drawn with (see getSegmentControlPoint / drawSmoothArrowPath) — using the
//   // very same bow calculation — so the resulting chain of short straight segments traces
//   // that original curve instead of cutting straight across it.
//   // `accNewNodes` accumulates every node created so far in the current finish operation,
//   // so labels stay unique even when one arrow-drawing pass fills in several
//   // corner-to-corner segments back to back.
//   const buildWaypointChainBetween = (fromPt, toPt, direction, accNewNodes) => {
//     const dx = toPt.rosX - fromPt.rosX;
//     const dy = toPt.rosY - fromPt.rosY;
//     const dist = Math.hypot(dx, dy);

//     const newArrows = [];
//     let prevId = fromPt.id;

//     const steps = Math.floor(dist / AUTO_WAYPOINT_SPACING);

//     // The original corner-to-corner curve. Every generated waypoint-to-waypoint
//     // arrow below receives the corresponding Bezier sub-segment, so the complete
//     // chain remains curved from the first waypoint-for-corner to the second.
//     const originalControl = getSegmentControlPoint(
//       { canvasX: fromPt.canvasX, canvasY: fromPt.canvasY },
//       { canvasX: toPt.canvasX, canvasY: toPt.canvasY },
//       0,
//       {}
//     );

//     const curveStart = { x: fromPt.canvasX, y: fromPt.canvasY };
//     const curveEnd = { x: toPt.canvasX, y: toPt.canvasY };
//     const curveControl = { x: originalControl.x, y: originalControl.y };

//     let waypointCount =
//       nodesRef.current.filter(n => n.type === "waypoint").length +
//       accNewNodes.filter(n => n.type === "waypoint").length;

//     const labelTaken = (label) =>
//       nodesRef.current.some(n => n.label === label) ||
//       accNewNodes.some(n => n.label === label);

//     // Keep the parameter positions exactly tied to distance along the original
//     // corner-to-corner path. This gives us a stable curve even after rendering
//     // the route as separate arrow objects.
//     const tValues = [0];
//     for (let i = 1; i <= steps; i++) {
//       const t = (i * AUTO_WAYPOINT_SPACING) / dist;
//       if (t >= 1) break;
//       tValues.push(t);
//     }
//     tValues.push(1);

//     for (let i = 1; i < tValues.length; i++) {
//       const t0 = tValues[i - 1];
//       const t1 = tValues[i];

//       const startCanvas = pointOnQuadratic(
//         curveStart.x, curveStart.y,
//         curveControl.x, curveControl.y,
//         curveEnd.x, curveEnd.y, t0
//       );
//       const endCanvas = pointOnQuadratic(
//         curveStart.x, curveStart.y,
//         curveControl.x, curveControl.y,
//         curveEnd.x, curveEnd.y, t1
//       );

//       const subControl = getQuadraticSubsegmentControlPoint(
//         curveStart, curveControl, curveEnd, t0, t1
//       );

//       const bend = controlPointToSignedBend(
//         startCanvas,
//         endCanvas,
//         subControl
//       );

//       // The first segment starts at the original corner node. All following
//       // segments start at the waypoint created in the previous iteration.
//       const currentStartId = prevId;

//       if (i < tValues.length - 1) {
//         const ros = canvasToRosCoords(endCanvas.x, endCanvas.y);
//         if (!ros) continue;

//         waypointCount++;
//         let label = `waypoint_${waypointCount}`;
//         while (labelTaken(label)) {
//           waypointCount++;
//           label = `waypoint_${waypointCount}`;
//         }

//         const wpNode = {
//           id: makeId("node"),
//           type: "waypoint",
//           label,
//           rosX: ros.x,
//           rosY: ros.y,
//           canvasX: endCanvas.x,
//           canvasY: endCanvas.y,
//           yaw: 0.0,
//           speed: undefined
//         };

//         accNewNodes.push(wpNode);

//         newArrows.push({
//           id: makeId("arrow"),
//           fromId: currentStartId,
//           toId: wpNode.id,
//           points: [],
//           direction,
//           curved: true,
//           bends: { 0: bend }
//         });

//         prevId = wpNode.id;
//       } else {
//         // Final generated segment ends exactly at the second
//         // waypoint-for-corner node.
//         newArrows.push({
//           id: makeId("arrow"),
//           fromId: currentStartId,
//           toId: toPt.id,
//           points: [],
//           direction,
//           curved: true,
//           bends: { 0: bend }
//         });
//       }
//     }

//     return { newArrows };
//   };

//   // Finishes the in-progress arrow at `toNode`. Walks the full chain — start node,
//   // every corner via-point clicked along the way, and the end node — and for each
//   // consecutive pair that are BOTH corner points, auto-fills the straight line between
//   // them with real "waypoint" nodes every 1m instead of drawing a bare curve. Segments
//   // where either end isn't a corner stay as plain direct arrows, same as before.
//   // `extraNodesToAdd` lets the caller fold in a brand-new endpoint node (e.g. one placed
//   // by clicking empty space to finish) so everything lands in a single history step.
//   const finishArrowAt = (toNode, viaPoints, extraNodesToAdd = []) => {
//     const fromNode = nodesRef.current.find(n => n.id === arrowDrawing.fromId);
//     if (!fromNode) { setArrowDrawing({ isDrawing: false, fromId: null, points: [] }); return; }

//     const sequence = [
//       { id: fromNode.id, rosX: fromNode.rosX, rosY: fromNode.rosY, canvasX: fromNode.canvasX, canvasY: fromNode.canvasY, isCorner: fromNode.type === "waypointforcorner" },
//       ...viaPoints,
//       { id: toNode.id, rosX: toNode.rosX, rosY: toNode.rosY, canvasX: toNode.canvasX, canvasY: toNode.canvasY, isCorner: toNode.type === "waypointforcorner" }
//     ];

//     const accNewNodes = [...extraNodesToAdd];
//     const allNewArrows = [];

//     for (let i = 0; i < sequence.length - 1; i++) {
//       const a = sequence[i], b = sequence[i + 1];
//       if (a.isCorner && b.isCorner) {
//         const { newArrows } = buildWaypointChainBetween(a, b, arrowDirection, accNewNodes);
//         allNewArrows.push(...newArrows);
//       } else {
//         allNewArrows.push({ id: makeId("arrow"), fromId: a.id, toId: b.id, points: [], direction: arrowDirection });
//       }
//     }

//     const nextNodes = accNewNodes.length ? [...nodesRef.current, ...accNewNodes] : nodesRef.current;
//     const nextArrows = [...arrowsRef.current, ...allNewArrows];
//     if (accNewNodes.length) setNodes(nextNodes);
//     setArrows(nextArrows);
//     recordHistoryState({ nodes: nextNodes, arrows: nextArrows });
//     setArrowDrawing({ isDrawing: false, fromId: null, points: [] });
//     setLastClickedCornerNodeId(null);
//   };

//   // ✅ FIX #2: IMPROVED ARROW CONNECTION LOGIC
//   const handleConnectClick = (clientX, clientY) => {
//     const c = clientToCanvasCoords(clientX, clientY);
//     const node = findNodeAtCanvas(c.x, c.y, 8 / zoomState.scale);

//     if (!node) {
//       if (arrowDrawing.isDrawing) {
//         if (!isWithinPlaceableArea(c.x, c.y)) return;
//         const ros = clientToRosCoords(clientX, clientY);
//         if (!ros || !isWithinMapBounds(ros.x, ros.y)) return;
//         const canvas = rosToCanvasCoords(ros.x, ros.y);
//         const num = nodesRef.current.filter(n => n.type === nodeType).length + 1;
//         const newNode = { id: makeId("node"), type: nodeType, label: `${nodeType}_${num}`, rosX: ros.x, rosY: ros.y, canvasX: canvas.x, canvasY: canvas.y, yaw: 0.0, speed: undefined };
//         finishArrowAt(newNode, arrowDrawing.points, [newNode]);
//       }
//       return;
//     }

//     if (!arrowDrawing.isDrawing) {
//       // Start new arrow
//       setArrowDrawing({ isDrawing: true, fromId: node.id, points: [] });
//       setLastClickedCornerNodeId(null); // Reset when starting new arrow
//       return;
//     }

//     if (arrowDrawing.fromId === node.id) {
//       // Clicked same node as start
//       setArrowDrawing({ isDrawing: false, fromId: null, points: [] });
//       setLastClickedCornerNodeId(null);
//       return;
//     }

//     // FIX #2: Improved waypointforcorner handling with double-click detection
//     if (node.type === "waypointforcorner") {
//       const now = Date.now();
//       // Check if this is a double-click (same node within 500ms)
//       const isQuickDoubleClick = lastClickedCornerNodeId === node.id && 
//                                   (now - cornerClickTimeRef.current < 500);
      
//       if (isQuickDoubleClick) {
//         // Double-click on corner node = finish arrow there.
//         // The first click on this same node already appended it as a via-point
//         // (see the "else" branch below) at this exact location. If we don't drop
//         // that duplicate here, the final segment becomes zero-length (same start
//         // and end point), which breaks the arrowhead-direction math and makes the
//         // arrowhead point the wrong way regardless of which side the curve bows to.
//         const lastPt = arrowDrawing.points[arrowDrawing.points.length - 1];
//         const trimmedPoints = (lastPt && lastPt.id === node.id)
//           ? arrowDrawing.points.slice(0, -1)
//           : arrowDrawing.points;
//         finishArrowAt(node, trimmedPoints);
//       } else {
//         // Single click on corner = add as control point and continue
//         setArrowDrawing(prev => ({
//           ...prev,
//           points: [...prev.points, { id: node.id, rosX: node.rosX, rosY: node.rosY, canvasX: node.canvasX, canvasY: node.canvasY, isCorner: true }]
//         }));
//         setLastClickedCornerNodeId(node.id);
//         cornerClickTimeRef.current = now;
//       }
//       return;
//     }

//     // Clicking any other node finishes the arrow
//     finishArrowAt(node, arrowDrawing.points);
//   };

//   const finishZone = () => {
//     if (!currentZonePoints.length) return;
//     const nextZones = [...zonesRef.current, { id: makeId("zone"), name: zoneName || `Zone_${zonesRef.current.length + 1}`, type: zoneType, points: currentZonePoints.slice() }];
//     setZones(nextZones);
//     recordHistoryState({ zones: nextZones });
//     setCurrentZonePoints([]); setZoneName(""); setZoneType("normal");
//   };

//   const handleSendYAMLToRobot = async () => {
//     if (!mapName) { await showAlert("Enter a map name first!", 'warning'); return; }
//     if (nodes.length === 0) { await showAlert("No nodes to send!", 'warning'); return; }
//     setCurrentSendType('yaml'); setRobotIp(""); setSendingStatus(""); setShowRobotIpModal(true);
//   };

//   const handleSendJSONToRobot = async () => {
//     if (!mapName) { await showAlert("Enter a map name first!", 'warning'); return; }
//     if (nodes.length === 0) { await showAlert("No nodes to send!", 'warning'); return; }
//     setCurrentSendType('json'); setRobotIp(""); setSendingStatus(""); setShowRobotIpModal(true);
//   };

//   const executeSendToRobot = async () => {
//     if (!robotIp.trim()) { setSendingStatus("Please enter robot IP address"); return; }
//     const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
//     if (!ipPattern.test(robotIp)) { setSendingStatus("Please enter a valid IP address"); return; }
//     if (currentSendType === 'yaml') setIsSavingYAML(true); else setIsSavingJSON(true);
//     setDbStatus("Sending..."); setSendingStatus("Sending...");
//     try {
//       const forwardArrows = arrows.filter(a => a.direction !== "reverse");
//       const reverseArrows = arrows.filter(a => a.direction === "reverse");
//       let forwardNodes = forwardArrows.length > 0 ? getOrderedNodesFromArrows(forwardArrows, nodes) : nodes;
//       let reverseNodes = reverseArrows.length > 0 ? getOrderedNodesFromArrows(reverseArrows, nodes) : [];
//       const forwardWPs = forwardNodes.length > 0 ? buildWaypointsArray(buildNodesWithYaw(forwardNodes, forwardArrows), "forward") : [];
//       let reverseWPs = reverseNodes.length > 0 ? buildWaypointsArray(buildNodesWithYaw(reverseNodes, reverseArrows), "reverse") : [];
      
//       const formData = new FormData();
//       formData.append('mapName', mapName); formData.append('robotIp', robotIp);
//       if (currentSendType === 'yaml') {
//         const yamlContent = buildYAMLString(forwardWPs, reverseWPs);
//         formData.append('yaml', new Blob([yamlContent], { type: 'text/yaml' }), `${mapName}.yaml`);
//         const response = await fetch('http://localhost:5000/send-yaml-to-robot', { method: 'POST', body: formData });
//         if (!response.ok) { const err = await response.json(); throw new Error(err.error || 'Failed'); }
//         setDbStatus("Sent!"); setSendingStatus("✅ Sent successfully!");
//         setTimeout(() => { setShowRobotIpModal(false); showAlert(`YAML sent to robot at ${robotIp}!\n📍 ${forwardWPs.length + reverseWPs.length} waypoints sent!`, 'success'); }, 1000);
//       } else {
//         formData.append('json', new Blob([JSON.stringify({ waypoints: forwardWPs, total_nodes: forwardWPs.length }, null, 2)], { type: 'application/json' }), `${mapName}_waypoints.json`);
//         const response = await fetch('http://localhost:5000/send-json-to-robot', { method: 'POST', body: formData });
//         if (!response.ok) { const err = await response.json(); throw new Error(err.error || 'Failed'); }
//         setDbStatus("Sent!"); setSendingStatus("✅ Sent successfully!");
//         setTimeout(() => { setShowRobotIpModal(false); showAlert(`JSON sent to robot at ${robotIp}!\n📍 ${forwardWPs.length} waypoints sent!`, 'success'); }, 1000);
//       }
//     } catch (e) { console.error(e); setDbStatus("Failed!"); setSendingStatus(`❌ Failed: ${e.message}`); }
//     finally { setIsSavingYAML(false); setIsSavingJSON(false); }
//   };

//   const saveNodesToDatabase = async () => {
//     if (nodes.length === 0 && arrows.length === 0 && zones.length === 0) { await showAlert("Nothing to save!", 'warning'); return; }
//     try {
//       setIsSaving(true); setDbStatus("Saving...");
//       const response = await fetch('http://localhost:5000/save-nodes', {
//         method: 'POST', headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ mapName: mapName || 'default', nodes: nodes.map(n => ({ ...n, yaw: n.yaw || 0.0 })), arrows, zones, yaw_calculation_method: yawCalculationMethod })
//       });
//       if (response.ok) {
//         const r = await response.json(); setDbStatus("Saved!");
//         const speedCount = nodes.filter(n => n.speed !== undefined && n.speed !== null).length;
//         await showAlert(`Saved to database!\n🏷️ Map: ${r.map_name}\n📍 ${nodes.length} nodes, ${arrows.length} arrows, ${zones.length} zones\n⚡ ${speedCount} nodes have custom speeds`, 'success');
//       } else { throw new Error(`HTTP ${response.status}`); }
//     } catch (e) { console.error(e); setDbStatus("Save failed!"); await showAlert(`Error: ${e.message}`, 'error'); }
//     finally { setIsSaving(false); }
//   };

//   const handleClearAll = async () => {
//     const ok = await showConfirm("Clear ALL nodes, arrows, and zones?", 'warning');
//     if (!ok) return;
//     nodesRef.current = [];
//     arrowsRef.current = [];
//     zonesRef.current = [];
//     rotationRef.current = 0;
//     setNodes([]); setArrows([]); setZones([]); setCurrentZonePoints([]);
//     setArrowDrawing({ isDrawing: false, fromId: null, points: [] }); setRotation(0);
//     recordHistoryState({ nodes: [], arrows: [], zones: [], rotation: 0 });
//   };

//   const handleClearWorkspace = async () => {
//     const ok = await showConfirm("Clear ALL data including the map?\nThis cannot be undone.", 'error');
//     if (!ok) return;
//     localStorage.removeItem("mapEditorWorkspace");
//     idCounter.current = 1;
//     setMapMsg(null); setEditableMap(null); setNodes([]); setArrows([]); setZones([]);
//     setCurrentZonePoints([]); setArrowDrawing({ isDrawing: false, fromId: null, points: [] });
//     setMapName(""); setCanvasInitialized(false); setRotation(0);
//     mapParamsRef.current = null; toolInitializedRef.current = false; clearHistory();
//     setZoomState({ scale: 1, offsetX: 0, offsetY: 0, isDragging: false, lastX: 0, lastY: 0 });
//   };

//   const drawMapToCanvas = (ctx, mapMsgData, width, height, SF) => {
//     const imgData = ctx.createImageData(width, height);
//     for (let y = 0; y < height; y++) {
//       for (let x = 0; x < width; x++) {
//         const val = mapMsgData[y * width + x];
//         const py = height - 1 - y;
//         const i = (py * width + x) * 4;
//         let gray = (val === -3 || val === -2) ? 205 : val === -1 ? 205 : val === 0 ? 255 : val === 100 ? 0 : 255 - Math.floor((val / 100) * 255);
//         imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] = gray; imgData.data[i+3] = 255;
//       }
//     }
//     const offCanvas = document.createElement("canvas");
//     offCanvas.width = width; offCanvas.height = height;
//     offCanvas.getContext("2d").putImageData(imgData, 0, 0);
//     ctx.drawImage(offCanvas, 0, 0, width, height);
//   };

//   const drawAnnotations = (ctx, SF) => {
//     zones.forEach(z => {
//       if (!z.points || z.points.length < 2) return;
//       ctx.beginPath();
//       z.points.forEach((p, i) => { if (i === 0) ctx.moveTo(p.canvasX, p.canvasY); else ctx.lineTo(p.canvasX, p.canvasY); });
//       ctx.closePath();
//       ctx.fillStyle = z.type === 'keep_out' ? "rgba(0,0,0,0.5)" : "rgba(16,185,129,0.15)"; ctx.fill();
//       ctx.strokeStyle = z.type === 'keep_out' ? "rgba(0,0,0,1)" : "rgba(16,185,129,0.6)";
//       ctx.lineWidth = 2/SF; ctx.stroke();
//       const cx = z.points.reduce((s,p) => s+p.canvasX, 0)/z.points.length;
//       const cy = z.points.reduce((s,p) => s+p.canvasY, 0)/z.points.length;
//       ctx.fillStyle = z.type === 'keep_out' ? "#dc2626" : "#064e3b";
//       ctx.font = `${Math.max(8, 12/SF)}px Arial`; ctx.fillText(z.name, cx+6/SF, cy);
//     });
//     arrows.forEach(a => {
//       const from = nodes.find(n => n.id === a.fromId), to = nodes.find(n => n.id === a.toId);
//       if (!from || !to) return;
//       const ap = [
//         { ...from, isCorner: from.type === "waypointforcorner" },
//         ...(a.points || []).map(p => ({ ...p, isCorner: true })),
//         { ...to, isCorner: to.type === "waypointforcorner" }
//       ];
//       if (ap.length < 2) return;
//       const color = a.direction === "reverse" ? "#ef4444" : "#f97316";
//       const bends = a.bends || {};
//       const curveAllSegments = a.curved === true || (Object.keys(bends).length > 0 && ap.length === 2);
//       ctx.strokeStyle = color; ctx.lineWidth = Math.max(1, 3/SF);
//       drawSmoothArrowPath(ctx, ap, bends, curveAllSegments);
//       const last = ap[ap.length-1], secLast = ap[ap.length-2];
//       if (last && secLast) {
//         let tangentX = last.canvasX - secLast.canvasX;
//         let tangentY = last.canvasY - secLast.canvasY;

//         if (curveAllSegments) {
//           const lastIndex = ap.length - 2;
//           const lastCtrl = getSegmentControlPoint(secLast, last, lastIndex, bends);
//           tangentX = last.canvasX - lastCtrl.x;
//           tangentY = last.canvasY - lastCtrl.y;
//         }

//         const angle = Math.atan2(tangentY, tangentX), hl = Math.max(6, 12/SF);
//         ctx.beginPath(); ctx.moveTo(last.canvasX, last.canvasY);
//         ctx.lineTo(last.canvasX - hl*Math.cos(angle-Math.PI/6), last.canvasY - hl*Math.sin(angle-Math.PI/6));
//         ctx.lineTo(last.canvasX - hl*Math.cos(angle+Math.PI/6), last.canvasY - hl*Math.sin(angle+Math.PI/6));
//         ctx.closePath(); ctx.fillStyle = color; ctx.fill();
//       }
//     });
//     nodes.forEach(n => {
//       const radius = Math.max(2, 6/SF);
//       const nodeColor = T.nodeColors[n.type] || "#1e40af";
//       ctx.beginPath();
//       ctx.fillStyle = nodeColor;
//       ctx.arc(n.canvasX, n.canvasY, radius, 0, Math.PI*2);
//       ctx.fill();
//       ctx.font = `bold ${Math.max(6, 10/SF)}px Arial`;
//       ctx.lineWidth = 3 / SF;
//       ctx.strokeStyle = 'white';
//       ctx.strokeText(n.label || n.type, n.canvasX + radius + 2, n.canvasY - radius - 2);
//       ctx.fillStyle = '#111827';
//       ctx.fillText(n.label || n.type, n.canvasX + radius + 2, n.canvasY - radius - 2);
//     });
//   };

//   const handleMouseDown = (e) => {
//     const rect = canvasRef.current?.getBoundingClientRect();
//     if (!rect) return;
//     const x = e.clientX - rect.left, y = e.clientY - rect.top;

//     if (e.button === 2) {
//       const c = clientToCanvasCoords(e.clientX, e.clientY);
//       const node = findNodeAtCanvas(c.x, c.y, 8 / zoomState.scale);
//       if (node) {
//         e.preventDefault();
//         openSpeedModal(node);
//         return;
//       }
//     }

//     if (e.button === 0 && (tool === "pan" || tool === "place_node")) {
//       const c = clientToCanvasCoords(e.clientX, e.clientY);
//       const node = findNodeAtCanvas(c.x, c.y, 8 / zoomState.scale);
//       if (node) {
//         draggingNodeRef.current = node.id;
//         setDraggingNodeId(node.id);
//         return;
//       }

//       // No node hit — see if the click landed on a curved arrow's drawn line.
//       // Only enabled in "pan" mode so it never conflicts with node placement clicks.
//       if (tool === "pan") {
//         const arrowHit = findArrowCurveHitAtCanvas(c.x, c.y, 8 / zoomState.scale);
//         if (arrowHit) {
//           draggingArrowRef.current = arrowHit;
//           setDraggingArrowInfo({ arrowId: arrowHit.arrowId, segmentIndex: arrowHit.segmentIndex });
//           return;
//         }
//       }
//     }

//     if (e.button === 1 || tool === "pan") { setZoomState(p => ({ ...p, isDragging: true, lastX: x, lastY: y })); return; }
//     if (tool === "place_node") { placeNodeAtClient(e.clientX, e.clientY); return; }
//     if (tool === "connect") { handleConnectClick(e.clientX, e.clientY); return; }
//     if (tool === "zone") {
//       if (!mapParamsRef.current) return;
//       const ros = clientToRosCoords(e.clientX, e.clientY); if (!ros) return;
//       const canvas = rosToCanvasCoords(ros.x, ros.y);
//       setCurrentZonePoints(p => [...p, { rosX: ros.x, rosY: ros.y, canvasX: canvas.x, canvasY: canvas.y }]); return;
//     }
//     if (tool === "erase") { eraseAtClient(e.clientX, e.clientY); return; }
//     if (tool === "crop") {
//       const c = clientToCanvasCoords(e.clientX, e.clientY);
//       setCropState({ ...cropState, startX: c.x, startY: c.y, endX: c.x, endY: c.y, isDragging: true, freehandPoints: [{x: c.x, y: c.y}] });
//     }
//   };

//   const handleMouseMove = (e) => {
//     if (!canvasRef.current) return;
//     const cc = clientToCanvasCoords(e.clientX, e.clientY);
//     const ros = canvasToRosCoords(cc.x, cc.y);
//     if (ros) setCursorCoords({ rosX: ros.x, rosY: ros.y, canvasX: cc.x, canvasY: cc.y }); else setCursorCoords(null);

//     if (draggingNodeRef.current) {
//       if (ros && isWithinMapBounds(ros.x, ros.y) && isWithinPlaceableArea(cc.x, cc.y)) {
//         setNodes(prev => {
//           const next = prev.map(n =>
//             n.id === draggingNodeRef.current
//               ? { ...n, canvasX: cc.x, canvasY: cc.y, rosX: ros.x, rosY: ros.y }
//               : n
//           );
//           nodesRef.current = next;
//           return next;
//         });
//       }
//       return;
//     }

//     if (draggingArrowRef.current) {
//       // Project the cursor onto the perpendicular of the segment's straight line.
//       // The *sign* of this projection is what determines which side the curve bows to —
//       // dragging across the straight line flips the sign, which flips the curve.
//       const { arrowId, segmentIndex, mx, my, px, py, len } = draggingArrowRef.current;
//       const vx = cc.x - mx, vy = cc.y - my;
//       let proj = vx * px + vy * py;
//       const maxBow = Math.max(25, len * 0.6);
//       proj = Math.max(-maxBow, Math.min(maxBow, proj));
//       setArrows(prev => {
//         const next = prev.map(a =>
//           a.id === arrowId
//             ? { ...a, bends: { ...(a.bends || {}), [segmentIndex]: proj } }
//             : a
//         );
//         arrowsRef.current = next;
//         return next;
//       });
//       return;
//     }

//     if ((tool === "pan" || tool === "place_node") && !zoomState.isDragging) {
//       const hoverNode = findNodeAtCanvas(cc.x, cc.y, 8 / zoomState.scale);
//       setHoveredNodeId(hoverNode ? hoverNode.id : null);
//       if (!hoverNode && tool === "pan") {
//         const hoverArrow = findArrowCurveHitAtCanvas(cc.x, cc.y, 8 / zoomState.scale);
//         setHoveredArrowControl(hoverArrow ? `${hoverArrow.arrowId}_${hoverArrow.segmentIndex}` : null);
//       } else if (hoveredArrowControl) {
//         setHoveredArrowControl(null);
//       }
//     } else {
//       if (hoveredNodeId) setHoveredNodeId(null);
//       if (hoveredArrowControl) setHoveredArrowControl(null);
//     }

//     if (zoomState.isDragging) {
//       const rect = canvasRef.current.getBoundingClientRect();
//       const x = e.clientX - rect.left, y = e.clientY - rect.top;
//       const dx = x - zoomState.lastX, dy = y - zoomState.lastY;
//       if (rotation !== 0) {
//         const angle = -rotation * Math.PI / 180;
//         setZoomState(p => ({ ...p, offsetX: p.offsetX + dx*Math.cos(angle) - dy*Math.sin(angle), offsetY: p.offsetY + dx*Math.sin(angle) + dy*Math.cos(angle), lastX: x, lastY: y }));
//       } else { setZoomState(p => ({ ...p, offsetX: p.offsetX + dx, offsetY: p.offsetY + dy, lastX: x, lastY: y })); }
//     }
//     if (cropState.isDragging && tool === "crop") {
//       const c = clientToCanvasCoords(e.clientX, e.clientY);
//       setCropState(prev => ({ ...prev, endX: c.x, endY: c.y, freehandPoints: [...prev.freehandPoints, {x: c.x, y: c.y}] }));
//     }
//     if (handEraseState.isErasing) continueHandErase(e.clientX, e.clientY);
//   };

//   const handleMouseUp = () => {
//     if (draggingNodeRef.current || draggingArrowRef.current) {
//       recordHistoryState();
//       draggingNodeRef.current = null;
//       setDraggingNodeId(null);
//       draggingArrowRef.current = null;
//       setDraggingArrowInfo(null);
//       return;
//     }
//     if (zoomState.isDragging) setZoomState(p => ({ ...p, isDragging: false }));
//     if (cropState.isDragging && tool === "crop") setCropState(prev => ({ ...prev, isDragging: false }));
//     if (handEraseState.isErasing) stopHandErase();
//   };

//   useEffect(() => {
//     const canvas = canvasRef.current; if (!canvas) return;
//     const ctx = canvas.getContext("2d", { willReadFrequently: true }); if (!ctx) return;
//     ctx.imageSmoothingEnabled = false;
//     const container = canvas.parentElement; if (!container) return;
//     const cW = container.clientWidth, cH = container.clientHeight;
//     if (cW <= 0 || cH <= 0) return;
//     canvas.width = cW; canvas.height = cH;
//     canvas.style.width = `${cW}px`; canvas.style.height = `${cH}px`;
//     ctx.clearRect(0, 0, cW, cH);
//     const mapToRender = editableMap || mapMsg;
//     if (!mapToRender || !canvasInitialized) {
//       ctx.fillStyle = T.surface; ctx.fillRect(0, 0, cW, cH);
//       ctx.fillStyle = T.textSecondary; ctx.font = "16px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
//       ctx.fillText("Load a map to begin editing", cW/2, cH/2); return;
//     }
//     const { width, height, data } = mapToRender;
//     ctx.save();
//     if (rotation !== 0) { const cx = cW/2, cy = cH/2; ctx.translate(cx, cy); ctx.rotate(rotation * Math.PI / 180); ctx.translate(-cx, -cy); }
//     ctx.translate(zoomState.offsetX, zoomState.offsetY); ctx.scale(zoomState.scale, zoomState.scale);
//     const imgData = ctx.createImageData(width, height);
//     for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
//       const val = data[y*width+x], py = height-1-y, i = (py*width+x)*4;
//       let gray = 205, alpha = 255;
//       if (val === -3) { gray = 255; alpha = 0; } else if (val === -2) { gray = 180; } else if (val === -1) { gray = 205; } else if (val === 0) { gray = 255; } else if (val === 100) { gray = 0; } else { gray = 255 - Math.floor((val/100)*255); }
//       imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] = gray; imgData.data[i+3] = alpha;
//     }
//     const offCanvas = document.createElement("canvas"); offCanvas.width = width; offCanvas.height = height;
//     const oCtx = offCanvas.getContext("2d"); if (oCtx) { oCtx.putImageData(imgData, 0, 0); ctx.drawImage(offCanvas, 0, 0, width, height); }
//     if (cropState.isCropping && cropState.freehandPoints.length > 0) {
//       ctx.strokeStyle = '#00ff00'; ctx.lineWidth = 2/zoomState.scale; ctx.setLineDash([5, 5]);
//       ctx.beginPath();
//       cropState.freehandPoints.forEach((point, idx) => { if (idx === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y); });
//       if (cropState.isDragging && cursorCoords) ctx.lineTo(cursorCoords.canvasX, cursorCoords.canvasY);
//       ctx.stroke(); ctx.setLineDash([]);
//       if (cropState.freehandPoints.length >= 3) {
//         ctx.fillStyle = 'rgba(0,255,0,0.1)'; ctx.beginPath();
//         cropState.freehandPoints.forEach((point, idx) => { if (idx === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y); });
//         ctx.closePath(); ctx.fill();
//       }
//     }
//     zones.forEach(z => {
//       if (!z.points || z.points.length < 2) return;
//       ctx.beginPath();
//       z.points.forEach((p, i) => { if (i === 0) ctx.moveTo(p.canvasX, p.canvasY); else ctx.lineTo(p.canvasX, p.canvasY); });
//       ctx.closePath();
//       ctx.fillStyle = z.type === 'keep_out' ? "rgba(0,0,0,0.5)" : "rgba(16,185,129,0.15)"; ctx.fill();
//       ctx.strokeStyle = z.type === 'keep_out' ? "rgba(0,0,0,1)" : "rgba(16,185,129,0.6)";
//       ctx.lineWidth = 1/zoomState.scale; ctx.stroke();
//       const cx = z.points.reduce((s,p)=>s+p.canvasX,0)/z.points.length;
//       const cy = z.points.reduce((s,p)=>s+p.canvasY,0)/z.points.length;
//       ctx.fillStyle = z.type === 'keep_out' ? "#dc2626" : "#064e3b";
//       ctx.font = `${Math.max(8, 12/zoomState.scale)}px Arial`; ctx.fillText(z.name, cx+6/zoomState.scale, cy);
//     });
//     if (currentZonePoints.length) {
//       ctx.beginPath();
//       currentZonePoints.forEach((p, idx) => { if (idx === 0) ctx.moveTo(p.canvasX, p.canvasY); else ctx.lineTo(p.canvasX, p.canvasY); });
//       ctx.strokeStyle = zoneType === 'keep_out' ? "rgba(0,0,0,0.9)" : "rgba(59,130,246,0.9)";
//       ctx.lineWidth = zoneType === 'keep_out' ? 2/zoomState.scale : 1/zoomState.scale; ctx.stroke();
//     }
//     arrows.forEach(a => {
//       const from = nodes.find(n => n.id === a.fromId), to = nodes.find(n => n.id === a.toId);
//       if (!from || !to) return;
//       const ap = [
//         { ...from, isCorner: from.type === "waypointforcorner" },
//         ...(a.points || []).map(p => ({ ...p, isCorner: true })),
//         { ...to, isCorner: to.type === "waypointforcorner" }
//       ];
//       if (ap.length < 2) return;
//       const color = a.direction === "reverse" ? "#ef4444" : "#f97316";
//       const bends = a.bends || {};
//       const curveAllSegments = a.curved === true || (Object.keys(bends).length > 0 && ap.length === 2);
//       ctx.strokeStyle = color; ctx.lineWidth = Math.max(1, 2/zoomState.scale);
//       drawSmoothArrowPath(ctx, ap, bends, curveAllSegments);
//       const last = ap[ap.length-1], secLast = ap[ap.length-2];
//       if (last && secLast) {
//         const angle = Math.atan2(last.canvasY-secLast.canvasY, last.canvasX-secLast.canvasX), hl = Math.max(6, 12/zoomState.scale);
//         ctx.beginPath(); ctx.moveTo(last.canvasX, last.canvasY);
//         ctx.lineTo(last.canvasX-hl*Math.cos(angle-Math.PI/6), last.canvasY-hl*Math.sin(angle-Math.PI/6));
//         ctx.lineTo(last.canvasX-hl*Math.cos(angle+Math.PI/6), last.canvasY-hl*Math.sin(angle+Math.PI/6));
//         ctx.closePath(); ctx.fillStyle = color; ctx.fill();
//       }

//       // Direct-drag feedback: no fixed handle dot — instead, re-stroke just the curved
//       // segment the user is hovering or dragging with a bright, thicker overlay so it's
//       // clear the whole line is grabbable, not just a single point.
//       if (tool === "pan") {
//         for (let i = 0; i < ap.length - 1; i++) {
//           const p1 = ap[i], p2 = ap[i + 1];
//           if (!(a.curved === true || (Object.keys(bends).length > 0 && ap.length === 2) || (p1.isCorner && p2.isCorner))) continue;
//           const key = `${a.id}_${i}`;
//           const isActive = (draggingArrowInfo && draggingArrowInfo.arrowId === a.id && draggingArrowInfo.segmentIndex === i) ||
//                             hoveredArrowControl === key;
//           if (!isActive) continue;
//           const ctrl = getSegmentControlPoint(p1, p2, i, bends);
//           ctx.save();
//           ctx.strokeStyle = "#ffffff";
//           ctx.globalAlpha = 0.85;
//           ctx.lineWidth = Math.max(3, 5 / zoomState.scale);
//           ctx.beginPath();
//           ctx.moveTo(p1.canvasX, p1.canvasY);
//           ctx.quadraticCurveTo(ctrl.x, ctrl.y, p2.canvasX, p2.canvasY);
//           ctx.stroke();
//           ctx.restore();
//         }
//       }
//     });
//     if (arrowDrawing.isDrawing) {
//       const from = nodes.find(n => n.id === arrowDrawing.fromId);
//       if (from && cursorCoords) {
//         const allPoints = [
//           { ...from, isCorner: from.type === "waypointforcorner" },
//           ...arrowDrawing.points,
//           { ...cursorCoords, isCorner: false }
//         ];
//         if (allPoints.length >= 2) {
//           ctx.strokeStyle = "rgba(255,165,0,0.8)"; ctx.lineWidth = Math.max(1, 2/zoomState.scale);
//           drawSmoothArrowPath(ctx, allPoints, {}, false);
//         }
//       }
//     }
//     nodes.forEach(n => {
//       const isActive = n.id === draggingNodeId || n.id === hoveredNodeId;
//       const radius = Math.max(2, 6/zoomState.scale) * (isActive ? 1.4 : 1);
//       const nodeColor = T.nodeColors[n.type] || "#1e40af";
//       ctx.beginPath();
//       ctx.fillStyle = nodeColor;
//       ctx.arc(n.canvasX, n.canvasY, radius, 0, Math.PI*2);
//       ctx.fill();
//       if (isActive) {
//         ctx.lineWidth = Math.max(1, 2/zoomState.scale);
//         ctx.strokeStyle = "#ffffff";
//         ctx.stroke();
//       }
//       ctx.font = `bold ${Math.max(6, 10/zoomState.scale)}px Arial`;
//       ctx.lineWidth = 3 / zoomState.scale;
//       ctx.strokeStyle = 'white';
//       ctx.strokeText(n.label || n.type, n.canvasX + radius + 2, n.canvasY - radius - 2);
//       ctx.fillStyle = '#111827';
//       ctx.fillText(n.label || n.type, n.canvasX + radius + 2, n.canvasY - radius - 2);
//     });

//     if (cursorCoords) {
//       ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.lineWidth = Math.max(0.5, 0.5/zoomState.scale);
//       ctx.beginPath(); ctx.moveTo(cursorCoords.canvasX, 0); ctx.lineTo(cursorCoords.canvasX, height);
//       ctx.moveTo(0, cursorCoords.canvasY); ctx.lineTo(width, cursorCoords.canvasY); ctx.stroke();
//     }
//     ctx.restore();
//   }, [mapMsg, editableMap, zoomState, nodes, arrows, zones, currentZonePoints, cursorCoords, T, rotation, arrowDrawing, cropState, zoneType, tool, canvasInitialized, draggingNodeId, hoveredNodeId, draggingArrowInfo, hoveredArrowControl]);

//   const MapLoaderModal = () => {
//     const handleZipSelect = async (e) => {
//       const file = e.target.files[0]; if (!file) return;
//       await loadMapFromZip(file);
//     };
//     return (
//       <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
//         <div style={{ background:T.card, padding:24, borderRadius:12, border:`1px solid ${T.border}`, borderTop:`3px solid ${T.accent}`, maxWidth:500, width:'90%', boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>
//           <h3 style={{ margin:'0 0 20px 0', color:T.text }}>🗺️ Load Map from ZIP</h3>
//           <div style={{ marginBottom:20 }}>
//             <label style={styles.label}>Select ZIP File:
//               <div style={{ marginTop:6, border:`1px solid ${T.border}`, borderRadius:8, padding:'10px 12px', background:T.card, color:T.text, fontSize:'14px', cursor:'pointer', position:'relative', overflow:'hidden' }}>
//                 Choose ZIP file containing YAML and PGM...
//                 <input type="file" accept=".zip" onChange={handleZipSelect} style={{ position:'absolute', inset:0, opacity:0, cursor:'pointer' }} />
//               </div>
//             </label>
//             <div style={styles.hint}>Select a ZIP file containing both YAML and PGM map files.</div>
//           </div>
//           <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
//             <button onClick={() => { setMapLoaderActive(false); }} style={styles.button}>Cancel</button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const RobotIpModal = () => (
//     <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
//       <div style={{ background:T.card, padding:24, borderRadius:12, border:`1px solid ${T.border}`, borderTop:`3px solid #10b981`, maxWidth:400, width:'90%', boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>
//         <h3 style={{ margin:'0 0 20px 0', color:T.text }}>{currentSendType === 'yaml' ? '📤 Send YAML to Robot' : '📤 Send JSON to Robot'}</h3>
//         <div style={{ marginBottom:20 }}>
//           <label style={styles.label}>Robot IP Address</label>
//           <input type="text" value={robotIp} onChange={e => setRobotIp(e.target.value)} placeholder="e.g., 192.168.1.100" style={styles.input} autoFocus />
//           <p style={styles.hint}>Enter the IP address of the robot</p>
//         </div>
//         {sendingStatus && (
//           <div style={{ padding:'10px', borderRadius:8, marginBottom:20, background: sendingStatus.includes('✅') ? '#10b981' : sendingStatus.includes('❌') ? '#ef4444' : '#3b82f6', color:'white', fontSize:'14px', textAlign:'center' }}>
//             {sendingStatus}
//           </div>
//         )}
//         <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
//           <button onClick={() => { setShowRobotIpModal(false); setSendingStatus(""); }} style={styles.button}>Cancel</button>
//           <button onClick={executeSendToRobot} style={{ ...styles.buttonAction, background:'#10b981' }} disabled={isSavingYAML || isSavingJSON}>
//             {isSavingYAML || isSavingJSON ? 'Sending...' : 'Send'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   const getCanvasCursor = () => {
//     if (draggingArrowInfo) return "grabbing";
//     if (draggingNodeId) return "move";
//     if (hoveredArrowControl && tool === "pan") return "grab";
//     if (hoveredNodeId && (tool === "pan" || tool === "place_node")) return "grab";
//     if (tool === "erase") return "cell";
//     if (tool === "pan") return zoomState.isDragging ? "grabbing" : "grab";
//     if (tool === "place_node") return "crosshair";
//     if (tool === "connect") return "crosshair";
//     if (tool === "zone") return "crosshair";
//     return "default";
//   };

//   return (
//     <div style={styles.container}>
//       {ModalComponent}
//       {speedModalNode && <SpeedModal />}
//       {mapLoaderActive && <MapLoaderModal />}
//       {showRobotIpModal && <RobotIpModal />}

//       <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, flexWrap:"wrap", gap:10 }}>
//         <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
//           <h1 style={{ margin:0, color:T.text, fontSize:'24px' }}>
//             <FaMapMarkerAlt style={{ color:T.accent, marginRight:8 }} />Map Editor
//           </h1>
//           <div style={styles.mapInfo}>Map: {mapName || "—"}</div>
//           <div style={styles.mapInfo}>Rotation: {rotation}°</div>
//           <div style={styles.mapInfo}>Nodes: {nodes.length}</div>
//           <div style={styles.mapInfo}>Arrows: {arrows.length}</div>
//           <div style={styles.mapInfo}>Zones: {zones.length}</div>
//         </div>
//         <div style={{ display:'flex', alignItems:'center', gap:8 }}>
//           <div style={styles.hud}>{cursorCoords ? `ROS: ${cursorCoords.rosX.toFixed(2)}, ${cursorCoords.rosY.toFixed(2)}` : "Hover map for coordinates"}</div>
//           <button onClick={toggleDarkMode} style={{ ...styles.buttonSmall, background:'transparent', color:T.text, border:`1px solid ${T.border}` }} title={darkMode ? "Light Mode" : "Dark Mode"}>
//             {darkMode ? <FaSun size={14} /> : <FaMoon size={14} />}
//           </button>
//         </div>
//       </div>

//       <div style={styles.mainContent}>
//         <div style={styles.sidebar}>
//           <div style={{ display:'flex', gap:4, marginBottom:16, borderBottom:`1px solid ${T.border}`, paddingBottom:8 }}>
//             {[{ id:"map", label:"🗺️ Map" }, { id:"annotate", label:"📍 Annotate" }, { id:"export", label:"📤 Export" }, { id:"tools", label:"🔧 Tools" }].map(tab => (
//               <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex:1, padding:'8px 4px', borderRadius:8, border:'none', cursor:'pointer', fontSize:'12px', fontWeight: activeTab===tab.id ? '600' : '500', background: activeTab===tab.id ? T.accent : 'transparent', color: activeTab===tab.id ? '#fff' : T.textSecondary, transition:'all 0.2s ease' }}>
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           {activeTab === "map" && (
//             <>
//               <div style={styles.buttonGroup}>
//                 <label style={styles.label}>Map Name</label>
//                 <input value={mapName} onChange={e => setMapName(e.target.value)} placeholder="My Map" style={styles.input} />
//               </div>
//               <div style={styles.buttonGroup}>
//                 <label style={styles.label}>Map Operations</label>
//                 <button onClick={() => setMapLoaderActive(true)} style={styles.buttonAction}><FaUpload /> Load Map</button>
//                 <button onClick={saveMapToComputer} style={styles.buttonAction}>
//                   <FaDownload /> Save PGM Map
//                 </button>
//                 <button onClick={saveMapAsPNG} style={styles.buttonAction}><FaImage /> Save PNG Map</button>
//                 <button onClick={saveCompleteMap} style={styles.buttonAction}>
//                   <FaDownload /> Save Complete ZIP
//                 </button>
//               </div>
//               <div style={styles.buttonGroup}>
//                 <label style={styles.label}>Database</label>
//                 <button onClick={saveNodesToDatabase} style={styles.buttonAction}><FaDatabase /> Save to DB</button>
//                 <div style={{ fontSize:'12px', color:T.textSecondary, marginTop:4 }}>Status: {isSaving ? "Saving..." : dbStatus}</div>
//               </div>
//             </>
//           )}

//           {activeTab === "annotate" && (
//             <>
//               <div style={styles.buttonGroup}>
//                 <label style={styles.label}>Yaw Calculation</label>
//                 <div style={{ display:"flex", alignItems:"center", gap:4 }}>
//                   <select value={yawCalculationMethod} onChange={e => setYawCalculationMethod(e.target.value)} style={styles.select}>
//                     <option value="direction">Direction-based</option>
//                     <option value="none">No calculation</option>
//                   </select>
//                   <button onClick={() => setShowYawTooltip(!showYawTooltip)} style={{ ...styles.buttonSmall, width:'36px' }}>?</button>
//                 </div>
//                 <div style={styles.hint}>Yaw calculated from arrow direction when saving.</div>
//               </div>
//               <div style={styles.buttonGroup}>
//                 <label style={styles.label}>Undo / Redo (Ctrl+Z / Ctrl+Y)</label>
//                 <div style={{ display:"flex", gap:8 }}>
//                   <button onClick={handleUndo} style={{ ...styles.button, flex:1 }} disabled={historyIndex <= 0}><FaUndo /> Undo</button>
//                   <button onClick={handleRedo} style={{ ...styles.button, flex:1 }} disabled={historyIndex >= history.length-1}><FaRedoAlt /> Redo</button>
//                 </div>
//                 <div style={styles.hint}>History: {historyIndex+1}/{history.length} steps</div>
//               </div>
//               <div style={styles.buttonGroup}>
//                 <label style={styles.label}>Clear Data</label>
//                 <button onClick={handleClearAll} style={styles.buttonDanger}><FaTrashAlt /> Clear Annotations</button>
//                 <button onClick={handleClearWorkspace} style={{ ...styles.buttonDanger, background:'#dc2626' }}><FaTrashAlt /> Delete Map & Annotations</button>
//               </div>
//             </>
//           )}

//           {activeTab === "export" && (
//             <>
//               <div style={styles.buttonGroup}>
//                 <label style={styles.label}>Export Files</label>
//                 <button onClick={handleSaveYAML} style={styles.buttonAction}><FaFileExport /> Export YAML</button>
//                 <button onClick={handleSaveJSON} style={styles.buttonAction}><FaFileExport /> Export JSON</button>
//               </div>
//               <div style={styles.buttonGroup}>
//                 <label style={styles.label}>Import</label>
//                 <button onClick={loadJSONWithMap} style={{ ...styles.buttonAction, background:T.accent, color:'white' }}><FaUpload /> Import Annotations</button>
//               </div>
//               <div style={styles.buttonGroup}>
//                 <label style={styles.label}>Send to Robot</label>
//                 <button onClick={handleSendYAMLToRobot} style={{ ...styles.buttonAction, background:'#f59e0b' }} disabled={isSavingYAML}><FaRocket /> {isSavingYAML ? "Sending..." : "Send YAML to Robot"}</button>
//                 <button onClick={handleSendJSONToRobot} style={{ ...styles.buttonAction, background:'#10b981' }} disabled={isSavingJSON}><FaRocket /> {isSavingJSON ? "Sending..." : "Send JSON to Robot"}</button>
//                 <div style={{ fontSize:'12px', color:T.textSecondary, marginTop:4 }}>Status: {dbStatus}</div>
//               </div>
//             </>
//           )}

//           {activeTab === "tools" && (
//             <>
//               <div style={styles.buttonGroup}>
//                 <label style={styles.label}>Drawing Tools</label>
//                 <div style={styles.toolGrid}>
//                   {[
//                     { id:"pan", icon:<FaHandPaper />, label:"Pan" },
//                     { id:"place_node", icon:<FaMapMarkerAlt />, label:"Node" },
//                     { id:"connect", icon:<FaArrowRight />, label:"Arrow" },
//                     { id:"zone", icon:<FaDrawPolygon />, label:"Zone" },
//                     { id:"erase", icon:<FaEraser />, label:"Erase" },
//                   ].map(({ id, icon, label }) => (
//                     <button key={id} onClick={() => {
//                       if (arrowDrawing.isDrawing) {
//                         setArrowDrawing({ isDrawing: false, fromId: null, points: [] });
//                       }
//                       setTool(id);
//                     }} style={tool === id ? styles.buttonSmallActive : styles.buttonSmall}>{icon} {label}</button>
//                   ))}
//                   <button onClick={() => {
//                     if (arrowDrawing.isDrawing) {
//                       setArrowDrawing({ isDrawing: false, fromId: null, points: [] });
//                     }
//                     startCrop();
//                   }} style={tool === "crop" ? styles.buttonSmallActive : styles.buttonSmall}><FaCropAlt /> Crop</button>
//                 </div>
//               </div>
//               <div style={styles.buttonGroup}>
//                 <label style={styles.label}>Node Type</label>
//                 <select value={nodeType} onChange={e => setNodeType(e.target.value)} style={styles.select}>
//                   <option value="station">Station</option>
//                   <option value="docking">Docking</option>
//                   <option value="waypoint">Waypoint</option>
//                   <option value="home">Home</option>
//                   <option value="charging">Charging</option>
//                   <option value="waypointforcorner">Waypoint For Corner</option>
//                 </select>
//               </div>
//               <div style={styles.buttonGroup}>
//                 <label style={styles.label}>Arrow Direction</label>
//                 <button onClick={() => setArrowDirection(p => p === "forward" ? "reverse" : "forward")}
//                   style={{ ...styles.button, background: arrowDirection === "reverse" ? "#ef4444" : "#f97316", color:"white", border:"none" }}>
//                   {arrowDirection === "reverse" ? "⬅️ Reverse" : "➡️ Forward"}
//                 </button>
//               </div>
//               <div style={styles.buttonGroup}>
//                 <label style={styles.label}>Zone Settings</label>
//                 <div style={styles.toolGrid}>
//                   <button onClick={() => setZoneType("normal")} style={zoneType === "normal" ? styles.buttonSmallActive : styles.buttonSmall}><FaDrawPolygon /> Normal</button>
//                   <button onClick={() => setZoneType("keep_out")} style={zoneType === "keep_out" ? styles.buttonSmallActive : styles.buttonSmall}><FaBan /> Restricted</button>
//                 </div>
//                 <input value={zoneName} onChange={e => setZoneName(e.target.value)} placeholder="Zone name" style={styles.input} />
//                 <button onClick={finishZone} style={styles.buttonSmall} disabled={currentZonePoints.length < 3}><FaCheck /> Finish Zone</button>
//               </div>
//               <div style={styles.buttonGroup}>
//                 <label style={styles.label}>Erase Settings</label>
//                 <select value={eraseMode} onChange={e => setEraseMode(e.target.value)} style={styles.select}>
//                   <option value="objects">🗑️ Objects</option>
//                   <option value="noise">🧹 Map Noise</option>
//                   <option value="hand">✋ Hand Erase</option>
//                 </select>
//                 {(eraseMode === "noise" || eraseMode === "hand") && (
//                   <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8 }}>
//                     <span style={{ fontSize:'12px' }}>Radius:</span>
//                     <input type="range" min="1" max="20" value={eraseRadius} onChange={e => setEraseRadius(parseInt(e.target.value))} style={{ flex:1 }} />
//                     <span>{eraseRadius}</span>
//                   </div>
//                 )}
//               </div>
//               {cropState.isCropping && (
//                 <div style={styles.buttonGroup}>
//                   <label style={styles.label}>Crop Actions</label>
//                   <div style={{ display:"flex", gap:8 }}>
//                     <button onClick={handleApplyCrop} style={{ ...styles.buttonSmall, background:'#10b981', color:'white' }} disabled={!cropState.freehandPoints || cropState.freehandPoints.length < 3}><FaCheck /> Apply</button>
//                     <button onClick={cancelCrop} style={{ ...styles.buttonSmall, background:T.danger, color:'white' }}><FaTimes /> Cancel</button>
//                   </div>
//                 </div>
//               )}
//               <div style={styles.buttonGroup}>
//                 <label style={styles.label}>Map Rotation</label>
//                 <div style={{ display:"flex", gap:8, alignItems:"center" }}>
//                   <input type="number" min="0" max="359" value={rotation} onChange={e => { const v = parseInt(e.target.value); if (!isNaN(v)) setRotation(((v % 360) + 360) % 360); }}
//                     style={{ ...styles.input, width:'80px', margin:0, textAlign:'center' }} placeholder="Deg" />
//                   <span>°</span>
//                   <button onClick={() => { const nextRotation = (rotationRef.current + 90) % 360; setRotation(nextRotation); recordHistoryState({ rotation: nextRotation }); }} style={styles.buttonSmall}>+90°</button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//         <div style={styles.mapContainer}>
//           <div style={styles.canvasContainer}>
//             <div style={styles.zoomControls}>
//               <div style={{ textAlign:"center", fontSize:13, fontWeight:'700', color:T.text, marginBottom:4 }}>{Math.round(zoomState.scale*100)}%</div>
//               <button onClick={() => setZoomState(p => ({ ...p, scale: Math.min(5, p.scale*1.2) }))} style={styles.zoomButton} title="Zoom In"><FaSearchPlus /></button>
//               <button onClick={() => setZoomState(p => ({ ...p, scale: Math.max(0.1, p.scale*0.8) }))} style={styles.zoomButton} title="Zoom Out"><FaSearchMinus /></button>
//               <button onClick={() => {
//                 if (!mapMsg || !canvasRef.current) return;
//                 const c = canvasRef.current.parentElement;
//                 if (c) setZoomState(p => ({ ...p, scale:1, offsetX:(c.clientWidth - mapMsg.width)/2, offsetY:(c.clientHeight - mapMsg.height)/2 }));
//               }} style={styles.zoomButton} title="Reset View"><FaExpand /></button>
//             </div>
            

//             {showYawTooltip && (
//               <div style={styles.yawTooltip}>
//                 <h4 style={{ margin:'0 0 8px 0', color:T.text }}>📐 Yaw Calculation Info</h4>
//                 <p style={{ margin:'0 0 8px 0', fontSize:'12px', color:T.textSecondary }}>
//                   • Yaw is calculated from arrow direction<br />
//                   • Waypoints are ordered by arrow connections<br />
//                   • Forward arrows → forward mission<br />
//                   • Reverse arrows → reverse mission<br />
//                   • Speed only appears in YAML if set via right-click<br />
//                   • Right-click on any node to set custom speed<br />
//                   • Click and drag any node in Pan/Node mode to reposition it<br />
//                   • Chain the Arrow tool through "Waypoint For Corner" nodes for smooth curved paths<br />
//                   • Double-click a corner node to finish arrow there!<br />
//                   • Any stretch of the arrow between two "Waypoint For Corner" nodes auto-fills with normal waypoints every 1m — works for a direct connection or a whole chain of corners!<br />
//                   • In Pan mode, click and drag directly on a curved arrow segment to bend it — cross the straight line to flip the curve to the other side!
//                 </p>
//                 <button onClick={() => setShowYawTooltip(false)} style={styles.buttonSmall}>Close</button>
//               </div>
//             )}

//             <canvas
//               ref={canvasRef}
//               style={{ 
//                 width:"100%", 
//                 height:"100%", 
//                 display:"block", 
//                 cursor: getCanvasCursor()
//               }}
//               onMouseDown={handleMouseDown}
//               onMouseMove={handleMouseMove}
//               onMouseUp={handleMouseUp}
//               onContextMenu={(e) => {
//                 const c = clientToCanvasCoords(e.clientX, e.clientY);
//                 const node = findNodeAtCanvas(c.x, c.y, 8 / zoomState.scale);
//                 if (node) {
//                   e.preventDefault();
//                   openSpeedModal(node);
//                 }
//               }}
//               onMouseLeave={() => {
//                 draggingNodeRef.current = null;
//                 setDraggingNodeId(null);
//                 setHoveredNodeId(null);
//                 draggingArrowRef.current = null;
//                 setDraggingArrowInfo(null);
//                 setHoveredArrowControl(null);
//                 setCursorCoords(null);
//                 setZoomState(p => ({ ...p, isDragging: false }));
//                 setCropState(prev => ({ ...prev, isDragging: false }));
//                 if (handEraseState.isErasing) stopHandErase();
//               }}
//               onTouchStart={e => {
//                 if (e.touches.length === 1) {
//                   const t = e.touches[0], rect = canvasRef.current?.getBoundingClientRect();
//                   if (rect) {
//                     const cc = clientToCanvasCoords(t.clientX, t.clientY);
//                     const node = findNodeAtCanvas(cc.x, cc.y, 10 / zoomState.scale);
//                     if (node && (tool === "pan" || tool === "place_node")) {
//                       saveToHistory();
//                       draggingNodeRef.current = node.id;
//                       setDraggingNodeId(node.id);
//                     } else {
//                       const arrowHit = tool === "pan" ? findArrowCurveHitAtCanvas(cc.x, cc.y, 12 / zoomState.scale) : null;
//                       if (arrowHit) {
//                         draggingArrowRef.current = arrowHit;
//                         setDraggingArrowInfo({ arrowId: arrowHit.arrowId, segmentIndex: arrowHit.segmentIndex });
//                       } else {
//                         setZoomState(p => ({ ...p, isDragging:true, lastX:t.clientX-rect.left, lastY:t.clientY-rect.top }));
//                       }
//                     }
//                   }
//                 }
//                 e.preventDefault();
//               }}
//               onTouchMove={e => {
//                 if (e.touches.length === 1) {
//                   const t = e.touches[0], rect = canvasRef.current?.getBoundingClientRect();
//                   if (rect) {
//                     if (draggingNodeRef.current) {
//                       const cc = clientToCanvasCoords(t.clientX, t.clientY);
//                       const ros = canvasToRosCoords(cc.x, cc.y);
//                       if (ros && isWithinMapBounds(ros.x, ros.y) && isWithinPlaceableArea(cc.x, cc.y)) {
//                         setNodes(prev => {
//                           const next = prev.map(n =>
//                             n.id === draggingNodeRef.current
//                               ? { ...n, canvasX: cc.x, canvasY: cc.y, rosX: ros.x, rosY: ros.y }
//                               : n
//                           );
//                           nodesRef.current = next;
//                           return next;
//                         });
//                       }
//                     } else if (draggingArrowRef.current) {
//                       const cc = clientToCanvasCoords(t.clientX, t.clientY);
//                       const { arrowId, segmentIndex, mx, my, px, py, len } = draggingArrowRef.current;
//                       const vx = cc.x - mx, vy = cc.y - my;
//                       let proj = vx * px + vy * py;
//                       const maxBow = Math.max(25, len * 0.6);
//                       proj = Math.max(-maxBow, Math.min(maxBow, proj));
//                       setArrows(prev => prev.map(a =>
//                         a.id === arrowId ? { ...a, bends: { ...(a.bends || {}), [segmentIndex]: proj } } : a
//                       ));
//                     } else if (zoomState.isDragging) {
//                       const x = t.clientX-rect.left, y = t.clientY-rect.top;
//                       setZoomState(p => ({ ...p, offsetX:p.offsetX+x-p.lastX, offsetY:p.offsetY+y-p.lastY, lastX:x, lastY:y }));
//                     }
//                   }
//                 }
//                 e.preventDefault();
//               }}
//               onTouchEnd={() => {
//                 if (draggingNodeRef.current || draggingArrowRef.current) recordHistoryState();
//                 draggingNodeRef.current = null;
//                 setDraggingNodeId(null);
//                 draggingArrowRef.current = null;
//                 setDraggingArrowInfo(null);
//                 setZoomState(p => ({ ...p, isDragging: false }));
//               }}
//               onTouchCancel={() => {
//                 draggingNodeRef.current = null;
//                 setDraggingNodeId(null);
//                 draggingArrowRef.current = null;
//                 setDraggingArrowInfo(null);
//                 setZoomState(p => ({ ...p, isDragging: false }));
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLanguage } from "../context/LanguageContext";
import yaml from "js-yaml";
import JSZip from 'jszip';
import { FaRocket } from "react-icons/fa";
import { useROS } from "../context/ROSContext";
import {
  FaSearchPlus, FaSearchMinus, FaExpand, FaTrashAlt, FaMapMarkerAlt,
  FaArrowRight, FaDrawPolygon, FaEraser, FaUpload, FaDownload, FaRedo,
  FaCropAlt, FaImage, FaMoon, FaSun, FaBan, FaHandPaper, FaBrush,
  FaUndo, FaRedoAlt, FaTimes, FaCheck, FaPalette, FaTools, FaFileExport,
  FaWrench, FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaTachometerAlt,
  FaEdit
} from "react-icons/fa";

// Persistence helpers
const compressMapData = (mapData) => {
  if (!mapData || !mapData.data) return null;
  try {
    return {
      ...mapData,
      data: Array.from(mapData.data),
      _compressed: true,
      _type: 'Int8Array'
    };
  } catch (e) { console.error("compress:", e); return null; }
};

const saveWorkspaceState = (state) => {
  try {
    const toSave = {
      ...state,
      mapMsg:      state.mapMsg      ? compressMapData(state.mapMsg)      : null,
      editableMap: state.editableMap ? compressMapData(state.editableMap) : null,
      nodes:       state.nodes || [],
      arrows:      state.arrows || [],
      zones:       state.zones || [],
      mapName:     state.mapName || "",
      rotation:    state.rotation || 0,
      tool:        state.tool || "pan",
      nodeType:    state.nodeType || "waypoint",
      eraseMode:   state.eraseMode || "objects",
      eraseRadius: state.eraseRadius || 3,
      zoomState:   state.zoomState || { scale: 1, offsetX: 0, offsetY: 0, isDragging: false, lastX: 0, lastY: 0 },
      mapParams:   state.mapParams,
      timestamp:   Date.now(),
    };
    localStorage.setItem("mapEditorWorkspace", JSON.stringify(toSave));
    return true;
  } catch (e) { console.error("save workspace:", e); return false; }
};

const loadWorkspaceState = () => {
  try {
    const saved = localStorage.getItem("mapEditorWorkspace");
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    let mapMsg = null, editableMap = null;
    if (parsed.mapMsg) {
      mapMsg = Array.isArray(parsed.mapMsg.data)
        ? { ...parsed.mapMsg, data: new Int8Array(parsed.mapMsg.data), _compressed: false }
        : parsed.mapMsg;
    }
    if (parsed.editableMap) {
      editableMap = Array.isArray(parsed.editableMap.data)
        ? { ...parsed.editableMap, data: new Int8Array(parsed.editableMap.data), _compressed: false }
        : parsed.editableMap;
    }
    return {
      ...parsed, mapMsg, editableMap: editableMap || mapMsg,
      nodes: parsed.nodes || [], arrows: parsed.arrows || [], zones: parsed.zones || [],
      mapName: parsed.mapName || "", rotation: parsed.rotation || 0,
      tool: parsed.tool || "pan", nodeType: parsed.nodeType || "waypoint",
      eraseMode: parsed.eraseMode || "objects", eraseRadius: parsed.eraseRadius || 3,
      zoomState: parsed.zoomState || { scale: 1, offsetX: 0, offsetY: 0, isDragging: false, lastX: 0, lastY: 0 },
      mapParams: parsed.mapParams, currentZonePoints: parsed.currentZonePoints || [],
    };
  } catch (e) { console.error("load workspace:", e); return null; }
};

// Modal System
function useModalSystem(T) {
  const [modal, setModal] = useState(null);

  const showAlert = useCallback((message, type = 'info') => {
    return new Promise(resolve => {
      setModal({ kind: 'alert', message, type, onOk: () => { setModal(null); resolve(); } });
    });
  }, []);

  const showConfirm = useCallback((message, type = 'warning') => {
    return new Promise(resolve => {
      setModal({
        kind: 'confirm', message, type,
        onConfirm: () => { setModal(null); resolve(true); },
        onCancel:  () => { setModal(null); resolve(false); }
      });
    });
  }, []);

  const ModalComponent = modal ? (() => {
    const icons = {
      info:    <FaInfoCircle size={22} style={{ color: '#60a5fa' }} />,
      success: <FaCheckCircle size={22} style={{ color: '#34d399' }} />,
      warning: <FaExclamationTriangle size={22} style={{ color: '#fbbf24' }} />,
      error:   <FaExclamationTriangle size={22} style={{ color: '#f87171' }} />,
    };
    const accentColors = {
      info: '#60a5fa', success: '#34d399', warning: '#fbbf24', error: '#f87171'
    };
    const accent = accentColors[modal.type] || '#60a5fa';
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: 16
      }}>
        <div style={{
          background: T ? T.card : '#1e293b',
          border: `1px solid ${T ? T.border : '#334155'}`,
          borderTop: `3px solid ${accent}`,
          borderRadius: 14,
          padding: 28, maxWidth: 460, width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          animation: 'modalIn 0.18s ease'
        }}>
          <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.94) translateY(-8px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
            <div style={{ flexShrink: 0, marginTop: 2 }}>{icons[modal.type] || icons.info}</div>
            <p style={{
              margin: 0, color: T ? T.text : '#f1f5f9',
              fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-line', flex: 1
            }}>{modal.message}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            {modal.kind === 'confirm' && (
              <button onClick={modal.onCancel} style={{
                padding: '8px 18px', borderRadius: 8,
                border: `1px solid ${T ? T.border : '#334155'}`,
                background: 'transparent', color: T ? T.textSecondary : '#94a3b8',
                cursor: 'pointer', fontSize: 13, fontWeight: 500
              }}>Cancel</button>
            )}
            <button onClick={modal.kind === 'confirm' ? modal.onConfirm : modal.onOk} style={{
              padding: '8px 22px', borderRadius: 8, border: 'none',
              background: accent, color: '#fff',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
              boxShadow: `0 2px 8px ${accent}55`
            }}>
              {modal.kind === 'confirm' ? 'Confirm' : 'OK'}
            </button>
          </div>
        </div>
      </div>
    );
  })() : null;

  return { showAlert, showConfirm, ModalComponent };
}

export default function MapEditor() {
  const { t } = useLanguage();
  const { connected: rosConnected, ros } = useROS();

  // UI State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("mapEditorDarkMode");
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
  });
  const [mapLoaderActive, setMapLoaderActive] = useState(false);
  const [activeTab, setActiveTab] = useState("map");

  // Map State
  const [mapMsg, setMapMsg] = useState(null);
  const [editableMap, setEditableMap] = useState(null);
  const mapParamsRef = useRef(null);
  const canvasInitializedRef = useRef(false);
  const toolInitializedRef = useRef(false);
  const [canvasInitialized, setCanvasInitialized] = useState(false);
  useEffect(() => { canvasInitializedRef.current = canvasInitialized; }, [canvasInitialized]);

  // Speed Configuration
  // tempSpeed lives here (not inside the modal) so typing in the speed modal is not
  // reset when MapEditor re-renders (e.g. on every mouse move).
  const [speedModalNode, setSpeedModalNode] = useState(null);
  const [tempSpeed, setTempSpeed] = useState(0.0);

  // Annotation State
  const [tool, setTool] = useState("pan");
  const [nodeType, setNodeType] = useState("waypoint");
  const [mapName, setMapName] = useState("");
  const [zoneName, setZoneName] = useState("");
  const [zoneType, setZoneType] = useState("normal");
  const [nodes, setNodes] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [zones, setZones] = useState([]);
  const [currentZonePoints, setCurrentZonePoints] = useState([]);
  const [arrowDirection, setArrowDirection] = useState("forward");
  const [arrowDrawing, setArrowDrawing] = useState({ isDrawing: false, fromId: null, points: [] });

  // Edit State
  const [rotation, setRotation] = useState(0);
  const [cropState, setCropState] = useState({ isCropping: false, startX: 0, startY: 0, endX: 0, endY: 0, isDragging: false, freehandPoints: [] });
  const [eraseMode, setEraseMode] = useState("objects");
  const [eraseRadius, setEraseRadius] = useState(3);
  const [handEraseState, setHandEraseState] = useState({ isErasing: false, lastX: 0, lastY: 0 });

  // Canvas / Zoom
  const canvasRef = useRef(null);
  const [zoomState, setZoomState] = useState({ scale: 1, offsetX: 0, offsetY: 0, isDragging: false, lastX: 0, lastY: 0 });
  const [cursorCoords, setCursorCoords] = useState(null);
  const idCounter = useRef(1);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });

  // Keep the canvas in sync with its container when the window is resized.
  useEffect(() => {
    const container = canvasRef.current?.parentElement;
    if (!container || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      setCanvasSize({ w: container.clientWidth, h: container.clientHeight });
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Node Dragging State
  const draggingNodeRef = useRef(null);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  // Arrow Curve-Handle Dragging State
  // draggingArrowRef holds { arrowId, segmentIndex, mx, my, px, py, len } captured at mousedown time.
  // While dragging, we project the cursor onto the perpendicular of the segment's straight line;
  // the *signed* projection becomes the new bend amount for that segment, so crossing the
  // straight line naturally flips the curve to the other side.
  const draggingArrowRef = useRef(null);
  const [draggingArrowInfo, setDraggingArrowInfo] = useState(null);
  const [hoveredArrowControl, setHoveredArrowControl] = useState(null);

  // Arrow Drawing State - track corner node clicks for finishing detection
  const [lastClickedCornerNodeId, setLastClickedCornerNodeId] = useState(null);
  const cornerClickTimeRef = useRef(0);

  // DB / Export State
  const [dbStatus, setDbStatus] = useState("Ready");
  const [isSavingYAML, setIsSavingYAML] = useState(false);
  const [isSavingJSON, setIsSavingJSON] = useState(false);

  // Yaw Settings
  const [yawCalculationMethod, setYawCalculationMethod] = useState("direction");
  const [showYawTooltip, setShowYawTooltip] = useState(false);

  // IMPROVED History - Track individual actions
  const initialState = { nodes: [], arrows: [], zones: [], rotation: 0, editableMapData: null };
  const historyRef = useRef([initialState]);
  const historyIndexRef = useRef(0);
  const [history, setHistory] = useState([initialState]);
  const [historyIndex, setHistoryIndex] = useState(0);
  useEffect(() => { historyRef.current = history; }, [history]);
  useEffect(() => { historyIndexRef.current = historyIndex; }, [historyIndex]);

  const nodesRef = useRef(nodes);
  const arrowsRef = useRef(arrows);
  const zonesRef = useRef(zones);
  const rotationRef = useRef(rotation);
  const mapMsgRef = useRef(mapMsg);
  const editableMapRef = useRef(editableMap);
  useEffect(() => { nodesRef.current = nodes; }, [nodes]);
  useEffect(() => { arrowsRef.current = arrows; }, [arrows]);
  useEffect(() => { zonesRef.current = zones; }, [zones]);
  useEffect(() => { rotationRef.current = rotation; }, [rotation]);
  useEffect(() => { mapMsgRef.current = mapMsg; }, [mapMsg]);
  useEffect(() => { editableMapRef.current = editableMap; }, [editableMap]);

  // Robot SSH Modal State
  // Only the robot IP is entered by the user (and remembered). The SSH username,
  // password and target folder are fixed constants in main.js.
  const savedConn = (() => {
    try { return JSON.parse(localStorage.getItem("mapEditorRobotConn")) || {}; } catch { return {}; }
  })();
  const [showRobotIpModal, setShowRobotIpModal] = useState(false);
  const [robotIp, setRobotIp] = useState(savedConn.ip || "");
  const [sendingStatus, setSendingStatus] = useState("");
  const [currentSendType, setCurrentSendType] = useState(null);

  // Theme
  const theme = {
    light: {
      background: '#ffffff', surface: '#f8fafc', card: '#ffffff',
      text: '#1e293b', textSecondary: '#64748b', border: '#e2e8f0',
      accent: '#3b82f6', danger: '#ef4444', success: '#10b981', warning: '#f59e0b',
      nodeColors: { station: '#8b5cf6', docking: '#06b6d4', waypoint: '#f59e0b', home: '#10b981', charging: '#ef4444', waypointforcorner: '#ec4899' }
    },
    dark: {
      background: '#0f172a', surface: '#1e293b', card: '#1e293b',
      text: '#f1f5f9', textSecondary: '#94a3b8', border: '#334155',
      accent: '#60a5fa', danger: '#f87171', success: '#34d399', warning: '#fbbf24',
      nodeColors: { station: '#a78bfa', docking: '#22d3ee', waypoint: '#fbbf24', home: '#34d399', charging: '#f87171', waypointforcorner: '#f472b6' }
    }
  };
  const T = darkMode ? theme.dark : theme.light;

  const { showAlert, showConfirm, ModalComponent } = useModalSystem(T);

  const styles = {
    container: { display: "flex", flexDirection: "column", gap: 12, padding: 12, width: "100%", minWidth: 0, boxSizing: "border-box", background: T.background, color: T.text, minHeight: '100vh', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' },
    mainContent: { display: "flex", gap: 12, flex: 1, minWidth: 0, width: "100%", minHeight: 'calc(100vh - 100px)' },
    sidebar: { width: 300, flexShrink: 0, background: T.card, borderRadius: 12, padding: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", border: `1px solid ${T.border}`, height: 'fit-content', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' },
    mapContainer: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 12, minHeight: '600px' },
    canvasContainer: { flex: 1, minWidth: 0, border: `2px solid ${T.border}`, borderRadius: 12, background: T.surface, position: "relative", overflow: "hidden", minHeight: 400 },
    buttonGroup: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 },
    button: { padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.card, color: T.text, cursor: "pointer", fontSize: '13px', fontWeight: '500', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' },
    buttonAction: { padding: "8px 12px", borderRadius: 8, border: "none", background: T.accent, color: "white", cursor: "pointer", fontSize: '13px', fontWeight: '500', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' },
    buttonDanger: { padding: "8px 12px", borderRadius: 8, border: "none", background: T.danger, color: "white", cursor: "pointer", fontSize: '13px', fontWeight: '500', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' },
    buttonSmall: { padding: "6px 10px", borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, color: T.text, cursor: "pointer", fontSize: '12px', fontWeight: '500', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', whiteSpace: 'nowrap' },
    buttonSmallActive: { padding: "6px 10px", borderRadius: 6, border: `1px solid ${T.accent}`, background: T.accent, color: "white", cursor: "pointer", fontSize: '12px', fontWeight: '500', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', whiteSpace: 'nowrap' },
    input: { width: "100%", padding: "8px 10px", margin: "4px 0 8px 0", borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, color: T.text, fontSize: '13px', boxSizing: 'border-box' },
    select: { width: "100%", padding: "8px 10px", marginTop: 4, borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, color: T.text, fontSize: '13px' },
    label: { fontSize: "13px", color: T.text, fontWeight: '600', marginBottom: 2, display: 'block' },
    hint: { fontSize: "11px", color: T.textSecondary, marginTop: 4, lineHeight: '1.3' },
    hud: { background: T.accent, color: "#fff", padding: "6px 10px", borderRadius: 6, fontSize: 12, fontWeight: '500', fontFamily: 'monospace' },
    mapInfo: { padding: "6px 10px", background: T.card, color: T.text, borderRadius: 6, fontSize: 12, fontWeight: '500', border: `1px solid ${T.border}` },
    zoomControls: { position: "absolute", top: 12, right: 12, display: "flex", flexDirection: "column", gap: 8, zIndex: 20, background: T.card, padding: 10, borderRadius: 10, boxShadow: "0 6px 18px rgba(0,0,0,0.15)", border: `1px solid ${T.border}` },
    zoomButton: { padding: 8, borderRadius: 6, border: "none", background: T.accent, color: "#fff", cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' },
    yawTooltip: { position: "absolute", top: 50, right: 12, zIndex: 21, background: T.card, padding: 12, borderRadius: 8, border: `1px solid ${T.border}`, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", maxWidth: 300 },
    toolGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8 },
  };

  const downloadFile = (blob, filename) => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => {
        URL.revokeObjectURL(url);
        resolve();
      }, 150);
    });
  };

  // ZOOM
  // The canvas is drawn as: translate(offset) -> scale(scale). To zoom around a fixed
  // screen point (anchorX, anchorY) the offset must move too:
  //     offset' = anchor - (anchor - offset) * (newScale / oldScale)
  // The view rotation is applied around the canvas center, so the center is a fixed point
  // of that rotation and zooming around the center is correct for every rotation angle.
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 5;

  const zoomAroundPoint = (factor, anchorX, anchorY) => {
    setZoomState(p => {
      const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, p.scale * factor));
      if (newScale === p.scale) return p;
      const k = newScale / p.scale;
      return {
        ...p,
        scale: newScale,
        offsetX: anchorX - (anchorX - p.offsetX) * k,
        offsetY: anchorY - (anchorY - p.offsetY) * k,
      };
    });
  };

  const zoomFromCenter = (factor) => {
    const container = canvasRef.current?.parentElement;
    if (!container) return;
    zoomAroundPoint(factor, container.clientWidth / 2, container.clientHeight / 2);
  };

  const rosToCanvasCoords = (rosX, rosY) => {
    if (!mapParamsRef.current) return { x: 0, y: 0 };
    const { resolution, originX, originY, height } = mapParamsRef.current;
    return { x: (rosX - originX) / resolution, y: height - (rosY - originY) / resolution };
  };

  const canvasToRosCoords = (canvasX, canvasY) => {
    if (!mapParamsRef.current) return null;
    const { resolution, originX, originY, height } = mapParamsRef.current;
    return {
      x: +(originX + canvasX * resolution).toFixed(2),
      y: +(originY + (height - canvasY) * resolution).toFixed(2)
    };
  };

  const clientToCanvasCoords = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const mouseX = clientX - rect.left, mouseY = clientY - rect.top;
    if (rotation === 0) return { x: (mouseX - zoomState.offsetX) / zoomState.scale, y: (mouseY - zoomState.offsetY) / zoomState.scale };
    const cX = rect.width / 2, cY = rect.height / 2;
    const tX = mouseX - cX, tY = mouseY - cY;
    const angle = -rotation * Math.PI / 180;
    return {
      x: (tX * Math.cos(angle) - tY * Math.sin(angle) + cX - zoomState.offsetX) / zoomState.scale,
      y: (tX * Math.sin(angle) + tY * Math.cos(angle) + cY - zoomState.offsetY) / zoomState.scale
    };
  };

  const clientToRosCoords = (clientX, clientY) => {
    const { x, y } = clientToCanvasCoords(clientX, clientY);
    return canvasToRosCoords(x, y);
  };

  const isWithinMapBounds = (rosX, rosY) => {
    if (!mapParamsRef.current) return false;
    const { resolution, width, height, originX, originY } = mapParamsRef.current;
    return rosX >= originX && rosX <= originX + width * resolution && rosY >= originY && rosY <= originY + height * resolution;
  };

  const isWithinPlaceableArea = (canvasX, canvasY) => {
    if (!editableMap || !mapParamsRef.current) return false;
    const { width, height, data } = editableMap;
    const px = Math.floor(canvasX), py = Math.floor(canvasY);
    if (px < 0 || px >= width || py < 0 || py >= height) return false;
    const my = height - 1 - py;
    if (my < 0 || my >= height) return false;
    return data[my * width + px] === 0;
  };

  const makeId = (prefix = "n") => `${prefix}_${idCounter.current++}`;

  // Short labels used ONLY for drawing on the canvas / exported PNG-PGM.
  // The real node.label (e.g. "waypointforcorner_1") is never changed, so
  // JSON / YAML / ZIP exports keep the full names.
  const SHORT_LABEL_PREFIX = {
    waypointforcorner: "wpc",
    waypoint: "wp",
    station: "st",
    docking: "dock",
    home: "home",
    charging: "chg"
  };
  const getDisplayLabel = (node) => {
    const full = node.label || node.type || "";
    const idx = full.lastIndexOf("_");
    if (idx === -1) return full;
    const short = SHORT_LABEL_PREFIX[full.slice(0, idx)];
    return short ? `${short}${full.slice(idx + 1)}` : full;
  };

  const isPointInPolygon = (point, polygon) => {
    const x = point.x, y = point.y;
    if (!polygon || polygon.length < 3) return false;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi + 0.0000001) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const pointInPolygon = (point, vs) => {
    if (!vs.length) return false;
    const x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i][0], yi = vs[i][1];
      const xj = vs[j][0], yj = vs[j][1];
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi + 0.0000001) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Curve control-point math, shared by the renderer, the hit-tester, and the drag handler.
  // `bends` is an object keyed by segment index -> a signed canvas-space bow amount.
  // If a segment has no entry in `bends`, we fall back to the original alternating bow so
  // arrows look exactly the same as before until the user actually drags a handle.
  const getSegmentControlPoint = (p1, p2, segmentIndex, bends = {}) => {
    const dx = p2.canvasX - p1.canvasX, dy = p2.canvasY - p1.canvasY;
    const len = Math.hypot(dx, dy) || 1;
    const px = -dy / len, py = dx / len;
    const mx = (p1.canvasX + p2.canvasX) / 2, my = (p1.canvasY + p2.canvasY) / 2;
    let bowSigned;
    if (bends[segmentIndex] !== undefined) {
      bowSigned = bends[segmentIndex];
    } else {
      const bowMag = Math.min(25, len * 0.3);
      bowSigned = bowMag * ((segmentIndex % 2 === 0) ? 1 : -1);
    }
    return { x: mx + px * bowSigned, y: my + py * bowSigned, len, px, py, mx, my, bowSigned };
  };

  const drawSmoothArrowPath = (ctx, pts, bends = {}, curveAllSegments = false) => {
    if (!pts || pts.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(pts[0].canvasX, pts[0].canvasY);

    for (let i = 0; i < pts.length - 1; i++) {
      const p1 = pts[i], p2 = pts[i + 1];
      const shouldCurve = curveAllSegments || (p1.isCorner && p2.isCorner);

      if (shouldCurve) {
        const ctrl = getSegmentControlPoint(p1, p2, i, bends);
        ctx.quadraticCurveTo(ctrl.x, ctrl.y, p2.canvasX, p2.canvasY);
      } else {
        ctx.lineTo(p2.canvasX, p2.canvasY);
      }
    }
    ctx.stroke();
  };

  // Walks the arrow graph to produce an ordered node sequence for export.
  //
  // Finds every disconnected chain/loop in the arrow graph and concatenates ALL of them,
  // in the order they were discovered (which follows arrow-creation order). A route is
  // often drawn in more than one "connect" session; keeping only the longest chain would
  // silently drop the rest of the route (the old truncated-export bug).
  const getOrderedNodesFromArrows = (arrowList, allNodes) => {
    if (arrowList.length === 0) return [];

    // Only the first outgoing arrow per node is followed. If a node has more than one
    // (branching — almost always a leftover duplicate connection), the others are
    // ignored for this walk rather than silently merged into one path.
    const nextByFrom = new Map();
    arrowList.forEach(a => { if (!nextByFrom.has(a.fromId)) nextByFrom.set(a.fromId, a.toId); });

    const toIds = new Set(arrowList.map(a => a.toId));
    const fromIds = new Set(arrowList.map(a => a.fromId));
    const allIds = new Set([...fromIds, ...toIds]);

    const visitedGlobal = new Set();
    const chains = [];

    const walkFrom = (startId) => {
      const ordered = [], localVisited = new Set();
      let currentId = startId;

      while (currentId && !localVisited.has(currentId)) {
        const node = allNodes.find(n => n.id === currentId);
        if (node) ordered.push(node);

        localVisited.add(currentId);
        visitedGlobal.add(currentId);
        currentId = nextByFrom.get(currentId) ?? null;
      }

      // A route may intentionally be a closed loop, for example:
      // waypointforcorner_8 -> waypoint_4 -> waypointforcorner_1
      // For a genuine loop, repeat the starting node once at the end so the exported
      // linear waypoint sequence explicitly represents the final edge back to the start.
      // Do NOT do this for an open chain that merely ends at another node.
      if (currentId === startId && ordered.length > 1) {
        const startNode = allNodes.find(n => n.id === startId);
        if (startNode) ordered.push(startNode);
      }

      return ordered;
    };

    // Walk every open-ended chain first (a source with no incoming arrow — a true start),
    // in the order those "from" ids were first seen (i.e. arrow-creation order).
    fromIds.forEach(id => {
      if (!toIds.has(id) && !visitedGlobal.has(id)) chains.push(walkFrom(id));
    });
    // Anything left over belongs to a closed loop with no natural start — walk those too.
    allIds.forEach(id => {
      if (!visitedGlobal.has(id)) chains.push(walkFrom(id));
    });

    if (chains.length === 0) return [];

    return chains.flat();
  };

  const buildNodesWithYaw = (nodesList, arrowsList) => {
    if (yawCalculationMethod === "direction" && arrowsList.length > 0) {
      return nodesList.map((node, idx) => {
        const nextNode = idx < nodesList.length - 1 ? nodesList[idx + 1] : null;
        if (!nextNode) return { ...node, yaw: node.yaw || 0.0 };
        let yawDeg = Math.atan2(nextNode.rosY - node.rosY, nextNode.rosX - node.rosX) * (180 / Math.PI);
        if (yawDeg < 0) yawDeg += 360;
        return { ...node, yaw: parseFloat(yawDeg.toFixed(2)) };
      });
    }
    return nodesList.map(n => ({ ...n, yaw: n.yaw || 0.0 }));
  };

  const buildWaypointsArray = (nodesWithYaw, missionType) => {
    let stationCount = 0;
    return nodesWithYaw.map(node => {
      const waypoint = {
        x: parseFloat(node.rosX.toFixed(2)),
        y: parseFloat(node.rosY.toFixed(2)),
        theta: parseFloat((node.yaw * Math.PI / 180).toFixed(6)),
        type: node.type,
        mission: missionType,
        rotation: "auto",
        label: node.label
      };
      if (node.speed !== undefined && node.speed !== null) {
        waypoint.speed = node.speed;
      }
      if (node.type === "station") {
        stationCount++;
        waypoint.name = node.label || `station_${stationCount}`;
        waypoint.plc_feedback = `I0.${stationCount}`;
      }
      return waypoint;
    });
  };

  const buildYAMLString = (forwardWaypoints, reverseWaypoints = []) => {
    const renderSection = (wps, label) => {
      let s = `\n# ${"=".repeat(60)}\n#  ${label}\n# ${"=".repeat(60)}\n`;
      wps.forEach((wp) => {
        const nodeNumber = wp.label ? wp.label.split('_')[1] : "?";
        // Use WPC for waypoint-for-corner nodes so the YAML comments are
        // unambiguous: WPC1, WPC2, WPC3... instead of WP1, WP2, WP3.
        const wpLabel = wp.type === "waypointforcorner"
          ? `WPC${nodeNumber}`
          : `WP${nodeNumber}`;

        s += `\n# ── ${wpLabel}: (${wp.x}, ${wp.y}) ──────────────────────────────\n`;
        s += `- x:           ${wp.x}\n`;
        s += `  y:           ${wp.y}\n`;
        s += `  theta:       ${wp.theta}\n`;
        s += `  type:        ${wp.type}\n`;
        s += `  mission:     ${wp.mission}\n`;
        s += `  rotation:    ${wp.rotation}\n`;
        if (wp.speed !== undefined) {
          s += `  speed:       ${wp.speed}\n`;
        }
        if (wp.type === "station") {
          if (wp.name) s += `  name:        "${wp.name}"\n`;
          if (wp.plc_feedback) s += `  plc_feedback: "${wp.plc_feedback}"\n`;
        }
      });
      return s;
    };

    let result = `# Waypoint configuration\n\nwaypoints:`;
    result += renderSection(forwardWaypoints, "FORWARD PATH");
    if (reverseWaypoints.length > 0) {
      result += renderSection(reverseWaypoints, "REVERSE PATH");
    }
    return result;
  };

  const handleSaveYAML = async () => {
    if (!mapMsg || !mapParamsRef.current) {
      await showAlert("No map loaded!", 'warning');
      return;
    }
    if (nodes.length === 0) {
      await showAlert("No nodes to export!", 'warning');
      return;
    }

    try {
      const forwardArrows = arrows.filter(a => a.direction !== "reverse");
      const reverseArrows = arrows.filter(a => a.direction === "reverse");

      let forwardNodes = forwardArrows.length > 0
        ? getOrderedNodesFromArrows(forwardArrows, nodes)
        : nodes;

      let reverseNodes = [];

      if (reverseArrows.length > 0) {
        reverseNodes = getOrderedNodesFromArrows(reverseArrows, nodes);
      } else if (forwardNodes.length > 1) {
        reverseNodes = [...forwardNodes].reverse();
      }

      const forwardWPs = forwardNodes.length > 0
        ? buildWaypointsArray(buildNodesWithYaw(forwardNodes, forwardArrows), "forward")
        : [];

      let reverseWPs = [];
      if (reverseNodes.length > 0) {
        const reverseNodesWithYaw = buildNodesWithYaw(reverseNodes, reverseArrows);
        reverseWPs = buildWaypointsArray(reverseNodesWithYaw, "reverse");
      }

      const yamlContent = buildYAMLString(forwardWPs, reverseWPs);
      const blob = new Blob([yamlContent], { type: 'application/x-yaml' });
      await downloadFile(blob, `${mapName || 'map'}_waypoints.yaml`);

      const speedCount = [...forwardWPs, ...reverseWPs].filter(wp => wp.speed !== undefined).length;
      await showAlert(`✅ YAML exported!\n📍 ${forwardWPs.length} forward, ${reverseWPs.length} reverse waypoints\n⚡ ${speedCount} nodes have custom speeds`, 'success');
    } catch (err) {
      console.error(err);
      await showAlert(`Error exporting YAML:\n${err.message}`, 'error');
    }
  };

  const handleSaveJSON = async () => {
    if (!mapMsg || !mapParamsRef.current) {
      await showAlert("No map loaded!", 'warning');
      return;
    }
    if (nodes.length === 0) {
      await showAlert("No nodes to export!", 'warning');
      return;
    }

    try {
      const forwardArrows = arrows.filter(a => a.direction !== "reverse");
      let forwardNodes = forwardArrows.length > 0 ? getOrderedNodesFromArrows(forwardArrows, nodes) : nodes;
      const forwardWPs = buildWaypointsArray(buildNodesWithYaw(forwardNodes, forwardArrows), "forward");

      const jsonOutput = {
        waypoints: forwardWPs,
        total_nodes: forwardWPs.length,
        timestamp: Date.now(),
        map_name: mapName || 'map'
      };

      const blob = new Blob([JSON.stringify(jsonOutput, null, 2)], { type: 'application/json' });
      await downloadFile(blob, `${mapName || 'map'}_waypoints.json`);

      const speedCount = forwardWPs.filter(wp => wp.speed !== undefined).length;
      await showAlert(`✅ JSON exported!\n📍 ${forwardWPs.length} waypoints\n⚡ ${speedCount} nodes have custom speeds`, 'success');
    } catch (err) {
      console.error(err);
      await showAlert(`Error exporting JSON:\n${err.message}`, 'error');
    }
  };

  // History stores COMPLETE post-action snapshots.
  // Every user action appends its resulting state; Undo moves to the previous
  // snapshot and Redo moves forward again.
  const cloneHistoryState = (state) => ({
    nodes: JSON.parse(JSON.stringify(state.nodes || [])),
    arrows: JSON.parse(JSON.stringify(state.arrows || [])),
    zones: JSON.parse(JSON.stringify(state.zones || [])),
    editableMapData: state.editableMapData == null ? null : Array.from(state.editableMapData),
    rotation: state.rotation || 0,
  });

  const recordHistoryState = (override = {}) => {
    try {
      const current = {
        nodes: override.nodes !== undefined ? override.nodes : nodesRef.current,
        arrows: override.arrows !== undefined ? override.arrows : arrowsRef.current,
        zones: override.zones !== undefined ? override.zones : zonesRef.current,
        editableMapData: override.editableMapData !== undefined
          ? override.editableMapData
          : (editableMapRef.current ? editableMapRef.current.data : null),
        rotation: override.rotation !== undefined ? override.rotation : rotationRef.current,
      };
      const entry = cloneHistoryState(current);
      const hist = historyRef.current;
      const idx = historyIndexRef.current;
      const last = hist[idx];
      if (last && JSON.stringify(last) === JSON.stringify(entry)) return;

      const nh = hist.slice(0, idx + 1);
      nh.push(entry);
      if (nh.length > 100) nh.shift();
      const ni = nh.length - 1;
      historyRef.current = nh;
      historyIndexRef.current = ni;
      setHistory(nh);
      setHistoryIndex(ni);
    } catch (err) {
      console.error('Record history error:', err);
    }
  };

  const resetHistoryToCurrent = (override = {}) => {
    const current = {
      nodes: override.nodes !== undefined ? override.nodes : nodesRef.current,
      arrows: override.arrows !== undefined ? override.arrows : arrowsRef.current,
      zones: override.zones !== undefined ? override.zones : zonesRef.current,
      editableMapData: override.editableMapData !== undefined
        ? override.editableMapData
        : (editableMapRef.current ? editableMapRef.current.data : null),
      rotation: override.rotation !== undefined ? override.rotation : rotationRef.current,
    };
    const entry = cloneHistoryState(current);
    historyRef.current = [entry];
    historyIndexRef.current = 0;
    setHistory([entry]);
    setHistoryIndex(0);
  };

  // Backward-compatible alias for older call sites; new editing operations
  // should call recordHistoryState AFTER computing their new state.
  const saveToHistory = () => recordHistoryState();

  const applyHistorySnapshot = (state) => {
    const nextNodes = JSON.parse(JSON.stringify(state.nodes || []));
    const nextArrows = JSON.parse(JSON.stringify(state.arrows || []));
    const nextZones = JSON.parse(JSON.stringify(state.zones || []));
    const nextRotation = state.rotation || 0;

    nodesRef.current = nextNodes;
    arrowsRef.current = nextArrows;
    zonesRef.current = nextZones;
    rotationRef.current = nextRotation;

    setNodes(nextNodes);
    setArrows(nextArrows);
    setZones(nextZones);
    setRotation(nextRotation);

    if (state.editableMapData != null) {
      const nd = Array.from(state.editableMapData);
      if (editableMapRef.current) {
        editableMapRef.current = { ...editableMapRef.current, data: nd };
        setEditableMap(p => p ? { ...p, data: Array.from(nd) } : null);
      }
      if (mapMsgRef.current) {
        mapMsgRef.current = { ...mapMsgRef.current, data: nd };
        setMapMsg(p => p ? { ...p, data: Array.from(nd) } : null);
      }
    }
  };

  const handleUndo = () => {
    try {
      const idx = historyIndexRef.current, hist = historyRef.current;
      if (idx <= 0) return;
      const ni = idx - 1;
      historyIndexRef.current = ni;
      setHistoryIndex(ni);
      applyHistorySnapshot(hist[ni]);
    } catch (err) { console.error("Undo error:", err); }
  };

  const handleRedo = () => {
    try {
      const idx = historyIndexRef.current, hist = historyRef.current;
      if (idx >= hist.length - 1) return;
      const ni = idx + 1;
      historyIndexRef.current = ni;
      setHistoryIndex(ni);
      applyHistorySnapshot(hist[ni]);
    } catch (err) { console.error("Redo error:", err); }
  };

  const clearHistory = () => {
    const entry = cloneHistoryState({ nodes: [], arrows: [], zones: [], rotation: 0, editableMapData: null });
    historyRef.current = [entry];
    historyIndexRef.current = 0;
    setHistory([entry]);
    setHistoryIndex(0);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const h = e => { if (!localStorage.getItem("mapEditorDarkMode")) setDarkMode(e.matches); };
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  const toggleDarkMode = () => setDarkMode(p => !p);
  useEffect(() => { localStorage.setItem("mapEditorDarkMode", JSON.stringify(darkMode)); }, [darkMode]);

  useEffect(() => {
    if (canvasInitialized && mapMsg && !toolInitializedRef.current) {
      toolInitializedRef.current = true;
      setTool("pan");
    }
  }, [canvasInitialized, mapMsg]);

  useEffect(() => {
    try {
      const ws = loadWorkspaceState();
      if (!ws) { console.log("No saved workspace"); return; }
      if (ws.mapMsg) {
        setMapMsg(ws.mapMsg);
        setEditableMap(ws.editableMap || ws.mapMsg);
        mapParamsRef.current = ws.mapParams || {
          width: ws.mapMsg.width, height: ws.mapMsg.height,
          resolution: ws.mapMsg.resolution || 0.05,
          originX: ws.mapMsg.origin?.x || 0, originY: ws.mapMsg.origin?.y || 0
        };
        setCanvasInitialized(true);
        toolInitializedRef.current = true;
        setTimeout(() => {
          if (canvasRef.current) {
            const container = canvasRef.current.parentElement;
            if (container && ws.mapMsg.width && ws.mapMsg.height) {
              setZoomState(prev => ({
                ...prev,
                offsetX: Math.max(0, (container.clientWidth - ws.mapMsg.width) / 2),
                offsetY: Math.max(0, (container.clientHeight - ws.mapMsg.height) / 2),
                scale: ws.zoomState?.scale || 1
              }));
            }
          }
        }, 100);
      }
      setNodes(ws.nodes || []); setArrows(ws.arrows || []); setZones(ws.zones || []);
      setMapName(ws.mapName || ""); setRotation(ws.rotation || 0);
      setTool(ws.tool || "pan"); setNodeType(ws.nodeType || "waypoint");
      setEraseMode(ws.eraseMode || "objects"); setEraseRadius(ws.eraseRadius || 3);
      if (ws.zoomState) setZoomState(prev => ({ ...prev, ...ws.zoomState }));
      if (ws.currentZonePoints) setCurrentZonePoints(ws.currentZonePoints);
      const allIds = [...(ws.nodes || []), ...(ws.arrows || []), ...(ws.zones || [])];
      const maxId = allIds.reduce((max, item) => Math.max(max, parseInt(item.id?.split('_')[1]) || 0), 0);
      idCounter.current = maxId + 1;
    } catch (err) { console.error("Error restoring workspace:", err); }
  }, []);

  useEffect(() => {
    const tid = setTimeout(() => {
      try {
        if (mapMsg || nodes.length > 0 || arrows.length > 0 || zones.length > 0) {
          saveWorkspaceState({ mapMsg, editableMap, mapParams: mapParamsRef.current, nodes, arrows, zones, currentZonePoints, mapName, rotation, tool, nodeType, eraseMode, eraseRadius, zoomState });
        }
      } catch (err) { console.error("Auto-save error:", err); }
    }, 500);
    return () => clearTimeout(tid);
  }, [mapMsg, editableMap, nodes, arrows, zones, currentZonePoints, mapName, rotation, tool, nodeType, eraseMode, eraseRadius, zoomState]);

  const openSpeedModal = (node) => {
    setTempSpeed(node.speed !== undefined && node.speed !== null ? node.speed : 0.0);
    setSpeedModalNode({ ...node });
  };

  // Rendered as a plain function call (not a nested component) so its inputs keep
  // focus/state while MapEditor re-renders.
  const renderSpeedModal = () => {
    if (!speedModalNode) return null;
    const onSpeedChange = (e) => {
      const v = parseFloat(e.target.value);
      setTempSpeed(isNaN(v) ? 0.0 : v);
    };
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 10000, padding: 16
      }}>
        <div style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderTop: `3px solid ${T.accent}`,
          borderRadius: 14,
          padding: 28, maxWidth: 400, width: '100%'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: T.text }}>
            <FaTachometerAlt style={{ marginRight: 8 }} />
            Set Speed for {speedModalNode.label}
          </h3>
          <div style={{ marginBottom: 20 }}>
            <label style={styles.label}>Speed (m/s)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="range"
                min="0.0"
                max="2.0"
                step="0.01"
                value={tempSpeed}
                onChange={onSpeedChange}
                style={{ flex: 1 }}
              />
              <input
                type="number"
                min="0.0"
                max="2.0"
                step="0.01"
                value={tempSpeed}
                onChange={onSpeedChange}
                style={{ ...styles.input, width: '80px', margin: 0 }}
              />
              <span>m/s</span>
            </div>
            <div style={styles.hint}>Set to 0.0 to remove speed (will not appear in YAML)</div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setSpeedModalNode(null)} style={styles.button}>Cancel</button>
            <button onClick={() => {
              if (speedModalNode) {
                const finalSpeed = tempSpeed === 0.0 ? undefined : tempSpeed;
                const nextNodes = nodesRef.current.map(n =>
                  n.id === speedModalNode.id ? { ...n, speed: finalSpeed } : n
                );
                nodesRef.current = nextNodes;
                setNodes(nextNodes);
                recordHistoryState({ nodes: nextNodes });
                setSpeedModalNode(null);
              }
            }} style={{ ...styles.buttonAction, background: T.success }}>Save</button>
          </div>
        </div>
      </div>
    );
  };

  const eraseAtClient = (clientX, clientY) => {
    if (!mapMsg) return;
    if (eraseMode === "objects") {
      const c = clientToCanvasCoords(clientX, clientY);
      eraseObjectsAt(c.x, c.y);
    }
    else if (eraseMode === "noise") {
      eraseNoiseAt(clientX, clientY);
    }
    else if (eraseMode === "hand") {
      startHandErase(clientX, clientY);
    }
  };

  const eraseObjectsAt = (canvasX, canvasY) => {
    const currentNodes = nodesRef.current;
    const currentArrows = arrowsRef.current;
    const currentZones = zonesRef.current;

    const node = findNodeAtCanvas(canvasX, canvasY, 8 / zoomState.scale);
    if (node) {
      const nextNodes = currentNodes.filter(p => p.id !== node.id);
      const nextArrows = currentArrows.filter(a => a.fromId !== node.id && a.toId !== node.id);
      nodesRef.current = nextNodes;
      arrowsRef.current = nextArrows;
      setNodes(nextNodes);
      setArrows(nextArrows);
      recordHistoryState({ nodes: nextNodes, arrows: nextArrows });
      return;
    }

    for (const arrow of currentArrows) {
      const fromNode = currentNodes.find(n => n.id === arrow.fromId);
      const toNode = currentNodes.find(n => n.id === arrow.toId);
      if (fromNode && toNode) {
        const dx = toNode.canvasX - canvasX, dy = toNode.canvasY - canvasY;
        if (Math.sqrt(dx*dx + dy*dy) <= 12 / zoomState.scale) {
          const nextArrows = currentArrows.filter(a => a.id !== arrow.id);
          setArrows(nextArrows);
          recordHistoryState({ arrows: nextArrows });
          return;
        }
        const allPoints = [fromNode, ...(arrow.points || []), toNode];
        for (let i = 0; i < allPoints.length - 1; i++) {
          const p1 = allPoints[i], p2 = allPoints[i+1];
          const A = canvasX-p1.canvasX, B = canvasY-p1.canvasY, C = p2.canvasX-p1.canvasX, D = p2.canvasY-p1.canvasY;
          const dot = A*C + B*D, lenSq = C*C + D*D;
          const param = lenSq !== 0 ? dot/lenSq : -1;
          const xx = param < 0 ? p1.canvasX : param > 1 ? p2.canvasX : p1.canvasX + param*C;
          const yy = param < 0 ? p1.canvasY : param > 1 ? p2.canvasY : p1.canvasY + param*D;
          if (Math.sqrt((canvasX-xx)**2 + (canvasY-yy)**2) <= 6/zoomState.scale) {
            const nextArrows = currentArrows.filter(a => a.id !== arrow.id);
            setArrows(nextArrows);
            recordHistoryState({ arrows: nextArrows });
            return;
          }
        }
      }
    }

    for (const z of currentZones) {
      if (pointInPolygon([canvasX, canvasY], z.points.map(p => [p.canvasX, p.canvasY]))) {
        const nextZones = currentZones.filter(pz => pz.id !== z.id);
        setZones(nextZones);
        recordHistoryState({ zones: nextZones });
        return;
      }
    }
  };

  const eraseNoiseAt = (clientX, clientY) => {
    const currentMap = editableMapRef.current;
    const currentMapMsg = mapMsgRef.current;
    if (!currentMap || !canvasRef.current) return;

    const canvasCoords = clientToCanvasCoords(clientX, clientY);
    const mapX = Math.floor(canvasCoords.x);
    const mapY = Math.floor(currentMap.height - canvasCoords.y);
    const { width, height, data } = currentMap;
    if (mapX < 0 || mapX >= width || mapY < 0 || mapY >= height) return;

    const newData = Array.from(data);
    let erased = 0;
    for (let y = mapY - eraseRadius; y <= mapY + eraseRadius; y++) {
      for (let x = mapX - eraseRadius; x <= mapX + eraseRadius; x++) {
        if (x >= 0 && x < width && y >= 0 && y < height &&
            Math.sqrt((x-mapX)**2 + (y-mapY)**2) <= eraseRadius) {
          const idx = y * width + x;
          if (newData[idx] === 100 || newData[idx] === -1) {
            newData[idx] = 0;
            erased++;
          }
        }
      }
    }
    if (erased > 0) {
      const nextMap = { ...currentMap, data: newData };
      const nextMsg = currentMapMsg ? { ...currentMapMsg, data: newData } : null;
      editableMapRef.current = nextMap;
      mapMsgRef.current = nextMsg;
      setEditableMap(nextMap);
      if (nextMsg) setMapMsg(nextMsg);
      recordHistoryState({ editableMapData: newData });
    }
  };

  const startHandErase = (clientX, clientY) => {
    if (!editableMap || !canvasRef.current) return;
    const canvasCoords = clientToCanvasCoords(clientX, clientY);
    const mapX = Math.floor(canvasCoords.x), mapY = Math.floor(editableMap.height - canvasCoords.y);
    const { width, height } = editableMap;
    if (mapX < 0 || mapX >= width || mapY < 0 || mapY >= height) return;
    setHandEraseState({ isErasing: true, lastX: mapX, lastY: mapY });
    eraseNoiseInLine(mapX, mapY, mapX, mapY);
  };

  const continueHandErase = (clientX, clientY) => {
    if (!handEraseState.isErasing || !editableMap || !canvasRef.current) return;
    const canvasCoords = clientToCanvasCoords(clientX, clientY);
    const currentX = Math.floor(canvasCoords.x), currentY = Math.floor(editableMap.height - canvasCoords.y);
    const { width, height } = editableMap;
    if (currentX < 0 || currentX >= width || currentY < 0 || currentY >= height) {
      setHandEraseState(prev => ({ ...prev, lastX: currentX, lastY: currentY })); return;
    }
    eraseNoiseInLine(handEraseState.lastX, handEraseState.lastY, currentX, currentY);
    setHandEraseState(prev => ({ ...prev, lastX: currentX, lastY: currentY }));
  };

  const stopHandErase = () => {
    if (handEraseState.isErasing && editableMapRef.current) {
      recordHistoryState({ editableMapData: editableMapRef.current.data });
    }
    setHandEraseState({ isErasing: false, lastX: 0, lastY: 0 });
  };

  const getLinePoints = (x0, y0, x1, y1) => {
    const points = [];
    const dx = Math.abs(x1-x0), dy = Math.abs(y1-y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx - dy, x = x0, y = y0;
    while (true) {
      points.push({ x, y });
      if (x === x1 && y === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x += sx; }
      if (e2 < dx)  { err += dx; y += sy; }
    }
    return points;
  };

  const eraseNoiseInLine = (x0, y0, x1, y1) => {
    const currentMap = editableMapRef.current;
    const currentMapMsg = mapMsgRef.current;
    if (!currentMap) return;

    const { width, height, data } = currentMap;
    const newData = Array.from(data);
    let erased = 0;
    getLinePoints(x0, y0, x1, y1).forEach(({ x, y }) => {
      if (x < 0 || x >= width || y < 0 || y >= height) return;
      for (let dy = -eraseRadius; dy <= eraseRadius; dy++) {
        for (let dx = -eraseRadius; dx <= eraseRadius; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height &&
              Math.sqrt(dx*dx + dy*dy) <= eraseRadius) {
            const idx = ny * width + nx;
            if (newData[idx] === 100 || newData[idx] === -1) {
              newData[idx] = 0;
              erased++;
            }
          }
        }
      }
    });
    if (erased > 0) {
      const nextMap = { ...currentMap, data: newData };
      const nextMsg = currentMapMsg ? { ...currentMapMsg, data: newData } : null;
      editableMapRef.current = nextMap;
      mapMsgRef.current = nextMsg;
      setEditableMap(nextMap);
      if (nextMsg) setMapMsg(nextMsg);
    }
  };

  const startCrop = () => {
    setCropState({ isCropping: true, startX: 0, startY: 0, endX: 0, endY: 0, isDragging: false, freehandPoints: [] });
    setTool("crop");
  };

  const cancelCrop = () => {
    setCropState({ isCropping: false, startX: 0, startY: 0, endX: 0, endY: 0, isDragging: false, freehandPoints: [] });
    setTool("pan");
  };

  const handleApplyCrop = async () => {
    if (!mapMsg || !mapParamsRef.current) { await showAlert("No map loaded!", 'error'); return; }
    if (!cropState.freehandPoints || cropState.freehandPoints.length < 3) { await showAlert("Draw a closed freehand shape first!", 'warning'); return; }
    const { width, height } = mapParamsRef.current;
    const mapPolygon = cropState.freehandPoints.map(p => ({ x: p.x, y: height - 1 - p.y }));
    const newData = new Int8Array([...mapMsg.data]);
    let keptPixels = 0, deletedPixels = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        if (isPointInPolygon({ x, y }, mapPolygon)) { if (newData[idx] !== -2 && newData[idx] !== -3) keptPixels++; }
        else { newData[idx] = -3; deletedPixels++; }
      }
    }
    setMapMsg(prev => prev ? { ...prev, data: newData } : null);
    setEditableMap(prev => prev ? { ...prev, data: [...newData] } : null);
    recordHistoryState({ editableMapData: newData });
    setCropState({ isCropping: false, startX: 0, startY: 0, endX: 0, endY: 0, isDragging: false, freehandPoints: [] });
    setTool("pan");
    await showAlert(`Crop applied!\n✅ Kept ${keptPixels} pixels inside selection\n🌫️ Made ${deletedPixels} pixels transparent`, 'success');
  };

  const loadMapFromZip = async (file) => {
    try {
      const jsZip = new JSZip();
      const zip = await jsZip.loadAsync(file);
      const yamlFiles = Object.keys(zip.files).filter(n => n.toLowerCase().endsWith('.yaml') || n.toLowerCase().endsWith('.yml'));
      const pgmFiles = Object.keys(zip.files).filter(n => n.toLowerCase().endsWith('.pgm'));
      if (!yamlFiles.length) { await showAlert("No YAML files in ZIP", 'error'); return; }
      if (!pgmFiles.length) { await showAlert("No PGM files in ZIP", 'error'); return; }
      const yamlText = await zip.files[yamlFiles[0]].async('text');
      const parsedYaml = yaml.load(yamlText);
      let pgmEntry = null;
      if (parsedYaml.image) {
        const possible = [parsedYaml.image, `${parsedYaml.image}.pgm`, parsedYaml.image.replace(/\.(png|jpg|jpeg)$/, '.pgm'), ...pgmFiles.filter(n => n.toLowerCase().includes(parsedYaml.image.toLowerCase()))];
        for (const name of possible) { if (zip.files[name]) { pgmEntry = zip.files[name]; break; } }
      }
      if (!pgmEntry && pgmFiles.length) pgmEntry = zip.files[pgmFiles[0]];
      if (!pgmEntry) { await showAlert("Could not find PGM file in ZIP", 'error'); return; }
      const pgmBuf = await pgmEntry.async('arraybuffer');
      await loadMapFromPGM(pgmBuf, parsedYaml, yamlFiles[0].replace(/\.(yaml|yml)$/, ''));
      setNodes([]); setArrows([]); setZones([]); setCurrentZonePoints([]);
      setArrowDrawing({ isDrawing: false, fromId: null, points: [] });
      setRotation(0); clearHistory(); idCounter.current = 1;
    } catch (err) {
      console.error(err);
      await showAlert("Failed to process ZIP.", 'error');
    }
  };

  const loadMapFromPGM = async (pgmBuffer, yamlConfig, mapNameFromFile) => {
    try {
      const bytes = new Uint8Array(pgmBuffer);
      const textHeader = new TextDecoder("ascii").decode(bytes.slice(0, 1000));
      const headerLines = textHeader.split(/\s+/).filter(l => l.length > 0);
      const magic = headerLines[0];
      if (magic !== "P5" && magic !== "P2") throw new Error("Unsupported PGM format");
      const width = parseInt(headerLines[1]), height = parseInt(headerLines[2]), maxVal = parseInt(headerLines[3]);
      const headerLength = textHeader.indexOf(maxVal.toString()) + maxVal.toString().length;
      const pixelBytes = bytes.slice(textHeader.slice(0, headerLength).length + 1);
      const occupancyData = new Int8Array(width * height);
      const negate = yamlConfig.negate || 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let v = pixelBytes[y * width + x];
          if (negate === 1) v = 255 - v;
          occupancyData[(height - 1 - y) * width + x] = (v >= 0 && v <= 10) ? 100 : (v >= 250 ? 0 : -1);
        }
      }
      const loadedMap = { width, height, resolution: yamlConfig.resolution || 0.05, data: occupancyData, origin: { x: yamlConfig.origin?.[0] || 0, y: yamlConfig.origin?.[1] || 0, z: 0 } };
      mapParamsRef.current = { width, height, resolution: yamlConfig.resolution || 0.05, originX: yamlConfig.origin?.[0] || 0, originY: yamlConfig.origin?.[1] || 0 };
      setMapMsg(loadedMap);
      setEditableMap({ ...loadedMap, data: [...occupancyData] });
      setCanvasInitialized(true); toolInitializedRef.current = false; setMapLoaderActive(false);
      if (mapNameFromFile && !mapName) setMapName(mapNameFromFile);
      if (canvasRef.current) {
        const c = canvasRef.current.parentElement;
        if (c) setZoomState(p => ({ ...p, offsetX: Math.max(0, (c.clientWidth - width) / 2), offsetY: Math.max(0, (c.clientHeight - height) / 2), scale: 1 }));
      }
      await showAlert(`Map loaded!\n📊 ${width}×${height} pixels`, 'success');
    } catch (err) {
      console.error(err);
      await showAlert("Failed to load map.", 'error');
    }
  };

  // Live /map subscription (rosbridge connection owned by ROSContext). This is only for
  // loading the map from the running robot; file sending no longer uses rosbridge.
  useEffect(() => {
    if (!ros || !rosConnected) return;

    const mapListener = new window.ROSLIB.Topic({
      ros,
      name: "/map",
      messageType: "nav_msgs/OccupancyGrid",
    });

    mapListener.subscribe((msg) => {
      if (canvasInitializedRef.current) return;

      const mapData = {
        width: msg.info.width,
        height: msg.info.height,
        resolution: msg.info.resolution,
        data: msg.data,
        origin: msg.info.origin.position,
      };

      mapParamsRef.current = {
        width: msg.info.width,
        height: msg.info.height,
        resolution: msg.info.resolution,
        originX: msg.info.origin.position.x,
        originY: msg.info.origin.position.y,
      };

      setMapMsg(mapData);
      setEditableMap({
        ...mapData,
        data: [...msg.data],
      });
      setCanvasInitialized(true);
      toolInitializedRef.current = false;

      if (canvasRef.current) {
        const c = canvasRef.current.parentElement;
        if (c) {
          setZoomState((p) => ({
            ...p,
            offsetX: Math.max(0, (c.clientWidth - msg.info.width) / 2),
            offsetY: Math.max(0, (c.clientHeight - msg.info.height) / 2),
            scale: 1,
          }));
        }
      }
    });

    return () => {
      mapListener.unsubscribe();
    };
  }, [ros, rosConnected]);

  const saveMapToComputer = async () => {
    if (!mapMsg || !mapParamsRef.current) {
      await showAlert("No map loaded!", 'warning');
      return;
    }

    try {
      const { width, height } = mapMsg, { resolution, originX, originY } = mapParamsRef.current, SF = 1;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = (rotation === 90 || rotation === 270) ? height*SF : width*SF;
      canvas.height = (rotation === 90 || rotation === 270) ? width*SF : height*SF;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(SF, SF);

      if (rotation !== 0) {
        const cX = canvas.width/(2*SF), cY = canvas.height/(2*SF);
        ctx.translate(cX, cY);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.translate(rotation===90||rotation===270 ? -cY : -cX, rotation===90||rotation===270 ? -cX : -cY);
      }

      drawMapToCanvas(ctx, mapMsg.data, width, height, SF);
      drawAnnotations(ctx, SF);
      ctx.restore();

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pgmData = new Uint8Array(canvas.width * canvas.height);

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y*canvas.width+x)*4;
          pgmData[y*canvas.width+x] = Math.round(
            (imageData.data[i] * 0.299 + imageData.data[i+1] * 0.587 + imageData.data[i+2] * 0.114)
          );
        }
      }

      const pgmHeader = `P5\n${canvas.width} ${canvas.height}\n255\n`;
      const pgmBlob = new Blob([new TextEncoder().encode(pgmHeader), pgmData], { type: 'image/x-portable-graymap' });

      let yamlContent = `image: ${mapName || 'map'}.pgm\nmode: trinary\nresolution: ${(resolution/SF).toFixed(6)}\norigin: [${originX.toFixed(6)}, ${originY.toFixed(6)}, 0]\nnegate: 0\noccupied_thresh: 0.65\nfree_thresh: 0.25\n`;

      const forwardArrows = arrows.filter(a => a.direction !== "reverse");
      let forwardNodes = forwardArrows.length > 0 ? getOrderedNodesFromArrows(forwardArrows, nodes) : nodes;
      const forwardWPs = buildWaypointsArray(buildNodesWithYaw(forwardNodes, forwardArrows), "forward");

      const jsonOutput = { waypoints: forwardWPs, total_nodes: forwardWPs.length };

      await downloadFile(pgmBlob, `${mapName||'map'}.pgm`);
      await new Promise(resolve => setTimeout(resolve, 250));
      await downloadFile(new Blob([yamlContent], { type: 'application/x-yaml' }), `${mapName||'map'}.yaml`);
      await new Promise(resolve => setTimeout(resolve, 250));
      await downloadFile(new Blob([JSON.stringify(jsonOutput, null, 2)], { type: 'application/json' }), `${mapName||'map'}_waypoints.json`);

      const speedCount = forwardWPs.filter(wp => wp.speed !== undefined).length;
      await showAlert(`✅ Map exported successfully!\n📄 PGM + YAML + JSON saved\n📍 ${nodes.length} nodes on map\n⚡ ${speedCount} nodes have custom speeds`, 'success');
    } catch (e) {
      console.error("Export error:", e);
      await showAlert(`Error exporting map:\n${e.message}`, 'error');
    }
  };

  const saveCompleteMap = async () => {
    if (!mapMsg || !mapParamsRef.current) {
      await showAlert("No map loaded!", 'warning');
      return;
    }

    try {
      const { width, height } = mapMsg, { resolution, originX, originY } = mapParamsRef.current, SF = 1;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = (rotation===90||rotation===270)?height*SF:width*SF;
      canvas.height = (rotation===90||rotation===270)?width*SF:height*SF;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(SF, SF);

      if (rotation !== 0) {
        const cX = canvas.width/(2*SF), cY = canvas.height/(2*SF);
        ctx.translate(cX, cY);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.translate(rotation===90||rotation===270?-cY:-cX, rotation===90||rotation===270?-cX:-cY);
      }

      drawMapToCanvas(ctx, mapMsg.data, width, height, SF);
      drawAnnotations(ctx, SF);
      ctx.restore();

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pgmData = new Uint8Array(canvas.width * canvas.height);

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y*canvas.width+x)*4;
          pgmData[y*canvas.width+x] = Math.round(
            (imageData.data[i] * 0.299 + imageData.data[i+1] * 0.587 + imageData.data[i+2] * 0.114)
          );
        }
      }

      const pgmHeader = `P5\n${canvas.width} ${canvas.height}\n255\n`;
      const pgmBlob = new Blob([new TextEncoder().encode(pgmHeader), pgmData], { type: 'image/x-portable-graymap' });

      let yamlContent = `image: ${mapName||'map'}.pgm\nmode: trinary\nresolution: ${(resolution/SF).toFixed(6)}\norigin: [${originX.toFixed(6)}, ${originY.toFixed(6)}, 0]\nnegate: 0\noccupied_thresh: 0.65\nfree_thresh: 0.25\n`;

      const completeMapData = {
        version: "2.0",
        mapName,
        rotation,
        timestamp: Date.now(),
        nodes: nodes.map(n => ({ id: n.id, type: n.type, label: n.label, rosX: n.rosX, rosY: n.rosY, yaw: n.yaw || 0, speed: n.speed })),
        arrows: arrows.map(a => ({ id: a.id, fromId: a.fromId, toId: a.toId, points: a.points || [], direction: a.direction, curved: a.curved === true, bends: a.bends || {} })),
        zones: zones.map(z => ({ id: z.id, name: z.name, type: z.type, points: z.points.map(p => ({ rosX: p.rosX, rosY: p.rosY, canvasX: p.canvasX, canvasY: p.canvasY })) }))
      };

      const zip = new JSZip();
      zip.file(`${mapName||'map'}.pgm`, pgmBlob);
      zip.file(`${mapName||'map'}.yaml`, yamlContent);
      zip.file(`${mapName||'map'}_data.json`, JSON.stringify(completeMapData, null, 2));

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      await downloadFile(zipBlob, `${mapName||'map'}_complete.zip`);

      const speedCount = nodes.filter(n => n.speed !== undefined && n.speed !== null).length;
      await showAlert(`✅ Complete map saved!\n📦 ZIP archive created\n📍 ${nodes.length} nodes, ${arrows.length} arrows, ${zones.length} zones\n⚡ ${speedCount} nodes have custom speeds`, 'success');
    } catch (e) {
      console.error("Save error:", e);
      await showAlert(`Error saving complete map:\n${e.message}`, 'error');
    }
  };

  const loadCompleteMap = async (file) => {
    try {
      const zip = new JSZip(), zipData = await zip.loadAsync(file);
      const pgmFiles = Object.keys(zipData.files).filter(n => n.toLowerCase().endsWith('.pgm'));
      const yamlFiles = Object.keys(zipData.files).filter(n => n.toLowerCase().endsWith('.yaml'));
      const dataFiles = Object.keys(zipData.files).filter(n => n.toLowerCase().endsWith('_data.json') || n.toLowerCase().endsWith('data.json'));
      if (!pgmFiles.length) { await showAlert("No PGM file found in ZIP", 'error'); return; }
      if (!yamlFiles.length) { await showAlert("No YAML file found in ZIP", 'error'); return; }
      const yamlText = await zipData.files[yamlFiles[0]].async('text');
      const parsedYaml = yaml.load(yamlText);
      const pgmBuf = await zipData.files[pgmFiles[0]].async('arraybuffer');
      await loadMapFromPGM(pgmBuf, parsedYaml, yamlFiles[0].replace(/\.(yaml|yml)$/, ''));
      if (dataFiles.length > 0) {
        const mapData = JSON.parse(await zipData.files[dataFiles[0]].async('text'));
        const loadedNodes = mapData.nodes.map(node => { const canvas = rosToCanvasCoords(node.rosX, node.rosY); return { ...node, canvasX: canvas.x, canvasY: canvas.y }; });
        const loadedArrows = mapData.arrows.map(arrow => ({ ...arrow, points: arrow.points || [], curved: arrow.curved === true, bends: arrow.bends || {} }));
        const loadedZones = mapData.zones.map(zone => ({ ...zone, points: zone.points.map(p => ({ ...p })) }));
        setNodes(loadedNodes); setArrows(loadedArrows); setZones(loadedZones);
        if (mapData.rotation !== undefined) setRotation(mapData.rotation);
        if (mapData.mapName) setMapName(mapData.mapName);
        const allIds = [...loadedNodes, ...loadedArrows, ...loadedZones];
        idCounter.current = allIds.reduce((max, item) => Math.max(max, parseInt(item.id?.split('_')[1]) || 0), 0) + 1;
        resetHistoryToCurrent({ nodes: loadedNodes, arrows: loadedArrows, zones: loadedZones, rotation: mapData.rotation !== undefined ? mapData.rotation : 0 });
        const speedCount = loadedNodes.filter(n => n.speed !== undefined && n.speed !== null).length;
        await showAlert(`Complete map loaded!\n📍 ${loadedNodes.length} nodes, ${loadedArrows.length} arrows, ${loadedZones.length} zones restored!\n⚡ ${speedCount} nodes have custom speeds`, 'success');
      } else { await showAlert("Map loaded but no node data found in ZIP", 'info'); }
    } catch (err) { console.error(err); await showAlert(`Failed to load complete map:\n${err.message}`, 'error'); }
  };

  const loadJSONWithMap = async () => {
    if (!mapMsg) {
      await showAlert("Please load a map first before importing JSON!", 'warning');
      return;
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const data = JSON.parse(await file.text());
        let loadedNodes = [];

        if (data.waypoints && Array.isArray(data.waypoints)) {
          loadedNodes = data.waypoints.map((wp, idx) => {
            const canvas = rosToCanvasCoords(wp.x, wp.y);
            let label = wp.label;
            if (!label) {
              const typeCount = loadedNodes.filter(n => n.type === wp.type).length + 1;
              label = `${wp.type}_${typeCount}`;
            }
            const yawDegrees = wp.theta ? (wp.theta * 180 / Math.PI) : 0;
            return {
              id: makeId("node"),
              type: wp.type || "waypoint",
              label: label,
              rosX: wp.x,
              rosY: wp.y,
              canvasX: canvas.x,
              canvasY: canvas.y,
              yaw: yawDegrees,
              speed: wp.speed,
              ...(wp.name && { name: wp.name }),
              ...(wp.plc_feedback && { plc_feedback: wp.plc_feedback })
            };
          });

          const loadedArrows = [];
          if (loadedNodes.length > 1) {
            for (let i = 0; i < loadedNodes.length - 1; i++) {
              loadedArrows.push({
                id: makeId("arrow"),
                fromId: loadedNodes[i].id,
                toId: loadedNodes[i+1].id,
                points: [],
                direction: "forward"
              });
            }
          }
          setArrows(loadedArrows);
        }
        else if (data.nodes && Array.isArray(data.nodes)) {
          loadedNodes = data.nodes.map(node => {
            let canvasX = node.canvasX, canvasY = node.canvasY;
            if (!canvasX || !canvasY) {
              const canvas = rosToCanvasCoords(node.rosX, node.rosY);
              canvasX = canvas.x;
              canvasY = canvas.y;
            }
            return {
              ...node,
              canvasX,
              canvasY,
              yaw: node.yaw || 0,
              speed: node.speed
            };
          });
          if (data.arrows) setArrows(data.arrows);
        }

        if (loadedNodes.length === 0) {
          await showAlert("No valid waypoints or nodes found in JSON file", 'warning');
          return;
        }

        const validNodes = [];
        for (const node of loadedNodes) {
          if (isWithinMapBounds(node.rosX, node.rosY)) {
            validNodes.push(node);
          } else {
            console.warn(`Node ${node.label} at (${node.rosX}, ${node.rosY}) is outside map bounds`);
          }
        }

        if (validNodes.length === 0) {
          await showAlert("No nodes are within the map bounds!", 'warning');
          return;
        }

        if (validNodes.length !== loadedNodes.length) {
          await showAlert(`⚠️ ${loadedNodes.length - validNodes.length} node(s) were outside map bounds and were skipped.\n\n✅ Imported ${validNodes.length} valid nodes.`, 'warning');
        }

        setNodes(validNodes);
        nodesRef.current = validNodes;

        const allIds = [...validNodes, ...arrows];
        const maxId = allIds.reduce((max, item) => {
          const idNum = parseInt(item.id?.split('_')[1]) || 0;
          return Math.max(max, idNum);
        }, 0);
        idCounter.current = maxId + 1;

        let importedZones = [];
        if (data.zones) {
          importedZones = data.zones.filter(zone =>
            zone.points.every(point => isWithinMapBounds(point.rosX, point.rosY))
          );
        }
        zonesRef.current = importedZones;
        setZones(importedZones);

        const importedArrows = data.arrows
          ? data.arrows.map(arrow => ({
              ...arrow,
              points: arrow.points || [],
              curved: arrow.curved === true,
              bends: arrow.bends || {}
            }))
          : arrowsRef.current;
        arrowsRef.current = importedArrows;
        setArrows(importedArrows);

        // JSON import is one atomic history action.
        recordHistoryState({
          nodes: validNodes,
          arrows: importedArrows,
          zones: importedZones
        });

        const speedCount = validNodes.filter(n => n.speed !== undefined && n.speed !== null).length;
        await showAlert(`✅ JSON imported successfully!\n📍 ${validNodes.length} nodes\n⚡ ${speedCount} nodes have custom speeds`, 'success');

      } catch (err) {
        console.error(err);
        await showAlert(`Failed to load JSON:\n${err.message}`, 'error');
      }
    };
    fileInput.click();
  };

  const saveMapAsPNG = async () => {
    if (!mapMsg || !mapParamsRef.current) { await showAlert("No map loaded!", 'warning'); return; }
    try {
      const { width, height } = mapMsg, SF = 4;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = width*SF; canvas.height = height*SF;
      ctx.fillStyle = '#f0f0f0'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.save(); ctx.scale(SF, SF);
      if (rotation !== 0) { ctx.translate(width/2, height/2); ctx.rotate(rotation * Math.PI / 180); ctx.translate(-width/2, -height/2); }
      const imgData = ctx.createImageData(width, height);
      for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
        const val = mapMsg.data[y*width+x], py = height-1-y, i = (py*width+x)*4;
        let gray = 205, alpha = 255;
        if (val === -3 || val === -2) { gray = 255; alpha = 0; }
        else if (val === 0) gray = 255;
        else if (val === 100) gray = 0;
        else if (val !== -1) gray = 255 - Math.floor((val/100)*255);
        imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] = gray; imgData.data[i+3] = alpha;
      }
      const offCanvas = document.createElement("canvas"); offCanvas.width = width; offCanvas.height = height;
      offCanvas.getContext("2d").putImageData(imgData, 0, 0); ctx.drawImage(offCanvas, 0, 0, width, height);
      drawAnnotations(ctx, SF);
      ctx.restore();
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob), a = document.createElement('a');
        a.href = url; a.download = `${mapName||'map'}_rotated_${rotation}_${SF}x.png`;
        a.click(); URL.revokeObjectURL(url);
        showAlert(`PNG saved!\n(${nodes.length} nodes, ${arrows.length} arrows, ${zones.length} zones)`, 'success');
      }, 'image/png');
    } catch (e) { console.error(e); showAlert(`Error saving PNG:\n${e.message}`, 'error'); }
  };

  const placeNodeAtClient = (clientX, clientY) => {
    if (!mapParamsRef.current) return;
    const ros = clientToRosCoords(clientX, clientY);
    if (!ros) return;
    const canvas = rosToCanvasCoords(ros.x, ros.y);
    if (!isWithinMapBounds(ros.x, ros.y)) return;
    if (!isWithinPlaceableArea(canvas.x, canvas.y)) return;

    const existingOfType = nodesRef.current.filter(n => n.type === nodeType);
    const nextNumber = existingOfType.length + 1;

    let label = `${nodeType}_${nextNumber}`;
    let counter = nextNumber;
    while (nodesRef.current.some(n => n.label === label)) {
      counter++;
      label = `${nodeType}_${counter}`;
    }

    const newNode = {
      id: makeId("node"),
      type: nodeType,
      label: label,
      rosX: ros.x,
      rosY: ros.y,
      canvasX: canvas.x,
      canvasY: canvas.y,
      yaw: 0.0,
      speed: undefined
    };

    const nextNodes = [...nodesRef.current, newNode];
    setNodes(nextNodes);
    recordHistoryState({ nodes: nextNodes });
  };

  const findNodeAtCanvas = (cx, cy, radius = 10) => {
    for (let i = nodesRef.current.length - 1; i >= 0; --i) {
      const n = nodesRef.current[i];
      if (Math.hypot(n.canvasX - cx, n.canvasY - cy) <= radius) return n;
    }
    return null;
  };

  // Point on a quadratic bezier at parameter t (0..1), used to hit-test along the curve.
  const pointOnQuadratic = (p0x, p0y, cx, cy, p2x, p2y, t) => {
    const mt = 1 - t;
    return {
      x: mt * mt * p0x + 2 * mt * t * cx + t * t * p2x,
      y: mt * mt * p0y + 2 * mt * t * cy + t * t * p2y
    };
  };

  // Return the control point for a quadratic sub-segment [t0,t1] of an
  // original quadratic Bezier. Used when a corner-to-corner curve is automatically
  // split into normal waypoint nodes: every generated arrow segment keeps the exact
  // same curve instead of becoming straight.
  const getQuadraticSubsegmentControlPoint = (p0, control, p2, t0, t1) => {
    const tm = (t0 + t1) / 2;
    const a = pointOnQuadratic(p0.x, p0.y, control.x, control.y, p2.x, p2.y, t0);
    const m = pointOnQuadratic(p0.x, p0.y, control.x, control.y, p2.x, p2.y, tm);
    const b = pointOnQuadratic(p0.x, p0.y, control.x, control.y, p2.x, p2.y, t1);

    // For a quadratic Bezier, B(0.5) = (A + 2C + B) / 4,
    // therefore C = 2*M - (A+B)/2.
    return {
      x: 2 * m.x - (a.x + b.x) / 2,
      y: 2 * m.y - (a.y + b.y) / 2
    };
  };

  // Convert a Bezier control point into the signed "bend" value used by
  // getSegmentControlPoint(). This makes stored bends independent of zoom.
  const controlPointToSignedBend = (p1, p2, control) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy) || 1;
    const px = -dy / len;
    const py = dx / len;
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    return (control.x - mx) * px + (control.y - my) * py;
  };

  // Locate the curved arrow segment (if any) whose *drawn curve* passes near a canvas point,
  // by sampling the quadratic bezier along its length. Only segments between two "corner"
  // points (waypointforcorner nodes / mid-arrow control points) are curved, so only those
  // are draggable.
  const findArrowCurveHitAtCanvas = (cx, cy, radius = 8) => {
    const SAMPLES = 24;
    for (let ai = arrowsRef.current.length - 1; ai >= 0; --ai) {
      const a = arrowsRef.current[ai];
      const from = nodesRef.current.find(n => n.id === a.fromId);
      const to = nodesRef.current.find(n => n.id === a.toId);
      if (!from || !to) continue;
      const ap = [
        { ...from, isCorner: from.type === "waypointforcorner" },
        ...(a.points || []).map(p => ({ ...p, isCorner: true })),
        { ...to, isCorner: to.type === "waypointforcorner" }
      ];
      const bends = a.bends || {};
      for (let i = 0; i < ap.length - 1; i++) {
        const p1 = ap[i], p2 = ap[i + 1];
        if (!(a.curved === true || (Object.keys(bends).length > 0 && ap.length === 2) || (p1.isCorner && p2.isCorner))) continue;
        const ctrl = getSegmentControlPoint(p1, p2, i, bends);
        let minDist = Infinity;
        for (let s = 0; s <= SAMPLES; s++) {
          const t = s / SAMPLES;
          const pt = pointOnQuadratic(p1.canvasX, p1.canvasY, ctrl.x, ctrl.y, p2.canvasX, p2.canvasY, t);
          const d = Math.hypot(cx - pt.x, cy - pt.y);
          if (d < minDist) minDist = d;
        }
        if (minDist <= radius) {
          return { arrowId: a.id, segmentIndex: i, mx: ctrl.mx, my: ctrl.my, px: ctrl.px, py: ctrl.py, len: ctrl.len };
        }
      }
    }
    return null;
  };

  const AUTO_WAYPOINT_SPACING = 1.0; // meters

  // Generates a chain of normal "waypoint" nodes ~1m apart between two corner points,
  // plus the arrows connecting them end-to-end. The waypoints are sampled ALONG the same
  // quadratic curve a direct corner-to-corner arrow is drawn with, so the resulting chain
  // of short segments traces that curve instead of cutting straight across it.
  // `accNewNodes` accumulates every node created so far in the current finish operation,
  // so labels stay unique even when one arrow-drawing pass fills in several segments.
  const buildWaypointChainBetween = (fromPt, toPt, direction, accNewNodes) => {
    const dx = toPt.rosX - fromPt.rosX;
    const dy = toPt.rosY - fromPt.rosY;
    const dist = Math.hypot(dx, dy);

    const newArrows = [];
    let prevId = fromPt.id;

    const steps = Math.floor(dist / AUTO_WAYPOINT_SPACING);

    const originalControl = getSegmentControlPoint(
      { canvasX: fromPt.canvasX, canvasY: fromPt.canvasY },
      { canvasX: toPt.canvasX, canvasY: toPt.canvasY },
      0,
      {}
    );

    const curveStart = { x: fromPt.canvasX, y: fromPt.canvasY };
    const curveEnd = { x: toPt.canvasX, y: toPt.canvasY };
    const curveControl = { x: originalControl.x, y: originalControl.y };

    let waypointCount =
      nodesRef.current.filter(n => n.type === "waypoint").length +
      accNewNodes.filter(n => n.type === "waypoint").length;

    const labelTaken = (label) =>
      nodesRef.current.some(n => n.label === label) ||
      accNewNodes.some(n => n.label === label);

    const tValues = [0];
    for (let i = 1; i <= steps; i++) {
      const t = (i * AUTO_WAYPOINT_SPACING) / dist;
      if (t >= 1) break;
      tValues.push(t);
    }
    tValues.push(1);

    for (let i = 1; i < tValues.length; i++) {
      const t0 = tValues[i - 1];
      const t1 = tValues[i];

      const startCanvas = pointOnQuadratic(
        curveStart.x, curveStart.y,
        curveControl.x, curveControl.y,
        curveEnd.x, curveEnd.y, t0
      );
      const endCanvas = pointOnQuadratic(
        curveStart.x, curveStart.y,
        curveControl.x, curveControl.y,
        curveEnd.x, curveEnd.y, t1
      );

      const subControl = getQuadraticSubsegmentControlPoint(
        curveStart, curveControl, curveEnd, t0, t1
      );

      const bend = controlPointToSignedBend(
        startCanvas,
        endCanvas,
        subControl
      );

      const currentStartId = prevId;

      if (i < tValues.length - 1) {
        const ros = canvasToRosCoords(endCanvas.x, endCanvas.y);
        if (!ros) continue;

        waypointCount++;
        let label = `waypoint_${waypointCount}`;
        while (labelTaken(label)) {
          waypointCount++;
          label = `waypoint_${waypointCount}`;
        }

        const wpNode = {
          id: makeId("node"),
          type: "waypoint",
          label,
          rosX: ros.x,
          rosY: ros.y,
          canvasX: endCanvas.x,
          canvasY: endCanvas.y,
          yaw: 0.0,
          speed: undefined
        };

        accNewNodes.push(wpNode);

        newArrows.push({
          id: makeId("arrow"),
          fromId: currentStartId,
          toId: wpNode.id,
          points: [],
          direction,
          curved: true,
          bends: { 0: bend }
        });

        prevId = wpNode.id;
      } else {
        // Final generated segment ends exactly at the second waypoint-for-corner node.
        newArrows.push({
          id: makeId("arrow"),
          fromId: currentStartId,
          toId: toPt.id,
          points: [],
          direction,
          curved: true,
          bends: { 0: bend }
        });
      }
    }

    return { newArrows };
  };

  // Finishes the in-progress arrow at `toNode`. Walks the full chain — start node,
  // every corner via-point clicked along the way, and the end node — and for each
  // consecutive pair that are BOTH corner points, auto-fills the stretch between
  // them with real "waypoint" nodes every 1m. Segments where either end isn't a
  // corner stay as plain direct arrows.
  // `extraNodesToAdd` lets the caller fold in a brand-new endpoint node so everything
  // lands in a single history step.
  const finishArrowAt = (toNode, viaPoints, extraNodesToAdd = []) => {
    const fromNode = nodesRef.current.find(n => n.id === arrowDrawing.fromId);
    if (!fromNode) { setArrowDrawing({ isDrawing: false, fromId: null, points: [] }); return; }

    const sequence = [
      { id: fromNode.id, rosX: fromNode.rosX, rosY: fromNode.rosY, canvasX: fromNode.canvasX, canvasY: fromNode.canvasY, isCorner: fromNode.type === "waypointforcorner" },
      ...viaPoints,
      { id: toNode.id, rosX: toNode.rosX, rosY: toNode.rosY, canvasX: toNode.canvasX, canvasY: toNode.canvasY, isCorner: toNode.type === "waypointforcorner" }
    ];

    const accNewNodes = [...extraNodesToAdd];
    const allNewArrows = [];

    for (let i = 0; i < sequence.length - 1; i++) {
      const a = sequence[i], b = sequence[i + 1];
      if (a.isCorner && b.isCorner) {
        const { newArrows } = buildWaypointChainBetween(a, b, arrowDirection, accNewNodes);
        allNewArrows.push(...newArrows);
      } else {
        allNewArrows.push({ id: makeId("arrow"), fromId: a.id, toId: b.id, points: [], direction: arrowDirection });
      }
    }

    const nextNodes = accNewNodes.length ? [...nodesRef.current, ...accNewNodes] : nodesRef.current;
    const nextArrows = [...arrowsRef.current, ...allNewArrows];
    if (accNewNodes.length) setNodes(nextNodes);
    setArrows(nextArrows);
    recordHistoryState({ nodes: nextNodes, arrows: nextArrows });
    setArrowDrawing({ isDrawing: false, fromId: null, points: [] });
    setLastClickedCornerNodeId(null);
  };

  const handleConnectClick = (clientX, clientY) => {
    const c = clientToCanvasCoords(clientX, clientY);
    const node = findNodeAtCanvas(c.x, c.y, 8 / zoomState.scale);

    if (!node) {
      if (arrowDrawing.isDrawing) {
        if (!isWithinPlaceableArea(c.x, c.y)) return;
        const ros = clientToRosCoords(clientX, clientY);
        if (!ros || !isWithinMapBounds(ros.x, ros.y)) return;
        const canvas = rosToCanvasCoords(ros.x, ros.y);
        const num = nodesRef.current.filter(n => n.type === nodeType).length + 1;
        const newNode = { id: makeId("node"), type: nodeType, label: `${nodeType}_${num}`, rosX: ros.x, rosY: ros.y, canvasX: canvas.x, canvasY: canvas.y, yaw: 0.0, speed: undefined };
        finishArrowAt(newNode, arrowDrawing.points, [newNode]);
      }
      return;
    }

    if (!arrowDrawing.isDrawing) {
      // Start new arrow
      setArrowDrawing({ isDrawing: true, fromId: node.id, points: [] });
      setLastClickedCornerNodeId(null);
      return;
    }

    if (arrowDrawing.fromId === node.id) {
      // Clicked same node as start
      setArrowDrawing({ isDrawing: false, fromId: null, points: [] });
      setLastClickedCornerNodeId(null);
      return;
    }

    // Corner chaining (single click = via-point, double-click = finish) only applies
    // when the arrow STARTED at a waypointforcorner node (corner -> corner -> ...).
    // If the arrow started at a normal node, clicking a corner node finishes the
    // arrow immediately with one click, like every other node.
    const startNode = nodesRef.current.find(n => n.id === arrowDrawing.fromId);
    const startedAtCorner = startNode?.type === "waypointforcorner";

    if (node.type === "waypointforcorner" && startedAtCorner) {
      const now = Date.now();
      const isQuickDoubleClick = lastClickedCornerNodeId === node.id &&
                                  (now - cornerClickTimeRef.current < 500);

      if (isQuickDoubleClick) {
        // Double-click on corner node = finish arrow there. The first click on this same
        // node already appended it as a via-point; drop that duplicate, otherwise the
        // final segment becomes zero-length and breaks the arrowhead-direction math.
        const lastPt = arrowDrawing.points[arrowDrawing.points.length - 1];
        const trimmedPoints = (lastPt && lastPt.id === node.id)
          ? arrowDrawing.points.slice(0, -1)
          : arrowDrawing.points;
        finishArrowAt(node, trimmedPoints);
      } else {
        // Single click on corner = add as control point and continue
        setArrowDrawing(prev => ({
          ...prev,
          points: [...prev.points, { id: node.id, rosX: node.rosX, rosY: node.rosY, canvasX: node.canvasX, canvasY: node.canvasY, isCorner: true }]
        }));
        setLastClickedCornerNodeId(node.id);
        cornerClickTimeRef.current = now;
      }
      return;
    }

    // Clicking any other node finishes the arrow
    finishArrowAt(node, arrowDrawing.points);
  };

  const finishZone = () => {
    if (!currentZonePoints.length) return;
    const nextZones = [...zonesRef.current, { id: makeId("zone"), name: zoneName || `Zone_${zonesRef.current.length + 1}`, type: zoneType, points: currentZonePoints.slice() }];
    setZones(nextZones);
    recordHistoryState({ zones: nextZones });
    setCurrentZonePoints([]); setZoneName(""); setZoneType("normal");
  };

  // ───────────────────────────────────────────────────────────────────────────
  // SEND TO ROBOT OVER SSH (SFTP)
  //
  // The renderer asks the Electron main process (main.js) over IPC ("robot:send-file").
  // main.js connects with `ssh2`, writes the file into the chosen folder on the robot
  // (default ~/Desktop) and returns { ok, path } or { ok:false, error }.
  // ───────────────────────────────────────────────────────────────────────────
  const openSendModal = async (type) => {
    if (!mapName) { await showAlert("Enter a map name first!", 'warning'); return; }
    if (nodes.length === 0) { await showAlert("No nodes to send!", 'warning'); return; }
    setCurrentSendType(type); setSendingStatus(""); setShowRobotIpModal(true);
  };

  const handleSendYAMLToRobot = () => openSendModal('yaml');
  const handleSendJSONToRobot = () => openSendModal('json');

  const closeRobotModal = () => {
    setShowRobotIpModal(false);
    setSendingStatus("");
  };

  const executeSendToRobot = async () => {
    const ip = robotIp.trim();
    if (!ip) { setSendingStatus("Please enter robot IP address"); return; }
    if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) { setSendingStatus("Please enter a valid IP address"); return; }
    // No preload script: the renderer talks to main.js directly (nodeIntegration is on).
    const ipcRenderer = window.require ? window.require("electron").ipcRenderer : null;
    if (!ipcRenderer) {
      setSendingStatus("❌ SSH sending only works in the desktop app (Electron).");
      return;
    }

    if (currentSendType === 'yaml') setIsSavingYAML(true); else setIsSavingJSON(true);
    setDbStatus("Sending..."); setSendingStatus("Connecting over SSH...");
    try {
      const forwardArrows = arrows.filter(a => a.direction !== "reverse");
      const reverseArrows = arrows.filter(a => a.direction === "reverse");
      const forwardNodes = forwardArrows.length > 0 ? getOrderedNodesFromArrows(forwardArrows, nodes) : nodes;
      const reverseNodes = reverseArrows.length > 0 ? getOrderedNodesFromArrows(reverseArrows, nodes) : [];
      const forwardWPs = forwardNodes.length > 0 ? buildWaypointsArray(buildNodesWithYaw(forwardNodes, forwardArrows), "forward") : [];
      const reverseWPs = reverseNodes.length > 0 ? buildWaypointsArray(buildNodesWithYaw(reverseNodes, reverseArrows), "reverse") : [];

      // Map names like "map/map" would be read as a folder path, so make them filename-safe.
      const safeName = mapName.replace(/[^A-Za-z0-9._-]+/g, "_");

      let filename, content, count;
      if (currentSendType === 'yaml') {
        filename = `${safeName}_waypoints.yaml`;
        content = buildYAMLString(forwardWPs, reverseWPs);
        count = forwardWPs.length + reverseWPs.length;
      } else {
        filename = `${safeName}_waypoints.json`;
        content = JSON.stringify({ waypoints: forwardWPs, total_nodes: forwardWPs.length }, null, 2);
        count = forwardWPs.length;
      }

      const result = await ipcRenderer.invoke("robot:send-file", {
        host: ip,
        filename, content,
      });
      if (!result?.ok) throw new Error(result?.error || "The robot could not save the file");

      // Remember connection details (NOT the password) for next time.
      try {
        localStorage.setItem("mapEditorRobotConn", JSON.stringify({ ip }));
      } catch (_) {}

      setDbStatus("Sent!"); setSendingStatus("✅ Sent successfully!");
      setTimeout(() => {
        closeRobotModal();
        showAlert(`${currentSendType.toUpperCase()} sent to robot at ${ip}!\n📍 ${count} waypoints sent\n📁 Saved as ${result.path}`, 'success');
      }, 800);
    } catch (e) {
      console.error(e); setDbStatus("Failed!"); setSendingStatus(`❌ Failed: ${e.message}`);
    } finally {
      setIsSavingYAML(false); setIsSavingJSON(false);
    }
  };

  const handleClearAll = async () => {
    const ok = await showConfirm("Clear ALL nodes, arrows, and zones?", 'warning');
    if (!ok) return;
    nodesRef.current = [];
    arrowsRef.current = [];
    zonesRef.current = [];
    rotationRef.current = 0;
    setNodes([]); setArrows([]); setZones([]); setCurrentZonePoints([]);
    setArrowDrawing({ isDrawing: false, fromId: null, points: [] }); setRotation(0);
    recordHistoryState({ nodes: [], arrows: [], zones: [], rotation: 0 });
  };

  const handleClearWorkspace = async () => {
    const ok = await showConfirm("Clear ALL data including the map?\nThis cannot be undone.", 'error');
    if (!ok) return;
    localStorage.removeItem("mapEditorWorkspace");
    idCounter.current = 1;
    setMapMsg(null); setEditableMap(null); setNodes([]); setArrows([]); setZones([]);
    setCurrentZonePoints([]); setArrowDrawing({ isDrawing: false, fromId: null, points: [] });
    setMapName(""); setCanvasInitialized(false); setRotation(0);
    mapParamsRef.current = null; toolInitializedRef.current = false; clearHistory();
    setZoomState({ scale: 1, offsetX: 0, offsetY: 0, isDragging: false, lastX: 0, lastY: 0 });
  };

  const drawMapToCanvas = (ctx, mapMsgData, width, height, SF) => {
    const imgData = ctx.createImageData(width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const val = mapMsgData[y * width + x];
        const py = height - 1 - y;
        const i = (py * width + x) * 4;
        let gray = (val === -3 || val === -2) ? 205 : val === -1 ? 205 : val === 0 ? 255 : val === 100 ? 0 : 255 - Math.floor((val / 100) * 255);
        imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] = gray; imgData.data[i+3] = 255;
      }
    }
    const offCanvas = document.createElement("canvas");
    offCanvas.width = width; offCanvas.height = height;
    offCanvas.getContext("2d").putImageData(imgData, 0, 0);
    ctx.drawImage(offCanvas, 0, 0, width, height);
  };

  const drawAnnotations = (ctx, SF) => {
    zones.forEach(z => {
      if (!z.points || z.points.length < 2) return;
      ctx.beginPath();
      z.points.forEach((p, i) => { if (i === 0) ctx.moveTo(p.canvasX, p.canvasY); else ctx.lineTo(p.canvasX, p.canvasY); });
      ctx.closePath();
      ctx.fillStyle = z.type === 'keep_out' ? "rgba(0,0,0,0.5)" : "rgba(16,185,129,0.15)"; ctx.fill();
      ctx.strokeStyle = z.type === 'keep_out' ? "rgba(0,0,0,1)" : "rgba(16,185,129,0.6)";
      ctx.lineWidth = 2/SF; ctx.stroke();
      const cx = z.points.reduce((s,p) => s+p.canvasX, 0)/z.points.length;
      const cy = z.points.reduce((s,p) => s+p.canvasY, 0)/z.points.length;
      ctx.fillStyle = z.type === 'keep_out' ? "#dc2626" : "#064e3b";
      ctx.font = `${Math.max(8, 12/SF)}px Arial`; ctx.fillText(z.name, cx+6/SF, cy);
    });
    arrows.forEach(a => {
      const from = nodes.find(n => n.id === a.fromId), to = nodes.find(n => n.id === a.toId);
      if (!from || !to) return;
      const ap = [
        { ...from, isCorner: from.type === "waypointforcorner" },
        ...(a.points || []).map(p => ({ ...p, isCorner: true })),
        { ...to, isCorner: to.type === "waypointforcorner" }
      ];
      if (ap.length < 2) return;
      const color = a.direction === "reverse" ? "#ef4444" : "#f97316";
      const bends = a.bends || {};
      const curveAllSegments = a.curved === true || (Object.keys(bends).length > 0 && ap.length === 2);
      ctx.strokeStyle = color; ctx.lineWidth = Math.max(1, 3/SF);
      drawSmoothArrowPath(ctx, ap, bends, curveAllSegments);
      const last = ap[ap.length-1], secLast = ap[ap.length-2];
      if (last && secLast) {
        let tangentX = last.canvasX - secLast.canvasX;
        let tangentY = last.canvasY - secLast.canvasY;

        if (curveAllSegments) {
          const lastIndex = ap.length - 2;
          const lastCtrl = getSegmentControlPoint(secLast, last, lastIndex, bends);
          tangentX = last.canvasX - lastCtrl.x;
          tangentY = last.canvasY - lastCtrl.y;
        }

        const angle = Math.atan2(tangentY, tangentX), hl = Math.max(6, 12/SF);
        ctx.beginPath(); ctx.moveTo(last.canvasX, last.canvasY);
        ctx.lineTo(last.canvasX - hl*Math.cos(angle-Math.PI/6), last.canvasY - hl*Math.sin(angle-Math.PI/6));
        ctx.lineTo(last.canvasX - hl*Math.cos(angle+Math.PI/6), last.canvasY - hl*Math.sin(angle+Math.PI/6));
        ctx.closePath(); ctx.fillStyle = color; ctx.fill();
      }
    });
    nodes.forEach(n => {
      const radius = Math.max(2, 6/SF);
      const nodeColor = T.nodeColors[n.type] || "#1e40af";
      ctx.beginPath();
      ctx.fillStyle = nodeColor;
      ctx.arc(n.canvasX, n.canvasY, radius, 0, Math.PI*2);
      ctx.fill();
      ctx.font = `bold ${Math.max(6, 10/SF)}px Arial`;
      ctx.lineWidth = 3 / SF;
      ctx.strokeStyle = 'white';
      ctx.strokeText(getDisplayLabel(n), n.canvasX + radius + 2, n.canvasY - radius - 2);
      ctx.fillStyle = '#111827';
      ctx.fillText(getDisplayLabel(n), n.canvasX + radius + 2, n.canvasY - radius - 2);
    });
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left, y = e.clientY - rect.top;

    if (e.button === 2) {
      const c = clientToCanvasCoords(e.clientX, e.clientY);
      const node = findNodeAtCanvas(c.x, c.y, 8 / zoomState.scale);
      if (node) {
        e.preventDefault();
        openSpeedModal(node);
        return;
      }
    }

    if (e.button === 0 && (tool === "pan" || tool === "place_node")) {
      const c = clientToCanvasCoords(e.clientX, e.clientY);
      const node = findNodeAtCanvas(c.x, c.y, 8 / zoomState.scale);
      if (node) {
        draggingNodeRef.current = node.id;
        setDraggingNodeId(node.id);
        return;
      }

      // No node hit — see if the click landed on a curved arrow's drawn line.
      // Only enabled in "pan" mode so it never conflicts with node placement clicks.
      if (tool === "pan") {
        const arrowHit = findArrowCurveHitAtCanvas(c.x, c.y, 8 / zoomState.scale);
        if (arrowHit) {
          draggingArrowRef.current = arrowHit;
          setDraggingArrowInfo({ arrowId: arrowHit.arrowId, segmentIndex: arrowHit.segmentIndex });
          return;
        }
      }
    }

    if (e.button === 1 || tool === "pan") { setZoomState(p => ({ ...p, isDragging: true, lastX: x, lastY: y })); return; }
    if (tool === "place_node") { placeNodeAtClient(e.clientX, e.clientY); return; }
    if (tool === "connect") { handleConnectClick(e.clientX, e.clientY); return; }
    if (tool === "zone") {
      if (!mapParamsRef.current) return;
      const ros = clientToRosCoords(e.clientX, e.clientY); if (!ros) return;
      const canvas = rosToCanvasCoords(ros.x, ros.y);
      setCurrentZonePoints(p => [...p, { rosX: ros.x, rosY: ros.y, canvasX: canvas.x, canvasY: canvas.y }]); return;
    }
    if (tool === "erase") { eraseAtClient(e.clientX, e.clientY); return; }
    if (tool === "crop") {
      const c = clientToCanvasCoords(e.clientX, e.clientY);
      setCropState({ ...cropState, startX: c.x, startY: c.y, endX: c.x, endY: c.y, isDragging: true, freehandPoints: [{x: c.x, y: c.y}] });
    }
  };

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    const cc = clientToCanvasCoords(e.clientX, e.clientY);
    const ros = canvasToRosCoords(cc.x, cc.y);
    if (ros) setCursorCoords({ rosX: ros.x, rosY: ros.y, canvasX: cc.x, canvasY: cc.y }); else setCursorCoords(null);

    if (draggingNodeRef.current) {
      if (ros && isWithinMapBounds(ros.x, ros.y) && isWithinPlaceableArea(cc.x, cc.y)) {
        setNodes(prev => {
          const next = prev.map(n =>
            n.id === draggingNodeRef.current
              ? { ...n, canvasX: cc.x, canvasY: cc.y, rosX: ros.x, rosY: ros.y }
              : n
          );
          nodesRef.current = next;
          return next;
        });
      }
      return;
    }

    if (draggingArrowRef.current) {
      // Project the cursor onto the perpendicular of the segment's straight line.
      // The *sign* of this projection determines which side the curve bows to —
      // dragging across the straight line flips the sign, which flips the curve.
      const { arrowId, segmentIndex, mx, my, px, py, len } = draggingArrowRef.current;
      const vx = cc.x - mx, vy = cc.y - my;
      let proj = vx * px + vy * py;
      const maxBow = Math.max(25, len * 0.6);
      proj = Math.max(-maxBow, Math.min(maxBow, proj));
      setArrows(prev => {
        const next = prev.map(a =>
          a.id === arrowId
            ? { ...a, bends: { ...(a.bends || {}), [segmentIndex]: proj } }
            : a
        );
        arrowsRef.current = next;
        return next;
      });
      return;
    }

    if ((tool === "pan" || tool === "place_node") && !zoomState.isDragging) {
      const hoverNode = findNodeAtCanvas(cc.x, cc.y, 8 / zoomState.scale);
      setHoveredNodeId(hoverNode ? hoverNode.id : null);
      if (!hoverNode && tool === "pan") {
        const hoverArrow = findArrowCurveHitAtCanvas(cc.x, cc.y, 8 / zoomState.scale);
        setHoveredArrowControl(hoverArrow ? `${hoverArrow.arrowId}_${hoverArrow.segmentIndex}` : null);
      } else if (hoveredArrowControl) {
        setHoveredArrowControl(null);
      }
    } else {
      if (hoveredNodeId) setHoveredNodeId(null);
      if (hoveredArrowControl) setHoveredArrowControl(null);
    }

    if (zoomState.isDragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const dx = x - zoomState.lastX, dy = y - zoomState.lastY;
      if (rotation !== 0) {
        const angle = -rotation * Math.PI / 180;
        setZoomState(p => ({ ...p, offsetX: p.offsetX + dx*Math.cos(angle) - dy*Math.sin(angle), offsetY: p.offsetY + dx*Math.sin(angle) + dy*Math.cos(angle), lastX: x, lastY: y }));
      } else { setZoomState(p => ({ ...p, offsetX: p.offsetX + dx, offsetY: p.offsetY + dy, lastX: x, lastY: y })); }
    }
    if (cropState.isDragging && tool === "crop") {
      const c = clientToCanvasCoords(e.clientX, e.clientY);
      setCropState(prev => ({ ...prev, endX: c.x, endY: c.y, freehandPoints: [...prev.freehandPoints, {x: c.x, y: c.y}] }));
    }
    if (handEraseState.isErasing) continueHandErase(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    if (draggingNodeRef.current || draggingArrowRef.current) {
      recordHistoryState();
      draggingNodeRef.current = null;
      setDraggingNodeId(null);
      draggingArrowRef.current = null;
      setDraggingArrowInfo(null);
      return;
    }
    if (zoomState.isDragging) setZoomState(p => ({ ...p, isDragging: false }));
    if (cropState.isDragging && tool === "crop") setCropState(prev => ({ ...prev, isDragging: false }));
    if (handEraseState.isErasing) stopHandErase();
  };

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true }); if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    const container = canvas.parentElement; if (!container) return;
    const cW = container.clientWidth, cH = container.clientHeight;
    if (cW <= 0 || cH <= 0) return;
    canvas.width = cW; canvas.height = cH;
    ctx.clearRect(0, 0, cW, cH);
    const mapToRender = editableMap || mapMsg;
    if (!mapToRender || !canvasInitialized) {
      ctx.fillStyle = T.surface; ctx.fillRect(0, 0, cW, cH);
      ctx.fillStyle = T.textSecondary; ctx.font = "16px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("Load a map to begin editing", cW/2, cH/2); return;
    }
    const { width, height, data } = mapToRender;
    ctx.save();
    if (rotation !== 0) { const cx = cW/2, cy = cH/2; ctx.translate(cx, cy); ctx.rotate(rotation * Math.PI / 180); ctx.translate(-cx, -cy); }
    ctx.translate(zoomState.offsetX, zoomState.offsetY); ctx.scale(zoomState.scale, zoomState.scale);
    const imgData = ctx.createImageData(width, height);
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const val = data[y*width+x], py = height-1-y, i = (py*width+x)*4;
      let gray = 205, alpha = 255;
      if (val === -3) { gray = 255; alpha = 0; } else if (val === -2) { gray = 180; } else if (val === -1) { gray = 205; } else if (val === 0) { gray = 255; } else if (val === 100) { gray = 0; } else { gray = 255 - Math.floor((val/100)*255); }
      imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] = gray; imgData.data[i+3] = alpha;
    }
    const offCanvas = document.createElement("canvas"); offCanvas.width = width; offCanvas.height = height;
    const oCtx = offCanvas.getContext("2d"); if (oCtx) { oCtx.putImageData(imgData, 0, 0); ctx.drawImage(offCanvas, 0, 0, width, height); }
    if (cropState.isCropping && cropState.freehandPoints.length > 0) {
      ctx.strokeStyle = '#00ff00'; ctx.lineWidth = 2/zoomState.scale; ctx.setLineDash([5, 5]);
      ctx.beginPath();
      cropState.freehandPoints.forEach((point, idx) => { if (idx === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y); });
      if (cropState.isDragging && cursorCoords) ctx.lineTo(cursorCoords.canvasX, cursorCoords.canvasY);
      ctx.stroke(); ctx.setLineDash([]);
      if (cropState.freehandPoints.length >= 3) {
        ctx.fillStyle = 'rgba(0,255,0,0.1)'; ctx.beginPath();
        cropState.freehandPoints.forEach((point, idx) => { if (idx === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y); });
        ctx.closePath(); ctx.fill();
      }
    }
    zones.forEach(z => {
      if (!z.points || z.points.length < 2) return;
      ctx.beginPath();
      z.points.forEach((p, i) => { if (i === 0) ctx.moveTo(p.canvasX, p.canvasY); else ctx.lineTo(p.canvasX, p.canvasY); });
      ctx.closePath();
      ctx.fillStyle = z.type === 'keep_out' ? "rgba(0,0,0,0.5)" : "rgba(16,185,129,0.15)"; ctx.fill();
      ctx.strokeStyle = z.type === 'keep_out' ? "rgba(0,0,0,1)" : "rgba(16,185,129,0.6)";
      ctx.lineWidth = 1/zoomState.scale; ctx.stroke();
      const cx = z.points.reduce((s,p)=>s+p.canvasX,0)/z.points.length;
      const cy = z.points.reduce((s,p)=>s+p.canvasY,0)/z.points.length;
      ctx.fillStyle = z.type === 'keep_out' ? "#dc2626" : "#064e3b";
      ctx.font = `${Math.max(8, 12/zoomState.scale)}px Arial`; ctx.fillText(z.name, cx+6/zoomState.scale, cy);
    });
    if (currentZonePoints.length) {
      ctx.beginPath();
      currentZonePoints.forEach((p, idx) => { if (idx === 0) ctx.moveTo(p.canvasX, p.canvasY); else ctx.lineTo(p.canvasX, p.canvasY); });
      ctx.strokeStyle = zoneType === 'keep_out' ? "rgba(0,0,0,0.9)" : "rgba(59,130,246,0.9)";
      ctx.lineWidth = zoneType === 'keep_out' ? 2/zoomState.scale : 1/zoomState.scale; ctx.stroke();
    }
    arrows.forEach(a => {
      const from = nodes.find(n => n.id === a.fromId), to = nodes.find(n => n.id === a.toId);
      if (!from || !to) return;
      const ap = [
        { ...from, isCorner: from.type === "waypointforcorner" },
        ...(a.points || []).map(p => ({ ...p, isCorner: true })),
        { ...to, isCorner: to.type === "waypointforcorner" }
      ];
      if (ap.length < 2) return;
      const color = a.direction === "reverse" ? "#ef4444" : "#f97316";
      const bends = a.bends || {};
      const curveAllSegments = a.curved === true || (Object.keys(bends).length > 0 && ap.length === 2);
      ctx.strokeStyle = color; ctx.lineWidth = Math.max(1, 2/zoomState.scale);
      drawSmoothArrowPath(ctx, ap, bends, curveAllSegments);
      const last = ap[ap.length-1], secLast = ap[ap.length-2];
      if (last && secLast) {
        const angle = Math.atan2(last.canvasY-secLast.canvasY, last.canvasX-secLast.canvasX), hl = Math.max(6, 12/zoomState.scale);
        ctx.beginPath(); ctx.moveTo(last.canvasX, last.canvasY);
        ctx.lineTo(last.canvasX-hl*Math.cos(angle-Math.PI/6), last.canvasY-hl*Math.sin(angle-Math.PI/6));
        ctx.lineTo(last.canvasX-hl*Math.cos(angle+Math.PI/6), last.canvasY-hl*Math.sin(angle+Math.PI/6));
        ctx.closePath(); ctx.fillStyle = color; ctx.fill();
      }

      // Direct-drag feedback: re-stroke just the curved segment the user is hovering or
      // dragging with a bright, thicker overlay so it's clear the whole line is grabbable.
      if (tool === "pan") {
        for (let i = 0; i < ap.length - 1; i++) {
          const p1 = ap[i], p2 = ap[i + 1];
          if (!(a.curved === true || (Object.keys(bends).length > 0 && ap.length === 2) || (p1.isCorner && p2.isCorner))) continue;
          const key = `${a.id}_${i}`;
          const isActive = (draggingArrowInfo && draggingArrowInfo.arrowId === a.id && draggingArrowInfo.segmentIndex === i) ||
                            hoveredArrowControl === key;
          if (!isActive) continue;
          const ctrl = getSegmentControlPoint(p1, p2, i, bends);
          ctx.save();
          ctx.strokeStyle = "#ffffff";
          ctx.globalAlpha = 0.85;
          ctx.lineWidth = Math.max(3, 5 / zoomState.scale);
          ctx.beginPath();
          ctx.moveTo(p1.canvasX, p1.canvasY);
          ctx.quadraticCurveTo(ctrl.x, ctrl.y, p2.canvasX, p2.canvasY);
          ctx.stroke();
          ctx.restore();
        }
      }
    });
    if (arrowDrawing.isDrawing) {
      const from = nodes.find(n => n.id === arrowDrawing.fromId);
      if (from && cursorCoords) {
        const allPoints = [
          { ...from, isCorner: from.type === "waypointforcorner" },
          ...arrowDrawing.points,
          { ...cursorCoords, isCorner: false }
        ];
        if (allPoints.length >= 2) {
          ctx.strokeStyle = "rgba(255,165,0,0.8)"; ctx.lineWidth = Math.max(1, 2/zoomState.scale);
          drawSmoothArrowPath(ctx, allPoints, {}, false);
        }
      }
    }
    nodes.forEach(n => {
      const isActive = n.id === draggingNodeId || n.id === hoveredNodeId;
      const radius = Math.max(2, 6/zoomState.scale) * (isActive ? 1.4 : 1);
      const nodeColor = T.nodeColors[n.type] || "#1e40af";
      ctx.beginPath();
      ctx.fillStyle = nodeColor;
      ctx.arc(n.canvasX, n.canvasY, radius, 0, Math.PI*2);
      ctx.fill();
      if (isActive) {
        ctx.lineWidth = Math.max(1, 2/zoomState.scale);
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
      }
      ctx.font = `bold ${Math.max(6, 10/zoomState.scale)}px Arial`;
      ctx.lineWidth = 3 / zoomState.scale;
      ctx.strokeStyle = 'white';
      ctx.strokeText(getDisplayLabel(n), n.canvasX + radius + 2, n.canvasY - radius - 2);
      ctx.fillStyle = '#111827';
      ctx.fillText(getDisplayLabel(n), n.canvasX + radius + 2, n.canvasY - radius - 2);
    });

    if (cursorCoords) {
      ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.lineWidth = Math.max(0.5, 0.5/zoomState.scale);
      ctx.beginPath(); ctx.moveTo(cursorCoords.canvasX, 0); ctx.lineTo(cursorCoords.canvasX, height);
      ctx.moveTo(0, cursorCoords.canvasY); ctx.lineTo(width, cursorCoords.canvasY); ctx.stroke();
    }
    ctx.restore();
  }, [mapMsg, editableMap, zoomState, nodes, arrows, zones, currentZonePoints, cursorCoords, T, rotation, arrowDrawing, cropState, zoneType, tool, canvasInitialized, draggingNodeId, hoveredNodeId, draggingArrowInfo, hoveredArrowControl, canvasSize]);

  // Modals below are plain render functions (called as {renderX()}), NOT nested
  // components. A component defined inside MapEditor gets a new identity on every render,
  // which would remount it (and drop input focus) on every keystroke / mouse move.
  const renderMapLoaderModal = () => {
    const handleZipSelect = async (e) => {
      const file = e.target.files[0]; if (!file) return;
      await loadMapFromZip(file);
    };
    return (
      <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
        <div style={{ background:T.card, padding:24, borderRadius:12, border:`1px solid ${T.border}`, borderTop:`3px solid ${T.accent}`, maxWidth:500, width:'90%', boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>
          <h3 style={{ margin:'0 0 20px 0', color:T.text }}>🗺️ Load Map from ZIP</h3>
          <div style={{ marginBottom:20 }}>
            <label style={styles.label}>Select ZIP File:
              <div style={{ marginTop:6, border:`1px solid ${T.border}`, borderRadius:8, padding:'10px 12px', background:T.card, color:T.text, fontSize:'14px', cursor:'pointer', position:'relative', overflow:'hidden' }}>
                Choose ZIP file containing YAML and PGM...
                <input type="file" accept=".zip" onChange={handleZipSelect} style={{ position:'absolute', inset:0, opacity:0, cursor:'pointer' }} />
              </div>
            </label>
            <div style={styles.hint}>Select a ZIP file containing both YAML and PGM map files.</div>
          </div>
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
            <button onClick={() => { setMapLoaderActive(false); }} style={styles.button}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const renderRobotModal = () => {
    const busy = isSavingYAML || isSavingJSON;
    return (
      <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
        <div style={{ background:T.card, padding:24, borderRadius:12, border:`1px solid ${T.border}`, borderTop:`3px solid #10b981`, maxWidth:420, width:'90%', boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>
          <h3 style={{ margin:'0 0 16px 0', color:T.text }}>{currentSendType === 'yaml' ? '📤 Send YAML to Robot (SSH)' : '📤 Send JSON to Robot (SSH)'}</h3>

          <label style={styles.label}>Robot IP Address</label>
          <input type="text" value={robotIp} onChange={e => setRobotIp(e.target.value)}
                 onKeyDown={e => { if (e.key === 'Enter' && !busy) executeSendToRobot(); }}
                 placeholder="e.g., 192.168.1.100" style={styles.input} autoFocus />
          <p style={styles.hint}>Enter the robot's IP. The file is saved to the robot's Desktop folder.</p>

          {sendingStatus && (
            <div style={{ padding:10, borderRadius:8, margin:'12px 0', background: sendingStatus.includes('✅') ? '#10b981' : sendingStatus.includes('❌') ? '#ef4444' : '#3b82f6', color:'white', fontSize:14, textAlign:'center' }}>
              {sendingStatus}
            </div>
          )}
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:12 }}>
            <button onClick={closeRobotModal} style={styles.button}>Cancel</button>
            <button onClick={executeSendToRobot} style={{ ...styles.buttonAction, background:'#10b981' }} disabled={busy}>
              {busy ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getCanvasCursor = () => {
    if (draggingArrowInfo) return "grabbing";
    if (draggingNodeId) return "move";
    if (hoveredArrowControl && tool === "pan") return "grab";
    if (hoveredNodeId && (tool === "pan" || tool === "place_node")) return "grab";
    if (tool === "erase") return "cell";
    if (tool === "pan") return zoomState.isDragging ? "grabbing" : "grab";
    if (tool === "place_node") return "crosshair";
    if (tool === "connect") return "crosshair";
    if (tool === "zone") return "crosshair";
    return "default";
  };

  return (
    <div style={styles.container}>
      {ModalComponent}
      {speedModalNode && renderSpeedModal()}
      {mapLoaderActive && renderMapLoaderModal()}
      {showRobotIpModal && renderRobotModal()}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, flexWrap:"wrap", gap:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <h1 style={{ margin:0, color:T.text, fontSize:'24px' }}>
            <FaMapMarkerAlt style={{ color:T.accent, marginRight:8 }} />Map Editor
          </h1>
          <div style={styles.mapInfo}>Map: {mapName || "—"}</div>
          <div style={styles.mapInfo}>Rotation: {rotation}°</div>
          <div style={styles.mapInfo}>Nodes: {nodes.length}</div>
          <div style={styles.mapInfo}>Arrows: {arrows.length}</div>
          <div style={styles.mapInfo}>Zones: {zones.length}</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={styles.hud}>{cursorCoords ? `ROS: ${cursorCoords.rosX.toFixed(2)}, ${cursorCoords.rosY.toFixed(2)}` : "Hover map for coordinates"}</div>
          <button onClick={toggleDarkMode} style={{ ...styles.buttonSmall, background:'transparent', color:T.text, border:`1px solid ${T.border}` }} title={darkMode ? "Light Mode" : "Dark Mode"}>
            {darkMode ? <FaSun size={14} /> : <FaMoon size={14} />}
          </button>
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.sidebar}>
          <div style={{ display:'flex', gap:4, marginBottom:16, borderBottom:`1px solid ${T.border}`, paddingBottom:8 }}>
            {[{ id:"map", label:"🗺️ Map" }, { id:"annotate", label:"📍 Annotate" }, { id:"export", label:"📤 Export" }, { id:"tools", label:"🔧 Tools" }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex:1, padding:'8px 4px', borderRadius:8, border:'none', cursor:'pointer', fontSize:'12px', fontWeight: activeTab===tab.id ? '600' : '500', background: activeTab===tab.id ? T.accent : 'transparent', color: activeTab===tab.id ? '#fff' : T.textSecondary, transition:'all 0.2s ease' }}>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "map" && (
            <>
              <div style={styles.buttonGroup}>
                <label style={styles.label}>Map Name</label>
                <input value={mapName} onChange={e => setMapName(e.target.value)} placeholder="My Map" style={styles.input} />
              </div>
              <div style={styles.buttonGroup}>
                <label style={styles.label}>Map Operations</label>
                <button onClick={() => setMapLoaderActive(true)} style={styles.buttonAction}><FaUpload /> Load Map</button>
                <button onClick={saveMapToComputer} style={styles.buttonAction}>
                  <FaDownload /> Save PGM Map
                </button>
                <button onClick={saveMapAsPNG} style={styles.buttonAction}><FaImage /> Save PNG Map</button>
                <button onClick={saveCompleteMap} style={styles.buttonAction}>
                  <FaDownload /> Save Complete ZIP
                </button>
              </div>
            </>
          )}

          {activeTab === "annotate" && (
            <>
              <div style={styles.buttonGroup}>
                <label style={styles.label}>Yaw Calculation</label>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <select value={yawCalculationMethod} onChange={e => setYawCalculationMethod(e.target.value)} style={styles.select}>
                    <option value="direction">Direction-based</option>
                    <option value="none">No calculation</option>
                  </select>
                  <button onClick={() => setShowYawTooltip(!showYawTooltip)} style={{ ...styles.buttonSmall, width:'36px' }}>?</button>
                </div>
                <div style={styles.hint}>Yaw calculated from arrow direction when saving.</div>
              </div>
              <div style={styles.buttonGroup}>
                <label style={styles.label}>Undo / Redo (Ctrl+Z / Ctrl+Y)</label>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={handleUndo} style={{ ...styles.button, flex:1 }} disabled={historyIndex <= 0}><FaUndo /> Undo</button>
                  <button onClick={handleRedo} style={{ ...styles.button, flex:1 }} disabled={historyIndex >= history.length-1}><FaRedoAlt /> Redo</button>
                </div>
                <div style={styles.hint}>History: {historyIndex+1}/{history.length} steps</div>
              </div>
              <div style={styles.buttonGroup}>
                <label style={styles.label}>Clear Data</label>
                <button onClick={handleClearAll} style={styles.buttonDanger}><FaTrashAlt /> Clear Annotations</button>
                <button onClick={handleClearWorkspace} style={{ ...styles.buttonDanger, background:'#dc2626' }}><FaTrashAlt /> Delete Map & Annotations</button>
              </div>
            </>
          )}

          {activeTab === "export" && (
            <>
              <div style={styles.buttonGroup}>
                <label style={styles.label}>Export Files</label>
                <button onClick={handleSaveYAML} style={styles.buttonAction}><FaFileExport /> Export YAML</button>
                <button onClick={handleSaveJSON} style={styles.buttonAction}><FaFileExport /> Export JSON</button>
              </div>
              <div style={styles.buttonGroup}>
                <label style={styles.label}>Import</label>
                <button onClick={loadJSONWithMap} style={{ ...styles.buttonAction, background:T.accent, color:'white' }}><FaUpload /> Import Annotations</button>
              </div>
              <div style={styles.buttonGroup}>
                <label style={styles.label}>Send to Robot (SSH)</label>
                <button onClick={handleSendYAMLToRobot} style={{ ...styles.buttonAction, background:'#f59e0b' }} disabled={isSavingYAML}><FaRocket /> {isSavingYAML ? "Sending..." : "Send YAML to Robot"}</button>
                <button onClick={handleSendJSONToRobot} style={{ ...styles.buttonAction, background:'#10b981' }} disabled={isSavingJSON}><FaRocket /> {isSavingJSON ? "Sending..." : "Send JSON to Robot"}</button>
                <div style={{ fontSize:'12px', color:T.textSecondary, marginTop:4 }}>Status: {dbStatus}</div>
              </div>
            </>
          )}

          {activeTab === "tools" && (
            <>
              <div style={styles.buttonGroup}>
                <label style={styles.label}>Drawing Tools</label>
                <div style={styles.toolGrid}>
                  {[
                    { id:"pan", icon:<FaHandPaper />, label:"Pan" },
                    { id:"place_node", icon:<FaMapMarkerAlt />, label:"Node" },
                    { id:"connect", icon:<FaArrowRight />, label:"Arrow" },
                    { id:"zone", icon:<FaDrawPolygon />, label:"Zone" },
                    { id:"erase", icon:<FaEraser />, label:"Erase" },
                  ].map(({ id, icon, label }) => (
                    <button key={id} onClick={() => {
                      if (arrowDrawing.isDrawing) {
                        setArrowDrawing({ isDrawing: false, fromId: null, points: [] });
                      }
                      setTool(id);
                    }} style={tool === id ? styles.buttonSmallActive : styles.buttonSmall}>{icon} {label}</button>
                  ))}
                  <button onClick={() => {
                    if (arrowDrawing.isDrawing) {
                      setArrowDrawing({ isDrawing: false, fromId: null, points: [] });
                    }
                    startCrop();
                  }} style={tool === "crop" ? styles.buttonSmallActive : styles.buttonSmall}><FaCropAlt /> Crop</button>
                </div>
              </div>
              <div style={styles.buttonGroup}>
                <label style={styles.label}>Node Type</label>
                <select value={nodeType} onChange={e => setNodeType(e.target.value)} style={styles.select}>
                  <option value="station">Station</option>
                  <option value="docking">Docking</option>
                  <option value="waypoint">Waypoint</option>
                  <option value="home">Home</option>
                  <option value="charging">Charging</option>
                  <option value="waypointforcorner">Waypoint For Corner</option>
                </select>
              </div>
              <div style={styles.buttonGroup}>
                <label style={styles.label}>Arrow Direction</label>
                <button onClick={() => setArrowDirection(p => p === "forward" ? "reverse" : "forward")}
                  style={{ ...styles.button, background: arrowDirection === "reverse" ? "#ef4444" : "#f97316", color:"white", border:"none" }}>
                  {arrowDirection === "reverse" ? "⬅️ Reverse" : "➡️ Forward"}
                </button>
              </div>
              <div style={styles.buttonGroup}>
                <label style={styles.label}>Zone Settings</label>
                <div style={styles.toolGrid}>
                  <button onClick={() => setZoneType("normal")} style={zoneType === "normal" ? styles.buttonSmallActive : styles.buttonSmall}><FaDrawPolygon /> Normal</button>
                  <button onClick={() => setZoneType("keep_out")} style={zoneType === "keep_out" ? styles.buttonSmallActive : styles.buttonSmall}><FaBan /> Restricted</button>
                </div>
                <input value={zoneName} onChange={e => setZoneName(e.target.value)} placeholder="Zone name" style={styles.input} />
                <button onClick={finishZone} style={styles.buttonSmall} disabled={currentZonePoints.length < 3}><FaCheck /> Finish Zone</button>
              </div>
              <div style={styles.buttonGroup}>
                <label style={styles.label}>Erase Settings</label>
                <select value={eraseMode} onChange={e => setEraseMode(e.target.value)} style={styles.select}>
                  <option value="objects">🗑️ Objects</option>
                  <option value="noise">🧹 Map Noise</option>
                  <option value="hand">✋ Hand Erase</option>
                </select>
                {(eraseMode === "noise" || eraseMode === "hand") && (
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8 }}>
                    <span style={{ fontSize:'12px' }}>Radius:</span>
                    <input type="range" min="1" max="20" value={eraseRadius} onChange={e => setEraseRadius(parseInt(e.target.value))} style={{ flex:1 }} />
                    <span>{eraseRadius}</span>
                  </div>
                )}
              </div>
              {cropState.isCropping && (
                <div style={styles.buttonGroup}>
                  <label style={styles.label}>Crop Actions</label>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={handleApplyCrop} style={{ ...styles.buttonSmall, background:'#10b981', color:'white' }} disabled={!cropState.freehandPoints || cropState.freehandPoints.length < 3}><FaCheck /> Apply</button>
                    <button onClick={cancelCrop} style={{ ...styles.buttonSmall, background:T.danger, color:'white' }}><FaTimes /> Cancel</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div style={styles.mapContainer}>
          <div style={styles.canvasContainer}>
            <div style={styles.zoomControls}>
              <div style={{ textAlign:"center", fontSize:13, fontWeight:'700', color:T.text, marginBottom:4 }}>{Math.round(zoomState.scale*100)}%</div>
              {/* Zoom In / Out zoom around the CENTER of the canvas (offset is adjusted too) */}
              <button onClick={() => zoomFromCenter(1.2)} style={styles.zoomButton} title="Zoom In"><FaSearchPlus /></button>
              <button onClick={() => zoomFromCenter(0.8)} style={styles.zoomButton} title="Zoom Out"><FaSearchMinus /></button>
              <button onClick={() => {
                if (!mapMsg || !canvasRef.current) return;
                const c = canvasRef.current.parentElement;
                if (c) setZoomState(p => ({ ...p, scale:1, offsetX:(c.clientWidth - mapMsg.width)/2, offsetY:(c.clientHeight - mapMsg.height)/2 }));
              }} style={styles.zoomButton} title="Reset View"><FaExpand /></button>

              {/* Rotation controls */}
              <button
                onClick={() => {
                  const nextRotation = (rotationRef.current + 90) % 360;
                  setRotation(nextRotation);
                  recordHistoryState({ rotation: nextRotation });
                }}
                style={styles.zoomButton}
                title="Rotate +90°"
              >
                <FaRedo />
              </button>
              <input
                type="number"
                min="0"
                max="359"
                value={rotation}
                onChange={e => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v)) setRotation(((v % 360) + 360) % 360);
                }}
                title="Rotation (degrees)"
                style={{
                  width: 44, padding: '4px 2px', textAlign: 'center',
                  borderRadius: 6, border: `1px solid ${T.border}`,
                  background: T.card, color: T.text, fontSize: 12, boxSizing: 'border-box'
                }}
              />
            </div>

            {showYawTooltip && (
              <div style={styles.yawTooltip}>
                <h4 style={{ margin:'0 0 8px 0', color:T.text }}>📐 Yaw Calculation Info</h4>
                <p style={{ margin:'0 0 8px 0', fontSize:'12px', color:T.textSecondary }}>
                  • Yaw is calculated from arrow direction<br />
                  • Waypoints are ordered by arrow connections<br />
                  • Forward arrows → forward mission<br />
                  • Reverse arrows → reverse mission<br />
                  • Speed only appears in YAML if set via right-click<br />
                  • Right-click on any node to set custom speed<br />
                  • Click and drag any node in Pan/Node mode to reposition it<br />
                  • Chain the Arrow tool through "Waypoint For Corner" nodes for smooth curved paths<br />
                  • Double-click a corner node to finish arrow there!<br />
                  • Any stretch of the arrow between two "Waypoint For Corner" nodes auto-fills with normal waypoints every 1m — works for a direct connection or a whole chain of corners!<br />
                  • In Pan mode, click and drag directly on a curved arrow segment to bend it — cross the straight line to flip the curve to the other side!
                </p>
                <button onClick={() => setShowYawTooltip(false)} style={styles.buttonSmall}>Close</button>
              </div>
            )}

            <canvas
              ref={canvasRef}
              style={{
                position:"absolute",
                top:0,
                left:0,
                width:"100%",
                height:"100%",
                display:"block",
                cursor: getCanvasCursor()
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onContextMenu={(e) => {
                const c = clientToCanvasCoords(e.clientX, e.clientY);
                const node = findNodeAtCanvas(c.x, c.y, 8 / zoomState.scale);
                if (node) {
                  e.preventDefault();
                  openSpeedModal(node);
                }
              }}
              onMouseLeave={() => {
                draggingNodeRef.current = null;
                setDraggingNodeId(null);
                setHoveredNodeId(null);
                draggingArrowRef.current = null;
                setDraggingArrowInfo(null);
                setHoveredArrowControl(null);
                setCursorCoords(null);
                setZoomState(p => ({ ...p, isDragging: false }));
                setCropState(prev => ({ ...prev, isDragging: false }));
                if (handEraseState.isErasing) stopHandErase();
              }}
              onTouchStart={e => {
                if (e.touches.length === 1) {
                  const t = e.touches[0], rect = canvasRef.current?.getBoundingClientRect();
                  if (rect) {
                    const cc = clientToCanvasCoords(t.clientX, t.clientY);
                    const node = findNodeAtCanvas(cc.x, cc.y, 10 / zoomState.scale);
                    if (node && (tool === "pan" || tool === "place_node")) {
                      saveToHistory();
                      draggingNodeRef.current = node.id;
                      setDraggingNodeId(node.id);
                    } else {
                      const arrowHit = tool === "pan" ? findArrowCurveHitAtCanvas(cc.x, cc.y, 12 / zoomState.scale) : null;
                      if (arrowHit) {
                        draggingArrowRef.current = arrowHit;
                        setDraggingArrowInfo({ arrowId: arrowHit.arrowId, segmentIndex: arrowHit.segmentIndex });
                      } else {
                        setZoomState(p => ({ ...p, isDragging:true, lastX:t.clientX-rect.left, lastY:t.clientY-rect.top }));
                      }
                    }
                  }
                }
                e.preventDefault();
              }}
              onTouchMove={e => {
                if (e.touches.length === 1) {
                  const t = e.touches[0], rect = canvasRef.current?.getBoundingClientRect();
                  if (rect) {
                    if (draggingNodeRef.current) {
                      const cc = clientToCanvasCoords(t.clientX, t.clientY);
                      const ros = canvasToRosCoords(cc.x, cc.y);
                      if (ros && isWithinMapBounds(ros.x, ros.y) && isWithinPlaceableArea(cc.x, cc.y)) {
                        setNodes(prev => {
                          const next = prev.map(n =>
                            n.id === draggingNodeRef.current
                              ? { ...n, canvasX: cc.x, canvasY: cc.y, rosX: ros.x, rosY: ros.y }
                              : n
                          );
                          nodesRef.current = next;
                          return next;
                        });
                      }
                    } else if (draggingArrowRef.current) {
                      const cc = clientToCanvasCoords(t.clientX, t.clientY);
                      const { arrowId, segmentIndex, mx, my, px, py, len } = draggingArrowRef.current;
                      const vx = cc.x - mx, vy = cc.y - my;
                      let proj = vx * px + vy * py;
                      const maxBow = Math.max(25, len * 0.6);
                      proj = Math.max(-maxBow, Math.min(maxBow, proj));
                      setArrows(prev => prev.map(a =>
                        a.id === arrowId ? { ...a, bends: { ...(a.bends || {}), [segmentIndex]: proj } } : a
                      ));
                    } else if (zoomState.isDragging) {
                      const x = t.clientX-rect.left, y = t.clientY-rect.top;
                      setZoomState(p => ({ ...p, offsetX:p.offsetX+x-p.lastX, offsetY:p.offsetY+y-p.lastY, lastX:x, lastY:y }));
                    }
                  }
                }
                e.preventDefault();
              }}
              onTouchEnd={() => {
                if (draggingNodeRef.current || draggingArrowRef.current) recordHistoryState();
                draggingNodeRef.current = null;
                setDraggingNodeId(null);
                draggingArrowRef.current = null;
                setDraggingArrowInfo(null);
                setZoomState(p => ({ ...p, isDragging: false }));
              }}
              onTouchCancel={() => {
                draggingNodeRef.current = null;
                setDraggingNodeId(null);
                draggingArrowRef.current = null;
                setDraggingArrowInfo(null);
                setZoomState(p => ({ ...p, isDragging: false }));
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}