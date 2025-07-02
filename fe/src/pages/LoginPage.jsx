import { useState } from "react";
import { ShipWheelIcon, EyeIcon, EyeOffIcon, SparklesIcon } from "lucide-react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // This is how we did it at first, without using our custom hook
  // const queryClient = useQueryClient();
  // const {
  //   mutate: loginMutation,
  //   isPending,
  //   error,
  // } = useMutation({
  //   mutationFn: login,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  // This is how we did it using our custom hook - optimized version
  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto">
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* LOGIN FORM SECTION */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              {/* LOGO */}
              <div className="mb-8 flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-75"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                    <ShipWheelIcon className="size-8 text-white" />
                  </div>
                </div>
                <div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                    TalkIn
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <SparklesIcon className="size-4 text-yellow-500" />
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">AI-Powered Language Learning</span>
                  </div>
                </div>
              </div>

              {/* ERROR MESSAGE DISPLAY */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-700 dark:text-red-300 text-sm font-medium">
                      {error.response?.data?.message || "An error occurred. Please try again."}
                    </span>
                  </div>
                </div>
              )}

              <div className="w-full">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                      Welcome back
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                      Continue your language learning journey
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Email address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="Enter your email"
                          className="w-full px-4 py-4 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="w-full px-4 py-4 pr-12 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                        >
                          {showPassword ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                    >
                      {isPending ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        <span>Sign in to your account</span>
                      )}
                    </button>

                    <div className="text-center pt-4">
                      <p className="text-slate-600 dark:text-slate-400">
                        Don't have an account?{" "}
                        <Link
                          to="/signup"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold hover:underline transition-colors duration-200"
                        >
                          Create one now
                        </Link>
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* IMAGE SECTION */}
            <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10 backdrop-blur-sm items-center justify-center relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-xl"></div>
              
              <div className="max-w-md p-8 text-center relative z-10">
                {/* Illustration */}
                <div className="relative aspect-square max-w-sm mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
                  <img
                    src="/i.png"
                    alt="Language connection illustration"
                    className="relative w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Connect with language partners worldwide
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                    Practice conversations, make friends, and improve your language skills together in a supportive community
                  </p>
                  
                  {/* Feature highlights */}
                  <div className="flex flex-wrap justify-center gap-4 mt-6">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Real-time conversations</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>AI-powered learning</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Global community</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
