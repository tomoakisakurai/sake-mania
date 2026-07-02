import clsx from 'clsx';
import type { PostVM } from '@/types';
import { Button } from '@/components/shared/Button';
// 投稿詳細の左カラム: 写真 + アクション(図鑑/記録/公開トグル)
export function MediaColumn({ post }: { post: PostVM }) {
  return (
    <aside className="flex flex-col gap-3">
      {post.hasPhoto && (<img src={post.photo} className="block h-85 w-full rounded-[10px] border border-line object-cover" alt="" />)}
      {post.noPhoto && (
        <figure className="m-0 flex h-85 items-center justify-center rounded-[10px] border border-line" style={{ background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)' }}>
          <figcaption className="font-mono text-[10px] text-muted [writing-mode:vertical-rl]">ラベル・ボトル写真</figcaption>
        </figure>
      )}
      <Button variant="secondary" size="md" onClick={post.brandClick} fullWidth>図鑑でこの銘柄を見る</Button>
      <Button variant="primary" size="md" onClick={post.recordClick} fullWidth>わたしも記録する</Button>
      {post.canPublish && (
        <button
          type="button"
          onClick={post.publishToggle}
          className={clsx(
            'cursor-pointer rounded-full border-[1.5px] px-6 py-2.5 text-center text-[13px] font-bold',
            post.isPublic ? 'border-accent bg-accent-tint text-accent-dark' : 'border-line bg-surface text-body',
          )}
        >{post.publishLabel}</button>
      )}
      {post.canDelete && (
        <Button variant="danger" size="md" onClick={post.deleteClick} fullWidth>この記録を削除する</Button>
      )}
    </aside>
  );
}
