import { useState } from "react";

function Login() {
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async () => {
    // 🔴 Validate empty fields
    if (!form.username || !form.password) {
      setError("Please enter username and password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://s-courier-system.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        window.location.reload();
      } else {
        setError(data.error || "Invalid username or password ❌");
      }

    } catch (err) {
      setError("Server error. Try again later ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Admin Login</h2>

        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        <div className="password-field">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          <span
            className="eye-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        {error && <p className="login-error">{error}</p>}

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

export default Login;