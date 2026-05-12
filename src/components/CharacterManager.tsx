import type { FC } from 'react';
import type { Character } from '../types';

type Props = { characters: Character[]; onChange: (c: Character[]) => void };

export const CharacterManager: FC<Props> = ({ characters, onChange }) => (
  <section className="card">
    <h2>5. レギュラーキャラ管理</h2>
    {characters.map((ch, index) => (
      <div key={ch.id} className="box">
        <strong>ID: {ch.id}</strong>
        <label>表示名</label>
        <input value={ch.displayName} disabled={!ch.isNameEditable} onChange={(e) => onChange(characters.map((c, i) => i === index ? { ...c, displayName: e.target.value } : c))} />
        <p>{ch.role} / {ch.personality}</p>
      </div>
    ))}
  </section>
);
