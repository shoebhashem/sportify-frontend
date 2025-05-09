const backendUrl =
  import.meta.env.MODE === "production"
    ? "https://your-production-backend.com/api/players"
    : "http://localhost:5000/api/players";

export { backendUrl };
