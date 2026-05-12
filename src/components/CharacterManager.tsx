import type { FC } from 'react';
import type { Character } from '../types';

type Props = { characters: Character[]; onChange: (c: Character[]) => void };

export const CharacterManager: FC<Props> = ({ characters, onChange }) => (
  <section className="card">
    <h2>5. レギュラーキャラ管理</h2>
    {characters.map((ch, index) => (
      <div key={ch.id} className="box">
        <strong>ID: {ch.id}</strong>
        <label>この漫画で使用する <input type="checkbox" checked={ch.useInManga} onChange={(e) => onChange(characters.map((c, i) => i === index ? { ...c, useInManga: e.target.checked } : c))} /></label>
        <label>表示名</label>
        <input value={ch.displayName} disabled={!ch.isNameEditable} onChange={(e) => onChange(characters.map((c, i) => i === index ? { ...c, displayName: e.target.value } : c))} />
        <label>role</label>
        <input value={ch.role} onChange={(e) => onChange(characters.map((c, i) => i === index ? { ...c, role: e.target.value } : c))} />
        <label>personality</label>
        <input value={ch.personality} onChange={(e) => onChange(characters.map((c, i) => i === index ? { ...c, personality: e.target.value } : c))} />
        <label>usage</label>
        <input value={ch.usage} onChange={(e) => onChange(characters.map((c, i) => i === index ? { ...c, usage: e.target.value } : c))} />
        <label>speakingStyle</label>
        <input value={ch.speakingStyle} onChange={(e) => onChange(characters.map((c, i) => i === index ? { ...c, speakingStyle: e.target.value } : c))} />
      </div>
    ))}
    <button onClick={() => {
      const ts = Date.now();
      const newCharacter: Character = {
        id: `character_${ts}`,
        defaultName: '新規キャラ',
        displayName: '新規キャラ',
        role: '',
        personality: '',
        usage: '',
        speakingStyle: '',
        isPreloaded: false,
        isNameEditable: true,
        useInManga: true,
      };
      onChange([...characters, newCharacter]);
    }}>キャラ追加</button>
  </section>
);
