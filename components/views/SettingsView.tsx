import React from "react";
import {
  Settings,
  Globe,
  Sun,
  Key,
  Lock,
  CheckCircle,
  Info,
  ExternalLink,
} from "lucide-react";
import { clsx } from "clsx";
import { UserState, Theme, Translation, AppLanguage } from "../../types";
import { THEMES } from "../../constants";
import { Card } from "../UIComponents";

interface SettingsViewProps {
  user: UserState;
  theme: Theme;
  t: Translation;
  onUpdateSetting: (key: keyof UserState["settings"], value: any) => void;
  onUpdateApiKey: (key: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  theme,
  t,
  onUpdateSetting,
  onUpdateApiKey,
}) => {
  const themeStyles = THEMES[theme];

  return (
    <div
      className="flex-1 p-6 md:p-12 overflow-y-auto pb-24"
      style={{ backgroundColor: themeStyles.bg, color: themeStyles.text }}
    >
      <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
        <Settings size={32} /> {t.settings}
      </h1>

      <div className="space-y-6">
        <Card theme={theme} className="p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-2">
            <Globe size={24} className="text-[var(--color-primary)]" />{" "}
            {t.selectLanguage}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(["en", "hi", "hinglish"] as AppLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onUpdateSetting("appLanguage", lang)}
                className={clsx(
                  "p-5 rounded-2xl border-2 font-bold transition-all relative overflow-hidden group",
                  user.settings.appLanguage === lang
                    ? "border-[var(--color-primary)] bg-white text-[var(--color-primary)] shadow-md ring-2 ring-[var(--color-primary)]/10"
                    : "border-gray-200 hover:border-gray-300 text-gray-500 hover:bg-gray-50"
                )}
              >
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <span className="text-2xl">
                    {lang === "en" ? "🇺🇸" : "🇮🇳"}
                  </span>
                  {lang === "en"
                    ? "English"
                    : lang === "hi"
                    ? "हिंदी (Hindi)"
                    : "Hinglish"}
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card theme={theme} className="p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-2">
            <Sun size={24} className="text-[var(--color-secondary)]" />{" "}
            {t.selectTheme}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(
              [
                "light",
                "dark",
                "midnight",
                "candy",
                "orange",
                "forest",
                "coffee",
                "golden",
                "neon",
                "berry",
                "lemon",
                "cosmic",
                "aqua",
              ] as Theme[]
            ).map((th) => (
              <button
                key={th}
                onClick={() => onUpdateSetting("theme", th)}
                className={clsx(
                  "p-4 rounded-2xl border-2 font-bold transition-all capitalize relative overflow-hidden",
                  user.settings.theme === th
                    ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30 scale-105 shadow-lg"
                    : "border-gray-200 hover:border-gray-300 hover:scale-[1.02]"
                )}
                style={{
                  // Preview background
                  background: THEMES[th].bg,
                  color: THEMES[th].text,
                }}
              >
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: THEMES[th].primary }}
                  ></div>
                  <span className="text-xs font-bold drop-shadow-sm">{th}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card theme={theme} className="p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-2">
            <Key size={24} className="text-[var(--color-accent)]" /> AI
            Assistant Key
          </h3>
          <p className="text-sm text-gray-500 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
            Enter your API key to enable AI coding tutorials.
          </p>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock size={18} />
            </div>
            <input
              type="password"
              placeholder="Enter your API key (sk-...)"
              value={user.apiKey || ""}
              onChange={(e) => onUpdateApiKey(e.target.value)}
              className="w-full pl-10 p-4 border-2 border-gray-200 rounded-xl focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:outline-none transition-all"
            />
          </div>
          {user.adminUnlocked && (
            <p className="text-xs text-green-600 bg-green-50 p-2 rounded mt-2 font-bold flex items-center gap-1">
              <CheckCircle size={12} /> Developer Mode Unlocked (System Key
              Active)
            </p>
          )}
        </Card>

        <Card theme={theme} className="p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-2">
            <Info size={24} className="text-gray-400" /> About App
          </h3>
          <div className="flex flex-col gap-4">
            <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
              <div className="bg-[var(--color-primary)] text-white p-3 rounded-full shadow-md">
                <Globe size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">
                  Developed by Sheikh Ali Akbar
                </h4>
                <p className="text-xs text-gray-500">
                  Passionate about coding education.
                </p>
              </div>
            </div>
            <a
              href="https://myfolioali.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="w-full p-3 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center gap-2 text-gray-500 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all font-bold"
            >
              <ExternalLink size={16} /> Visit Developer Portfolio
            </a>
          </div>
        </Card>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => {
              const confirmReset = window.confirm(
                "Are you sure you want to reset all progress? This cannot be undone."
              );
              if (confirmReset) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="text-red-500 font-bold hover:text-white hover:bg-red-500 px-6 py-3 rounded-xl transition-all border border-red-200"
          >
            Reset All Progress
          </button>
        </div>
      </div>
    </div>
  );
};
