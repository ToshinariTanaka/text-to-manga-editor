import type { FC } from 'react';
import type { Storyboard, TextLayer } from '../types';

type Props = {
  storyboard: Storyboard | null;
  textLayers: TextLayer[];
  onChange: (sb: Storyboard) => void;
  onTextLayersChange: (layers: TextLayer[]) => void;
};

const reindexPanelsAndLayers = (panels: Storyboard['panels'], layers: TextLayer[]) => {
  const panelIdMap = new Map<number, number>();
  const reindexedPanels = panels.map((panel, index) => {
    const nextPanelId = index + 1;
    panelIdMap.set(panel.panelId, nextPanelId);
    return { ...panel, panelId: nextPanelId };
  });
  const reindexedLayers = layers
    .filter((layer) => panelIdMap.has(layer.panelId))
    .map((layer) => ({ ...layer, panelId: panelIdMap.get(layer.panelId) ?? layer.panelId }));

  return { reindexedPanels, reindexedLayers };
};

export const StoryboardEditor: FC<Props> = ({ storyboard, textLayers, onChange, onTextLayersChange }) => {
  if (!storyboard) return null;

  const updatePanel = (idx: number, key: string, value: string) => {
    const next = { ...storyboard, panels: storyboard.panels.map((p, i) => (i === idx ? { ...p, [key]: value } : p)) };
    onChange(next);
  };

  const syncDialogueLayer = (panelId: number, text: string, speaker: string) => {
    onTextLayersChange(
      textLayers.map((layer) => (layer.panelId === panelId && layer.type === 'speech' ? { ...layer, text, speaker } : layer)),
    );
  };

  const syncNarrationLayer = (panelId: number, text: string) => {
    onTextLayersChange(
      textLayers.map((layer) => (layer.panelId === panelId && layer.type === 'narration' ? { ...layer, text } : layer)),
    );
  };

  return <section className="card"><h2>7. 漫画設計図編集</h2>{storyboard.panels.map((p, idx) => <div className="box" key={p.panelId}><h3>コマ {p.panelId}</h3><label>場面の要約</label><input value={p.summary} onChange={(e) => updatePanel(idx, 'summary', e.target.value)} /><label>背景</label><input value={p.background} onChange={(e) => updatePanel(idx, 'background', e.target.value)} /><label>表情</label><input value={p.expression} onChange={(e) => updatePanel(idx, 'expression', e.target.value)} /><label>動作</label><input value={p.action} onChange={(e) => updatePanel(idx, 'action', e.target.value)} /><label>セリフ</label><textarea value={p.dialogues[0]?.text ?? ''} onChange={(e) => {
    const text = e.target.value;
    const next = { ...storyboard, panels: storyboard.panels.map((panel, i) => i === idx ? { ...panel, dialogues: [{ speaker: panel.dialogues[0]?.speaker ?? '', text }] } : panel) };
    onChange(next);
    syncDialogueLayer(p.panelId, text, p.dialogues[0]?.speaker ?? '');
  }} /><label>ナレーション</label><textarea value={p.narration} onChange={(e) => {
    updatePanel(idx, 'narration', e.target.value);
    syncNarrationLayer(p.panelId, e.target.value);
  }} /><label>画像生成指示 imagePrompt</label><textarea value={p.imagePrompt} onChange={(e) => updatePanel(idx, 'imagePrompt', e.target.value)} /><div><button onClick={() => {
    const remaining = storyboard.panels.filter((_, i) => i !== idx);
    const filteredLayers = textLayers.filter((layer) => layer.panelId !== p.panelId);
    const { reindexedPanels, reindexedLayers } = reindexPanelsAndLayers(remaining, filteredLayers);
    onChange({ ...storyboard, panels: reindexedPanels });
    onTextLayersChange(reindexedLayers);
  }}>削除</button>{idx > 0 && <button onClick={() => {
    const arr = [...storyboard.panels];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    const { reindexedPanels, reindexedLayers } = reindexPanelsAndLayers(arr, textLayers);
    onChange({ ...storyboard, panels: reindexedPanels });
    onTextLayersChange(reindexedLayers);
  }}>↑</button>}{idx < storyboard.panels.length - 1 && <button onClick={() => {
    const arr = [...storyboard.panels];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    const { reindexedPanels, reindexedLayers } = reindexPanelsAndLayers(arr, textLayers);
    onChange({ ...storyboard, panels: reindexedPanels });
    onTextLayersChange(reindexedLayers);
  }}>↓</button>}</div></div>)}<button onClick={() => {
    const nextPanelId = storyboard.panels.length + 1;
    const newPanel = { panelId: nextPanelId, summary: '新しいコマ', characters: [], background: '', expression: '', action: '', dialogues: [{ speaker: '', text: '' }], narration: '', imagePrompt: '' };
    onChange({ ...storyboard, panels: [...storyboard.panels, newPanel] });
    onTextLayersChange([
      ...textLayers,
      { id: `${nextPanelId}-speech-0`, panelId: nextPanelId, type: 'speech', speaker: '', text: '', x: 8, y: 20, width: 80, fontSize: 16, writingMode: 'horizontal', bold: false },
      { id: `${nextPanelId}-narration-0`, panelId: nextPanelId, type: 'narration', speaker: '', text: '', x: 8, y: 70, width: 84, fontSize: 14, writingMode: 'horizontal', bold: false },
    ]);
  }}>コマ追加</button></section>;
};
