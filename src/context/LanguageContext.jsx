// // context/LanguageContext.js
// import React, { createContext, useState, useContext, useEffect } from 'react';

// // Default translations for English
// const defaultTranslations = {
//   settings: "Settings",
//   dark_mode: "Dark Mode",
//   enable_notifications: "Enable Notifications",
//   language: "Language",
//   save: "Save",
//   reset: "Reset",
//   settings_saved: "Settings saved successfully!",
//   logout: "Logout",
//   notifications: "Notifications",
  
//   // Header translations
//   agvs: "AGVs",
//   robot_status: "Robot Status",
//   updated: "Updated",
//   never: "Never",
//   loading: "Loading...",
//   wifi_connected: "WiFi Connected",
//   wifi_disconnected: "WiFi Disconnected",
//   select_online: "Select Online",
//   clear: "Clear",
//   search_agvs: "Search AGVs...",
//   agvs_selected: "AGVs selected",
//   cancel: "Cancel",
//   confirm: "Confirm",
  
//   // Sidebar translations
//   dashboard: "Dashboard",
//   maps: "Maps",
//   realtime_visualisation: "Real-Time Visualisation",
//   task_allocation: "Task Allocation",
//   health_check: "Health Check",
//   reports: "Reports",
//   mapview: "Mapview",
  
//   // Footer translation
//   copyright: "© 2025 Taikisha India | All Rights Reserved.",
  
//   // Dashboard translations
//   system_status: "System Status",
//   ros_bridge: "ROS Bridge",
//   stations_loaded: "Stations Loaded",
//   current_location: "Current Location",
//   target_location: "Target Location",
//   amr_status_distribution: "AMR Status Distribution",
//   battery_level_overview: "Battery Level Overview",
//   amr_status: "AMR Status",
//   station_information: "Station Information",
  
//   // Status translations
//   online: "Online",
//   offline: "Offline",
//   running: "Running",
//   idle: "Idle",
//   maintenance: "Maintenance",
//   charging: "Charging",

//   // Table header translations
//   amr_id: "AMR ID",
//   status: "Status",
//   battery: "Battery",
//   motor_temp: "Motor Temp",
//   speed: "Speed",
//   error: "Error",

//   // Health translations
//   health: {
//     amr: "AMR",
//     imu: "IMU",
//     lidar: "LIDAR",
//     camera: "Depth Camera",
//     battery: "Battery",
//     motor: "Motor Controller",
//     encoder: "Encoder",
//     brakes: "Brakes",
//     cpu: "CPU usage",
//     memory: "Memory usage",
//     disk: "Disk usage",
//     ros2: "Ros2 Nodes",
//     ros2t: "Ros2 Topics",
//     nav2: "Nav2 Stack",
//     localization: "Localization",
//     pathplanner: "Path Planner",
//     rosmaster: "ROS Master",
//     wifi: "WiFi Connection",
//     ethernet: "Ethernet",
//     serial: "Serial Communication",
//     can: "CAN Communication",
//     position: "Position",
//     status: {
//       ok: "OK",
//       fault: "FAULT",
//       idle: "IDLE",
//       unknown: "UNKNOWN"
//     }
//   }
// };

// // Marathi translations
// const mrTranslations = {
//   settings: "सेटिंग्ज",
//   dark_mode: "डार्क मोड",
//   enable_notifications: "सूचना सक्षम करा",
//   language: "भाषा",
//   save: "जतन करा",
//   reset: "रीसेट करा",
//   settings_saved: "सेटिंग्ज यशस्वीरित्या जतन केल्या!",
//   logout: "लॉग आउट",
//   notifications: "सूचना",
  
//   agvs: "एजीव्ही",
//   robot_status: "रोबोट स्थिती",
//   updated: "अपडेट केले",
//   never: "कधीही नाही",
//   loading: "लोड होत आहे...",
//   wifi_connected: "WiFi कनेक्ट केले",
//   wifi_disconnected: "WiFi डिस्कनेक्ट केले",
//   select_online: "ऑनलाइन निवडा",
//   clear: "साफ करा",
//   search_agvs: "एजीव्ही शोधा...",
//   agvs_selected: "एजीव्ही निवडले",
//   cancel: "रद्द करा",
//   confirm: "पुष्टी करा",
  
//   dashboard: "डॅशबोर्ड",
//   maps: "नकाशे",
//   realtime_visualisation: "रीयल-टाइम व्हिज्युअलायझेशन",
//   task_allocation: "कार्य वाटप",
//   health_check: "आरोग्य तपासणी",
//   reports: "अहवाल",
//   mapview: "नकाशा दृश्य",
  
//   copyright: "© २०२५ ताइकिशा इंडिया | सर्व हक्क राखीव.",
  
//   system_status: "सिस्टम स्थिती",
//   ros_bridge: "ROS ब्रिज",
//   stations_loaded: "स्टेशने लोड केली",
//   current_location: "सध्याचे स्थान",
//   target_location: "लक्ष्य स्थान",
//   amr_status_distribution: "एएमआर स्थिती वितरण",
//   battery_level_overview: "बॅटरी पातळी अवलोकन",
//   amr_status: "एएमआर स्थिती",
//   station_information: "स्टेशन माहिती",
  
//   online: "ऑनलाइन",
//   offline: "ऑफलाइन",
//   running: "चालू",
//   idle: "निष्क्रिय",
//   maintenance: "देखभाल",
//   charging: "चार्जिंग",

//   // Table header translations
//   amr_id: "एएमआर आयडी",
//   status: "स्थिती",
//   battery: "बॅटरी",
//   motor_temp: "मोटर तापमान",
//   speed: "गती",
//   error: "त्रुटी",

//   // Health translations
//   health: {
//     amr: "एएमआर",
//     imu: "आयएमयू",
//     lidar: "लिडार",
//     camera: "खोली कॅमेरा",
//     battery: "बॅटरी",
//     motor: "मोटर कंट्रोलर",
//     encoder: "एन्कोडर",
// brakes: "ब्रेक्स",
// cpu: "सीपीयू वापर",
// memory: "मेमरी वापर",
// disk: "डिस्क वापर",
// ros2: "ROS2 नोड्स",
// ros2t: "ROS2 टॉपिक्स",
// nav2: "Nav2 स्टॅक",
// localization: "स्थाननिर्धारण",
// pathplanner: "मार्ग नियोजक",
// rosmaster: "ROS मास्टर",
// wifi: "वाई-फाय कनेक्शन",
// ethernet: "ईथरनेट",
// serial: "सीरियल कम्युनिकेशन",
// can: "CAN कम्युनिकेशन",
//     position: "स्थान",
//     status: {
//       ok: "ठीक",
//       fault: "दोष",
//       idle: "निष्क्रिय",
//       unknown: "अज्ञात"
//     }
//   }
// };

// // Hindi translations
// const hiTranslations = {
//   settings: "सेटिंग्स",
//   dark_mode: "डार्क मोड",
//   enable_notifications: "सूचनाएं सक्षम करें",
//   language: "भाषा",
//   save: "सहेजें",
//   reset: "रीसेट करें",
//   settings_saved: "सेटिंग्स सफलतापूर्वक सहेजी गईं!",
//   logout: "लॉग आउट",
//   notifications: "सूचनाएं",
  
//   agvs: "एजीवी",
//   robot_status: "रोबोट स्थिति",
//   updated: "अपडेट किया गया",
//   never: "कभी नहीं",
//   loading: "लोड हो रहा है...",
//   wifi_connected: "WiFi जुड़ा हुआ",
//   wifi_disconnected: "WiFi डिस्कनेक्ट किया गया",
//   select_online: "ऑनलाइन चुनें",
//   clear: "साफ करें",
//   search_agvs: "एजीवी खोजें...",
//   agvs_selected: "एजीवी चुने गए",
//   cancel: "रद्द करें",
//   confirm: "पुष्टि करें",
  
//   dashboard: "डैशबोर्ड",
//   maps: "मानचित्र",
//   realtime_visualisation: "रियल-टाइम विज़ुअलाइज़ेशन",
//   task_allocation: "कार्य आवंटन",
//   health_check: "स्वास्थ्य जांच",
//   reports: "रिपोर्ट",
//     mapview: "मानचित्र दृश्य",

  
//   copyright: "© २०२५ ताइकिशा इंडिया | सर्व अधिकार सुरक्षित।",
  
//   system_status: "सिस्टम स्थिति",
//   ros_bridge: "ROS ब्रिज",
//   stations_loaded: "स्टेशन लोड किए गए",
//   current_location: "वर्तमान स्थान",
//   target_location: "लक्ष्य स्थान",
//   amr_status_distribution: "एएमआर स्थिति वितरण",
//   battery_level_overview: "बैटरी स्तर अवलोकन",
//   amr_status: "एएमआर स्थिति",
//   station_information: "स्टेशन सूचना",
  
//   online: "ऑनलाइन",
//   offline: "ऑफलाइन",
//   running: "चल रहा है",
//   idle: "निष्क्रिय",
//   maintenance: "रखरखाव",
//   charging: "चार्जिंग",


//   // Table header translations
//   amr_id: "एएमआर आईडी",
//   status: "स्थिति",
//   battery: "बैटरी",
//   motor_temp: "मोटर तापमान",
//   speed: "गति",
//   error: "त्रुटि",

//   // Health translations
//   health: {
//     amr: "एएमआर",
//     imu: "आईएमयू",
//     lidar: "लिडार",
//     camera: "डेप्थ कैमरा",
//     battery: "बॅटरी",
//     motor: "मोटर कंट्रोलर",
//     encoder: "एन्कोडर",
// brakes: "ब्रेक",
// cpu: "सीपीयू उपयोग",
// memory: "मेमोरी उपयोग",
// disk: "डिस्क उपयोग",
// ros2: "ROS2 नोड्स",
// ros2t: "ROS2 टॉपिक्स",
// nav2: "Nav2 स्टैक",
// localization: "स्थान निर्धारण",
// pathplanner: "मार्ग योजनाकार",
// rosmaster: "ROS मास्टर",
// wifi: "वाई-फाई कनेक्शन",
// ethernet: "ईथरनेट",
// serial: "सीरियल संचार",
// can: "CAN संचार",


//     position: "स्थिति",
//     status: {
//       ok: "ठीक",
//       fault: "दोष",
//       idle: "निष्क्रिय",
//       unknown: "अज्ञात"
//     }
//   }
// };

// const translations = {
//   en: defaultTranslations,
//   mr: mrTranslations,
//   hi: hiTranslations
// };

// const LanguageContext = createContext();

// export const LanguageProvider = ({ children }) => {
//   const [language, setLanguage] = useState(() => {
//     return localStorage.getItem('language') || 'en';
//   });

//   const [translationsData, setTranslationsData] = useState(translations[language]);

//   useEffect(() => {
//     setTranslationsData(translations[language]);
//     localStorage.setItem('language', language);
//   }, [language]);

//   const t = (key) => {
//     if (!key) return '';
    
//     const keys = key.split('.');
//     let result = translationsData;
    
//     for (const k of keys) {
//       if (result && typeof result === 'object' && k in result) {
//         result = result[k];
//       } else {
//         console.warn(`Translation not found for key: "${key}"`);
//         return key;
//       }
//     }
    
//     return result || key;
//   };

//   return (
//     <LanguageContext.Provider value={{ language, setLanguage, t }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// };

// export const useLanguage = () => useContext(LanguageContext);


// context/LanguageContext.jsx


import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Default translations for English
const defaultTranslations = {
  // Settings
  settings: "Settings",
  robot_id: "ROBOT ID",
  dark_mode: "Dark Mode",
  enable_notifications: "Enable Notifications",
  theme: "Theme",
  language: "Language",
  save: "Save",
  reset: "Reset",
  settings_saved: "Settings saved successfully!",
  logout: "Logout",
  notifications: "Notifications",
  
  // Header translations
  agvs: "AGVs",
  robot_status: "Robot Status",
  updated: "Updated",
  never: "Never",
  loading: "Loading...",
  wifi_connected: "WiFi Connected",
  wifi_disconnected: "WiFi Disconnected",
  select_online: "Select Online",
  clear: "Clear",
  search_agvs: "Search AGVs...",
  agvs_selected: "AGVs selected",
  cancel: "Cancel",
  confirm: "Confirm",
  
  // Sidebar translations
  playpause: "Playpause",
  dashboard: "Dashboard",
  magnetic: "Magnetic",
  qrcode: "QRcode",
  maps: "Maps",
  realtime_visualisation: "Real-Time Visualisation",
  task_allocation: "Task Allocation",
  health_check: "Health Check",
  reports: "Reports",
  mapview: "Mapview",
  
  // Footer translation
  copyright: "© 2025 Taikisha India | All Rights Reserved.",
  
  // Dashboard translations
  system_status: "System Status",
  ros_bridge: "ROS Bridge",
  stations_loaded: "Stations Loaded",
  current_location: "Current Location",
  target_location: "Target Location",
  amr_status_distribution: "AMR Status Distribution",
  battery_level_overview: "Battery Level Overview",
  amr_status: "AMR Status",
  station_information: "Station Information",
  
  // Status translations
  online: "Online",
  offline: "Offline",
  running: "Running",
  idle: "Idle",
  maintenance: "Maintenance",
  charging: "Charging",

  // Table header translations
  amr_id: "AMR ID",
  status: "Status",
  battery: "Battery",
  motor_temp: "Motor Temp",
  speed: "Speed",
  error: "Error",

  // Health translations
  health: {
    amr: "AMR",
    imu: "IMU",
    lidar: "LIDAR",
    camera: "Depth Camera",
    battery: "Battery",
    motor: "Motor Controller",
    frontestop: "Front Estop",
    rareestop: "Rear Estop",
    encoder: "Encoder",
    brakes: "Brakes",
    cpu: "CPU usage",
    memory: "Memory usage",
    disk: "Disk usage",
    ros2: "Ros2 Nodes",
    ros2t: "Ros2 Topics",
    nav2: "Nav2 Stack",
    localization: "Localization",
    pathplanner: "Path Planner",
    rosmaster: "ROS Master",
    wifi: "WiFi Connection",
    ethernet: "Ethernet",
    serial: "Serial Communication",
    can: "CAN Communication",
    position: "Position",
    status: {
      ok: "OK",
      fault: "FAULT",
      idle: "IDLE",
      unknown: "UNKNOWN"
    }
  },

  // Task Allocation translations
  configure_task: "Configure Task",
  configure_task_desc: "Configure the selected task parameters",
  mission_builder: "Mission Builder",
  loop: "Loop",
  infinite_loop: "(-1 = infinite)",
  clear_all: "Clear All",
  select_robot: "Select Robot",
  drag_tasks_prompt: "Drag task modules here to build mission",
  total_tasks: "Total Tasks",
  send_mission: "Send Mission",
  tasks: "tasks",
  available_tasks: "Available Tasks",
  drag_drop_prompt: "Drag and drop to add tasks to mission",
  backend_status: "Backend Status",
  connected: "Connected",
  
  // Configuration panel
  select_task: "Select a task to configure",
  configure: "Configure",
  direction: "Direction",
  forward: "Forward",
  reverse: "Reverse",
  clockwise: "Clockwise",
  anticlockwise: "Anticlockwise",
  distance_meters: "Distance (meters)",
  speed_ms: "Speed (m/s)",
  rotation_angle: "Rotation Angle (degrees)",
  angular_speed: "Angular Speed (r/s)",
  zone: "Zone",
  duration_ms: "Duration (milliseconds)",
  
  // Alert messages
  backend_not_connected: "Backend not connected",
  select_robot_prompt: "Please select a robot",
  add_task_prompt: "Add at least one task",
  mission_queued: "Mission queued successfully",
  mission_failed: "Failed to send mission"
};

// Marathi translations
const mrTranslations = {
  // Settings
  settings: "सेटिंग्ज",
  robot_id: "रोबोट आयडी",
  dark_mode: "डार्क मोड",
  enable_notifications: "सूचना सक्षम करा",
  language: "भाषा",
  theme: "थीम",
  save: "जतन करा",
  reset: "रीसेट करा",
  settings_saved: "सेटिंग्ज यशस्वीरित्या जतन केल्या!",
  logout: "लॉग आउट",
  notifications: "सूचना",
  
  // Header
  agvs: "एजीव्ही",
  robot_status: "रोबोट स्थिती",
  updated: "अपडेट केले",
  never: "कधीही नाही",
  loading: "लोड होत आहे...",
  wifi_connected: "WiFi कनेक्ट केले",
  wifi_disconnected: "WiFi डिस्कनेक्ट केले",
  select_online: "ऑनलाइन निवडा",
  clear: "साफ करा",
  search_agvs: "एजीव्ही शोधा...",
  agvs_selected: "एजीव्ही निवडले",
  cancel: "रद्द करा",
  confirm: "पुष्टी करा",
  
  // Sidebar
  playpause: "प्लेपॉज",
  dashboard: "डॅशबोर्ड",
  qrcode: "Qr कोड",
  magnetic: "चुंबकीय टेप",
  maps: "नकाशे",
  realtime_visualisation: "रीयल-टाइम व्हिज्युअलायझेशन",
  task_allocation: "कार्य वाटप",
  health_check: "आरोग्य तपासणी",
  reports: "अहवाल",
  mapview: "नकाशा दृश्य",
  
  // Footer
  copyright: "© २०२५ ताइकिशा इंडिया | सर्व हक्क राखीव.",
  
  // Dashboard
  system_status: "सिस्टम स्थिती",
  ros_bridge: "ROS ब्रिज",
  stations_loaded: "स्टेशने लोड केली",
  current_location: "सध्याचे स्थान",
  target_location: "लक्ष्य स्थान",
  amr_status_distribution: "एएमआर स्थिती वितरण",
  battery_level_overview: "बॅटरी पातळी अवलोकन",
  amr_status: "एएमआर स्थिती",
  station_information: "स्टेशन माहिती",
  
  // Status
  online: "ऑनलाइन",
  offline: "ऑफलाइन",
  running: "चालू",
  idle: "निष्क्रिय",
  maintenance: "देखभाल",
  charging: "चार्जिंग",

  // Table
  amr_id: "एएमआर आयडी",
  status: "स्थिती",
  battery: "बॅटरी",
  motor_temp: "मोटर तापमान",
  speed: "गती",
  error: "त्रुटी",

  // Health
  health: {
    amr: "एएमआर",
    imu: "आयएमयू",
    lidar: "लिडार",
    camera: "खोली कॅमेरा",
    battery: "बॅटरी",
    motor: "मोटर कंट्रोलर",
    frontestop: "सामने आपातकालीन बटन",
    rareestop: "रियर आपातकालीन बटन",
    encoder: "एन्कोडर",
    brakes: "ब्रेक्स",
    cpu: "सीपीयू वापर",
    memory: "मेमरी वापर",
    disk: "डिस्क वापर",
    ros2: "ROS2 नोड्स",
    ros2t: "ROS2 टॉपिक्स",
    nav2: "Nav2 स्टॅक",
    localization: "स्थाननिर्धारण",
    pathplanner: "मार्ग नियोजक",
    rosmaster: "ROS मास्टर",
    wifi: "वाई-फाय कनेक्शन",
    ethernet: "ईथरनेट",
    serial: "सीरियल कम्युनिकेशन",
    can: "CAN कम्युनिकेशन",
    position: "स्थान",
    status: {
      ok: "ठीक",
      fault: "दोष",
      idle: "निष्क्रिय",
      unknown: "अज्ञात"
    }
  },

  // Task Allocation
  configure_task: "कार्य कॉन्फिगर करा",
  configure_task_desc: "निवडलेल्या कार्याचे पॅरामीटर्स कॉन्फिगर करा",
  mission_builder: "मिशन बिल्डर",
  loop: "लूप",
  infinite_loop: "(-1 = अनंत)",
  clear_all: "सर्व साफ करा",
  select_robot: "रोबोट निवडा",
  drag_tasks_prompt: "मिशन तयार करण्यासाठी कार्य मॉड्यूल येथे ड्रॅग करा",
  total_tasks: "एकूण कार्ये",
  send_mission: "मिशन पाठवा",
  tasks: "कार्ये",
  available_tasks: "उपलब्ध कार्ये",
  drag_drop_prompt: "मिशनमध्ये कार्ये जोडण्यासाठी ड्रॅग आणि ड्रॉप करा",
  backend_status: "बॅकएंड स्थिती",
  connected: "कनेक्ट केलेले",
  
  // Configuration panel
  select_task: "कॉन्फिगर करण्यासाठी कार्य निवडा",
  configure: "कॉन्फिगर करा",
  direction: "दिशा",
  forward: "पुढे",
  reverse: "मागे",
  clockwise: "घड्याळाच्या दिशेने",
  anticlockwise: "घड्याळाच्या विरुद्ध दिशेने",
  distance_meters: "अंतर (मीटर)",
  speed_ms: "गती (मी/से)",
  rotation_angle: "रोटेशन कोन (अंश)",
  angular_speed: "कोनीय गती (आर/से)",
  zone: "झोन",
  duration_ms: "कालावधी (मिलिसेकंद)",
  
  // Alert messages
  backend_not_connected: "बॅकएंड कनेक्ट केलेले नाही",
  select_robot_prompt: "कृपया रोबोट निवडा",
  add_task_prompt: "किमान एक कार्य जोडा",
  mission_queued: "मिशन यशस्वीरित्या रांगेत जोडले",
  mission_failed: "मिशन पाठविण्यात अयशस्वी"
};

// Hindi translations
const hiTranslations = {
  // Settings
  settings: "सेटिंग्स",
  robot_id: "रोबोट आईडी",
  dark_mode: "डार्क मोड",
  enable_notifications: "सूचनाएं सक्षम करें",
  language: "भाषा",
  theme: "थीम",
  save: "सहेजें",
  reset: "रीसेट करें",
  settings_saved: "सेटिंग्स सफलतापूर्वक सहेजी गईं!",
  logout: "लॉग आउट",
  notifications: "सूचनाएं",
  
  // Header
  agvs: "एजीवी",
  robot_status: "रोबोट स्थिति",
  updated: "अपडेट किया गया",
  never: "कभी नहीं",
  loading: "लोड हो रहा है...",
  wifi_connected: "WiFi जुड़ा हुआ",
  wifi_disconnected: "WiFi डिस्कनेक्ट किया गया",
  select_online: "ऑनलाइन चुनें",
  clear: "साफ करें",
  search_agvs: "एजीवी खोजें...",
  agvs_selected: "एजीवी चुने गए",
  cancel: "रद्द करें",
  confirm: "पुष्टि करें",
  
  // Sidebar
  playpause: "प्लेपॉज",
  dashboard: "डैशबोर्ड",
  qrcode: "Qr कोड",
  magnetic: "चुंबकीय टेप",
  maps: "मानचित्र",
  realtime_visualisation: "रियल-टाइम विज़ुअलाइज़ेशन",
  task_allocation: "कार्य आवंटन",
  health_check: "स्वास्थ्य जांच",
  reports: "रिपोर्ट",
  mapview: "मानचित्र दृश्य",
  
  // Footer
  copyright: "© २०२५ ताइकिशा इंडिया | सर्व अधिकार सुरक्षित।",
  
  // Dashboard
  system_status: "सिस्टम स्थिति",
  ros_bridge: "ROS ब्रिज",
  stations_loaded: "स्टेशन लोड किए गए",
  current_location: "वर्तमान स्थान",
  target_location: "लक्ष्य स्थान",
  amr_status_distribution: "एएमआर स्थिति वितरण",
  battery_level_overview: "बैटरी स्तर अवलोकन",
  amr_status: "एएमआर स्थिति",
  station_information: "स्टेशन सूचना",
  
  // Status
  online: "ऑनलाइन",
  offline: "ऑफलाइन",
  running: "चल रहा है",
  idle: "निष्क्रिय",
  maintenance: "रखरखाव",
  charging: "चार्जिंग",

  // Table
  amr_id: "एएमआर आईडी",
  status: "स्थिति",
  battery: "बैटरी",
  motor_temp: "मोटर तापमान",
  speed: "गति",
  error: "त्रुटि",

  // Health
  health: {
    amr: "एएमआर",
    imu: "आईएमयू",
    lidar: "लिडार",
    camera: "डेप्थ कैमरा",
    battery: "बैटरी",
    motor: "मोटर कंट्रोलर",
    frontestop: "समोर आणीबाणी बटण",
    rareestop: "मागील आपत्कालीन बटण",
    encoder: "एन्कोडर",
    brakes: "ब्रेक",
    cpu: "सीपीयू उपयोग",
    memory: "मेमोरी उपयोग",
    disk: "डिस्क उपयोग",
    ros2: "ROS2 नोड्स",
    ros2t: "ROS2 टॉपिक्स",
    nav2: "Nav2 स्टैक",
    localization: "स्थान निर्धारण",
    pathplanner: "मार्ग योजनाकार",
    rosmaster: "ROS मास्टर",
    wifi: "वाई-फाई कनेक्शन",
    ethernet: "ईथरनेट",
    serial: "सीरियल संचार",
    can: "CAN संचार",
    position: "स्थिति",
    status: {
      ok: "ठीक",
      fault: "दोष",
      idle: "निष्क्रिय",
      unknown: "अज्ञात"
    }
  },

  // Task Allocation
  configure_task: "कार्य कॉन्फ़िगर करें",
  configure_task_desc: "चयनित कार्य के पैरामीटर कॉन्फ़िगर करें",
  mission_builder: "मिशन बिल्डर",
  loop: "लूप",
  infinite_loop: "(-1 = अनंत)",
  clear_all: "सभी साफ़ करें",
  select_robot: "रोबोट चुनें",
  drag_tasks_prompt: "मिशन बनाने के लिए कार्य मॉड्यूल यहाँ खींचें",
  total_tasks: "कुल कार्य",
  send_mission: "मिशन भेजें",
  tasks: "कार्य",
  available_tasks: "उपलब्ध कार्य",
  drag_drop_prompt: "मिशन में कार्य जोड़ने के लिए खींचें और छोड़ें",
  backend_status: "बैकएंड स्थिति",
  connected: "कनेक्टेड",
  
  // Configuration panel
  select_task: "कॉन्फ़िगर करने के लिए कार्य चुनें",
  configure: "कॉन्फ़िगर करें",
  direction: "दिशा",
  forward: "आगे",
  reverse: "पीछे",
  clockwise: "दक्षिणावर्त",
  anticlockwise: "वामावर्त",
  distance_meters: "दूरी (मीटर)",
  speed_ms: "गति (मी/से)",
  rotation_angle: "घूर्णन कोण (डिग्री)",
  angular_speed: "कोणीय गति (आर/से)",
  zone: "क्षेत्र",
  duration_ms: "अवधि (मिलीसेकंड)",
  
  // Alert messages
  backend_not_connected: "बैकएंड कनेक्ट नहीं है",
  select_robot_prompt: "कृपया रोबोट चुनें",
  add_task_prompt: "कम से कम एक कार्य जोड़ें",
  mission_queued: "मिशन सफलतापूर्वक कतारबद्ध किया गया",
  mission_failed: "मिशन भेजने में विफल"
};

// Japanese translations
const jpTranslations = {
  // Settings
  settings: "設定",
  robot_id: "ロボットID",
  dark_mode: "ダークモード",
  enable_notifications: "通知を有効にする",
  language: "言語",
  theme: "テーマ",
  save: "保存",
  reset: "リセット",
  settings_saved: "設定が正常に保存されました！",
  logout: "ログアウト",
  notifications: "通知",

  // Header
  agvs: "AGV",
  robot_status: "ロボット状態",
  updated: "更新済み",
  never: "なし",
  loading: "読み込み中...",
  wifi_connected: "WiFi 接続済み",
  wifi_disconnected: "WiFi 未接続",
  select_online: "オンラインを選択",
  clear: "クリア",
  search_agvs: "AGV を検索...",
  agvs_selected: "AGV が選択されました",
  cancel: "キャンセル",
  confirm: "確認",

  // Sidebar
  playpause: "再生一時停止",
  dashboard: "ダッシュボード",
  qrcode: "QRコード",
  magnetic: "磁気",
  maps: "マップ",
  realtime_visualisation: "リアルタイム表示",
  task_allocation: "タスク割り当て",
  health_check: "ヘルスチェック",
  reports: "レポート",
  mapview: "マップビュー",

  // Footer
  copyright: "© 2025 大気社インド | 無断転載禁止。",

  // Dashboard
  system_status: "システム状態",
  ros_bridge: "ROS ブリッジ",
  stations_loaded: "ステーション読込済み",
  current_location: "現在位置",
  target_location: "目標位置",
  amr_status_distribution: "AMR 状態分布",
  battery_level_overview: "バッテリー概要",
  amr_status: "AMR 状態",
  station_information: "ステーション情報",

  // Status
  online: "オンライン",
  offline: "オフライン",
  running: "稼働中",
  idle: "待機中",
  maintenance: "メンテナンス",
  charging: "充電中",

  // Table
  amr_id: "AMR ID",
  status: "状態",
  battery: "バッテリー",
  motor_temp: "モーター温度",
  speed: "速度",
  error: "エラー",

  // Health
  health: {
    amr: "アムル",
    imu: "イム",
    lidar: "ライダー",
    camera: "深度カメラ",
    battery: "バッテリー",
    motor: "モーター制御",
    frontestop: "正面の非常ボタン",
    rareestop: "後部緊急停止",
    encoder: "エンコーダ",
    brakes: "ブレーキ",
    cpu: "CPU 使用率",
    memory: "メモリ使用率",
    disk: "ディスク使用率",
    ros2: "ROS2 ノード",
    ros2t: "ROS2 トピック",
    nav2: "Nav2 スタック",
    localization: "自己位置推定",
    pathplanner: "経路計画",
    rosmaster: "ROS マスター",
    wifi: "WiFi 接続",
    ethernet: "イーサネット",
    serial: "シリアル通信",
    can: "CAN 通信",
    position: "位置",
    status: {
      ok: "正常",
      fault: "異常",
      idle: "待機",
      unknown: "不明"
    }
  },

  // Task Allocation
  configure_task: "タスク設定",
  configure_task_desc: "選択したタスクのパラメータを設定します",
  mission_builder: "ミッションビルダー",
  loop: "ループ",
  infinite_loop: "(-1 = 無限)",
  clear_all: "すべてクリア",
  select_robot: "ロボットを選択",
  drag_tasks_prompt: "タスクモジュールをここにドラッグしてミッションを構築",
  total_tasks: "総タスク数",
  send_mission: "ミッション送信",
  tasks: "タスク",
  available_tasks: "利用可能なタスク",
  drag_drop_prompt: "ドラッグ＆ドロップでタスクをミッションに追加",
  backend_status: "バックエンド状態",
  connected: "接続済み",
  
  // Configuration panel
  select_task: "設定するタスクを選択",
  configure: "設定",
  direction: "方向",
  forward: "前進",
  reverse: "後退",
  clockwise: "時計回り",
  anticlockwise: "反時計回り",
  distance_meters: "距離 (メートル)",
  speed_ms: "速度 (m/秒)",
  rotation_angle: "回転角度 (度)",
  angular_speed: "角速度 (r/秒)",
  zone: "ゾーン",
  duration_ms: "時間 (ミリ秒)",
  
  // Alert messages
  backend_not_connected: "バックエンドに接続されていません",
  select_robot_prompt: "ロボットを選択してください",
  add_task_prompt: "少なくとも1つのタスクを追加してください",
  mission_queued: "ミッションが正常にキューに入れられました",
  mission_failed: "ミッションの送信に失敗しました"
};

const translations = {
  en: defaultTranslations,
  mr: mrTranslations,
  hi: hiTranslations,
  jp: jpTranslations
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    if (typeof window === 'undefined') return 'en';
    
    // Try multiple storage methods for mobile compatibility
    try {
      // 1. Check localStorage first
      const localStorageLang = localStorage.getItem('language');
      if (localStorageLang && ['en', 'mr', 'hi', 'jp'].includes(localStorageLang)) {
        return localStorageLang;
      }
      
      // 2. Check sessionStorage
      const sessionStorageLang = sessionStorage.getItem('language');
      if (sessionStorageLang && ['en', 'mr', 'hi', 'jp'].includes(sessionStorageLang)) {
        return sessionStorageLang;
      }
      
      // 3. Check cookies
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'language' && ['en', 'mr', 'hi', 'jp'].includes(value)) {
          return value;
        }
      }
    } catch (error) {
      console.warn('Error reading language from storage:', error);
    }
    
    return 'en';
  });

  const [translationsData, setTranslationsData] = useState(translations[language]);
  const [isMobile, setIsMobile] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
        .test(navigator.userAgent) || 
        window.innerWidth <= 768;
      setIsMobile(mobile);
      
      if (mobile) {
        console.log('Mobile/Waveshare device detected');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Handle storage events for cross-tab/window updates
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'language') {
        console.log('Storage event: Language changed to', e.newValue);
        if (e.newValue && e.newValue !== language) {
          setLanguageState(e.newValue);
        }
      }
    };

    const handleLanguageChanged = () => {
      console.log('Custom languageChanged event received');
      setForceUpdate(prev => prev + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('languageChanged', handleLanguageChanged);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('languageChanged', handleLanguageChanged);
    };
  }, [language]);

  // Update translations when language changes
  useEffect(() => {
    console.log(`Language context updated to: ${language}`);
    setTranslationsData(translations[language]);
    
    // Save to all storage methods
    try {
      localStorage.setItem('language', language);
      sessionStorage.setItem('language', language);
      document.cookie = `language=${language}; path=/; max-age=31536000; SameSite=Strict`;
      
      // Dispatch event for mobile components
      window.dispatchEvent(new Event('languageChanged'));
      
      // Force mobile update
      if (isMobile) {
        console.log('Mobile device - triggering forced update');
        setForceUpdate(prev => prev + 1);
        
        // Dispatch custom storage event
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'language',
          newValue: language,
          oldValue: null,
          url: window.location.href
        }));
      }
    } catch (error) {
      console.warn('Error saving language to storage:', error);
    }
  }, [language, isMobile]);

  const t = useCallback((key) => {
    if (!key) return '';
    
    try {
      const keys = key.split('.');
      let result = translationsData;
      
      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k];
        } else {
          console.warn(`Translation not found for key: "${key}"`);
          return key;
        }
      }
      
      return result || key;
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  }, [translationsData]);

  const setLanguage = useCallback((newLanguage) => {
    if (!['en', 'mr', 'hi', 'jp'].includes(newLanguage)) {
      console.warn(`Invalid language: ${newLanguage}`);
      return;
    }
    
    console.log(`Setting language to: ${newLanguage}`);
    setLanguageState(newLanguage);
    
    // Mobile-specific handling
    if (isMobile) {
      console.log('Mobile language change - forcing immediate update');
      
      // Force immediate UI update
      setTimeout(() => {
        window.dispatchEvent(new Event('languageChanged'));
        setForceUpdate(prev => prev + 1);
      }, 50);
    }
  }, [isMobile]);

  const refreshTranslations = useCallback(() => {
    console.log('Manually refreshing translations');
    setForceUpdate(prev => prev + 1);
    setTranslationsData(prev => ({ ...prev }));
  }, []);

  const value = {
    language,
    setLanguage,
    t,
    isMobile,
    forceUpdate,
    refreshTranslations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};