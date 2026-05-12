import type { FC } from 'react';
import type { TextLayer } from '../types';

type Props = { textLayers: TextLayer[]; onChange: (t: TextLayer[]) => void };

export const TextLayerEditor: FC<Props> = ({ textLayers, onChange }) => (
  <section className="card"><h2>9. 文字レイヤー編集</h2>{textLayers.map((l, idx) => <div key={l.id} className="box"><p>{l.panelId} / {l.type}</p><textarea value={l.text} onChange={(e) => onChange(textLayers.map((x, i) => i === idx ? { ...x, text: e.target.value } : x))} /><div className="row"><input type="number" value={l.fontSize} onChange={(e) => onChange(textLayers.map((x, i) => i === idx ? { ...x, fontSize: Number(e.target.value) } : x))} /><input type="number" value={l.x} onChange={(e) => onChange(textLayers.map((x, i) => i === idx ? { ...x, x: Number(e.target.value) } : x))} /><input type="number" value={l.y} onChange={(e) => onChange(textLayers.map((x, i) => i === idx ? { ...x, y: Number(e.target.value) } : x))} /><input type="number" value={l.width} onChange={(e) => onChange(textLayers.map((x, i) => i === idx ? { ...x, width: Number(e.target.value) } : x))} /></div><label><input type="checkbox" checked={l.bold} onChange={(e) => onChange(textLayers.map((x, i) => i === idx ? { ...x, bold: e.target.checked } : x))} />太字</label><select value={l.writingMode} onChange={(e) => onChange(textLayers.map((x, i) => i === idx ? { ...x, writingMode: e.target.value as TextLayer['writingMode'] } : x))}><option value="horizontal">横書き</option><option value="vertical">縦書き</option></select></div>)}</section>
);
