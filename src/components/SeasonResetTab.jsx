import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "../config";
import { AlertTriangle, RotateCcw, CheckCircle, XCircle } from "lucide-react";

const STEPS = {
  WARNING: "warning",
  PASSWORD: "password",
  CONFIRM: "confirm",
  DONE: "done",
  ERROR: "error",
};

const SeasonResetTab = () => {
  const [step, setStep] = useState(STEPS.WARNING);
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await axios.post(`${baseUrl}/api/admin/reset-season`, {
        resetPassword: password,
      });
      setResult(res.data);
      setStep(STEPS.DONE);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Reset failed. Please try again.");
      setStep(STEPS.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setStep(STEPS.WARNING);
    setPassword("");
    setResult(null);
    setErrorMsg("");
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Step 1: Warning */}
      {step === STEPS.WARNING && (
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-red-700 mb-1">Season Reset — Irreversible Action</h2>
              <p className="text-sm text-gray-700 mb-3">
                This will permanently:
              </p>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Archive the current season's stats and rankings</li>
                <li><strong>Delete all sessions</strong> from the database</li>
                <li><strong>Delete all points history logs</strong></li>
                <li><strong>Reset all player CL / EL / Total wins to 0</strong></li>
                <li>Start a new season from today's date</li>
              </ul>
              <p className="text-sm text-red-600 font-semibold mt-3">
                This cannot be undone. The archived season data will be preserved and visible in Past Seasons.
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setStep(STEPS.PASSWORD)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              I understand — Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Password */}
      {step === STEPS.PASSWORD && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Enter Reset Password</h2>
          <p className="text-sm text-gray-500 mb-4">
            Enter the admin reset password to proceed.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Reset password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 mb-4"
            onKeyDown={(e) => e.key === "Enter" && password && setStep(STEPS.CONFIRM)}
          />
          <div className="flex gap-3">
            <button
              onClick={() => setStep(STEPS.WARNING)}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2"
            >
              ← Back
            </button>
            <button
              disabled={!password}
              onClick={() => setStep(STEPS.CONFIRM)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Final confirmation */}
      {step === STEPS.CONFIRM && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <RotateCcw className="w-6 h-6 text-red-500" />
            <h2 className="text-lg font-bold text-red-700">Final Confirmation</h2>
          </div>
          <p className="text-sm text-gray-700 mb-2">
            You are about to <strong>permanently reset the current season</strong>.
          </p>
          <p className="text-sm text-gray-700 mb-6">
            All sessions and logs will be deleted and all wins reset to zero. The season snapshot will be saved to Past Seasons.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setStep(STEPS.PASSWORD)}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2"
            >
              ← Back
            </button>
            <button
              disabled={loading}
              onClick={handleReset}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              {loading ? "Resetting..." : "Yes, Reset Season Now"}
            </button>
          </div>
        </div>
      )}

      {/* Success */}
      {step === STEPS.DONE && result && (
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-7 h-7 text-green-500" />
            <h2 className="text-lg font-bold text-green-700">Season Reset Complete</h2>
          </div>
          <p className="text-sm text-gray-700 mb-1">{result.message}</p>
          <p className="text-xs text-gray-400 mt-2">
            New season started: {new Date(result.newSeasonStart).toLocaleDateString("sv-SE")}
          </p>
        </div>
      )}

      {/* Error */}
      {step === STEPS.ERROR && (
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-400">
          <div className="flex items-center gap-3 mb-3">
            <XCircle className="w-7 h-7 text-red-500" />
            <h2 className="text-lg font-bold text-red-700">Reset Failed</h2>
          </div>
          <p className="text-sm text-gray-700 mb-4">{errorMsg}</p>
          <button
            onClick={restart}
            className="text-sm text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
};

export default SeasonResetTab;
