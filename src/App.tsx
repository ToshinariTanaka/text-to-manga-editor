import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { CharacterManager } from './components/CharacterManager';
import { ExportPanel } from './components/ExportPanel';
import { MangaPreview } from './components/MangaPreview';
import { SettingsPanel } from './components/SettingsPanel';
import { SourceInput } from './components/SourceInput';
import { StoryboardEditor } from './components/StoryboardEditor';
import { TextLayerEditor } from './components/TextLayerEditor';
import { defaultCharacters } from './data/defaultCharacters';
import type { AppState, StoryboardSettings } from './types';
import { buildTextLayersFromStoryboard, generateStoryboard } from './utils/generateStoryboard';
import { loadAppState, resetAppState, saveAppState } from './utils/storage';

const defaultSettings: StoryboardSettings = { adaptationMode: '忠実に漫画化', panelCountMode: 'manual', manualPanelCount: 4, aiPanelDensity: null, stylePreset: '教材風' };
const sampleText = '朝の教室で、リーディーが今日の目標を説明した。生徒はうなずき、短い演習に取り組んだ。最後に振り返りをして終了した。';

function App() {
  const [sourceText, setSourceText] = useState(sampleText);
  const [settings, setSettings] = useState(defaultSettings);
  const [characters, setCharacters] = useState(defaultCharacters);
  const [storyboard, setStoryboard] = useState<AppState['storyboard']>(null);
  const [textLayers, setTextLayers] = useState<AppState['textLayers']>([]);
  const [showPanelNumbers, setShowPanelNumbers] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  const onGenerate = () => {
    const sb = generateStoryboard(sourceText, settings, characters);
    setStoryboard(sb);
    setTextLayers(buildTextLayersFromStoryboard(sb));
  };

  const onExport = async (withNumber: boolean) => {
    if (!previewRef.current) return;
    const old = showPanelNumbers;
    setShowPanelNumbers(withNumber);
    await new Promise((r) => setTimeout(r, 50));
    const dataUrl = await toPng(previewRef.current);
    setShowPanelNumbers(old);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `manga-${withNumber ? 'with-number' : 'final'}.png`;
    a.click();
  };

  const appState: AppState = { sourceText, settings, characters, storyboard, textLayers, showPanelNumbers };

  return <main className="app"><h1>文章→漫画エディタ (MVP)</h1><SourceInput sourceText={sourceText} onChange={setSourceText} /><SettingsPanel settings={settings} onChange={setSettings} /><CharacterManager characters={characters} onChange={setCharacters} /><section className="card"><h2>6. 漫画設計図作成</h2><button onClick={onGenerate}>漫画設計図を作成</button></section><StoryboardEditor storyboard={storyboard} onChange={setStoryboard} /><TextLayerEditor textLayers={textLayers} onChange={setTextLayers} /><MangaPreview storyboard={storyboard} textLayers={textLayers} showPanelNumbers={showPanelNumbers} previewRef={previewRef} /><ExportPanel showPanelNumbers={showPanelNumbers} setShowPanelNumbers={setShowPanelNumbers} onExport={onExport} onSave={() => saveAppState(appState)} onLoad={() => { const loaded = loadAppState(); if (loaded) { setSourceText(loaded.sourceText); setSettings(loaded.settings); setCharacters(loaded.characters); setStoryboard(loaded.storyboard); setTextLayers(loaded.textLayers); setShowPanelNumbers(loaded.showPanelNumbers); } }} onReset={() => { resetAppState(); setSourceText(sampleText); setSettings(defaultSettings); setCharacters(defaultCharacters); setStoryboard(null); setTextLayers([]); setShowPanelNumbers(true); }} /></main>;
}

export default App;
