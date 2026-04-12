"use client";
import Sidebar from "../components/Sidebar";
import { AppProvider } from "../components/AppContext";
import CommandPalette from "../components/CommandPalette";
import AuraBackground from "../components/AuraBackground";

export default function DashboardLayout({ children }) {
  return (
    <AppProvider>
      <AuraBackground />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <main className="main-content">{children}</main>
        <CommandPalette />
      </div>
    </AppProvider>
  );
}
