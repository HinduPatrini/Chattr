/**
 * Formats a message timestamp into a human-readable string.
 * Today -> "hh:mm AM/PM"
 * Yesterday -> "Yesterday"
 * Within a week -> Weekday (e.g. "Wed")
 * Older -> "MM/DD"
 */
export const formatMessageTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 6);
  
  if (date >= startOfToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (date >= startOfYesterday) {
    return "Yesterday";
  } else if (date >= startOfWeek) {
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
};

/**
 * Formats a user's lastSeen timestamp into a dynamic relative string.
 * Just now, Xm ago, Xh ago, Yesterday, X days ago, etc.
 */
export const formatLastSeen = (lastSeenTime) => {
  if (!lastSeenTime) return "Last seen recently";
  const date = new Date(lastSeenTime);
  const now = new Date();
  const diffMs = now - date;
  
  if (diffMs < 0) return "Last seen just now";
  
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60) {
    return "Last seen just now";
  }
  
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) {
    return `Last seen ${diffMins}m ago`;
  }
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `Last seen ${diffHours}h ago`;
  }
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    return "Last seen yesterday";
  }
  
  if (diffDays < 7) {
    return `Last seen ${diffDays}d ago`;
  }
  
  return `Last seen on ${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
};
