import { PropsWithChildren } from 'react'

export function Welcome({ children }: PropsWithChildren) {
  return (
    <div className="flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6 py-16">
        <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center mx-auto mb-4 font-bold">AI</div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">AI Chat Playground</h1>
        <p className="text-muted-foreground mt-2">Learn and Build AI Applications with Gemini API.</p>
        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  )
}
