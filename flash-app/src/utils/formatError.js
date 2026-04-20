function sanitizeApiMessage(text) {
  if (typeof text !== "string") {
    return text;
  }
  const t = text.trim();
  if (t.startsWith("<!") || t.toLowerCase().includes("<html")) {
    return "Server returned an error page (often 404). If you use a shared API, deploy the latest backend so this feature exists.";
  }
  return text;
}

export default function formatError(error) {
  if (!error) {
    return "";
  }
  if (typeof error === "string") {
    return sanitizeApiMessage(error);
  }
  if (typeof error.error === "string") {
    return sanitizeApiMessage(error.error);
  }
  if (Array.isArray(error)) {
    return error.join(", ");
  }
  if (typeof error === "object") {
    return Object.entries(error)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: ${value.join(", ")}`;
        }
        if (typeof value === "string") {
          return `${key}: ${sanitizeApiMessage(value)}`;
        }
        return `${key}: ${JSON.stringify(value)}`;
      })
      .join(" | ");
  }
  return String(error);
}
