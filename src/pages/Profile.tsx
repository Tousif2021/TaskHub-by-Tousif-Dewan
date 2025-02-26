
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } else {
        result = await supabase.auth.signUp({
          email,
          password,
        });
      }

      if (result.error) throw result.error;

      if (!isLogin && result.data.user) {
        toast.success("Successfully signed up! Please verify your email.");
      } else if (isLogin && result.data.user) {
        toast.success("Successfully logged in!");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Successfully signed out!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Error signing out");
    }
  };

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <div className="max-w-md mx-auto p-6">
        <div className="animate-fade-down">
          <h1 className="text-3xl font-semibold text-primary flex items-center gap-2">
            <User className="w-8 h-8" />
            {user ? "Your Profile" : "Authentication"}
          </h1>
          <p className="text-primary/60 mt-2">
            {user ? "Manage your account" : "Sign in or create a new account"}
          </p>
        </div>

        {loading ? (
          <div className="mt-8 text-center text-primary/60">Loading...</div>
        ) : user ? (
          <div className="mt-8 space-y-6 bg-white p-6 rounded-lg shadow-sm">
            <div>
              <h2 className="font-medium text-primary">Email</h2>
              <p className="text-primary/60">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="mt-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 text-center rounded-lg transition-colors ${
                    isLogin
                      ? "bg-accent text-white"
                      : "bg-primary/5 text-primary hover:bg-primary/10"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 text-center rounded-lg transition-colors ${
                    !isLogin
                      ? "bg-accent text-white"
                      : "bg-primary/5 text-primary hover:bg-primary/10"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
