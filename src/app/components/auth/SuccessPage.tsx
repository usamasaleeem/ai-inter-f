import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Sparkles, ArrowRight, Home, Zap, Crown, TrendingUp } from "lucide-react";
import { api } from "../../../services/api";

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");
  const [errorMessage, setErrorMessage] = useState("");
  const [subscriptionData, setSubscriptionData] = useState(null);

  useEffect(() => {
    const checkoutId = searchParams.get("checkout_id");

    if (!checkoutId) {
      setStatus("error");
      setErrorMessage("No checkout ID found. Please contact support.");
      return;
    }

    api.post("/auth/checkout", { checkoutId })
      .then((response) => {
        if (response.data.success) {
          setStatus("success");
          setSubscriptionData(response.data.data);
          // Auto redirect after 3 seconds on success
          setTimeout(() => {
            navigate("/dashboard");
          }, 3000);
        } else {
          setStatus("error");
          setErrorMessage(response.data.message || "Payment verification failed");
        }
      })
      .catch((error) => {
        console.error("Verification error:", error);
        setStatus("error");
        setErrorMessage(
          error.response?.data?.message || 
          "Failed to verify payment. Please contact support."
        );
      });
  }, [searchParams, navigate]);

  const handleRedirect = () => {
    if (status === "success") {
      navigate("/dashboard");
    } else {
      navigate("/pricing");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Main Card */}
              <div className="relative overflow-hidden rounded-3xl bg-white/80 shadow-2xl backdrop-blur-xl dark:bg-gray-800/80">
                {/* Confetti Effect for Success */}
                {status === "success" && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
                          left: `${Math.random() * 100}%`,
                          top: -10,
                        }}
                        animate={{
                          y: ["0vh", "100vh"],
                          rotate: [0, 360],
                          opacity: [1, 0],
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.1,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </div>
                )}

                <div className="relative p-8 text-center">
                  {/* Animated Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="mb-6"
                  >
                    {status === "processing" && (
                      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
                        <Loader2 className="h-12 w-12 animate-spin text-white" />
                      </div>
                    )}
                    
                    {status === "success" && (
                      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                        <CheckCircle className="h-12 w-12 text-white" />
                      </div>
                    )}
                    
                    {status === "error" && (
                      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 shadow-lg">
                        <XCircle className="h-12 w-12 text-white" />
                      </div>
                    )}
                  </motion.div>

                  {/* Title with Animation */}
                  <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-3 text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300"
                  >
                    {status === "processing" && "Processing Payment"}
                    {status === "success" && "Payment Successful!"}
                    {status === "error" && "Verification Failed"}
                  </motion.h1>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8 text-gray-600 dark:text-gray-300"
                  >
                    {status === "processing" && (
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4 animate-pulse text-blue-500" />
                        Please wait while we confirm your subscription...
                      </span>
                    )}
                    {status === "success" && (
                      "Your account has been upgraded! You now have access to all premium features."
                    )}
                    {status === "error" && errorMessage}
                  </motion.p>

                
                  {/* Progress Bar for Success */}
                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mb-6"
                    >
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 3, ease: "linear" }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Redirecting to dashboard in 3 seconds...
                      </p>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3"
                  >
                    <button
                      onClick={handleRedirect}
                      className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    >
                      {status === "success" ? (
                        <>
                          Go to Dashboard
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      ) : (
                        <>
                          Back to Pricing
                          <Home className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    {status === "error" && (
                      <button
                        onClick={() => window.location.reload()}
                        className="inline-flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                      >
                        Try Again
                      </button>
                    )}
                  </motion.div>

                  {/* Support Link */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-6 text-xs text-gray-500 dark:text-gray-400"
                  >
                    Need help?{" "}
                    <a
                      href="/support"
                      className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Contact Support
                    </a>
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

    
        </div>
      </div>
    </div>
  );
}