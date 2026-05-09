import { Outlet, useNavigate, useLocation } from 'react-router';
import { useStore } from '../../../store/useStore';
import { Button } from '../ui/button';
import {
  LayoutDashboard,
  BriefcaseIcon,
  Users,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Settings,
  HelpCircle,
  Sparkles,
  GitBranch,
  Star,
  UserCheck,
  UserPlus,
  FileText,
  BarChart3,
  Calendar,
  Clock,
  Trophy,
  Target,
  Zap,
  BookOpen,
  Award,
  TrendingUp,
  Shield,
  Bell,
  Search,
  Filter
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../../../lib/helpers';
import logo from '../../../images/logo.svg';
import clogo from '../../../images/clogo.svg';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const [isCollapsed, setIsCollapsed] = useState(() => {
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

  const mainNavigation = [
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
      icon: GitBranch,
    },
    {
      name: 'Shortlisted',
      path: '/dashboard/shortlist',
      icon: Star,
    },
    {
      name: 'All Candidates',
      path: '/dashboard/candidates',
      icon: Users,
    },
  ];

  const secondaryNavigation = [
  
    {
      name: 'Settings',
      path: '/dashboard/settings/templates',
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
          isCollapsed ? "w-[60px]" : "w-64",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full relative">
          {/* Collapse Toggle Button - Fixed Position */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "hidden lg:flex items-center justify-center absolute bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50 transition-all duration-200 z-50",
              isCollapsed 
                ? "-right-3 top-8 w-6 h-6" 
                : "-right-3 top-8 w-6 h-6"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3 text-gray-600" />
            ) : (
              <ChevronLeft className="h-3 w-3 text-gray-600" />
            )}
          </button>

          {/* Header with Logo */}
          <div className={cn(
            "py-5 border-b border-gray-100 transition-all duration-300",
            isCollapsed ? "px-2" : "px-5"
          )}>
            <div className="flex items-center justify-start w-full">
              <img
                src={isCollapsed ? clogo : logo}
                alt="Intervo AI"
                className={cn(
                  "transition-all duration-300 object-contain",
                  isCollapsed ? "h-7 w-7" : "h-9 w-auto"
                )}
              />
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 py-5 px-2 space-y-5 overflow-y-auto">
            {/* Main Section */}
            <div className="space-y-1">
              {!isCollapsed && (
                <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Main
                </p>
              )}
              {mainNavigation.map((item) => {
                const isActive = isActivePath(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                      isActive
                        ? "bg-gray-900 text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100",
                      isCollapsed ? "justify-center py-2.5" : "px-3 py-2.5"
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className={cn(
                      "shrink-0 transition-all duration-300",
                      isCollapsed ? "h-4 w-4" : "h-4 w-4"
                    )} />
                    <span className={cn(
                      "overflow-hidden whitespace-nowrap transition-all duration-300 text-sm",
                      isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100 ml-1"
                    )}>
                      {item.name}
                    </span>

                    {/* Tooltip for collapsed mode */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1.5 bg-gray-800 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 whitespace-nowrap shadow-lg">
                        {item.name}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

          

            {/* Secondary Navigation */}
            <div className={cn(
              "space-y-1",
              !isCollapsed && "pt-2"
            )}>
              {!isCollapsed && (
                <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Resources
                </p>
              )}
              {secondaryNavigation.map((item) => {
                const isActive = isActivePath(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-100",
                      isCollapsed ? "justify-center py-2.5" : "px-3 py-2.5"
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className={cn(
                      "shrink-0 transition-all duration-300",
                      isCollapsed ? "h-4 w-4" : "h-4 w-4"
                    )} />
                    <span className={cn(
                      "overflow-hidden whitespace-nowrap transition-all duration-300 text-sm",
                      isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100 ml-1"
                    )}>
                      {item.name}
                    </span>
                    
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1.5 bg-gray-800 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 whitespace-nowrap shadow-lg">
                        {item.name}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* User Section */}
          <div className="p-2 border-t border-gray-100">
            <div className={cn(
              "flex items-center gap-2 p-2 rounded-lg transition-all duration-300 hover:bg-gray-50 cursor-pointer",
              isCollapsed && "justify-center"
            )}>
              <Avatar className={cn(
                "shrink-0 border border-gray-200",
                isCollapsed ? "h-8 w-8" : "h-9 w-9"
              )}>
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-gray-800 text-white text-xs">
                  {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className={cn(
                "flex-1 min-w-0 overflow-hidden transition-all duration-300",
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              )}>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
                <Badge variant="secondary" className="mt-1 text-[9px] px-1.5 py-0 bg-gray-100">
                  Recruiter
                </Badge>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={handleLogout}
              className={cn(
                "w-full mt-1 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200",
                isCollapsed ? "justify-center px-0 py-2" : "justify-start px-2 py-2",
                isCollapsed && "mt-2"
              )}
              title={isCollapsed ? "Logout" : undefined}
            >
              <LogOut className={cn(
                "shrink-0 transition-all duration-300",
                isCollapsed ? "h-4 w-4" : "h-4 w-4"
              )} />
              <span className={cn(
                "overflow-hidden whitespace-nowrap transition-all duration-300 text-sm font-medium",
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
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6 flex items-center justify-between lg:hidden sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <img src={logo} alt="Intervo AI" className="h-6 w-auto" />
          
          <div className="w-8" />
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-5 lg:px-6 lg:py-6 max-w-8xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}