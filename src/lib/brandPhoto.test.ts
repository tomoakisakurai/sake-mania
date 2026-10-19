import { describe, it, expect } from 'vitest';
import { brandPhotoPath, parseImageDataUrl, isImageDataUrl } from './brandPhoto';

describe('brandPhotoPath', () => {
  it('id と version を埋め込んだ画像ルートのURLを返す', () => {
    expect(brandPhotoPath('abc-123', 'd41d8cd9')).toBe('/api/brand-photo/abc-123?v=d41d8cd9');
  });

  it('id と version を URL エンコードする', () => {
    expect(brandPhotoPath('a/b c', 'x&y=z')).toBe('/api/brand-photo/a%2Fb%20c?v=x%26y%3Dz');
  });
});

describe('parseImageDataUrl', () => {
  it('jpeg のデータURLを MIME タイプとバイト列に分解する', () => {
    const bytes = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);
    const result = parseImageDataUrl(`data:image/jpeg;base64,${bytes.toString('base64')}`);
    expect(result?.mimeType).toBe('image/jpeg');
    expect(result?.bytes.equals(bytes)).toBe(true);
  });

  it('webp のデータURLを MIME タイプとバイト列に分解する', () => {
    const bytes = Buffer.from('RIFF\u0000\u0000\u0000\u0000WEBP', 'binary');
    const result = parseImageDataUrl(`data:image/webp;base64,${bytes.toString('base64')}`);
    expect(result?.mimeType).toBe('image/webp');
    expect(result?.bytes.equals(bytes)).toBe(true);
  });

  it('空文字は null', () => {
    expect(parseImageDataUrl('')).toBeNull();
  });

  it('画像ルートのURLは null', () => {
    expect(parseImageDataUrl('/api/brand-photo/abc?v=123')).toBeNull();
  });

  it('data: の prefix がない base64 は null', () => {
    expect(parseImageDataUrl('image/jpeg;base64,/9j/4AAQ')).toBeNull();
  });

  it('画像以外の MIME タイプは null', () => {
    expect(parseImageDataUrl('data:text/html;base64,PGgxPg==')).toBeNull();
  });
});

describe('isImageDataUrl', () => {
  it('画像のデータURLなら true', () => {
    expect(isImageDataUrl('data:image/jpeg;base64,/9j/4AAQ')).toBe(true);
  });

  it('画像ルートのURLなら false', () => {
    expect(isImageDataUrl('/api/brand-photo/abc?v=123')).toBe(false);
  });

  it('空文字なら false', () => {
    expect(isImageDataUrl('')).toBe(false);
  });
});
