// CSSの副作用インポート（例: import './globals.css'）の型解決用。
// moduleResolution: "bundler" 下で ts(2882) を防ぐためのアンビエント宣言。
declare module '*.css';
