/**
 * @fileoverview GitHub Actions script to sync untranslated files tracking issue
 */

const ISSUE_TITLE = '[自動更新] 未翻訳ドキュメント一覧';
const LABELS = ['type: translation', '翻訳者募集中'];

const CATEGORY_EMOJIS = {
  guide: '📖 Guide',
  tutorial: '🎓 Tutorial',
  reference: '📚 Reference',
  'best-practices': '⚡ Best Practices',
  cli: '🔧 CLI',
  app: '🧩 Components/App',
  other: '📦 その他'
};

const CATEGORY_ORDER = ['guide', 'tutorial', 'reference', 'best-practices', 'cli', 'app', 'other'];

/**
 * Generate URLs for a file
 */
function generateLinks(filepath) {
  const githubUrl = `https://github.com/angular/angular-ja/blob/main/adev-ja/${filepath}`;

  // タイトル生成: パスから拡張子を除去したシンプルな形式
  const title = filepath
    .replace('src/content/', '')
    .replace(/\.(md|ts|html|json)$/, '');

  const issueUrl = `https://github.com/angular/angular-ja/issues/new?template=----.md&title=${encodeURIComponent(title + ' の翻訳')}`;

  // .mdファイルのみプレビューURL生成
  let previewUrl = null;
  if (filepath.endsWith('.md')) {
    const previewPath = filepath
      .replace('src/content/', '')
      .replace(/\/README\.md$/, '') // READMEの場合はディレクトリのみ
      .replace(/\.md$/, '');
    previewUrl = `https://angular.jp/${previewPath}`;
  }

  return { githubUrl, previewUrl, issueUrl };
}

/**
 * Format a file entry for the issue body
 */
function formatFileEntry(filepath, links) {
  const displayName = filepath.replace('src/content/', '');

  let linksText = `[GitHub](${links.githubUrl})`;
  if (links.previewUrl) {
    linksText += ` | [プレビュー](${links.previewUrl})`;
  }
  linksText += ` | [📝 翻訳宣言](${links.issueUrl})`;

  return `- [ ] **${displayName}** (${linksText})`;
}

/**
 * Group files by category
 */
function groupByCategory(files) {
  const groups = {};
  for (const file of files) {
    const category = file.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(file);
  }
  return groups;
}

/**
 * Generate issue body
 */
function generateIssueBody(filesData) {
  const { count, files } = filesData;

  if (count === 0) {
    return `## 🎉 全てのファイルが翻訳されました！

**最終更新**: ${new Date().toISOString()}

現在、未翻訳のファイルはありません。素晴らしい貢献をありがとうございます！

---

## 📝 翻訳ガイド

今後新しい未翻訳ファイルが追加された場合、このIssueが自動的に更新されます。

- [翻訳ガイドライン](https://github.com/angular/angular-ja/blob/main/CONTRIBUTING.md)
`;
  }

  const groups = groupByCategory(files);

  let body = `## 📋 未翻訳ドキュメント一覧

このIssueは自動的に更新されます。翻訳したいファイルの「📝 翻訳宣言」リンクから翻訳宣言Issueを作成してください。

**最終更新**: ${new Date().toISOString()}
**未翻訳ファイル数**: ${count}件

---

`;

  // カテゴリ順にセクションを生成
  for (const category of CATEGORY_ORDER) {
    if (!groups[category] || groups[category].length === 0) continue;

    const categoryFiles = groups[category];
    const emoji = CATEGORY_EMOJIS[category] || category;

    body += `### ${emoji} (${categoryFiles.length}件)\n\n`;

    for (const file of categoryFiles) {
      const links = generateLinks(file.path);
      body += formatFileEntry(file.path, links) + '\n';
    }

    body += '\n';
  }

  body += `---

## 📝 翻訳の始め方

1. 上記リストから翻訳したいファイルを選ぶ
2. 「📝 翻訳宣言」リンクをクリックしてIssueを作成
3. [翻訳ガイド](https://github.com/angular/angular-ja/blob/main/CONTRIBUTING.md)に従って作業開始
`;

  return body;
}

/**
 * Main function
 */
export default async ({github, context, core, filesData}) => {
  const owner = context.repo.owner;
  const repo = context.repo.repo;

  core.info(`Processing ${filesData.count} untranslated files...`);

  // 既存のトラッキングIssueを検索 (state: all で closed も含む)
  const { data: issues } = await github.rest.issues.listForRepo({
    owner,
    repo,
    state: 'all',
    labels: LABELS[0],
    creator: 'github-actions[bot]'
  });

  const trackingIssue = issues.find(issue => issue.title === ISSUE_TITLE);

  const issueBody = generateIssueBody(filesData);

  if (trackingIssue) {
    core.info(`Found existing tracking issue #${trackingIssue.number}`);

    // Issueを更新
    await github.rest.issues.update({
      owner,
      repo,
      issue_number: trackingIssue.number,
      body: issueBody,
      state: 'open' // closed状態の場合はreopen
    });

    core.info(`Updated tracking issue #${trackingIssue.number}`);

    if (trackingIssue.state === 'closed') {
      core.info(`Reopened tracking issue #${trackingIssue.number}`);
    }
  } else {
    // 新規Issueを作成
    const { data: newIssue } = await github.rest.issues.create({
      owner,
      repo,
      title: ISSUE_TITLE,
      body: issueBody,
      labels: LABELS
    });

    core.info(`Created new tracking issue #${newIssue.number}`);
  }

  core.info('Done!');
};
