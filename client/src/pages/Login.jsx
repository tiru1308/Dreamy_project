import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(form)
      });
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="centered">
      <form className="card form" onSubmit={onSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          required
        />
        {error ? <p className="error">{error}</p> : null}
        <button className="button" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
        <p className="muted">No account? <Link to="/register">Create one</Link></p>
      </form>
    </main>
  );
};

export default Login;
