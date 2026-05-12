export type AdaptationMode =
  | '忠実に漫画化'
  | '少し整理して漫画化'
  | '要点をまとめて漫画化'
  | '1行1コマ形式にする';

export type PanelCountMode = 'manual' | 'auto';
export type AIPanelDensity = '短め' | '標準' | '丁寧' | '1行1コマ寄り';
export type StylePreset =
  | 'かわいい'
  | 'ややコミカル'
  | 'まじめ'
  | '教材風'
  | '少年漫画風'
  | 'ほのぼの'
  | 'シンプル線画'
  | 'お任せ';

export type StoryboardSettings = {
  adaptationMode: AdaptationMode;
  panelCountMode: PanelCountMode;
  manualPanelCount: number | null;
  aiPanelDensity: AIPanelDensity | null;
  stylePreset: StylePreset;
};

export type Character = {
  id: string;
  defaultName: string;
  displayName: string;
  role: string;
  personality: string;
  usage: string;
  speakingStyle: string;
  appearanceNotes?: string;
  referenceImages?: string[];
  isPreloaded: boolean;
  isNameEditable: boolean;
  useInManga: boolean;
};

export type Dialogue = { speaker: string; text: string };

export type StoryboardPanel = {
  panelId: number;
  summary: string;
  characters: string[];
  background: string;
  expression: string;
  action: string;
  dialogues: Dialogue[];
  narration: string;
  imagePrompt: string;
};

export type Storyboard = {
  title: string;
  sourceText: string;
  settings: StoryboardSettings;
  panels: StoryboardPanel[];
};

export type TextLayer = {
  id: string;
  panelId: number;
  type: 'speech' | 'narration' | 'sound' | 'title';
  speaker: string;
  text: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
  writingMode: 'horizontal' | 'vertical';
  bold: boolean;
};

export type AppState = {
  sourceText: string;
  settings: StoryboardSettings;
  characters: Character[];
  storyboard: Storyboard | null;
  textLayers: TextLayer[];
  showPanelNumbers: boolean;
};
