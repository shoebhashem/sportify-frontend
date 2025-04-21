import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function App() {
  return <h2 className="text-xl text-green-500">React + Tailwind is working!</h2>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
