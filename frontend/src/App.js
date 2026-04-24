import React, { useState } from "react";
import axios from "axios";

/* 🌳 Improved Tree Component */
const Tree = ({ data }) => {
  if (!data || Object.keys(data).length === 0) return null;

  return (
    <ul style={{ listStyle: "none", paddingLeft: "20px" }}>
      {Object.entries(data).map(([key, value]) => (
        <li key={key} style={{ margin: "6px 0" }}>
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              backgroundColor: "#e3f2fd",
              display: "inline-block",
              fontWeight: "bold"
            }}
          >
            {key}
          </span>

          <div
            style={{
              marginLeft: "15px",
              borderLeft: "2px solid #ccc",
              paddingLeft: "10px"
            }}
          >
            <Tree data={value} />
          </div>
        </li>
      ))}
    </ul>
  );
};

function App() {
  const [input, setInput] = useState('["A->B","A->C","B->D"]');
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setError("");
      setLoading(true);
      setResult(null);

      let parsed;

      try {
        parsed = JSON.parse(input);
      } catch {
        throw new Error("❌ Invalid JSON format");
      }

      const res = await axios.post(
        "http://localhost:5000/bfhl", // 🔥 Change after deployment
        { data: parsed }
      );

      setResult(res.data);

    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        "❌ Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial",
        maxWidth: "850px",
        margin: "auto",
        lineHeight: "1.6"
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        🚀 BFHL Hierarchy Builder
      </h1>

      {/* Input */}
      <textarea
        rows="5"
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <br /><br />

      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "6px",
          fontWeight: "bold"
        }}
      >
        Submit
      </button>

      {/* Loader */}
      {loading && <p>⏳ Processing...</p>}

      {/* Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Result */}
      {result && (
        <>
          <h2>🌳 Hierarchies</h2>

          {result.hierarchies.map((h, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "15px",
                marginBottom: "12px",
                background: "#ffffff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
              }}
            >
              <p><strong>Root:</strong> {h.root}</p>

              {h.has_cycle ? (
                <p style={{ color: "orange" }}>⚠ Cycle detected</p>
              ) : (
                <>
                  <p><strong>Depth:</strong> {h.depth}</p>
                  <Tree data={h.tree} />
                </>
              )}
            </div>
          ))}

          <h2>📊 Summary</h2>
          <pre>{JSON.stringify(result.summary, null, 2)}</pre>

          <h2>⚠ Invalid Entries</h2>
          {result.invalid_entries.length === 0 ? (
            <p>✅ No invalid entries</p>
          ) : (
            <pre>{JSON.stringify(result.invalid_entries, null, 2)}</pre>
          )}

          <h2>🔁 Duplicate Edges</h2>
          {result.duplicate_edges.length === 0 ? (
            <p>✅ No duplicate edges</p>
          ) : (
            <pre>{JSON.stringify(result.duplicate_edges, null, 2)}</pre>
          )}
        </>
      )}
    </div>
  );
}

export default App;