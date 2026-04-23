// components/PricingSection.tsx
import { useState } from "react";
import { Check, ArrowRight, Shield, Zap, HelpCircle, ChevronDown, Sparkles, Building2, Headphones } from "lucide-react";

// UI Components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl border ${className}`}>{children}</div>
);

const Button = ({ children, onClick, variant = "primary", disabled = false, className = "" }: any) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/20",
    outline: "border-2 border-gray-200 text-gray-900 hover:bg-gray-50",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Toggle = ({ 
  checked, 
  onChange, 
  leftLabel, 
  rightLabel 
}: { 
  checked: boolean; 
  onChange: (checked: boolean) => void; 
  leftLabel: string; 
  rightLabel: string;
}) => {
  return (
    <div className="relative flex items-center p-1">
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`relative z-10 px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-full ${
          !checked 
            ? 'text-white bg-black shadow-sm' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        {leftLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`relative z-10 px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-full ${
          checked 
            ? 'text-white bg-black shadow-sm' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        {rightLabel}
      </button>
    </div>
  );
};

// Helper function to add customer parameters to checkout URL
// Without encoding (not recommended)
const addCustomerParamsToCheckoutLink = (checkoutLink: string, email?: string, name?: string) => {
  if (!checkoutLink || !email) return checkoutLink;
  
  const url = new URL(checkoutLink);
  // Don't encode - but this might break if email has special characters
  url.searchParams.set('customer_email', email);
  
  if (name) {
    url.searchParams.set('customer_name', name);
  }
  
  return url.toString();
};

// Pricing tiers data
const TIERS = [
  {
    name: "Starter",
    tagline: "For growing teams",
    description: "Perfect for small teams and startups scaling their early hiring pipeline.",
    price: { monthly: 59, yearly: 49 },
    features: [
      "Up to 10 AI interviews / month",
      "Standard voice models",
      "Basic scoring rubrics",
      "Email support",
      "3 active job posting",
      "Basic analytics dashboard",
    ],
    cta: "Choose Plan",
    ctaVariant: "outline" as const,
    popular: false,
    icon: <Zap className="w-5 h-5" />,
    iconColor: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    checkoutLink: "https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_KTGMzwkE0w5v9fe2mpO16QJOcVamqJBur958f4CCXrN/redirect",
  },
  {
    name: "Pro",
    tagline: "Most popular",
    description: "Everything you need to run high-volume recruiting at scale.",
    price: { monthly: 249, yearly: 229 },
    features: [
      "Up to 50 AI interviews",
      "Premium ultra-realistic voices",
      "Custom rubric builder",
      "ATS integrations (Greenhouse, Lever)",
      "Priority support with SLA",
      "Unlimited job postings",
      "Advanced analytics & reports",
      "Team collaboration tools",
    ],
    cta: "Choose Plan",
    ctaVariant: "primary" as const,
    popular: true,
    icon: <Sparkles className="w-5 h-5" />,
    iconColor: "text-primary bg-primary/10 border-primary/20",
    checkoutLink: "https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_b0OfGaKUC96bVN6cv2waXtXOzgRnLOhEwMp2n12DOFF/redirect",
  },
  {
    name: "Enterprise",
    tagline: "For large organizations",
    description: "Custom compliance, security, and dedicated support for enterprises.",
    price: { monthly: "Custom", yearly: "Custom" },
    features: [
      "Everything in Pro, plus:",
      "Dedicated account manager",
      "Custom voice cloning",
      "SSO & advanced role management",
      "SLA guarantees (99.9% uptime)",
      "Custom ATS integrations",
      "On-premise deployment option",
      "Volume-based pricing",
    ],
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
    popular: false,
    icon: <Building2 className="w-5 h-5" />,
    iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    checkoutLink: 'https://hirelai.com/book-demo',
  },
];

interface PricingSectionProps {
  onPlanSelect?: (planId: string, checkoutLink: string | null) => void;
  isLoading?: string | null;
  userEmail?: string;
  userName?: string;
  showSkip?: boolean;
  onSkip?: () => void;
  variant?: "full" | "compact";
}

export function PricingSection({
  onPlanSelect,
  isLoading = null,
  userEmail,
  userName,
  showSkip = true,
  onSkip,
  variant = "full",
}: PricingSectionProps) {
  const [isYearly, setIsYearly] = useState(false);

  const handlePlanClick = (tier: typeof TIERS[0]) => {
    if (onPlanSelect) {
      // Add email to checkout link for Polar links
      let checkoutLinkWithEmail = tier.checkoutLink;
      
      if (tier.checkoutLink && tier.checkoutLink.includes('polar.sh') && userEmail) {
        checkoutLinkWithEmail = addCustomerParamsToCheckoutLink(tier.checkoutLink, userEmail, userName);
        console.log('Checkout link with email:', checkoutLinkWithEmail); // For debugging
      }
      
      onPlanSelect(tier.name.toLowerCase(), checkoutLinkWithEmail);
    }
  };

  if (variant === "compact") {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
          <p className="text-gray-600 text-sm">Select the perfect plan for your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-xl border-2 p-4 transition-all ${
                tier.popular
                  ? "border-black shadow-lg bg-white"
                  : "border-gray-200 bg-white"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-black text-white px-3 py-0.5 rounded-full text-xs font-semibold">
                    Popular
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between mb-3">
                <div className={`p-1.5 rounded-lg border ${tier.iconColor}`}>
                  {tier.icon}
                </div>
                <h3 className="font-bold text-gray-900">{tier.name}</h3>
              </div>
              <div className="mb-3">
                {typeof tier.price.monthly === "number" ? (
                  <>
                    <span className="text-2xl font-bold">${isYearly ? tier.price.yearly : tier.price.monthly}</span>
                    <span className="text-gray-600 text-sm">/mo</span>
                  </>
                ) : (
                  <span className="text-xl font-bold">Custom</span>
                )}
              </div>
              <Button
                variant={tier.popular ? "primary" : "outline"}
                onClick={() => handlePlanClick(tier)}
                disabled={isLoading === tier.name.toLowerCase()}
                className="w-full text-sm py-2"
              >
                {isLoading === tier.name.toLowerCase() ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  tier.cta
                )}
              </Button>
            </div>
          ))}
        </div>

        {showSkip && onSkip && (
          <div className="text-center mt-6">
            <button
              onClick={onSkip}
              className="text-gray-600 hover:text-gray-900 text-sm underline"
            >
              Skip for now → Go to Dashboard
            </button>
          </div>
        )}
      </div>
    );
  }

  // Full pricing page variant
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Pricing Cards */}
      <section className="pb-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-br from-black/5 via-purple-500/5 to-transparent blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center p-1 rounded-full bg-gray-200/50 border border-gray-300">
            <Toggle
              checked={isYearly}
              onChange={setIsYearly}
              leftLabel="Monthly"
              rightLabel="Yearly"
            />
          </div>
          {isYearly && (
            <p className="text-sm text-green-600 font-semibold mt-3">
              Save 20% with annual billing
            </p>
          )}
        </div>
      
        <div className="max-w-7xl pt-10 mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {TIERS.map((tier, i) => (
              <div
                key={tier.name}
                className={`relative h-full ${tier.popular ? "md:-mt-4 md:mb-[-16px]" : ""}`}
                style={{
                  animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`
                }}
              >
                {tier.popular && (
                  <div className="absolute -inset-[1px] bg-gradient-to-b from-black via-gray-700 to-gray-300 rounded-2xl opacity-100" />
                )}

                <Card className={`h-full flex flex-col relative rounded-2xl overflow-hidden ${
                  tier.popular
                    ? "border-0 shadow-2xl shadow-black/10 bg-white"
                    : "border-gray-200 bg-white/80"
                }`}>
                  {tier.popular && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500" />
                  )}

                  <div className="p-6 pb-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-xl border ${tier.iconColor}`}>
                        {tier.icon}
                      </div>
                      {tier.popular && (
                        <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 bg-black/5 text-black rounded-full border border-black/10">
                          Most Popular
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mb-1 text-gray-900">{tier.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{tier.description}</p>
                  </div>

                  <div className="p-6 flex-1 space-y-6">
                    <div className="pb-4 border-b border-gray-100">
                      {typeof tier.price.monthly === "number" ? (
                        <>
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold tracking-tight text-gray-900">
                              ${isYearly ? tier.price.yearly : tier.price.monthly}
                            </span>
                            <span className="text-base font-medium text-gray-500">/mo</span>
                          </div>
                          {isYearly && (
                            <p className="text-xs text-gray-500 mt-1">
                              Billed annually (${(tier.price.yearly as number) * 12}/yr)
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="flex items-baseline">
                          <span className="text-3xl font-extrabold tracking-tight text-gray-900">
                            Custom
                          </span>
                        </div>
                      )}
                    </div>

                    <ul className="space-y-3">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                            tier.popular ? "text-gray-900" : "text-green-500"
                          }`} />
                          <span className="text-sm font-medium text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 pt-0 mt-auto">
                    <Button
                      variant={tier.popular ? "primary" : "outline"}
                      onClick={() => handlePlanClick(tier)}
                      disabled={isLoading === tier.name.toLowerCase()}
                      className={`w-full h-11 text-base font-semibold ${
                        tier.popular
                          ? "shadow-lg shadow-black/20"
                          : ""
                      }`}
                    >
                      {isLoading === tier.name.toLowerCase() ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        <>
                          {tier.cta}
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div 
            className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-gray-500"
            style={{ animation: "fadeIn 0.5s ease-out 0.4s both" }}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="font-medium">SOC 2 Compliant</span>
            </div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="font-medium">14-day free trial</span>
            </div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-green-500" />
              <span className="font-medium">24/7 Support</span>
            </div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="font-medium">GDPR Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-16 border-y border-gray-200 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold uppercase tracking-widest mb-4 border border-amber-500/20">
                <Building2 className="w-3 h-3 mr-2" /> Enterprise
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-4">
                Need a custom solution?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Get volume pricing, custom integrations, dedicated support, and on-premise deployment options tailored to your organization.
              </p>
              <ul className="space-y-2 mb-8">
                {["Dedicated account manager", "Custom SLA & uptime guarantees", "White-glove onboarding"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Check className="w-4 h-4 text-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-shrink-0">
              <Button
                variant="primary"
                onClick={() => handlePlanClick(TIERS[2])}
                className="h-12 px-8 text-base font-semibold"
              >
                Talk to Sales
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Add CSS animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}