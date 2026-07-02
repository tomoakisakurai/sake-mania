# SAKE MANIA (酒マニア)

社内日本酒部の活動アプリ。Next.js 15 (App Router) + React 19 + TypeScript + Zustand + Drizzle ORM + Supabase (Postgres / Auth)。

## コマンド

```bash
yarn dev          # 開発サーバー (port 5174)
yarn build        # 本番ビルド
yarn tsc --noEmit # 型チェック
yarn test         # ユニットテスト (Vitest, src/**/*.test.ts)
yarn e2e          # E2Eテスト (Playwright, e2e/*.spec.ts)
yarn db:push      # スキーマをDBへ反映 (drizzle-kit)
yarn db:seed      # data.ts のシードデータをDBへ投入
```

## ⚠️ server action の認可原則(最重要)

**Drizzle (`getDb()`) は `DATABASE_URL` でDBに直接続するため、RLS を素通しする。**
RLS(`src/db/setup-rls.ts`)が効くのはブラウザから anon key の Supabase クライアントで叩くパスだけ。server action の認可は RLS に守られない。

したがって、**書き込み系の server action は必ず自前で認可すること**:

1. **認証**: `getSupabaseServer()` → `auth.getUser()` でログインユーザーを取得。null なら失敗を返す
2. **所有権**: UPDATE / DELETE は WHERE 句に本人条件を含める

```ts
// 良い例 (meetups.ts の deleteMeetup)
const deleted = await db.delete(schema.meetupEvents)
  .where(and(eq(schema.meetupEvents.id, meetupId), eq(schema.meetupEvents.hostId, user.id)))
  .returning({ id: schema.meetupEvents.id });
return deleted.length > 0;
```

「先にSELECTで所有者確認してからDELETE」はレース条件があるため、WHERE に含める方式を使う。
新しい action を追加・レビューするときは、この2点を必ず確認する。

## アーキテクチャ

- **URLが画面状態の唯一の真実**: `src/lib/routes.ts` が URL↔screen をマッピング(`routeStateFromPath` / `paths`)。画面遷移は `store.nav(screen)` か `router.push(paths.xxx())`
- **`src/useVals.ts`**: プロトタイプ移植由来の巨大ビューモデル。**新規追加は禁止**。新しい画面は「画面ごとに server action + ローカルstate」のパターンで書く(`src/screens/Events/` や `src/screens/Member/` が参考)。既存画面も触るついでに useVals から引き剥がしていく方針
- **`src/store.ts`** (Zustand): ユーザーデータとナビゲーション注入のみ。**新規追加は原則禁止**
- **データ境界**: profiles / records / meetup_events / events 系は実DB。`src/data.ts` は db:seed 専用 + 参照データ(brands/others/bars等)のDB未設定時フォールバック(詳細は data.ts のヘッダー参照)
- **表示名の source of truth は profiles テーブル**。`auth.users.user_metadata` は新規登録時のシードにすぎない。既存 profiles 行を metadata の値で上書きしない(`onConflictDoNothing` を使う)
- **メンバーのURLキーは profiles.id**(nickname は改名で切れるため使わない)

## コード規約

- **コミットメッセージは日本語**。作業前に GitHub issue を作成し、ブランチを切ってから実装する
- **セマンティックHTML**: `<div>` は純粋なレイアウト用 flex/grid コンテナのみ。見出しは `<h1-3>`(`m-0` 必須)、テキストは `<p>`、リストは `<ul>/<li>`、領域は `<section>/<article>/<header>/<aside>`
- **Tailwind + `@theme` トークン**(`globals.css`): 色の直書き(`text-[#XXX]`)禁止。`text-primary` / `bg-surface` 等を使う
- **条件付き className は `clsx`**。テンプレートリテラル連結は禁止
- **共通コンポーネント**(`src/components/shared/`): Button / Input / Textarea / Modal / Spinner / Loading / KebabMenu を優先して使う
- **トグル系ボタンは target state パターン**(連打防止 + spinner)。`useOptimistic` は使わない(冪等な既読化などは例外)。実装例: `src/screens/Events/EventStatusButton.tsx`
- **変数名の省略禁止**(`notif` → `notification`, `md` → `meetupDetail`)
- 日時は `eventDate`(date型)を正とし、`dateLabel`(自由文字列)のパースに依存するコードを増やさない
