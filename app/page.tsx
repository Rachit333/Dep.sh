// "use client";

// import { useState, useEffect, useRef, ReactNode } from "react";
// import { useRouter } from "next/navigation";

// type LogEntry = { type: string; text: string };

// type App = {
//   name: string;
//   port: number;
//   status: "online" | "stopped" | "deploying";
//   domain: string;
//   release: string;
//   uptime: string;
// };

// type AppRowProps = {
//   app: App;
//   onAction: (appName: string, action: DeployAction) => Promise<void>;
// };

// type DeployModalProps = {
//   onClose: () => void;
//   onDeploy: (params: { repo: string; appName: string; port: string }) => Promise<void>;
// };

// type DeployAction = "redep" | "rollback" | "stop" | "start" | "delete" | "deploy";

// // Helper to get auth headers
// function getAuthHeaders(): HeadersInit {
//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("dashboard_token") : null;
//   return {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token || ""}`,
//   };
// }

// const FRAMEWORKS = { next: "Next.js", vite: "Vite", node: "Node" };

// const STATUS_COLOR = {
//   online: "#00ff9d",
//   stopped: "#ff4444",
//   deploying: "#ffcc00",
// };

// function TerminalLog({ lines }: { lines: LogEntry[] }) {
//   const bottomRef = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [lines]);
//   return (
//     <div
//       style={{
//         background: "#0a0a0a",
//         border: "1px solid #1e1e1e",
//         fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
//         fontSize: "12px",
//         color: "#a0a0a0",
//         padding: "12px",
//         height: "220px",
//         overflowY: "auto",
//         lineHeight: "1.7",
//       }}
//     >
//       {lines.map((l, i) => (
//         <div
//           key={i}
//           style={{
//             color:
//               l.type === "success"
//                 ? "#00ff9d"
//                 : l.type === "error"
//                   ? "#ff4444"
//                   : l.type === "cmd"
//                     ? "#ffcc00"
//                     : "#a0a0a0",
//           }}
//         >
//           {l.type === "cmd" ? <span style={{ color: "#555" }}>$ </span> : null}
//           {l.text}
//         </div>
//       ))}
//       <div ref={bottomRef} />
//     </div>
//   );
// }

// function AppRow({ app, onAction }: AppRowProps): ReactNode {
//   const [hovered, setHovered] = useState<boolean>(false);
//   return (
//     <div
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       style={{
//         display: "grid",
//         gridTemplateColumns: "160px 80px 100px 1fr auto",
//         alignItems: "center",
//         gap: "16px",
//         padding: "14px 20px",
//         borderBottom: "1px solid #141414",
//         background: hovered ? "#0f0f0f" : "transparent",
//         transition: "background 0.15s",
//       }}
//     >
//       <div>
//         <div
//           style={{
//             color: "#e8e8e8",
//             fontFamily: "'JetBrains Mono', monospace",
//             fontSize: "13px",
//             fontWeight: 600,
//           }}
//         >
//           {app.name}
//         </div>
//         <div
//           style={{
//             color: "#444",
//             fontSize: "11px",
//             marginTop: "2px",
//             fontFamily: "monospace",
//           }}
//         >
//           :{app.port}
//         </div>
//       </div>

//       <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
//         <div
//           style={{
//             width: "7px",
//             height: "7px",
//             borderRadius: "50%",
//             background: STATUS_COLOR[app.status],
//             boxShadow:
//               app.status === "online"
//                 ? `0 0 8px ${STATUS_COLOR[app.status]}`
//                 : "none",
//             animation: app.status === "online" ? "pulse 2.5s infinite" : "none",
//           }}
//         />
//         <span
//           style={{
//             color: STATUS_COLOR[app.status],
//             fontSize: "11px",
//             fontFamily: "monospace",
//             textTransform: "uppercase",
//             letterSpacing: "0.06em",
//           }}
//         >
//           {app.status}
//         </span>
//       </div>

//       <div style={{ color: "#555", fontSize: "11px", fontFamily: "monospace" }}>
//         {app.uptime}
//       </div>

//       <div
//         style={{ color: "#3a6fff", fontSize: "12px", fontFamily: "monospace" }}
//       >
//         <a
//           href={`https://${app.domain}`}
//           target="_blank"
//           rel="noreferrer"
//           style={{
//             color: "#3a6fff",
//             textDecoration: "none",
//             opacity: hovered ? 1 : 0.7,
//             transition: "opacity 0.15s",
//           }}
//         >
//           {app.domain} ↗
//         </a>
//       </div>

//       <div style={{ display: "flex", gap: "6px" }}>
//         {[
//           "redep",
//           "rollback",
//           app.status === "online" ? "stop" : "start",
//           "delete",
//         ].map((action) => (
//           <button
//             key={action}
//             onClick={() => onAction(app.name, action as DeployAction)}
//             style={{
//               background: action === "delete" ? "#1a0606" : "#111",
//               color: action === "delete" ? "#ff4444" : "#888",
//               border: `1px solid ${action === "delete" ? "#330000" : "#1e1e1e"}`,
//               borderRadius: "3px",
//               padding: "4px 8px",
//               fontSize: "10px",
//               fontFamily: "monospace",
//               cursor: "pointer",
//               textTransform: "uppercase",
//               letterSpacing: "0.08em",
//               transition: "all 0.15s",
//             }}
//             onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
//               e.currentTarget.style.background =
//                 action === "delete" ? "#2a0808" : "#1a1a1a";
//               e.currentTarget.style.color = action === "delete" ? "#ff6666" : "#ccc";
//             }}
//             onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
//               e.currentTarget.style.background =
//                 action === "delete" ? "#1a0606" : "#111";
//               e.currentTarget.style.color = action === "delete" ? "#ff4444" : "#888";
//             }}
//           >
//             {action}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// function DeployModal({ onClose, onDeploy }: DeployModalProps): ReactNode {
//   const [repo, setRepo] = useState<string>("");
//   const [appName, setAppName] = useState<string>("");
//   const [port, setPort] = useState<string>("");

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         background: "rgba(0,0,0,0.85)",
//         zIndex: 100,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//       onClick={onClose}
//     >
//       <div
//         onClick={(e) => e.stopPropagation()}
//         style={{
//           background: "#0d0d0d",
//           border: "1px solid #222",
//           borderTop: "2px solid #3a6fff",
//           width: "520px",
//           padding: "28px",
//         }}
//       >
//         <div
//           style={{
//             fontFamily: "'JetBrains Mono', monospace",
//             color: "#888",
//             fontSize: "11px",
//             letterSpacing: "0.15em",
//             textTransform: "uppercase",
//             marginBottom: "20px",
//           }}
//         >
//           ▸ new deployment
//         </div>

//         {[
//           {
//             label: "Git Repository",
//             val: repo,
//             set: setRepo,
//             placeholder: "https://github.com/user/repo.git",
//           },
//           {
//             label: "App Name (optional)",
//             val: appName,
//             set: setAppName,
//             placeholder: "auto-detected from repo",
//           },
//           {
//             label: "Port (optional)",
//             val: port,
//             set: setPort,
//             placeholder: "auto-assigned from 3100",
//           },
//         ].map(({ label, val, set, placeholder }) => (
//           <div key={label} style={{ marginBottom: "16px" }}>
//             <div
//               style={{
//                 color: "#555",
//                 fontSize: "11px",
//                 fontFamily: "monospace",
//                 marginBottom: "6px",
//                 textTransform: "uppercase",
//                 letterSpacing: "0.1em",
//               }}
//             >
//               {label}
//             </div>
//             <input
//               value={val}
//               onChange={(e) => set(e.target.value)}
//               placeholder={placeholder}
//               style={{
//                 width: "100%",
//                 boxSizing: "border-box",
//                 background: "#080808",
//                 border: "1px solid #1e1e1e",
//                 color: "#ddd",
//                 fontFamily: "monospace",
//                 fontSize: "13px",
//                 padding: "10px 12px",
//                 outline: "none",
//                 borderRadius: "2px",
//               }}
//               onFocus={(e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = "#3a6fff")}
//               onBlur={(e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = "#1e1e1e")}
//             />
//           </div>
//         ))}

//         <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
//           <button
//             onClick={onClose}
//             style={{
//               flex: 1,
//               padding: "10px",
//               background: "transparent",
//               border: "1px solid #222",
//               color: "#555",
//               fontFamily: "monospace",
//               fontSize: "12px",
//               cursor: "pointer",
//               textTransform: "uppercase",
//               letterSpacing: "0.1em",
//             }}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => repo && onDeploy({ repo, appName, port })}
//             style={{
//               flex: 2,
//               padding: "10px",
//               background: repo ? "#0a1628" : "#0a0a0a",
//               border: `1px solid ${repo ? "#3a6fff" : "#1a1a1a"}`,
//               color: repo ? "#3a6fff" : "#333",
//               fontFamily: "monospace",
//               fontSize: "12px",
//               cursor: repo ? "pointer" : "not-allowed",
//               textTransform: "uppercase",
//               letterSpacing: "0.1em",
//               transition: "all 0.2s",
//             }}
//           >
//             ▸ Deploy
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function DeployDashboard(): ReactNode {
//   const [apps, setApps] = useState<App[]>([]);
//   const [logs, setLogs] = useState<LogEntry[]>([
//     { type: "info", text: "deploy-dashboard v1.0.0 initialized" },
//     { type: "info", text: "server: 192.168.1.50 — 0 apps loaded" },
//     { type: "success", text: "all systems nominal" },
//   ]);
//   const [showDeploy, setShowDeploy] = useState<boolean>(false);
//   const [activeTab, setActiveTab] = useState<"apps" | "logs">("apps");
//   const router = useRouter();

//   const addLog = (lines: LogEntry[]): void => setLogs((prev) => [...prev, ...lines]);

//   // Single loadApps definition using getAuthHeaders
//   const loadApps = async (): Promise<void> => {
//     const res = await fetch("/api/apps", {
//       headers: getAuthHeaders(),
//     });

//     if (!res.ok) {
//       console.error(await res.text());
//       return;
//     }

//     const data = await res.json();
//     setApps(data.apps);
//   };

//   useEffect(() => {
//     // Check for token and redirect to login if not found
//     const token =
//       typeof window !== "undefined"
//         ? localStorage.getItem("dashboard_token")
//         : null;

//     if (!token) {
//       router.push("/login");
//       return;
//     }

//     loadApps();

//     const interval = setInterval(loadApps, 5000);
//     return () => clearInterval(interval);
//   }, [router]);

//   // Fixed handleAction — was floating outside any function scope
//   const handleAction = async (appName: string, action: DeployAction): Promise<void> => {
//     addLog([{ type: "cmd", text: `${action} ${appName}` }]);

//     try {
//       const res = await fetch("/api/action", {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify({ action, appName }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         addLog([{ type: "success", text: `${action} completed` }]);
//       } else {
//         addLog([{ type: "error", text: data.error || "operation failed" }]);
//       }
//     } catch (err: any) {
//       addLog([{ type: "error", text: err.message || "request failed" }]);
//     }

//     await loadApps();
//   };

//   const handleDeploy = async ({
//     repo,
//     appName,
//     port,
//   }: {
//     repo: string;
//     appName: string;
//     port: string;
//   }): Promise<void> => {
//     addLog([{ type: "cmd", text: `deploy ${repo}` }]);

//     try {
//       const res = await fetch("/api/action", {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify({
//           action: "deploy",
//           repo,
//           appName,
//           port,
//         }),
//       });

//       if (!res.ok) {
//         const text = await res.text();
//         addLog([{ type: "error", text }]);
//         return;
//       }

//       const data = await res.json();

//       if (data.success) {
//         addLog([{ type: "success", text: "deployment started" }]);
//       } else {
//         addLog([{ type: "error", text: data.error || "deployment failed" }]);
//       }
//     } catch (err: any) {
//       addLog([{ type: "error", text: err.message || "request failed" }]);
//     }

//     setShowDeploy(false);
//     await loadApps();
//   };

//   const online: number = apps.filter((a) => a.status === "online").length;
//   const stopped: number = apps.filter((a) => a.status === "stopped").length;
//   const deploying: number = apps.filter((a) => a.status === "deploying").length;

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#080808",
//         color: "#ddd",
//         fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
//       }}
//     >
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@700;800&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: #0a0a0a; }
//         ::-webkit-scrollbar-thumb { background: #222; }
//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.4; }
//         }
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(8px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .app-row { animation: fadeIn 0.3s ease forwards; }
//       `}</style>

//       {/* Header */}
//       <div
//         style={{
//           borderBottom: "1px solid #141414",
//           padding: "0 32px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           height: "56px",
//           position: "sticky",
//           top: 0,
//           zIndex: 10,
//           background: "#080808",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
//           <div
//             style={{
//               fontFamily: "'Syne', sans-serif",
//               fontSize: "18px",
//               fontWeight: 800,
//               letterSpacing: "-0.02em",
//               color: "#fff",
//             }}
//           >
//             dep<span style={{ color: "#3a6fff" }}>.</span>sh
//           </div>
//           <div
//             style={{ width: "1px", height: "20px", background: "#1e1e1e" }}
//           />
//           <div
//             style={{ color: "#444", fontSize: "11px", letterSpacing: "0.1em" }}
//           >
//             192.168.1.50
//           </div>
//         </div>

//         <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
//           <div style={{ display: "flex", gap: "16px" }}>
//             {[
//               { label: "online", val: online, color: "#00ff9d" },
//               { label: "stopped", val: stopped, color: "#ff4444" },
//               { label: "deploying", val: deploying, color: "#ffcc00" },
//             ].map(({ label, val, color }) => (
//               <div key={label} style={{ textAlign: "center" }}>
//                 <div
//                   style={{
//                     fontSize: "18px",
//                     fontWeight: 700,
//                     color,
//                     lineHeight: 1,
//                   }}
//                 >
//                   {val}
//                 </div>
//                 <div
//                   style={{
//                     fontSize: "9px",
//                     color: "#444",
//                     letterSpacing: "0.15em",
//                     textTransform: "uppercase",
//                     marginTop: "2px",
//                   }}
//                 >
//                   {label}
//                 </div>
//               </div>
//             ))}
//           </div>
//           <button
//             onClick={() => setShowDeploy(true)}
//             style={{
//               background: "#0a1628",
//               border: "1px solid #3a6fff",
//               color: "#3a6fff",
//               padding: "8px 18px",
//               fontFamily: "monospace",
//               fontSize: "12px",
//               cursor: "pointer",
//               letterSpacing: "0.1em",
//               textTransform: "uppercase",
//               borderRadius: "2px",
//               transition: "all 0.15s",
//             }}
//             onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
//               e.currentTarget.style.background = "#0f2040";
//               e.currentTarget.style.color = "#6a9fff";
//             }}
//             onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
//               e.currentTarget.style.background = "#0a1628";
//               e.currentTarget.style.color = "#3a6fff";
//             }}
//           >
//             + Deploy
//           </button>
//           <button
//             onClick={() => {
//               localStorage.removeItem("dashboard_token");
//               router.push("/login");
//             }}
//             style={{
//               background: "transparent",
//               border: "1px solid #444",
//               color: "#666",
//               padding: "8px 18px",
//               fontFamily: "monospace",
//               fontSize: "12px",
//               cursor: "pointer",
//               letterSpacing: "0.1em",
//               textTransform: "uppercase",
//               borderRadius: "2px",
//               transition: "all 0.15s",
//             }}
//             onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
//               e.currentTarget.style.borderColor = "#666";
//               e.currentTarget.style.color = "#999";
//             }}
//             onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
//               e.currentTarget.style.borderColor = "#444";
//               e.currentTarget.style.color = "#666";
//             }}
//           >
//             ▸ Logout
//           </button>
//         </div>
//       </div>

//       <div
//         style={{ padding: "24px 32px", maxWidth: "1200px", margin: "0 auto" }}
//       >
//         {/* Tabs */}
//         <div
//           style={{
//             display: "flex",
//             gap: "0",
//             borderBottom: "1px solid #141414",
//             marginBottom: "24px",
//           }}
//         >
//           {(["apps", "logs"] as const).map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               style={{
//                 background: "transparent",
//                 border: "none",
//                 borderBottom: `2px solid ${activeTab === tab ? "#3a6fff" : "transparent"}`,
//                 color: activeTab === tab ? "#ddd" : "#444",
//                 fontFamily: "monospace",
//                 fontSize: "12px",
//                 padding: "10px 20px",
//                 cursor: "pointer",
//                 textTransform: "uppercase",
//                 letterSpacing: "0.12em",
//                 transition: "all 0.15s",
//                 marginBottom: "-1px",
//               }}
//             >
//               {tab === "apps" ? `apps (${apps.length})` : "logs"}
//             </button>
//           ))}
//         </div>

//         {activeTab === "apps" && (
//           <div
//             style={{
//               border: "1px solid #141414",
//               borderRadius: "2px",
//               overflow: "hidden",
//             }}
//           >
//             {/* Table header */}
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "160px 80px 100px 1fr auto",
//                 gap: "16px",
//                 padding: "10px 20px",
//                 background: "#0a0a0a",
//                 borderBottom: "1px solid #141414",
//               }}
//             >
//               {["APP / PORT", "STATUS", "UPTIME", "DOMAIN", "ACTIONS"].map(
//                 (h) => (
//                   <div
//                     key={h}
//                     style={{
//                       color: "#333",
//                       fontSize: "10px",
//                       letterSpacing: "0.15em",
//                       textTransform: "uppercase",
//                     }}
//                   >
//                     {h}
//                   </div>
//                 ),
//               )}
//             </div>

//             {apps.length === 0 ? (
//               <div
//                 style={{
//                   padding: "48px",
//                   textAlign: "center",
//                   color: "#333",
//                   fontSize: "13px",
//                 }}
//               >
//                 no apps deployed — click{" "}
//                 <span style={{ color: "#3a6fff" }}>+ Deploy</span> to get
//                 started
//               </div>
//             ) : (
//               apps.map((app) => (
//                 <div key={app.name} className="app-row">
//                   {app.status === "deploying" ? (
//                     <div
//                       style={{
//                         display: "grid",
//                         gridTemplateColumns: "160px 80px 100px 1fr auto",
//                         alignItems: "center",
//                         gap: "16px",
//                         padding: "14px 20px",
//                         borderBottom: "1px solid #141414",
//                         background: "#0b0d10",
//                       }}
//                     >
//                       <div
//                         style={{
//                           color: "#e8e8e8",
//                           fontFamily: "monospace",
//                           fontSize: "13px",
//                           fontWeight: 600,
//                         }}
//                       >
//                         {app.name}
//                       </div>
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "7px",
//                         }}
//                       >
//                         <div
//                           style={{
//                             width: "7px",
//                             height: "7px",
//                             border: "2px solid #ffcc00",
//                             borderTopColor: "transparent",
//                             borderRadius: "50%",
//                             animation: "spin 0.8s linear infinite",
//                           }}
//                         />
//                         <span
//                           style={{
//                             color: "#ffcc00",
//                             fontSize: "11px",
//                             fontFamily: "monospace",
//                             textTransform: "uppercase",
//                           }}
//                         >
//                           deploying
//                         </span>
//                       </div>
//                       <div
//                         style={{
//                           color: "#333",
//                           fontSize: "11px",
//                           fontFamily: "monospace",
//                         }}
//                       >
//                         —
//                       </div>
//                       <div
//                         style={{
//                           color: "#3a6fff",
//                           fontSize: "12px",
//                           fontFamily: "monospace",
//                           opacity: 0.5,
//                         }}
//                       >
//                         {app.domain}
//                       </div>
//                       <div style={{ color: "#333", fontSize: "11px" }}>—</div>
//                     </div>
//                   ) : (
//                     <AppRow app={app} onAction={handleAction} />
//                   )}
//                 </div>
//               ))
//             )}
//           </div>
//         )}

//         {activeTab === "logs" && (
//           <div>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: "12px",
//               }}
//             >
//               <div
//                 style={{
//                   color: "#444",
//                   fontSize: "11px",
//                   letterSpacing: "0.1em",
//                   textTransform: "uppercase",
//                 }}
//               >
//                 terminal output
//               </div>
//               <button
//                 onClick={() => setLogs([])}
//                 style={{
//                   background: "transparent",
//                   border: "1px solid #1e1e1e",
//                   color: "#444",
//                   fontFamily: "monospace",
//                   fontSize: "10px",
//                   padding: "4px 10px",
//                   cursor: "pointer",
//                   letterSpacing: "0.1em",
//                   textTransform: "uppercase",
//                 }}
//               >
//                 clear
//               </button>
//             </div>
//             <TerminalLog lines={logs} />
//           </div>
//         )}

//         {/* Quick actions bar */}
//         <div
//           style={{
//             marginTop: "24px",
//             display: "flex",
//             gap: "10px",
//             flexWrap: "wrap",
//           }}
//         >
//           {[
//             {
//               label: "redeploy all",
//               action: () => {
//                 apps.forEach((a) => {
//                   if (a.status !== "deploying") handleAction(a.name, "redep" as DeployAction);
//                 });
//               },
//             },
//             {
//               label: "pm2 status",
//               action: () => {
//                 setActiveTab("logs");
//                 addLog([
//                   { type: "cmd", text: "deploy status" },
//                   ...apps.map((a) => ({
//                     type: a.status === "online" ? "success" : "error",
//                     text: `${a.name.padEnd(16)} ${a.status.padEnd(10)} :${a.port}`,
//                   })),
//                 ]);
//               },
//             },
//           ].map(({ label, action }) => (
//             <button
//               key={label}
//               onClick={action}
//               style={{
//                 background: "#0a0a0a",
//                 border: "1px solid #1e1e1e",
//                 color: "#555",
//                 fontFamily: "monospace",
//                 fontSize: "11px",
//                 padding: "7px 14px",
//                 cursor: "pointer",
//                 textTransform: "uppercase",
//                 letterSpacing: "0.1em",
//                 borderRadius: "2px",
//                 transition: "all 0.15s",
//               }}
//               onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
//                 e.currentTarget.style.color = "#999";
//                 e.currentTarget.style.borderColor = "#333";
//               }}
//               onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
//                 e.currentTarget.style.color = "#555";
//                 e.currentTarget.style.borderColor = "#1e1e1e";
//               }}
//             >
//               {label}
//             </button>
//           ))}
//           <div
//             style={{
//               marginLeft: "auto",
//               color: "#222",
//               fontSize: "10px",
//               alignSelf: "center",
//               fontFamily: "monospace",
//             }}
//           >
//             ~/apps/.ports — {apps.length} entries
//           </div>
//         </div>
//       </div>

//       {showDeploy && (
//         <DeployModal
//           onClose={() => setShowDeploy(false)}
//           onDeploy={handleDeploy}
//         />
//       )}
//     </div>
//   );
// }


"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";

type LogEntry = { type: string; text: string };

type App = {
  name: string;
  port: number;
  status: "online" | "stopped" | "deploying";
  domain: string;
  release: string;
  uptime: string;
};

type AppRowProps = {
  app: App;
  onAction: (appName: string, action: DeployAction) => Promise<void>;
  loadingKeys: Set<string>;
};

type DeployModalProps = {
  onClose: () => void;
  onDeploy: (params: { repo: string; appName: string; port: string }) => Promise<void>;
  isDeploying: boolean;
};

type DeployAction = "redep" | "rollback" | "stop" | "start" | "delete" | "deploy";

function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("dashboard_token") : null;
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token || ""}`,
  };
}

const STATUS_COLOR = {
  online: "#00ff9d",
  stopped: "#ff4444",
  deploying: "#ffcc00",
};

function Spinner({ color = "#3a6fff", size = 10 }: { color?: string; size?: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: `${size}px`,
        height: `${size}px`,
        border: `2px solid ${color}33`,
        borderTopColor: color,
        borderRadius: "50%",
        animation: "spin 0.65s linear infinite",
        flexShrink: 0,
      }}
    />
  );
}

function TerminalLog({ lines }: { lines: LogEntry[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);
  return (
    <div
      style={{
        background: "#0a0a0a",
        border: "1px solid #1e1e1e",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: "12px",
        color: "#a0a0a0",
        padding: "12px",
        height: "220px",
        overflowY: "auto",
        lineHeight: "1.7",
      }}
    >
      {lines.map((l, i) => (
        <div
          key={i}
          style={{
            color:
              l.type === "success"
                ? "#00ff9d"
                : l.type === "error"
                  ? "#ff4444"
                  : l.type === "cmd"
                    ? "#ffcc00"
                    : "#a0a0a0",
          }}
        >
          {l.type === "cmd" ? <span style={{ color: "#555" }}>$ </span> : null}
          {l.text}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

function AppRow({ app, onAction, loadingKeys }: AppRowProps): ReactNode {
  const [hovered, setHovered] = useState<boolean>(false);

  const actions = ["redep", "rollback", app.status === "online" ? "stop" : "start", "delete"] as DeployAction[];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "160px 80px 100px 1fr auto",
        alignItems: "center",
        gap: "16px",
        padding: "14px 20px",
        borderBottom: "1px solid #141414",
        background: hovered ? "#0f0f0f" : "transparent",
        transition: "background 0.15s",
      }}
    >
      <div>
        <div style={{ color: "#e8e8e8", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", fontWeight: 600 }}>
          {app.name}
        </div>
        <div style={{ color: "#444", fontSize: "11px", marginTop: "2px", fontFamily: "monospace" }}>
          :{app.port}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
        <div
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: STATUS_COLOR[app.status],
            boxShadow: app.status === "online" ? `0 0 8px ${STATUS_COLOR[app.status]}` : "none",
            animation: app.status === "online" ? "pulse 2.5s infinite" : "none",
          }}
        />
        <span style={{ color: STATUS_COLOR[app.status], fontSize: "11px", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {app.status}
        </span>
      </div>

      <div style={{ color: "#555", fontSize: "11px", fontFamily: "monospace" }}>{app.uptime}</div>

      <div style={{ color: "#3a6fff", fontSize: "12px", fontFamily: "monospace" }}>
        <a
          href={`https://${app.domain}`}
          target="_blank"
          rel="noreferrer"
          style={{ color: "#3a6fff", textDecoration: "none", opacity: hovered ? 1 : 0.7, transition: "opacity 0.15s" }}
        >
          {app.domain} ↗
        </a>
      </div>

      <div style={{ display: "flex", gap: "6px" }}>
        {actions.map((action) => {
          const key = `${app.name}:${action}`;
          // Also treat any action on this app as "busy" if any key for this app is loading
          const isThisLoading = loadingKeys.has(key);
          const isAnyLoading = [...loadingKeys].some((k) => k.startsWith(`${app.name}:`));
          const isDisabled = isAnyLoading;
          const isDelete = action === "delete";

          return (
            <button
              key={action}
              onClick={() => !isDisabled && onAction(app.name, action)}
              disabled={isDisabled}
              title={isAnyLoading && !isThisLoading ? "Another action is running…" : undefined}
              style={{
                background: isDelete ? "#1a0606" : "#111",
                color: isDisabled
                  ? isDelete ? "#551111" : "#333"
                  : isDelete ? "#ff4444" : "#888",
                border: `1px solid ${isDelete ? "#330000" : "#1e1e1e"}`,
                borderRadius: "3px",
                padding: "4px 8px",
                fontSize: "10px",
                fontFamily: "monospace",
                cursor: isDisabled ? "not-allowed" : "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                minWidth: "52px",
                justifyContent: "center",
                opacity: isDisabled && !isThisLoading ? 0.45 : 1,
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                if (isDisabled) return;
                e.currentTarget.style.background = isDelete ? "#2a0808" : "#1a1a1a";
                e.currentTarget.style.color = isDelete ? "#ff6666" : "#ccc";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                if (isDisabled) return;
                e.currentTarget.style.background = isDelete ? "#1a0606" : "#111";
                e.currentTarget.style.color = isDelete ? "#ff4444" : "#888";
              }}
            >
              {isThisLoading ? (
                <>
                  <Spinner color={isDelete ? "#ff4444" : "#3a6fff"} size={8} />
                  <span style={{ color: isDelete ? "#ff4444" : "#3a6fff" }}>{action}</span>
                </>
              ) : (
                action
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DeployModal({ onClose, onDeploy, isDeploying }: DeployModalProps): ReactNode {
  const [repo, setRepo] = useState<string>("");
  const [appName, setAppName] = useState<string>("");
  const [port, setPort] = useState<string>("");

  const canSubmit = !!repo && !isDeploying;

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={!isDeploying ? onClose : undefined}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#0d0d0d", border: "1px solid #222", borderTop: "2px solid #3a6fff", width: "520px", padding: "28px" }}
      >
        <div style={{ fontFamily: "'JetBrains Mono', monospace", color: "#888", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>
          ▸ new deployment
        </div>

        {[
          { label: "Git Repository", val: repo, set: setRepo, placeholder: "https://github.com/user/repo.git" },
          { label: "App Name (optional)", val: appName, set: setAppName, placeholder: "auto-detected from repo" },
          { label: "Port (optional)", val: port, set: setPort, placeholder: "auto-assigned from 3100" },
        ].map(({ label, val, set, placeholder }) => (
          <div key={label} style={{ marginBottom: "16px" }}>
            <div style={{ color: "#555", fontSize: "11px", fontFamily: "monospace", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {label}
            </div>
            <input
              value={val}
              onChange={(e) => set(e.target.value)}
              placeholder={placeholder}
              disabled={isDeploying}
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#080808",
                border: "1px solid #1e1e1e",
                color: "#ddd",
                fontFamily: "monospace",
                fontSize: "13px",
                padding: "10px 12px",
                outline: "none",
                borderRadius: "2px",
                opacity: isDeploying ? 0.5 : 1,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#3a6fff")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#1e1e1e")}
            />
          </div>
        ))}

        <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
          <button
            onClick={onClose}
            disabled={isDeploying}
            style={{
              flex: 1,
              padding: "10px",
              background: "transparent",
              border: "1px solid #222",
              color: "#555",
              fontFamily: "monospace",
              fontSize: "12px",
              cursor: isDeploying ? "not-allowed" : "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              opacity: isDeploying ? 0.4 : 1,
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => canSubmit && onDeploy({ repo, appName, port })}
            disabled={!canSubmit}
            style={{
              flex: 2,
              padding: "10px",
              background: canSubmit ? "#0a1628" : "#0a0a0a",
              border: `1px solid ${canSubmit ? "#3a6fff" : "#1a1a1a"}`,
              color: canSubmit ? "#3a6fff" : "#333",
              fontFamily: "monospace",
              fontSize: "12px",
              cursor: canSubmit ? "pointer" : "not-allowed",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {isDeploying ? (
              <>
                <Spinner color="#3a6fff" size={10} />
                <span>Deploying…</span>
              </>
            ) : (
              "▸ Deploy"
            )}
          </button>
        </div>

        {isDeploying && (
          <div
            style={{
              marginTop: "16px",
              padding: "10px 12px",
              background: "#080d18",
              border: "1px solid #1a2a4a",
              borderRadius: "2px",
              color: "#3a6fff",
              fontSize: "11px",
              fontFamily: "monospace",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              animation: "fadeIn 0.2s ease",
            }}
          >
            <Spinner color="#3a6fff" size={9} />
            Cloning repo and running build… this may take a moment
          </div>
        )}
      </div>
    </div>
  );
}

export default function DeployDashboard(): ReactNode {
  const [apps, setApps] = useState<App[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: "info", text: "deploy-dashboard v1.0.0 initialized" },
    { type: "info", text: "server: 192.168.1.50 — 0 apps loaded" },
    { type: "success", text: "all systems nominal" },
  ]);
  const [showDeploy, setShowDeploy] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"apps" | "logs">("apps");
  // Track in-flight action keys as "appName:action"
  const [loadingKeys, setLoadingKeys] = useState<Set<string>>(new Set());
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [redeployingAll, setRedeployingAll] = useState<boolean>(false);
  const router = useRouter();

  const addLog = (lines: LogEntry[]): void => setLogs((prev) => [...prev, ...lines]);

  const setKeyLoading = (key: string, loading: boolean) => {
    setLoadingKeys((prev) => {
      const next = new Set(prev);
      loading ? next.add(key) : next.delete(key);
      return next;
    });
  };

  const loadApps = async (): Promise<void> => {
    const res = await fetch("/api/apps", { headers: getAuthHeaders() });
    if (!res.ok) { console.error(await res.text()); return; }
    const data = await res.json();
    setApps(data.apps);
  };

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("dashboard_token") : null;
    if (!token) { router.push("/login"); return; }
    loadApps();
    const interval = setInterval(loadApps, 5000);
    return () => clearInterval(interval);
  }, [router]);

  const handleAction = async (appName: string, action: DeployAction): Promise<void> => {
    const key = `${appName}:${action}`;
    setKeyLoading(key, true);
    addLog([{ type: "cmd", text: `${action} ${appName}` }]);

    try {
      const res = await fetch("/api/action", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ action, appName }),
      });
      const data = await res.json();
      if (data.success) {
        addLog([{ type: "success", text: `${action} completed` }]);
      } else {
        addLog([{ type: "error", text: data.error || "operation failed" }]);
      }
    } catch (err: any) {
      addLog([{ type: "error", text: err.message || "request failed" }]);
    } finally {
      setKeyLoading(key, false);
    }

    await loadApps();
  };

  const handleDeploy = async ({ repo, appName, port }: { repo: string; appName: string; port: string }): Promise<void> => {
    setIsDeploying(true);
    addLog([{ type: "cmd", text: `deploy ${repo}` }]);

    try {
      const res = await fetch("/api/action", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ action: "deploy", repo, appName, port }),
      });

      if (!res.ok) {
        const text = await res.text();
        addLog([{ type: "error", text }]);
        return;
      }

      const data = await res.json();
      if (data.success) {
        addLog([{ type: "success", text: "deployment started" }]);
      } else {
        addLog([{ type: "error", text: data.error || "deployment failed" }]);
      }
    } catch (err: any) {
      addLog([{ type: "error", text: err.message || "request failed" }]);
    } finally {
      setIsDeploying(false);
    }

    setShowDeploy(false);
    await loadApps();
  };

  const online = apps.filter((a) => a.status === "online").length;
  const stopped = apps.filter((a) => a.status === "stopped").length;
  const deploying = apps.filter((a) => a.status === "deploying").length;

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#ddd", fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #222; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .app-row { animation: fadeIn 0.3s ease forwards; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #141414", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px", position: "sticky", top: 0, zIndex: 10, background: "#080808" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 800, letterSpacing: "-0.02em", color: "#fff" }}>
            dep<span style={{ color: "#3a6fff" }}>.</span>sh
          </div>
          <div style={{ width: "1px", height: "20px", background: "#1e1e1e" }} />
          <div style={{ color: "#444", fontSize: "11px", letterSpacing: "0.1em" }}>192.168.1.50</div>
        </div>

        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "16px" }}>
            {[
              { label: "online", val: online, color: "#00ff9d" },
              { label: "stopped", val: stopped, color: "#ff4444" },
              { label: "deploying", val: deploying, color: "#ffcc00" },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "18px", fontWeight: 700, color, lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: "9px", color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "2px" }}>{label}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowDeploy(true)}
            style={{ background: "#0a1628", border: "1px solid #3a6fff", color: "#3a6fff", padding: "8px 18px", fontFamily: "monospace", fontSize: "12px", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "2px", transition: "all 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#0f2040"; e.currentTarget.style.color = "#6a9fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#0a1628"; e.currentTarget.style.color = "#3a6fff"; }}
          >
            + Deploy
          </button>
          <button
            onClick={() => { localStorage.removeItem("dashboard_token"); router.push("/login"); }}
            style={{ background: "transparent", border: "1px solid #444", color: "#666", padding: "8px 18px", fontFamily: "monospace", fontSize: "12px", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "2px", transition: "all 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#666"; e.currentTarget.style.color = "#999"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#444"; e.currentTarget.style.color = "#666"; }}
          >
            ▸ Logout
          </button>
        </div>
      </div>

      <div style={{ padding: "24px 32px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: "0", borderBottom: "1px solid #141414", marginBottom: "24px" }}>
          {(["apps", "logs"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ background: "transparent", border: "none", borderBottom: `2px solid ${activeTab === tab ? "#3a6fff" : "transparent"}`, color: activeTab === tab ? "#ddd" : "#444", fontFamily: "monospace", fontSize: "12px", padding: "10px 20px", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.12em", transition: "all 0.15s", marginBottom: "-1px" }}
            >
              {tab === "apps" ? `apps (${apps.length})` : "logs"}
            </button>
          ))}
        </div>

        {activeTab === "apps" && (
          <div style={{ border: "1px solid #141414", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "160px 80px 100px 1fr auto", gap: "16px", padding: "10px 20px", background: "#0a0a0a", borderBottom: "1px solid #141414" }}>
              {["APP / PORT", "STATUS", "UPTIME", "DOMAIN", "ACTIONS"].map((h) => (
                <div key={h} style={{ color: "#333", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase" }}>{h}</div>
              ))}
            </div>

            {apps.length === 0 ? (
              <div style={{ padding: "48px", textAlign: "center", color: "#333", fontSize: "13px" }}>
                no apps deployed — click <span style={{ color: "#3a6fff" }}>+ Deploy</span> to get started
              </div>
            ) : (
              apps.map((app) => (
                <div key={app.name} className="app-row">
                  {app.status === "deploying" ? (
                    <div style={{ display: "grid", gridTemplateColumns: "160px 80px 100px 1fr auto", alignItems: "center", gap: "16px", padding: "14px 20px", borderBottom: "1px solid #141414", background: "#0b0d10" }}>
                      <div style={{ color: "#e8e8e8", fontFamily: "monospace", fontSize: "13px", fontWeight: 600 }}>{app.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                        <div style={{ width: "7px", height: "7px", border: "2px solid #ffcc00", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                        <span style={{ color: "#ffcc00", fontSize: "11px", fontFamily: "monospace", textTransform: "uppercase" }}>deploying</span>
                      </div>
                      <div style={{ color: "#333", fontSize: "11px", fontFamily: "monospace" }}>—</div>
                      <div style={{ color: "#3a6fff", fontSize: "12px", fontFamily: "monospace", opacity: 0.5 }}>{app.domain}</div>
                      <div style={{ color: "#333", fontSize: "11px" }}>—</div>
                    </div>
                  ) : (
                    <AppRow app={app} onAction={handleAction} loadingKeys={loadingKeys} />
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "logs" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ color: "#444", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>terminal output</div>
              <button
                onClick={() => setLogs([])}
                style={{ background: "transparent", border: "1px solid #1e1e1e", color: "#444", fontFamily: "monospace", fontSize: "10px", padding: "4px 10px", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase" }}
              >
                clear
              </button>
            </div>
            <TerminalLog lines={logs} />
          </div>
        )}

        {/* Quick actions bar */}
        <div style={{ marginTop: "24px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {[
            {
              label: redeployingAll ? "redeploying…" : "redeploy all",
              isLoading: redeployingAll,
              action: async () => {
                if (redeployingAll) return;
                setRedeployingAll(true);
                await Promise.all(
                  apps
                    .filter((a) => a.status !== "deploying")
                    .map((a) => handleAction(a.name, "redep"))
                );
                setRedeployingAll(false);
              },
            },
            {
              label: "pm2 status",
              isLoading: false,
              action: () => {
                setActiveTab("logs");
                addLog([
                  { type: "cmd", text: "deploy status" },
                  ...apps.map((a) => ({
                    type: a.status === "online" ? "success" : "error",
                    text: `${a.name.padEnd(16)} ${a.status.padEnd(10)} :${a.port}`,
                  })),
                ]);
              },
            },
          ].map(({ label, action, isLoading }) => (
            <button
              key={label}
              onClick={action}
              disabled={isLoading}
              style={{
                background: "#0a0a0a",
                border: "1px solid #1e1e1e",
                color: isLoading ? "#3a6fff" : "#555",
                fontFamily: "monospace",
                fontSize: "11px",
                padding: "7px 14px",
                cursor: isLoading ? "not-allowed" : "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                borderRadius: "2px",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: "7px",
              }}
              onMouseEnter={(e) => {
                if (isLoading) return;
                e.currentTarget.style.color = "#999";
                e.currentTarget.style.borderColor = "#333";
              }}
              onMouseLeave={(e) => {
                if (isLoading) return;
                e.currentTarget.style.color = "#555";
                e.currentTarget.style.borderColor = "#1e1e1e";
              }}
            >
              {isLoading && <Spinner color="#3a6fff" size={9} />}
              {label}
            </button>
          ))}
          <div style={{ marginLeft: "auto", color: "#222", fontSize: "10px", alignSelf: "center", fontFamily: "monospace" }}>
            ~/apps/.ports — {apps.length} entries
          </div>
        </div>
      </div>

      {showDeploy && (
        <DeployModal
          onClose={() => !isDeploying && setShowDeploy(false)}
          onDeploy={handleDeploy}
          isDeploying={isDeploying}
        />
      )}
    </div>
  );
}