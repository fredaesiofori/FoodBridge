export function formatTimeLeft(isoString: string): { text: string; isUrgent: boolean; isExpired: boolean } {
  const diffMs = new Date(isoString).getTime() - new Date().getTime();
  if (diffMs <= 0) {
    return { text: 'Expired', isUrgent: false, isExpired: true };
  }

  const diffMins = Math.round(diffMs / (60 * 1000));
  if (diffMins < 60) {
    return { text: `${diffMins} mins`, isUrgent: true, isExpired: false };
  }

  const diffHours = (diffMins / 60).toFixed(1);
  const isUrgent = diffMins <= 120; // within 2 hours
  return {
    text: `${diffHours.replace('.0', '')} hours`,
    isUrgent,
    isExpired: false,
  };
}

export function formatTimeAgo(isoString: string): string {
  const diffMs = new Date().getTime() - new Date(isoString).getTime();
  const diffMins = Math.round(diffMs / (60 * 1000));
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const hours = Math.floor(diffMins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
