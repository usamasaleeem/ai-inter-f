import { Outlet, useNavigate, useLocation } from 'react-router';
import { useStore } from '../../../store/useStore';
import { Button } from '../ui/button';
import {
  LayoutDashboard,
  BriefcaseIcon,
  Users,
  Columns3,
  Star,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../../../lib/helpers';
import logo from '../../../images/logo.svg';

import clogo from '../../../images/clogo.svg';
export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Persist sidebar state in localStorage
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    {
      name: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Jobs',
      path: '/dashboard/jobs',
      icon: BriefcaseIcon,
    },
    {
      name: 'Pipeline',
      path: '/dashboard/pipeline',
      icon: Columns3,
    },
    {
      name: 'Shortlist',
      path: '/dashboard/shortlist',
      icon: Star,
    },
    {
      name: 'All Candidates',
      path: '/dashboard/candidates',
      icon: Users,
    },
    {
      name: 'Settings',
      path: '/dashboard/settings/templates', // 👈 direct to templates for now
      icon: Settings,
    },
  ];

  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
          "lg:relative lg:inset-auto",
          isCollapsed ? "w-20" : "w-64",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={cn(
            "p-6 border-b border-gray-200 transition-all duration-300",
            isCollapsed && "p-4"
          )}>
            <div className="flex items-center justify-between">
              <div className="transition-all duration-300">
                <div className="flex items-center justify-between">

                  {/* Logo */}
                  <img
                    src={isCollapsed ? clogo : logo}
                    alt="Intervo AI"
                    className={cn(
                      "transition-all duration-300 object-contain",
                      isCollapsed ? "h-8 w-8 mx-auto" : "h-10 w-auto"
                    )}
                  />



                  {/* Mobile Close */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>

                </div>

              </div>
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex shrink-0"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = isActivePath(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-300 group relative",
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100",
                    isCollapsed && "justify-center px-2"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className={cn(
                    "h-5 w-5 shrink-0 transition-all duration-300",
                    isCollapsed && "h-6 w-6"
                  )} />
                  <span className={cn(
                    "overflow-hidden whitespace-nowrap transition-all duration-300",
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  )}>
                    {item.name}
                  </span>

                  {/* Tooltip for collapsed mode */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className={cn(
              "flex items-center gap-3 px-4 py-3 mb-2 transition-all duration-300",
              isCollapsed && "justify-center px-2"
            )}>
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                <span className="text-sm font-medium">
                  {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className={cn(
                "flex-1 min-w-0 overflow-hidden transition-all duration-300",
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              )}>
                <p className="text-sm truncate font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-600 truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={cn(
                "w-full gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300",
                isCollapsed ? "justify-center px-2" : "justify-start"
              )}
              title={isCollapsed ? "Logout" : undefined}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span className={cn(
                "overflow-hidden whitespace-nowrap transition-all duration-300",
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              )}>
                Logout
              </span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-8xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}