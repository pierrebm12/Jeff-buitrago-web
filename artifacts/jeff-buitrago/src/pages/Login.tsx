import { useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/context/AdminContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAdminLogin } from "@workspace/api-client-react";

interface LoginProps {
  onSuccess: () => void;
}

export function Login({ onSuccess }: LoginProps) {
  const { t } = useLanguage();
  const { setIsAdmin } = useAdmin();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useAdminLogin({
    mutation: {
      onSuccess: () => {
        setIsAdmin(true);
        onSuccess();
      },
      onError: () => {
        setError(t.admin.loginError);
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ data: { password } });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-black to-black pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="text-3xl font-bold tracking-[0.2em] text-white mb-2">
            JEFF <span className="text-primary">BUITRAGO</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mt-6">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-xl font-semibold text-white mt-4 tracking-wider uppercase">
            {t.admin.loginTitle}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-widest">
              {t.admin.passwordLabel}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
              required
              autoFocus
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm"
            >
              {error}
            </motion.p>
          )}

          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-primary text-black hover:bg-primary/90 h-12 font-bold uppercase tracking-widest"
          >
            {loginMutation.isPending ? "..." : t.admin.loginButton}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
