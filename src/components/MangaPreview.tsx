import type { FC, RefObject } from 'react';
import type { Storyboard, TextLayer } from '../types';

type Props = { storyboard: Storyboard | null; textLayers: TextLayer[]; showPanelNumbers: boolean; previewRef: RefObject<HTMLDivElement> };

export const MangaPreview: FC<Props> = ({ storyboard, textLayers, showPanelNumbers, previewRef }) => {
  if (!storyboard) return null;
  const isOnePerLine = storyboard.settings.adaptationMode === '1行1コマ形式にする';
  const cols = isOnePerLine ? 1 : Math.ceil(storyboard.panels.length / 2);

  return <section className="card"><h2>8. 漫画プレビュー</h2><div ref={previewRef} className="grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(220px, 1fr))` }}>{storyboard.panels.map((panel) => <article key={panel.panelId} className="panel">{showPanelNumbers && <div className="num">#{panel.panelId}</div>}<p><b>{panel.summary}</b></p>{textLayers.filter((l) => l.panelId === panel.panelId).map((layer) => <div key={layer.id} style={{ left: `${layer.x}%`, top: `${layer.y}%`, width: `${layer.width}%`, fontSize: `${layer.fontSize}px`, fontWeight: layer.bold ? 700 : 400, writingMode: layer.writingMode === 'vertical' ? 'vertical-rl' : 'horizontal-tb' }} className="layer">{layer.speaker ? `${layer.speaker}: ` : ''}{layer.text}</div>)}</article>)}</div></section>;
};
