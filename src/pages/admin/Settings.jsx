import { useState } from "react";
import RoleNavbar from "../../components/layout/RoleNavbar";
import {
  Settings as SettingsIcon,
  Save,
  CheckCircle2,
  Database,
  Shield,
} from "lucide-react";

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [platformFee, setPlatformFee] = useState("5.0");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight flex items-center gap-2">
            <SettingsIcon className="text-brand-600" /> Platform Configuration
          </h1>
          <p className="text-sm text-ink-500 mt-1">
            Global system settings, commission rate parameters, and API options.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="card p-6 border border-ink-100 bg-white shadow-sm space-y-4">
            <h3 className="text-base font-black text-ink-900 pb-2 border-b border-ink-100">
              Financial & Commission Rules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label text-xs font-bold text-ink-700">
                  Platform Take-rate (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={platformFee}
                  onChange={(e) => setPlatformFee(e.target.value)}
                  className="input text-sm"
                />
              </div>

              <div>
                <label className="label text-xs font-bold text-ink-700">
                  Billing Currency
                </label>
                <input
                  type="text"
                  disabled
                  value="NGN (Nigerian Naira ₦)"
                  className="input text-sm bg-ink-50 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="card p-6 border border-ink-100 bg-white shadow-sm space-y-4">
            <h3 className="text-base font-black text-ink-900 pb-2 border-b border-ink-100">
              System Operations
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-ink-900">
                  Maintenance Mode
                </p>
                <p className="text-xs text-ink-500">
                  Temporarily suspend queue ticket creation for database
                  maintenance.
                </p>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-5 h-5 rounded border-ink-300 text-brand-500 focus:ring-brand-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {saved ? (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                <CheckCircle2 size={14} /> Changes saved successfully!
              </span>
            ) : (
              <div />
            )}

            <button
              type="submit"
              className="btn-primary px-8 py-3 font-bold text-xs inline-flex items-center gap-2"
            >
              <Save size={16} /> Save Configuration
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
