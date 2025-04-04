export function formatViewCount(count: number): string {
  if (!count) return '0';
  
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
} 