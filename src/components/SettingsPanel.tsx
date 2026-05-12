import type { FC } from 'react';
import type { AIPanelDensity, StoryboardSettings } from '../types';

type Props = { settings: StoryboardSettings; onChange: (s: StoryboardSettings) => void };
const adaptationModes = ['忠実に漫画化', '少し整理して漫画化', '要点をまとめて漫画化', '1行1コマ形式にする'] as const;
const stylePresets = ['かわいい', 'ややコミカル', 'まじめ', '教材風', '少年漫画風', 'ほのぼの', 'シンプル線画', 'お任せ'] as const;
const densities: AIPanelDensity[] = ['短め', '標準', '丁寧', '1行1コマ寄り'];

export const SettingsPanel: FC<Props> = ({ settings, onChange }) => (
  <section className="card">
    <h2>2-4. 漫画化設定</h2>
    <label>漫画化モード</label>
    <select value={settings.adaptationMode} onChange={(e) => onChange({ ...settings, adaptationMode: e.target.value as StoryboardSettings['adaptationMode'] })}>{adaptationModes.map((m) => <option key={m}>{m}</option>)}</select>
    <label>コマ数</label>
    <div>
      <label><input type="radio" checked={settings.panelCountMode === 'manual'} onChange={() => onChange({ ...settings, panelCountMode: 'manual' })} />ユーザーが指定する</label>
      <label><input type="radio" checked={settings.panelCountMode === 'auto'} onChange={() => onChange({ ...settings, panelCountMode: 'auto' })} />AIにお任せする</label>
    </div>
    {settings.panelCountMode === 'manual' ? <input type="number" min={1} max={20} value={settings.manualPanelCount ?? 4} onChange={(e) => onChange({ ...settings, manualPanelCount: Number(e.target.value), aiPanelDensity: null })} /> : <select value={settings.aiPanelDensity ?? '標準'} onChange={(e) => onChange({ ...settings, aiPanelDensity: e.target.value as AIPanelDensity, manualPanelCount: null })}>{densities.map((d) => <option key={d}>{d}</option>)}</select>}
    <label>絵柄プリセット</label>
    <select value={settings.stylePreset} onChange={(e) => onChange({ ...settings, stylePreset: e.target.value as StoryboardSettings['stylePreset'] })}>{stylePresets.map((s) => <option key={s}>{s}</option>)}</select>
  </section>
);
