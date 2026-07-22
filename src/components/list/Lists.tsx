/**
 * @fileoverview Todo list widget container component.
 */

import { memo } from 'react'
import { useLists } from './hooks/useLists'
import ListWidget from './ListWidget'

/**
 * Todo list widget that manages multiple lists.
 * 
 * @example <Lists />
 */
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
