import React, { useState } from "react";
import {
  Home,
  BrainCircuit,
  Terminal,
  Gamepad2,
  User,
  Settings,
  Menu,
  X,
  Crown,
  BookOpen,
  Globe,
  Code2,
  ChevronRight,
} from "lucide-react";
import { clsx } from "clsx";
import { Theme, Translation } from "../../types";
import { THEMES } from "../../constants";

interface MobileNavProps {
  view: string;
  setView: (view: any) => void;
  t: Translation;
  theme: Theme;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  view,
  setView,
  t,
  theme,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const themeStyles = THEMES[theme];

  const handleNav = (target: string) => {
    setView(target);
    setIsMenuOpen(false); // Close menu if navigating
  };

  const NavItem = ({
    target,
    icon: Icon,
    label,
    isActive,
  }: {
    target?: string;
    icon: any;
    label?: string;
    isActive?: boolean;
  }) => (
    <button
      onClick={() => (target ? handleNav(target) : setIsMenuOpen(!isMenuOpen))}
      className={clsx(
        "flex flex-col items-center justify-center p-2 rounded-2xl transition-all active:scale-95 flex-1",
        isActive
          ? "text-[var(--color-primary)] font-bold bg-[var(--color-primary)]/10"
          : "text-gray-400 hover:text-gray-600"
      )}
    >
      <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
      {label && <span className="text-[10px] mt-1 tracking-wide">{label}</span>}
    </button>
  );

  const MenuOption = ({
    target,
    icon: Icon,
    label,
    desc,
    color,
  }: {
    target: string;
    icon: any;
    label: string;
    desc: string;
    color: string;
  }) => (
    <button
      onClick={() => handleNav(target)}
      className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all active:scale-95 active:bg-gray-50 mb-3"
    >
      <div className={`p-3 rounded-full ${color} text-white shadow-md`}>
        <Icon size={20} />
      </div>
      <div className="text-left flex-1">
        <h3 className="font-bold text-gray-800">{label}</h3>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
      <ChevronRight className="text-gray-300" size={18} />
    </button>
  );

  return (
    <>
      {/* --- SMART BOTTOM BAR --- */}
      <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 p-2 pb-safe flex justify-between items-center sticky bottom-0 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <NavItem
          target="dashboard"
          icon={Home}
          label="Home"
          isActive={view === "dashboard"}
        />
        <NavItem
          target="problems"
          icon={BrainCircuit}
          label="Practice"
          isActive={view === "problems"}
        />
        <NavItem
          target="playground"
          icon={Terminal}
          label="Code"
          isActive={view === "playground"}
        />
        <NavItem
          target="arcade"
          icon={Gamepad2}
          label="Arcade"
          isActive={view === "arcade"}
        />

        {/* Menu Trigger */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className={clsx(
            "flex flex-col items-center justify-center p-2 rounded-2xl transition-all active:scale-95 flex-1",
            isMenuOpen
              ? "text-[var(--color-primary)] font-bold"
              : "text-gray-400"
          )}
        >
          <Menu size={24} />
          <span className="text-[10px] mt-1 tracking-wide">Menu</span>
        </button>
      </div>

      {/* --- FULL SCREEN MENU OVERLAY --- */}
      <div
        className={clsx(
          "fixed inset-0 z-50 bg-gray-50/95 backdrop-blur-xl transition-all duration-300 md:hidden flex flex-col",
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-full pointer-events-none"
        )}
      >
        {/* Menu Header */}
        <div className="p-6 flex items-center justify-between bg-white shadow-sm border-b border-gray-100 pt-safe">
          <div className="flex items-center gap-2">
            <div className="bg-[var(--color-primary)] p-1.5 rounded-lg">
              <Code2 className="text-white" size={20} />
            </div>
            <span className="font-black text-xl text-[var(--color-primary)]">
              Menu
            </span>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex-1 overflow-y-auto p-6 pb-32">
          {/* User Section */}
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
              User Zone
            </p>
            <MenuOption
              target="profile"
              icon={User}
              label={t.profile}
              desc="Stats, Badges & Progress"
              color="bg-blue-500"
            />
            <MenuOption
              target="settings"
              icon={Settings}
              label={t.settings}
              desc="Theme, Language & API Key"
              color="bg-gray-600"
            />
          </div>

          {/* Learn Section */}
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
              Knowledge Base
            </p>
            <MenuOption
              target="leaderboard"
              icon={Crown}
              label="Leaderboard"
              desc="See top rankers"
              color="bg-yellow-500"
            />
            <MenuOption
              target="resources"
              icon={BookOpen}
              label="Resources"
              desc="Cheatsheets & Docs"
              color="bg-purple-500"
            />
          </div>

          {/* Developer Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-[1px] rounded-2xl shadow-lg">
              <div className="bg-white rounded-2xl p-4">
                <h4 className="font-black text-lg text-[var(--color-primary)] mb-1 flex items-center gap-2">
                  <Globe size={18} /> Developer
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Built with passion to help you learn coding faster and
                  smarter.
                </p>
                <a
                  href="https://myfolioali.netlify.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full text-center py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold shadow-md active:scale-95 transition-transform"
                >
                  {t.aboutDev}
                </a>
              </div>
            </div>
          </div>

          {/* Credit Footer */}
          <div className="mt-8 text-center opacity-50">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3"></div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t.developedBy}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">
              v3.5 Beta Mobile Optimized
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
