export default defineAppConfig({
  ui: {
    chatMessage: {
      variants: {
        variant: {
          soft: { content: 'bg-primary-50 text-primary-900 rounded-2xl' },
          solid: { content: 'bg-primary-600 text-neutral-50 rounded-2xl' }
        }
      }
    },
    chatPrompt: {
      defaultVariants: { variant: 'naked' },
      slots: { base: 'text-neutral-900 placeholder:text-neutral-400' },
      variants: { variant: { naked: { root: 'bg-neutral-50 border border-neutral-200' } } }
    },
    colors: { neutral: 'slate', primary: 'green' }
  }
})
