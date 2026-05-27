const entries = [
  'commit pushed [main]',
  'deploy ok · 12.4s',
  'flutter build ipa',
  'firebase rules updated',
  'merged PR #142',
  'lint clean · 0 warnings',
  'coffee.refill()',
  'tests passing · 247/247',
  'reading: designing data-intensive applications',
  'now playing: lofi · ch1',
  'pushed feat/og-image',
  'standup @ 09:30',
];

export default function TerminalLog() {
  const loop = [...entries, ...entries];
  return (
    <div className="terminal-log" aria-hidden="true">
      <div className="terminal-log-track">
        {loop.map((e, i) => (
          <span key={i} className="terminal-log-item">
            <span className="terminal-log-prompt">log&gt;</span> {e}
          </span>
        ))}
      </div>
    </div>
  );
}
