// @ts-nocheck
export interface TodoItem {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export interface TodoList {
  id: string
  title: string
  items: TodoItem[]
  createdAt: number
  updatedAt: number
}

export interface ListsState {
  lists: TodoList[]
  activeListId: string | null
}
