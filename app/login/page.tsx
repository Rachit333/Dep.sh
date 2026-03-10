"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage(): React.ReactNode {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Store token in localStorage
      localStorage.setItem("dashboard_token", data.token);

      // Redirect to dashboard
      router.push("/");
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#ddd",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "40px",
          background: "#0a0a0a",
          border: "1px solid #1e1e1e",
          borderTop: "2px solid #3a6fff",
        }}
      >
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "24px",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#fff",
            marginBottom: "8px",
          }}
        >
          dep<span style={{ color: "#3a6fff" }}>.</span>sh
        </div>
        <div
          style={{
            color: "#666",
            fontSize: "12px",
            marginBottom: "32px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          deployment dashboard
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                color: "#555",
                fontSize: "11px",
                fontFamily: "monospace",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="enter your username"
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#080808",
                border: "1px solid #1e1e1e",
                color: "#ddd",
                fontFamily: "monospace",
                fontSize: "13px",
                padding: "12px",
                outline: "none",
                borderRadius: "2px",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#3a6fff")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#1e1e1e")}
              required
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label
              style={{
                display: "block",
                color: "#555",
                fontSize: "11px",
                fontFamily: "monospace",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="enter your password"
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#080808",
                border: "1px solid #1e1e1e",
                color: "#ddd",
                fontFamily: "monospace",
                fontSize: "13px",
                padding: "12px",
                outline: "none",
                borderRadius: "2px",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#3a6fff")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#1e1e1e")}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div
              style={{
                background: "#1a0606",
                border: "1px solid #330000",
                color: "#ff6666",
                padding: "12px",
                borderRadius: "2px",
                fontSize: "12px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !username || !password}
            style={{
              width: "100%",
              padding: "12px",
              background:
                loading || !username || !password ? "#0a0a0a" : "#0a1628",
              border: `1px solid ${loading || !username || !password ? "#1a1a1a" : "#3a6fff"
                }`,
              color:
                loading || !username || !password ? "#333" : "#3a6fff",
              fontFamily: "monospace",
              fontSize: "12px",
              cursor:
                loading || !username || !password ? "not-allowed" : "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              borderRadius: "2px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!loading && username && password) {
                e.currentTarget.style.background = "#0f2040";
                e.currentTarget.style.color = "#6a9fff";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && username && password) {
                e.currentTarget.style.background = "#0a1628";
                e.currentTarget.style.color = "#3a6fff";
              }
            }}
          >
            {loading ? "logging in..." : "▸ Login"}
          </button>
        </form>

        <div
          style={{
            marginTop: "24px",
            color: "#444",
            fontSize: "11px",
            textAlign: "center",
            letterSpacing: "0.1em",
          }}
        >
          demo credentials: admin / admin
        </div>
      </div>
    </div>
  );
}
