"use client";
import Sidebar from "../components/Sidebar";
import { AppProvider } from "../components/AppContext";
import CommandPalette from "../components/CommandPalette";

export default function DashboardLayout({ children }) {
  return (
    <AppProvider>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <main className="main-content">{children}</main>
        <CommandPalette />
      </div>
    </AppProvider>
  );
}
