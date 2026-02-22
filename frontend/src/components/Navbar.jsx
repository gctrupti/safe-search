import React, { useState } from "react";

export default function Navbar({ activeTab, setActiveTab, role, logout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* LEFT: Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
          <div>
            <p className="font-semibold text-sm sm:text-base">
              Encrypted Search
            </p>
            <p className="text-xs text-gray-500">
              SSE/PEKS Protocol
            </p>
          </div>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-4 items-center">
          {role === "internal" && (
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-3 py-1 rounded ${
                activeTab === "upload"
                  ? "bg-gray-200"
                  : "text-gray-600"
              }`}
            >
              Upload
            </button>
          )}

          <button
            onClick={() => setActiveTab("search")}
            className={`px-3 py-1 rounded ${
              activeTab === "search"
                ? "bg-gray-200"
                : "text-gray-600"
            }`}
          >
            Search
          </button>

          <button
            onClick={() => setActiveTab("metrics")}
            className={`px-3 py-1 rounded ${
              activeTab === "metrics"
                ? "bg-gray-200"
                : "text-gray-600"
            }`}
          >
            Metrics
          </button>

          <span className="text-sm bg-gray-100 px-3 py-1 rounded">
            {role === "internal"
              ? "Internal Analyst"
              : "External Auditor"}
          </span>

          <button
            onClick={logout}
            className="text-sm text-gray-600 hover:text-black"
          >
            Logout
          </button>
        </div>

        {/* HAMBURGER BUTTON (Mobile Only) */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="space-y-1">
            <div className="w-6 h-0.5 bg-black"></div>
            <div className="w-6 h-0.5 bg-black"></div>
            <div className="w-6 h-0.5 bg-black"></div>
          </div>
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-white border-t">
          {role === "internal" && (
            <button
              onClick={() => {
                setActiveTab("upload");
                setMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded ${
                activeTab === "upload"
                  ? "bg-gray-200"
                  : "text-gray-600"
              }`}
            >
              Upload
            </button>
          )}

          <button
            onClick={() => {
              setActiveTab("search");
              setMenuOpen(false);
            }}
            className={`block w-full text-left px-3 py-2 rounded ${
              activeTab === "search"
                ? "bg-gray-200"
                : "text-gray-600"
            }`}
          >
            Search
          </button>

          <button
            onClick={() => {
              setActiveTab("metrics");
              setMenuOpen(false);
            }}
            className={`block w-full text-left px-3 py-2 rounded ${
              activeTab === "metrics"
                ? "bg-gray-200"
                : "text-gray-600"
            }`}
          >
            Metrics
          </button>

          <div className="border-t pt-3">
            <span className="block text-sm bg-gray-100 px-3 py-2 rounded mb-2">
              {role === "internal"
                ? "Internal Analyst"
                : "External Auditor"}
            </span>

            <button
              onClick={logout}
              className="block w-full text-left text-sm text-gray-600 hover:text-black"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}