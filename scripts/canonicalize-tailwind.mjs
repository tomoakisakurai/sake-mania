#!/usr/bin/env node
// Tailwind v4 (--spacing: 0.25rem = 4px) で arbitrary な px 値を canonical な
// half-step class に変換するスクリプト。
//
// 例:
//   mb-[22px]         -> mb-5.5
//   translate-x-[14px] -> translate-x-3.5
//   -mt-[8px]         -> -mt-2
//   pt-[1px]          -> 変換しない (4px倍数でないため)
//
// 使い方: node scripts/canonicalize-tailwind.mjs [pattern...]
//   引数なし: src/ 全体
//   引数あり: 引数のglob

import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

// Tailwind v4 spacing スケールを使う prefix（負号は別途処理）
const SPACING_PREFIXES = [
  // margin / padding
  'm', 'mt', 'mb', 'ml', 'mr', 'mx', 'my',
  'p', 'pt', 'pb', 'pl', 'pr', 'px', 'py',
  // gap
  'gap', 'gap-x', 'gap-y',
  // size
  'w', 'h', 'min-w', 'max-w', 'min-h', 'max-h', 'size',
  // position
  'top', 'right', 'bottom', 'left',
  'inset', 'inset-x', 'inset-y',
  'start', 'end',
  // translate
  'translate-x', 'translate-y',
  // space between
  'space-x', 'space-y',
  // scroll
  'scroll-m', 'scroll-mt', 'scroll-mb', 'scroll-ml', 'scroll-mr', 'scroll-mx', 'scroll-my',
  'scroll-p', 'scroll-pt', 'scroll-pb', 'scroll-pl', 'scroll-pr', 'scroll-px', 'scroll-py',
];

const PREFIX_PATTERN = SPACING_PREFIXES
  .sort((a, b) => b.length - a.length) // 長い順 (gap-x が gap より先にマッチ)
  .map((prefix) => prefix.replace(/-/g, '\\-'))
  .join('|');

// 例: "  className mb-[22px]  -translate-x-[14px]" などを順次マッチ
const CLASS_RE = new RegExp(`(-?)(${PREFIX_PATTERN})-\\[(\\d+)px\\]`, 'g');

function toCanonical(px) {
  const n = px / 4;
  if (n === Math.floor(n)) return String(n);
  if (n * 2 === Math.floor(n * 2)) return n.toFixed(1).replace(/\.0$/, '');
  return null;
}

// 旧 v3 → v4 canonical の単純リネーム (className文字列内の単語のみ)
const ALIAS_RENAMES = [
  // flex
  ['flex-shrink-0', 'shrink-0'],
  ['flex-shrink', 'shrink'],
  ['flex-grow-0', 'grow-0'],
  ['flex-grow', 'grow'],
  // overflow
  ['overflow-ellipsis', 'text-ellipsis'],
  // decoration
  ['decoration-slice', 'box-decoration-slice'],
  ['decoration-clone', 'box-decoration-clone'],
];

function renameAliases(source) {
  let result = source;
  for (const [from, to] of ALIAS_RENAMES) {
    const re = new RegExp(`(?<=[\\s"'\`])${from.replace(/-/g, '\\-')}(?=[\\s"'\`])`, 'g');
    result = result.replace(re, to);
  }
  return result;
}

function processSource(source) {
  let changed = false;
  let next = source.replace(CLASS_RE, (match, sign, prefix, pxStr) => {
    const canonical = toCanonical(parseInt(pxStr, 10));
    if (canonical === null) return match;
    changed = true;
    return `${sign}${prefix}-${canonical}`;
  });
  const renamed = renameAliases(next);
  if (renamed !== next) {
    changed = true;
    next = renamed;
  }
  return { next, changed };
}

function listFiles(args) {
  if (args.length === 0) {
    const out = execSync('git ls-files src', { encoding: 'utf8' });
    return out
      .split('\n')
      .filter((file) => /\.(tsx|ts|jsx|js)$/.test(file));
  }
  return args;
}

const files = listFiles(process.argv.slice(2));
let totalChanged = 0;
for (const file of files) {
  const abs = path.resolve(file);
  const source = readFileSync(abs, 'utf8');
  const { next, changed } = processSource(source);
  if (changed) {
    writeFileSync(abs, next);
    totalChanged++;
    console.log(`fixed: ${file}`);
  }
}
console.log(`\n${totalChanged} file(s) updated`);
