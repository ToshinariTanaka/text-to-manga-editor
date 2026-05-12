import type { ChangeEvent, FC } from 'react';
import type { Character } from '../types';

type Props = { characters: Character[]; onChange: (c: Character[]) => void };

export const CharacterManager: FC<Props> = ({ characters, onChange }) => {
  const updateCharacter = (index: number, updates: Partial<Character>) => {
    onChange(characters.map((character, i) => (i === index ? { ...character, ...updates } : character)));
  };

  const handleReferenceUpload = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const readers = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        }),
    );

    Promise.all(readers)
      .then((dataUrls) => {
        const current = characters[index].referenceImages ?? [];
        updateCharacter(index, { referenceImages: [...current, ...dataUrls.filter(Boolean)] });
      })
      .catch(() => {
        // MVP: 読み込み失敗時は何もしない
      })
      .finally(() => {
        event.target.value = '';
      });
  };

  return (
    <section className="card">
      <h2>5. レギュラーキャラ管理</h2>
      <div className="character-list">
        {characters.map((ch, index) => (
          <article key={ch.id} className="character-card">
            <strong>ID: {ch.id}</strong>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={ch.useInManga}
                onChange={(e) => updateCharacter(index, { useInManga: e.target.checked })}
              />
              この漫画で使用する
            </label>

            <label>表示名</label>
            <input
              value={ch.displayName}
              disabled={!ch.isNameEditable}
              onChange={(e) => updateCharacter(index, { displayName: e.target.value })}
            />

            <label>role</label>
            <input value={ch.role} onChange={(e) => updateCharacter(index, { role: e.target.value })} />

            <label>personality</label>
            <input value={ch.personality} onChange={(e) => updateCharacter(index, { personality: e.target.value })} />

            <label>usage</label>
            <input value={ch.usage} onChange={(e) => updateCharacter(index, { usage: e.target.value })} />

            <label>speakingStyle</label>
            <input
              value={ch.speakingStyle}
              onChange={(e) => updateCharacter(index, { speakingStyle: e.target.value })}
            />

            <label>見た目メモ</label>
            <textarea
              className="full"
              rows={3}
              value={ch.appearanceNotes ?? ''}
              onChange={(e) => updateCharacter(index, { appearanceNotes: e.target.value })}
            />

            <label>参照画像</label>
            <input type="file" accept="image/*" multiple onChange={(e) => handleReferenceUpload(index, e)} />
            <div className="reference-images">
              {(ch.referenceImages ?? []).map((image, imageIndex) => (
                <div key={`${ch.id}-ref-${imageIndex}`} className="reference-image-item">
                  <img src={image} alt={`${ch.displayName} の参照画像 ${imageIndex + 1}`} />
                  <button
                    type="button"
                    onClick={() =>
                      updateCharacter(index, {
                        referenceImages: (ch.referenceImages ?? []).filter((_, i) => i !== imageIndex),
                      })
                    }
                  >
                    画像削除
                  </button>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <button
        onClick={() => {
          const ts = Date.now();
          const newCharacter: Character = {
            id: `character_${ts}`,
            defaultName: '新規キャラ',
            displayName: '新規キャラ',
            role: '',
            personality: '',
            usage: '',
            speakingStyle: '',
            appearanceNotes: '',
            referenceImages: [],
            isPreloaded: false,
            isNameEditable: true,
            useInManga: true,
          };
          onChange([...characters, newCharacter]);
        }}
      >
        キャラ追加
      </button>
    </section>
  );
};
