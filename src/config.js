// Configuration for Sportify Frontend
// Updated to use AWS Lambda API Gateway instead of EC2

const LAMBDA_API_URL = "https://welv4ub46l.execute-api.eu-north-1.amazonaws.com/prod/api/players";
// const EC2_API_URL = "https://ec2.publicvm.com/api/players"; // Commented out - keeping for future reference

const backendUrl =
  import.meta.env.MODE === "production"
    ? LAMBDA_API_URL
    : "http://localhost:5000/api/players";

// Base URL without the /api/players suffix — use for non-player routes
const baseUrl =
  import.meta.env.MODE === "production"
    ? "https://welv4ub46l.execute-api.eu-north-1.amazonaws.com/prod"
    : "http://localhost:5000";

export { backendUrl, baseUrl };
