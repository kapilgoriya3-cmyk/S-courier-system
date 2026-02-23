import { useState } from "react";

function Login() {
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // clear error while typing
  };

  const handleLogin = async () => {
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
      setError(data.error || "Login failed ❌");
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
        />

        {/* PASSWORD FIELD WITH EYE BUTTON */}
        <div className="password-field">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={handleChange}
          />

          <span
            className="eye-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        {/* ERROR MESSAGE */}
        {error && <p className="login-error">{error}</p>}

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;