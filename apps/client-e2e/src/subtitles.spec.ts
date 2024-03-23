import { test, expect } from '@playwright/test';
import * as fs from 'node:fs';
import { workspaceRoot } from '@nx/devkit';

test('it lists the available subtitles', async ({ page }) => {
  await page.goto('/');

  await page.getByText('data').click();
  await page.getByText('Evil').click();
  await page.getByText('Evil.S01E01.mkv').click();

  await page.waitForLoadState();

  const expected = new Map([
    [
      'Addic7ed',
      [
        'French - KILLERS',
        'French - KILLERS',
        'French - WEBRip-NTb',
        'French - KILLERS',
        'French - WEBRip-NTb',
        'French - AMRAP+NTb+ION10',
        'French - AMRAP+NTb+ION10',
        'French - AMZN.WEB-DL.NTb',
      ],
    ],
    [
      'External',
      ['fr - Evil.S01E01.mkv.fr.srt', 'fr - Evil.S01E01.mkv.fr.srt'],
    ],
    ['Internal', ['default', 'hun', 'ger', 'fre', 'spa', 'ita', 'jpn', 'und']],
  ]);

  expected.forEach((value, key) => {
    const origin = page.getByText(key);
    value.forEach((subtitle) => {
      expect(origin.getByText(subtitle)).toBeDefined();
    });
  });
});

test('it downloads a subtitle from Addic7ed', async ({ page }) => {
  await page.goto('/');

  await page.getByText('data').click();
  await page.getByText('Evil').click();
  await page.getByText('Evil.S01E02.mkv').click();

  await page.waitForLoadState();

  await  page.getByText('Addic7ed').getByText('French - AMZN.WEB-DL.NTb').click();

  await page.waitForLoadState();

  expect(
    page.getByText('Internal').getByText('Evil.S01E02.mkv.fr.srt')
  ).toBeDefined();

  await page.waitForTimeout(1000)

  fs.rmSync(`${workspaceRoot}/data/Evil/Evil.S01E02.mkv.fr.srt`, {force: true})
});

test('it translates a subtitle from a file', async ({page}) => {
  await page.goto('/');

  await page.getByText('data').click();
  await page.getByText('Evil').click();
  const video = page.getByText('Evil.S01E01.mkv')
  await video.click();
  await page.waitForLoadState();
  const internalSubtitle = video.getByText('Internal').getByText('unknown')
  await internalSubtitle.click()
  const external =video.getByText('External')

  expect(external.getByText('default - fr')).toBeDefined()
});

test('it removes an external subtitle', async ({page}) => {
  fs.copyFileSync(`${workspaceRoot}/data/Evil/Evil.S01E01.mkv.fr.srt`, `${workspaceRoot}/data/Evil/Evil.S01E01.copy.mkv.fr.srt`)

  await page.goto('/');

  await page.getByText('data').click();
  await page.getByText('Evil').click();
  const video = page.getByText('Evil.S01E01.mkv')
  await video.click();
  await page.waitForLoadState();

  const externalSubtitleCopy = page.getByText('External').getByText(`Evil.S01E01.mkv.fr.srt`)
  expect(externalSubtitleCopy).toBeDefined()

  await externalSubtitleCopy.getByRole('button', { name: 'trash' }).click()
  await page.waitForLoadState();

  await expect(video.getByText('External').getByText(`Evil.S01E01.mkv.fr.srt`)).toHaveCount(0)

  fs.rmSync(`${workspaceRoot}/data/Evil/Evil.S01E01.copy.mkv.fr.srt`)
})
