import type { FC } from 'react';

type Props = { showPanelNumbers: boolean; setShowPanelNumbers: (v: boolean) => void; onExport: (withNumber: boolean) => Promise<void>; onSave: () => void; onLoad: () => void; onReset: () => void };

export const ExportPanel: FC<Props> = ({ showPanelNumbers, setShowPanelNumbers, onExport, onSave, onLoad, onReset }) => (
  <section className="card"><h2>10-12. 表示切替・出力・保存</h2><label><input type="checkbox" checked={showPanelNumbers} onChange={(e) => setShowPanelNumbers(e.target.checked)} />コマ番号を表示する</label><div className="row"><button onClick={() => void onExport(true)}>コマ番号ありPNGを書き出す</button><button onClick={() => void onExport(false)}>コマ番号なしPNGを書き出す</button></div><div className="row"><button onClick={onSave}>保存</button><button onClick={onLoad}>読み込み</button><button onClick={onReset}>初期化</button></div></section>
);
