import type { CSSProperties } from 'react';

type TypedProps = {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
};

export default function Typed({ text, speed = 45, delay = 200, className }: TypedProps) {
  const style: CSSProperties = {
    ['--len' as string]: text.length,
    ['--type-speed' as string]: `${speed}ms`,
    ['--type-delay' as string]: `${delay}ms`,
  };
  return (
    <span className={`typed${className ? ' ' + className : ''}`} style={style} aria-label={text}>
      {text}
    </span>
  );
}
