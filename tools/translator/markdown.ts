export type ContentBlock = string;

export function splitMarkdown(content: string): ContentBlock[] {
  // split content by heading lines (lines starting with ##)
  return content.split(/\n(?=##\s)/);
}

export async function renderMarkdown(blocks: ContentBlock[]) {
  const content = blocks
    .map((block) => (block.endsWith('\n') ? block.replace(/\n$/, '') : block))
    .join('\n\n');
  // add trailing newline
  return content + '\n';
}
