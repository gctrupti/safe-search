import { useState } from "react";
import api from "../services/api";

export default function CreateAuditorCard({ onCreated }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [privateKey, setPrivateKey] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    if (!name) return;

    try {
      setLoading(true);

      const res = await api.post("/api/auditor/create/", { name });
      const key = res.data?.data?.private_key;

      setPrivateKey(key);
      setName("");
    } catch (err) {
      console.error(err);
      alert("Failed to create auditor");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(privateKey);
    setCopied(true);
  };

  const handleClose = () => {
    setPrivateKey(null);
    setCopied(false);
    if (onCreated) onCreated();
  };

  return (
    <>
      {/* CREATE CARD */}
      <div className="bg-white border rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="font-semibold mb-4 text-base sm:text-lg">
          Create New Auditor
        </h3>

        {/* MOBILE-FIRST STACK */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter auditor name (e.g. RBI)"
            className="flex-1 border rounded px-4 py-2 w-full text-sm sm:text-base"
          />

          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-black text-white px-5 py-2 rounded w-full sm:w-auto"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      {/* PRIVATE KEY MODAL */}
      {privateKey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-lg sm:max-w-2xl shadow-xl">

            <h2 className="text-lg sm:text-xl font-semibold mb-3 text-red-600">
              ⚠️ Save This Private Key
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              This private key will be shown only once.
              Store it securely. It cannot be recovered later.
            </p>

            <textarea
              readOnly
              value={privateKey}
              className="w-full h-40 sm:h-48 border rounded p-3 text-xs font-mono bg-gray-50 mb-4 break-all"
            />

            {/* MOBILE STACKED BUTTONS */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3">

              <button
                onClick={handleCopy}
                className="px-4 py-2 border rounded hover:bg-gray-100 w-full sm:w-auto"
              >
                {copied ? "Copied ✔" : "Copy to Clipboard"}
              </button>

              <button
                onClick={handleClose}
                className="bg-black text-white px-5 py-2 rounded w-full sm:w-auto"
              >
                I Have Stored This Securely
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}