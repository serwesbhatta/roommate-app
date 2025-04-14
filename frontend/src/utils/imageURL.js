// utils/imageURL.js
export const getImageUrl = (url) => {
  if (!url) return "/default-avatar.png";
  if (url.startsWith("blob:")) return url;
  if (url.startsWith("http") || url.startsWith("/")) return url;
  // Otherwise, assume it's a relative path; prepend your backend host.
  return `http://localhost:8000/${url}`;
};
