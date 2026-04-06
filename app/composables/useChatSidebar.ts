const [isCollapsed, toggle] = useToggle()

export function useChatSidebar() {
  return {
    isCollapsed,
    toggle
  }
}
