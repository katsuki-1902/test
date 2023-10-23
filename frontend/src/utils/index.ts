import https from "https";

const agent = new https.Agent({
  rejectUnauthorized: false, // Set to false to bypass SSL certificate validation
});

export const requestOptions = {
  method: "GET", // or 'POST', 'PUT', etc.
  agent: agent, // Use the custom agent to bypass certificate validation
};
