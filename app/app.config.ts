export default defineAppConfig({
  ui: {
    chatMessage: {
      variants: {
        variant: {
          soft: { content: 'bg-green-50 text-green-900 rounded-2xl' },
          solid: { content: 'bg-green-600 text-white rounded-2xl' }
        }
      }
    },
    colors: {
      neutral: 'slate',
      primary: 'green'
    }
  }
})
