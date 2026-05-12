import type { FC } from 'react';
import type { Storyboard } from '../types';

type Props = { storyboard: Storyboard | null; onChange: (sb: Storyboard) => void };

export const StoryboardEditor: FC<Props> = ({ storyboard, onChange }) => {
  if (!storyboard) return null;

  const updatePanel = (idx: number, key: string, value: string) => {
    const next = { ...storyboard, panels: storyboard.panels.map((p, i) => i === idx ? { ...p, [key]: value } : p) };
    onChange(next);
  };

  return <section className="card"><h2>7. 漫画設計図編集</h2>{storyboard.panels.map((p, idx) => <div className="box" key={p.panelId}><h3>コマ {p.panelId}</h3><input value={p.summary} onChange={(e) => updatePanel(idx, 'summary', e.target.value)} /><input value={p.background} onChange={(e) => updatePanel(idx, 'background', e.target.value)} /><input value={p.expression} onChange={(e) => updatePanel(idx, 'expression', e.target.value)} /><input value={p.action} onChange={(e) => updatePanel(idx, 'action', e.target.value)} /><textarea value={p.dialogues[0]?.text ?? ''} onChange={(e) => onChange({ ...storyboard, panels: storyboard.panels.map((panel, i) => i === idx ? { ...panel, dialogues: [{ speaker: panel.dialogues[0]?.speaker ?? '', text: e.target.value }] } : panel) })} /><textarea value={p.narration} onChange={(e) => updatePanel(idx, 'narration', e.target.value)} /><textarea value={p.imagePrompt} onChange={(e) => updatePanel(idx, 'imagePrompt', e.target.value)} /><div><button onClick={() => onChange({ ...storyboard, panels: storyboard.panels.filter((_, i) => i !== idx).map((panel, i) => ({ ...panel, panelId: i + 1 })) })}>削除</button>{idx > 0 && <button onClick={() => { const arr = [...storyboard.panels]; [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]; onChange({ ...storyboard, panels: arr.map((x, i) => ({ ...x, panelId: i + 1 })) }); }}>↑</button>}{idx < storyboard.panels.length - 1 && <button onClick={() => { const arr = [...storyboard.panels]; [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]; onChange({ ...storyboard, panels: arr.map((x, i) => ({ ...x, panelId: i + 1 })) }); }}>↓</button>}</div></div>)}<button onClick={() => onChange({ ...storyboard, panels: [...storyboard.panels, { panelId: storyboard.panels.length + 1, summary: '新しいコマ', characters: [], background: '', expression: '', action: '', dialogues: [{ speaker: '', text: '' }], narration: '', imagePrompt: '' }] })}>コマ追加</button></section>;
};
