import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/api";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [err,  setErr]  = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate("/browse");
    } catch (ex) {
      setErr(formatApiError(ex.response?.data?.detail) || ex.message);
    } finally { setBusy(false); }
  };

  return (
    <div className="grain min-h-[80vh] grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:block relative border-r border-[#27272A] overflow-hidden">
        <img src="https://images.pexels.com/photos/256477/pexels-photo-256477.jpeg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0A0A0B] via-transparent to-transparent" />
        <div className="relative h-full p-12 flex flex-col justify-end">
          <h2 className="editorial-heading text-5xl">Welcome back.</h2>
          <p className="text-[#A1A1AA] mt-4 max-w-sm">The library remembers.</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <form onSubmit={submit} className="w-full max-w-sm" data-testid="login-form">
          <div className="text-xs tracking-[0.3em] uppercase text-[#E27D60] mb-3">Sign in</div>
          <h1 className="editorial-heading text-4xl mb-8">Login to BookBridge</h1>

          <label className="block text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-2">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required data-testid="login-email"
            className="w-full bg-[#141417] border border-[#27272A] px-4 py-3 outline-none focus:border-[#E27D60] mb-5" />

          <label className="block text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-2">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required data-testid="login-password"
            className="w-full bg-[#141417] border border-[#27272A] px-4 py-3 outline-none focus:border-[#E27D60] mb-5" />

          {err && <div data-testid="login-error" className="text-sm text-red-400 mb-3">{err}</div>}

          <button data-testid="login-submit" disabled={busy} className="btn-primary w-full">{busy ? "…" : "Sign In"}</button>

          <p className="text-sm text-[#A1A1AA] mt-6">
            New here?{" "}
            <Link to="/register" data-testid="login-to-register" className="text-[#E27D60] hover:underline">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
