import { Outlet, useNavigate, useLocation } from "react-router";
import {
    Settings,
    FileText,
    Brain,
    Users,
    ChevronRight,
} from "lucide-react";
import { cn } from "../../../lib/helpers";

export function SettingsLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        {
            name: "General",
            desc: "Company & basic info",
            path: "/dashboard/settings",
            icon: Settings,
        },
        {
            name: "Templates",
            desc: "Emails & status messages",
            path: "/dashboard/settings/templates",
            icon: FileText,
        },
        {
            name: "AI Config",
            desc: "Interview automation",
            path: "/dashboard/settings/ai",
            icon: Brain,
        },
        {
            name: "Team",
            desc: "Manage members",
            path: "/dashboard/settings/team",
            icon: Users,
        },
    ];

    const isActive = (path) => {
        if (path === "/dashboard/settings") {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6">

            {/* Sidebar */}
            <div className="lg:w-72 w-full bg-white border rounded-xl p-4 shadow-sm">

                {/* Heading */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Settings</h2>
                    <p className="text-xs text-gray-500">
                        Manage your workspace preferences
                    </p>
                </div>

                {/* Tabs */}
                <div className="space-y-1">
                    {tabs.map((tab) => {
                        const active = isActive(tab.path);

                        return (
                            <button
                                key={tab.path}
                                onClick={() => navigate(tab.path)}
                                className={cn(
                                    "w-full flex items-center justify-between p-3 rounded-lg transition-all group",
                                    active
                                        ? "bg-gray-900 text-white shadow-sm"
                                        : "hover:bg-gray-100 text-gray-700"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <tab.icon
                                        className={cn(
                                            "h-5 w-5",
                                            active ? "text-white" : "text-gray-500"
                                        )}
                                    />

                                    <div className="text-left">
                                        <p className="text-sm font-medium">{tab.name}</p>
                                        <p
                                            className={cn(
                                                "text-xs",
                                                active ? "text-gray-300" : "text-gray-500"
                                            )}
                                        >
                                            {tab.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Arrow */}
                                <ChevronRight
                                    className={cn(
                                        "h-4 w-4 transition-transform",
                                        active
                                            ? "text-white"
                                            : "text-gray-400 group-hover:translate-x-1"
                                    )}
                                />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-white border rounded-xl p-6 lg:p-8 shadow-sm min-h-[400px]">
                <Outlet />
            </div>
        </div>
    );
}