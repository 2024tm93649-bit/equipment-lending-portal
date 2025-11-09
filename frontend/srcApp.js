import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000"; // backend URL

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (token) fetchItems(token);
  }, [token]);

  const login = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        alert("Login successful!");
      } else {
        alert(data.msg || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Login error — check backend is running");
    }
  };

  const fetchItems = async (tokenVal) => {
    try {
      const res = await fetch(`${API_BASE}/api/items`, {
        headers: { "x-auth-token": tokenVal },
      });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Equipment Lending Portal</h1>

      {!token ? (
        <div style={{ marginTop: 20 }}>
          <h3>Login</h3>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginRight: 8 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginRight: 8 }}
          />
          <button onClick={login}>Login</button>
          <p style={{ marginTop: 12 }}>
            Use admin@example.com/admin123 or student@example.com/student123
          </p>
        </div>
      ) : (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>Available Items</h3>
            <div>
              <button onClick={() => fetchItems(token)} style={{ marginRight: 8 }}>
                Refresh
              </button>
              <button onClick={logout}>Logout</button>
            </div>
          </div>

          {items.length === 0 ? (
            <p>No items found.</p>
          ) : (
            <ul>
              {items.map((it) => (
                <li key={it._id}>
                  <b>{it.name}</b> — {it.category} ({it.available} available)
                  {it.description ? <span> — {it.description}</span> : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
