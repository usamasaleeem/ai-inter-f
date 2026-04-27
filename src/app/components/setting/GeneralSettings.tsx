import { useEffect, useState, useRef } from "react";
import { useStore } from "../../../store/useStore";

export default function GeneralSettings() {
  const profile = useStore((state: any) => state.organizationProfile);
  const fetchProfile = useStore((state: any) => state.fetchOrganizationProfile);
  const updateOrg = useStore((state: any) => state.updateOrganization);
  const uploadLogo = useStore((state: any) => state.uploadCompanyLogo);
  const uploadingLogo = useStore((state: any) => state.uploadingLogo);

  const [form, setForm] = useState({
    name: "",
    email: "",
    industry: "",
    companySize: "",
    autoAiInterview: false,
  });

  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      if (profile.logo) {
        setLogoPreview(profile.logo);
      }
    }
  }, [profile]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);

    // Upload to server
    const uploadedUrl = await uploadLogo(file);
    
    if (!uploadedUrl) {
      // Revert preview if upload fails
      setLogoPreview(profile?.logo || null);
      alert('Failed to upload logo. Please try again.');
    }
  };

  const handleRemoveLogo = async () => {
    if (!confirm('Are you sure you want to remove the company logo?')) return;
    
    try {
      // Call API to remove logo
      const response = await fetch('/api/auth/remove-logo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        setLogoPreview(null);
        // Update profile in store
        await fetchProfile();
      }
    } catch (error) {
      console.error('Error removing logo:', error);
    }
  };

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

      {/* Company Logo Section */}
      <div className="bg-white border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Company Logo</h2>
        
        <div className="flex items-center gap-6">
          {/* Logo Preview */}
          <div className="relative">
            {logoPreview ? (
              <div className="relative group">
                <img
                  src={logoPreview}
                  alt="Company logo"
                  className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                />
                <button
                  onClick={handleRemoveLogo}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition shadow-lg opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            {/* Upload Overlay on Hover */}
            {logoPreview && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                   onClick={() => fileInputRef.current?.click()}>
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <p className="text-sm text-gray-700 mb-1">Company Logo</p>
            <p className="text-xs text-gray-500 mb-3">
              Recommended size: 200x200px. Max file size: 5MB. Supported formats: PNG, JPG, SVG
            </p>
            <div className="flex gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingLogo}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploadingLogo ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upload Logo
                  </>
                )}
              </button>
           
            </div>
          </div>
        </div>
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