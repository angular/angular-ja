export type ContentBlock = string;
export type ContentType = 'markdown' | 'recommendations';

export function splitMarkdown(content: string): ContentBlock[] {
  // split content by heading lines (lines starting with ##)
  return content.split(/\n(?=##\s)/);
}

export function splitRecommendations(content: string): ContentBlock[] {
  // split content by 300 lines
  const size = 300;
  if (content.length <= size) {
    return [content];
  }
  const lines = content.split('\n');
  const blocks: ContentBlock[] = [];
  for (let i = 0; i < lines.length; i += size) {
    blocks.push(lines.slice(i, i + size).join('\n'));
  }
  return blocks;
}

export async function renderContent(
  contentType: ContentType,
  blocks: ContentBlock[]
) {
  const content = blocks
    .map((block) => {
      if (contentType === 'markdown') {
        // For markdown, ensure each block ends with a newline
        return block;
      } else {
        // For code, ensure no trailing newline
        return stripMarkdownBackticks(block);
      }
    })
    .map((block) => (block.endsWith('\n') ? block.replace(/\n$/, '') : block))
    .join('\n\n');
  // add trailing newline
  return content + '\n';
}

export function getContentType(filename: string): ContentType {
  // Determine content type based on file extension
  if (filename.endsWith('.md')) {
    return 'markdown';
  } else if (filename.includes('recommendations')) {
    return 'recommendations';
  }
  // Default to markdown for other file types
  return 'markdown';
}

export function stripMarkdownBackticks(content: string): string {
  // Trim leading and trailing backticks
  // and remove any language specifier
  // e.g. ```js or ```typescript
  return content
    .replace(/^\s*```[a-zA-Z0-9-]*\s*/, '') // leading backticks with optional language
    .replace(/\s*```[a-zA-Z0-9-]*\s*$/, ''); // trailing backticks with optional language
}
