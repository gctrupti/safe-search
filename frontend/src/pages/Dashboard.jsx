import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import UploadPage from "../components/UploadPage";
import SearchPage from "../components/SearchPage";
import MetricsPage from "../components/MetricsPage";

export default function Dashboard({ role, logout, auditor, privateKey }) {

  const [activeTab, setActiveTab] = useState("upload");

  // Set default tab based on role
  useEffect(() => {
    if (role === "external") {
      setActiveTab("search");
    } else {
      setActiveTab("upload");
    }
  }, [role]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={role}
        logout={logout}
      />

      {/* CONTENT */}
      {activeTab === "upload" && role === "internal" && <UploadPage />}

      {activeTab === "search" && (
        <SearchPage
          role={role}
          auditor={auditor}
          privateKey={privateKey}
        />
      )}

      {activeTab === "metrics" && (
        <MetricsPage role={role} />
      )}
    </div>
  );
}