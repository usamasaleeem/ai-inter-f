import { useEffect, useState } from "react";
import { useStore } from "../../../store/useStore";

export default function GeneralSettings() {
  const profile = useStore((state: any) => state.organizationProfile);
  const fetchProfile = useStore((state: any) => state.fetchOrganizationProfile);
  const updateOrg = useStore((state: any) => state.updateOrganization);

  const [form, setForm] = useState({
    name: "",
    email: "",
    industry: "",
    companySize: "",
    autoAiInterview: false,
  });

  const [loading, setLoading] = useState(false);
  const [updatingSubscription, setUpdatingSubscription] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        industry: profile.industry || "",
        companySize: profile.companySize || "",
        autoAiInterview: profile.autoAiInterview || false,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateOrg({
        name: form.name,
        industry: form.industry,
        companySize: form.companySize,
        autoAiInterview: form.autoAiInterview,
      });
      await fetchProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'pro':
        return 'bg-blue-100 text-blue-800';
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'trial':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
       return 'bg-green-100 text-green-800';
    }
  };

  const getUsagePercentage = () => {
    if (!profile?.subscription) return 0;
    const { interviewsUsed, interviewsLimit } = profile.subscription;
    return (interviewsUsed / interviewsLimit) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">General Settings</h1>
        <p className="text-sm text-gray-500">
          Manage your company details and hiring preferences
        </p>
      </div>

      {/* Subscription & Plan Section */}
      {profile?.subscription && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-semibold text-gray-700">
                Current Plan
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPlanBadgeColor(profile.subscription.plan)}`}>
                  {profile.subscription.plan?.toUpperCase() || 'FREE'}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadgeColor(profile.subscription.status)}`}>
                  {profile.subscription.status?.toUpperCase() || 'ACTIVE'}
                </span>
              </div>
            </div>
            
            {profile.subscription.plan === 'free' && (
              <button
                onClick={() => window.location.href = '/pricing'}
                className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:opacity-90 transition"
              >
                Upgrade Plan
              </button>
            )}
          </div>

          {/* Interview Usage */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Interview Credits Used</span>
              <span className="font-medium">
                {profile.subscription.interviewsUsed} / {profile.subscription.interviewsLimit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(getUsagePercentage(), 100)}%` }}
              />
            </div>
            {getUsagePercentage() >= 90 && (
              <p className="text-xs text-orange-600">
                ⚠️ You're approaching your interview limit. Consider upgrading your plan.
              </p>
            )}
          </div>

          {/* Subscription Dates */}
          {profile.subscription.startDate && (
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 pt-2">
              <div>
                <span className="font-medium">Started on:</span>
                <span className="ml-2">
                  {new Date(profile.subscription.startDate).toLocaleDateString()}
                </span>
              </div>
              {profile.subscription.expiryDate && (
                <div>
                  <span className="font-medium">Expires on:</span>
                  <span className="ml-2">
                    {new Date(profile.subscription.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          )}

          
        </div>
      )}

      {/* Company Info */}
      <div className="bg-white border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Company Info</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              placeholder="Company Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              disabled
              className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Contact support to change email
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Industry
            </label>
            <input
              type="text"
              placeholder="e.g., SaaS, Fintech, Healthcare"
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Company Size
            </label>
            <select
              value={form.companySize}
              onChange={(e) => setForm({ ...form, companySize: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">Select size</option>
              <option value="1-10">1-10 employees</option>
              <option value="10-50">10-50 employees</option>
              <option value="50-200">50-200 employees</option>
              <option value="200-1000">200-1000 employees</option>
              <option value="1000+">1000+ employees</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hiring Preferences */}
      <div className="bg-white border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">
          Hiring Preferences
        </h2>

        {/* Auto AI Interview */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Auto-start AI Interview</p>
            <p className="text-xs text-gray-500">
              Automatically send candidates to AI interview after applying
            </p>
          </div>
          <button
            onClick={() => setForm({ ...form, autoAiInterview: !form.autoAiInterview })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
              form.autoAiInterview ? 'bg-black' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                form.autoAiInterview ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Usage Statistics */}
      {profile?.subscription && profile.subscription.interviewsUsed > 0 && (
        <div className="bg-white border rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">
            Usage Statistics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {profile.subscription.interviewsUsed}
              </p>
              <p className="text-xs text-gray-600">Interviews Conducted</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {profile.subscription.interviewsLimit - profile.subscription.interviewsUsed}
              </p>
              <p className="text-xs text-gray-600">Remaining Credits</p>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 bg-black text-white rounded-lg text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}