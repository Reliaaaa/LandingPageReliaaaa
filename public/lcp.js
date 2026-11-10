if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes?.includes('largest-contentful-paint')) {
  let latestLcp;
  const observer = new PerformanceObserver(list => {
    const entries = list.getEntries();
    if (entries.length) {
      latestLcp = entries[entries.length - 1];
      console.info('[LCP] candidate:', Math.round(latestLcp.startTime), 'ms', latestLcp.element);
    }
  });
  observer.observe({ type: 'largest-contentful-paint', buffered: true });
  const finish = () => {
    if (document.visibilityState !== 'hidden') return;
    const remaining = observer.takeRecords();
    if (remaining.length) latestLcp = remaining[remaining.length - 1];
    if (latestLcp) console.info('[LCP] last candidate:', Math.round(latestLcp.startTime), 'ms');
    observer.disconnect();
    document.removeEventListener('visibilitychange', finish);
  };
  document.addEventListener('visibilitychange', finish);
}
