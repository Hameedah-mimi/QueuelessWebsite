import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../common/Logo";
import {
  Calendar,
  Clock,
  Compass,
  User,
  Users,
  Building2,
  Scissors,
  BarChart3,
  Settings,
  LogOut,
  RefreshCw,
  Search,
  Briefcase,
  Menu,
  X,
} from "lucide-react";

export default function RoleNavbar() {
  const { user, activeRole, primaryRole, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Links based on active role
  let links = [];
  if (activeRole === "customer") {
    links = [
      { to: "/customer", label: "Home", icon: Compass },
      { to: "/customer/explore", label: "Explore Services", icon: Search },
      { to: "/customer/appointments", label: "My Bookings", icon: Calendar },
      { to: "/customer/queue", label: "Live Queue", icon: Clock },
      { to: "/customer/profile", label: "Profile", icon: User },
    ];
  } else if (activeRole === "worker") {
    links = [
      { to: "/worker", label: "Dashboard", icon: Briefcase },
      { to: "/worker/schedule", label: "Client Schedule", icon: Calendar },
      { to: "/worker/earnings", label: "My Earnings", icon: BarChart3 },
      { to: "/worker/profile", label: "Availability", icon: Settings },
    ];
  } else if (activeRole === "organization" || activeRole === "org_manager") {
    links = [
      { to: "/organization", label: "Overview", icon: Building2 },
      { to: "/organization/queue", label: "Queue Terminal", icon: Clock },
      { to: "/organization/services", label: "Services Menu", icon: Scissors },
      { to: "/organization/staff", label: "Specialists", icon: Users },
    ];
  } else if (activeRole === "admin") {
    links = [
      { to: "/admin", label: "Overview", icon: BarChart3 },
      { to: "/admin/users", label: "Users", icon: Users },
      { to: "/admin/organizations", label: "Organizations", icon: Building2 },
      { to: "/admin/bookings", label: "Bookings", icon: Calendar },
      { to: "/admin/settings", label: "Settings", icon: Settings },
    ];
  }

  const isStaffOrBusiness = primaryRole !== "customer";

  const toggleRoleMode = () => {
    if (activeRole === "customer") {
      switchRole(primaryRole);
      navigate(
        primaryRole === "admin"
          ? "/admin"
          : primaryRole === "worker"
            ? "/worker"
            : "/organization",
      );
    } else {
      switchRole("customer");
      navigate("/customer");
    }
    setMobileOpen(false);
  };

  return (
    <>
      {/* MOBILE TOP BAR (Visible only on mobile/tablet) */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 h-16 flex items-center justify-between shadow-xs">
        <Logo className="h-7" to="/" />

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-100">
            {activeRole?.replace("_", " ") || "User"}
          </span>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            aria-label="Open Navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* MOBILE SLIDE-OUT DRAWER OVERLAY */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-72 bg-white h-full p-5 flex flex-col justify-between shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <Logo className="h-7" to="/" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-slate-400 p-1"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Role Switcher in Mobile Drawer */}
              {isStaffOrBusiness && (
                <div className="py-3 border-b border-slate-100">
                  <button
                    onClick={toggleRoleMode}
                    className="w-full py-2 px-3 rounded-xl bg-teal-50 border border-teal-200 text-xs font-bold text-teal-800 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <RefreshCw size={13} />
                      {activeRole === "customer"
                        ? "Return to Workspace"
                        : "Switch to Customer"}
                    </span>
                  </button>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="py-4 space-y-1">
                {links.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to;

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                        isActive
                          ? "bg-teal-50 text-teal-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 truncate">
                {user?.full_name || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-rose-600 p-1.5"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR (Permanent on screens >= lg) */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden lg:flex fixed inset-y-0 z-30">
        <div>
          {/* Logo Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <Logo className="h-7" to="/" />
            <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-100">
              {activeRole?.replace("_", " ") || "User"}
            </span>
          </div>

          {/* Role Switcher */}
          {isStaffOrBusiness && (
            <div className="p-4 border-b border-slate-100">
              <button
                onClick={toggleRoleMode}
                className="w-full py-2.5 px-3 rounded-2xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-xs font-bold text-slate-800 hover:text-teal-800 transition flex items-center justify-between shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <RefreshCw size={13} className="text-teal-600" />
                  {activeRole === "customer"
                    ? "Return to Workspace"
                    : "Switch to Customer"}
                </span>
                <span className="text-[10px] text-teal-600 font-extrabold">
                  Switch
                </span>
              </button>
            </div>
          )}

          {/* Links */}
          <nav className="p-4 space-y-1">
            {links.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition ${
                    isActive
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 font-bold flex items-center justify-center text-xs shrink-0">
              {(user?.full_name || user?.email || "U")[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                {user?.full_name || "My Account"}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-rose-600 p-1.5 transition"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
