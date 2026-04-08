"use client";
import Sidebar from "../components/Sidebar";
import { AppProvider } from "../components/AppContext";

export default function DashboardLayout({ children }) {
  return (
    <AppProvider>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
    </AppProvider>
  );
}
