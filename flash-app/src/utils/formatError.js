export default function formatError(error) {
  if (!error) {
    return "";
  }
  if (typeof error === "string") {
    return error;
  }
  if (typeof error.error === "string") {
    return error.error;
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
          return `${key}: ${value}`;
        }
        return `${key}: ${JSON.stringify(value)}`;
      })
      .join(" | ");
  }
  return String(error);
}
