# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## 新規登録の制限(招待リンク)

### 仕組み

- 新規登録は、管理者が発行した招待リンク(`/login?invite=<トークン>`)を開いたときだけできます。メールアドレスのドメインは問いません(社用メールも招待リンクが必要です)。
- 判定は `auth.users` の BEFORE INSERT トリガー(`public.enforce_signup_gate`)で行います。フォームの判定は anon key で Supabase の API を直接叩けば迂回できるため、フォーム側のチェックは案内のためだけです。
- 招待トークンは `public.signup_invites` に sha256 のハッシュだけを保存します。平文は発行した画面で1回だけ表示します。登録時に送られたトークンは、トリガーが user metadata から取り除くので `auth.users` に残りません。
- トリガーが拒否すると、Supabase Auth はトリガーの例外文(`signup_gate: invite required` など)か「Database error saving new user」を返します。画面では招待リンクが必要な旨のメッセージに変換して表示します。

### セットアップ

```bash
yarn db:signup-gate   # テーブル・関数・トリガーを作る(再実行可能)
```

### 招待リンクの発行

1. 管理者(`profiles.is_admin = true`)でログインし、`/admin/invites`(SP ではハンバーガーメニューの「招待リンク」)を開く。
2. ラベル、有効期限(日数)、使用回数の上限を入れて「発行する」を押す。「Slack にも投稿する」が ON なら、Slack にもリンクを投稿します(本番 URL が決まっている環境だけ)。
3. 表示された URL か QR コードを相手に渡す。トークンはこのときだけ表示されるので、画面を離れる前にコピーしてください。

不要になったリンクは、発行済み一覧の「失効する」で使えなくできます。

### 有効期限と使用回数の上限

- 有効期限: 発行から指定した日数が過ぎると、そのリンクでは登録できなくなります。空欄なら無期限です。
- 使用回数の上限: そのリンクで登録できる人数です。登録が1件成功するたびに使用回数が1増え、上限に達すると登録できなくなります。空欄なら無制限です。
- 期限と上限は登録の瞬間(`auth.users` への INSERT 時)に判定します。リンクを開いた時点では判定しません。

### Supabase ダッシュボードで行うこと

1. Authentication → Providers → Email の「Confirm email」を ON にする。
2. Authentication → Email Templates の「Confirm signup」のリンクを `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup` に変える。
3. Authentication → URL Configuration の Site URL と Redirect URLs に、本番 URL と `/auth/confirm`・`/auth/callback` を登録する。

### 補足

- GitHub ログインは招待トークンを渡せないため、新規登録には使えません(トリガーが拒否し、ログイン画面に戻って招待リンクからメールアドレスで登録するよう案内します)。登録済みのユーザーは GitHub でログインできます。
- 判定は `auth.users` への INSERT 時だけなので、既存ユーザーのログインには影響しません。
