import type { FC } from 'react';
import type { Character, Storyboard, TextLayer } from '../types';

type Props = {
  storyboard: Storyboard | null;
  characters: Character[];
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

export const StoryboardEditor: FC<Props> = ({ storyboard, characters, textLayers, onChange, onTextLayersChange }) => {
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

  const updatePanelCharacters = (idx: number, rawValue: string) => {
    const names = rawValue
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean);
    const next = { ...storyboard, panels: storyboard.panels.map((p, i) => (i === idx ? { ...p, characters: names } : p)) };
    onChange(next);
  };

  const buildReferenceSuffix = (panelCharacters: string[]) => {
    const notes = panelCharacters
      .map((characterName) => characters.find((character) => character.displayName === characterName))
      .filter((character): character is Character => Boolean(character))
      .map((character) => {
        const count = character.referenceImages?.length ?? 0;
        return count > 0 ? `${character.displayName}は登録済み参照画像（${count}枚）に合わせる` : null;
      })
      .filter((note): note is string => Boolean(note));
    return notes.length > 0 ? ` キャラ参照: ${notes.join('、')}。` : '';
  };

  const updateImagePromptWithReference = (idx: number, imagePrompt: string, panelCharacters: string[]) => {
    const cleanedPrompt = imagePrompt.replace(/\s*キャラ参照:.+?。\s*$/u, '').trim();
    const suffix = buildReferenceSuffix(panelCharacters);
    updatePanel(idx, 'imagePrompt', `${cleanedPrompt}${suffix}`.trim());
  };

  return <section className="card"><h2>7. 漫画設計図編集</h2>{storyboard.panels.map((p, idx) => <div className="box" key={p.panelId}><h3>コマ {p.panelId}</h3><label>場面の要約</label><input value={p.summary} onChange={(e) => updatePanel(idx, 'summary', e.target.value)} /><label>背景</label><input value={p.background} onChange={(e) => updatePanel(idx, 'background', e.target.value)} /><label>表情</label><input value={p.expression} onChange={(e) => updatePanel(idx, 'expression', e.target.value)} /><label>動作</label><input value={p.action} onChange={(e) => updatePanel(idx, 'action', e.target.value)} /><label>セリフ</label><textarea value={p.dialogues[0]?.text ?? ''} onChange={(e) => {
    const text = e.target.value;
    const next = { ...storyboard, panels: storyboard.panels.map((panel, i) => i === idx ? { ...panel, dialogues: [{ speaker: panel.dialogues[0]?.speaker ?? '', text }] } : panel) };
    onChange(next);
    syncDialogueLayer(p.panelId, text, p.dialogues[0]?.speaker ?? '');
  }} /><label>使用キャラ（カンマ区切り）</label><input value={p.characters.join(', ')} onChange={(e) => {
    const nextCharacters = e.target.value
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean);
    updatePanelCharacters(idx, e.target.value);
    updateImagePromptWithReference(idx, p.imagePrompt, nextCharacters);
  }} /><div className="panel-character-thumbnails">{p.characters.map((name) => {
    const character = characters.find((item) => item.displayName === name);
    const thumbnail = character?.referenceImages?.[0];
    if (!character || !thumbnail) return null;
    return <div key={`${p.panelId}-${character.id}`} className="panel-character-thumbnail-item"><img src={thumbnail} alt={`${name} の参照画像`} /><span>{name}</span></div>;
  })}</div><label>ナレーション</label><textarea value={p.narration} onChange={(e) => {
    updatePanel(idx, 'narration', e.target.value);
    syncNarrationLayer(p.panelId, e.target.value);
  }} /><label>画像生成指示 imagePrompt</label><textarea value={p.imagePrompt} onChange={(e) => updateImagePromptWithReference(idx, e.target.value, p.characters)} /><div><button onClick={() => {
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
