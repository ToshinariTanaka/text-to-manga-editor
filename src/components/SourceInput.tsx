import type { FC } from 'react';

type Props = { sourceText: string; onChange: (v: string) => void };

export const SourceInput: FC<Props> = ({ sourceText, onChange }) => (
  <section className="card">
    <h2>1. 文章入力</h2>
    <textarea value={sourceText} onChange={(e) => onChange(e.target.value)} rows={8} className="full" />
  </section>
);
