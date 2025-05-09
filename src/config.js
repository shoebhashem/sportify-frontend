const backendUrl =
  import.meta.env.MODE === "production"
    ? "https://ec2.publicvm.com/api/players"
    : "http://localhost:5000/api/players";

export { backendUrl };
