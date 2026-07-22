// @ts-nocheck
import { memo } from 'react'
import { useLists } from './hooks/useLists'
import ListWidget from './ListWidget'

function Lists() {
  const { lists, addList, updateList, removeList } = useLists()

  return (
    <ListWidget
      lists={lists}
      onUpdate={updateList}
      onRemove={removeList}
      onAdd={addList}
    />
  )
}

export default memo(Lists)
