import type { Character, Storyboard, StoryboardPanel, StoryboardSettings, TextLayer } from '../types';

const splitLines = (text: string): string[] =>
  text
    .split(/\n|。|！|\?|？/g)
    .map((line) => line.trim())
    .filter(Boolean);

const estimatePanels = (settings: StoryboardSettings, lineCount: number): number => {
  if (settings.panelCountMode === 'manual' && settings.manualPanelCount) return settings.manualPanelCount;

  const base = Math.max(2, Math.min(12, Math.ceil(lineCount / 2)));
  const densityMap: Record<string, number> = { 短め: -1, 標準: 0, 丁寧: 2, '1行1コマ寄り': lineCount - base };
  return Math.max(2, Math.min(12, base + (densityMap[settings.aiPanelDensity ?? '標準'] ?? 0)));
};

export const generateStoryboard = (
  sourceText: string,
  settings: StoryboardSettings,
  characters: Character[],
): Storyboard => {
  const lines = splitLines(sourceText);
  const panelCount = estimatePanels(settings, lines.length);
  const activeCharacters = characters.filter((character) => character.useInManga);
  const lead = activeCharacters[0]?.displayName ?? '案内役';

  const buildCharacterReferencePrompt = (characterNames: string[]) => {
    const referenceNotes = characterNames
      .map((characterName) => activeCharacters.find((character) => character.displayName === characterName))
      .filter((character): character is Character => Boolean(character))
      .map((character) => {
        const referenceCount = character.referenceImages?.length ?? 0;
        if (referenceCount === 0) return null;
        return `${character.displayName}は登録済み参照画像（${referenceCount}枚）に合わせる`;
      })
      .filter((note): note is string => Boolean(note));

    return referenceNotes.length > 0 ? ` キャラ参照: ${referenceNotes.join('、')}。` : '';
  };

  const panels: StoryboardPanel[] = Array.from({ length: panelCount }, (_, index) => {
    const seed = lines[index % Math.max(1, lines.length)] ?? `場面 ${index + 1}`;
    return {
      panelId: index + 1,
      summary: `${seed} を中心に説明する`,
      characters: [lead],
      background: '教室・ホワイトボード前',
      expression: '落ち着いた笑顔',
      action: 'ポイントを指し示す',
      dialogues: [{ speaker: lead, text: `${seed} について見ていきましょう。` }],
      narration: `コマ${index + 1}: ${seed}`,
      imagePrompt: `${settings.stylePreset}の漫画。${seed}を説明する${lead}。${buildCharacterReferencePrompt([lead])}`,
    };
  });

  return {
    title: '自動生成ストーリーボード',
    sourceText,
    settings,
    panels,
  };
};

export const buildTextLayersFromStoryboard = (storyboard: Storyboard): TextLayer[] => {
  const layers: TextLayer[] = [];

  storyboard.panels.forEach((panel) => {
    panel.dialogues.forEach((dialogue, idx) => {
      layers.push({
        id: `${panel.panelId}-speech-${idx}`,
        panelId: panel.panelId,
        type: 'speech',
        speaker: dialogue.speaker,
        text: dialogue.text,
        x: 8,
        y: 20 + idx * 18,
        width: 80,
        fontSize: 16,
        writingMode: 'horizontal',
        bold: false,
      });
    });

    layers.push({
      id: `${panel.panelId}-narration-0`,
      panelId: panel.panelId,
      type: 'narration',
      speaker: '',
      text: panel.narration,
      x: 8,
      y: 70,
      width: 84,
      fontSize: 14,
      writingMode: 'horizontal',
      bold: false,
    });
  });

  return layers;
};
