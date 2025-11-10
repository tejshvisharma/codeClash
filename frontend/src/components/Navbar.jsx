import React from "react";
import { User, Code, LogOut, Zap } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton.jsx";

// Custom CodeClash Logo Component
const CodeClashLogo = () => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" className="text-primary">
      {/* Left Brace - Primary Color */}
      <path
        d="M8,6 Q4,8 4,16 Q4,24 8,26"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Right Brace - Secondary Color (Clash Effect) */}
      <path
        d="M24,6 Q28,8 28,16 Q28,24 24,26"
        stroke="hsl(var(--s))"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Lightning Bolt - Center (Clash Symbol) */}
      <path d="M14,10 L17,16 L14,22 L19,16 L16,10 Z" fill="currentColor" />
    </svg>
  );
};

const Navbar = () => {
  const { authUser } = useAuthStore();
  const fname = authUser?.name.split(" ")[0];
  const lname = authUser?.name.split(" ")[1];
  return (
    <nav className="sticky top-0 z-50 w-full py-3 px-4">
      <div className="flex w-full justify-between mx-auto max-w-5xl bg-black/20 shadow-lg shadow-neutral-800/20 backdrop-blur-xl border border-white/10 rounded-2xl overflow-visible px-4">
        {/* Logo Section - Enhanced */}
        <Link to="/" className="flex items-center gap-3 py-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/30 group-hover:border-primary/50 transition-all duration-300">
            <CodeClashLogo />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              CodeClash
            </span>
            <span className="text-xs text-gray-400 mt-0.5">
              Compete • Learn • Master
            </span>
          </div>
        </Link>

        {/* User Profile - Enhanced */}
        <div className="flex items-center">
          <div className="dropdown dropdown-end dropdown-hover dropdown-bottom">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle p-0 w-10 h-10 rounded-xl hover:bg-white/10 transition-all duration-300 relative"
            >
              <div className="w-full h-full rounded-xl overflow-hidden border-2 border-white/20">
                <img
                  src={
                    authUser?.image ||
                    `https://eu.ui-avatars.com/api/?name=${fname}+${lname}&size=250`
                  }
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Online Status Indicator */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </label>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-4  z-[1] p-4 shadow-2xl bg-base-100/90 backdrop-blur-lg rounded-2xl w-auto border border-base-content/15 animate-fade-in mr-4"
            >
              {/* User Info Header */}
              <li className="mb-3">
                <div className="py-3 px-3 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl overflow-hidden">
                      <img
                        src={
                          authUser?.image ||
                          `https://eu.ui-avatars.com/api/?name=${fname}+${lname}&size=250`
                        }
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-base-content truncate">
                        {authUser?.name || "Coder"}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span className="text-xs text-amber-600 font-medium">
                          {authUser?.streak || 0} day streak
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-3 mt-3 pt-2 border-t border-primary/10">
                    {/* Rank Badge */}
                    <div className="group flex items-center gap-2 px-2 py-1 rounded-full bg-blue-500/10 hover:bg-blue-500/20 transition-all duration-200 cursor-default">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-400 group-hover:scale-110 transition-transform"
                      >
                        <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m-2 13l-2-2m2 2l2-2"></path>
                      </svg>
                      <span className="text-blue-300 font-medium text-sm group-hover:text-blue-200 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-blue-400 group-hover:scale-110 transition-transform"
                        >
                          <path d="M12 2L8 6L6 10L12 14L18 10L16 6L12 2Z"></path>
                          <path d="M12 22V14"></path>
                        </svg>
                        {authUser?.rank || "—"}
                      </span>
                      <span className="text-blue-400/60 text-xs">Rank</span>
                    </div>

                    {/* Solved Badge */}
                    <div className="group flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 transition-all duration-200 cursor-default">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-emerald-400 group-hover:scale-110 transition-transform"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <span className="text-emerald-300 font-medium text-sm group-hover:text-emerald-200 transition-colors">
                        {authUser?.solved || 0}
                      </span>
                      <span className="text-emerald-400/60 text-xs">
                        Solved
                      </span>
                    </div>
                  </div>
                </div>
              </li>

              <hr className="border-base-content/15 my-2" />

              {/* Navigation Items */}
              <li>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-primary/15 transition-all duration-200 text-base-content hover:text-primary font-medium group"
                >
                  <User className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>My Profile</span>
                </Link>
              </li>

              {authUser?.role === "ADMIN" && (
                <li>
                  <Link
                    to="/add-problem"
                    className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-secondary/15 transition-all duration-200 text-base-content hover:text-secondary font-medium group"
                  >
                    <Code className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span>Add Problem</span>
                  </Link>
                </li>
              )}

              {/* Logout - Enhanced */}
              <li className="mt-2">
                <LogoutButton className="flex items-center gap-3 py-2.5 px-3 rounded-xl w-full text-left hover:bg-error/15 transition-all duration-200 text-error hover:text-error font-medium group">
                  <LogOut className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>Logout</span>
                </LogoutButton>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
