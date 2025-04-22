// utils/formatters.js
export const toJSDate = (timestamp) => {
  if (!timestamp) return null;
  
  try {
    // Handle different timestamp formats
    const date = new Date(timestamp);
    
    // Check if date is valid
    return isNaN(date.getTime()) ? null : date;
  } catch (e) {
    console.error("Error parsing date:", e);
    return null;
  }
};

export const formatLastSeen = (timestamp) => {
  if (!timestamp) return "Offline";
  
  try {
    const date = toJSDate(timestamp);
    if (!date) return "Offline";
    
    const now = new Date();
    const diff = now - date;
    
    // Less than a minute
    if (diff < 60000) return "Just now";
    
    // Less than an hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `Last seen ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    // Less than a day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `Last seen ${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    // Format date
    return `Last seen ${date.toLocaleDateString()}`;
  } catch (e) {
    console.error("Error formatting last seen:", e);
    return "Offline";
  }
};