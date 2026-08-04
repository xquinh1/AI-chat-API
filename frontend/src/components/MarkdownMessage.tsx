import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeBlock } from './CodeBlock'

export function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className="markdown-body text-[15px] leading-7 text-stone-700">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: CodeBlock }}>{content}</ReactMarkdown>
    </div>
  )
}
