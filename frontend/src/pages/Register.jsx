import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/api";
import { toast } from "sonner";

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", college: "", city: "", degree: "", semester: "", phone: ""
  });
  const [err,  setErr]  = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const payload = { ...form, semester: form.semester ? parseInt(form.semester) : null };
      await register(payload);
      toast.success("Welcome to BookBridge");
      navigate("/browse");
    } catch (ex) {
      setErr(formatApiError(ex.response?.data?.detail) || ex.message);
    } finally { setBusy(false); }
  };

  return (
    <div className="grain min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-3xl">
        <div className="text-xs tracking-[0.3em] uppercase text-[#E27D60] mb-3">Sign up</div>
        <h1 className="editorial-heading text-4xl md:text-5xl mb-2">Become a part of the campus.</h1>
        <p className="text-[#A1A1AA] mb-10">It takes thirty seconds. No OTP, no nonsense.</p>

        <form onSubmit={submit} data-testid="register-form" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Name"             testid="reg-name"     value={form.name}     onChange={set("name")}     required />
          <Field label="Email"            testid="reg-email"    value={form.email}    onChange={set("email")}    type="email" required />
          <Field label="Password"         testid="reg-password" value={form.password} onChange={set("password")} type="password" required />
          <Field label="Phone (optional)" testid="reg-phone"    value={form.phone}    onChange={set("phone")} />
          <Field label="College"          testid="reg-college"  value={form.college}  onChange={set("college")}  placeholder="e.g. IIT Delhi" />
          <Field label="City"             testid="reg-city"     value={form.city}     onChange={set("city")}     placeholder="e.g. Delhi" />
          <Field label="Degree"           testid="reg-degree"   value={form.degree}   onChange={set("degree")}   placeholder="e.g. B.Tech CSE" />
          <Field label="Semester"         testid="reg-semester" value={form.semester} onChange={set("semester")} type="number" placeholder="1-12" />

          {err && <div data-testid="register-error" className="col-span-full text-sm text-red-400">{err}</div>}

          <div className="col-span-full flex items-center justify-between mt-4">
            <Link to="/login" data-testid="reg-to-login" className="text-sm text-[#A1A1AA] hover:text-white">Already have an account? Sign in →</Link>
            <button data-testid="register-submit" disabled={busy} className="btn-primary">{busy ? "…" : "Create account"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, testid, type = "text", ...props }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-2">{label}</label>
      <input type={type} data-testid={testid} {...props}
        className="w-full bg-[#141417] border border-[#27272A] px-4 py-3 outline-none focus:border-[#E27D60]" />
    </div>
  );
}
