import { CommandShape } from '@seleniumhq/side-model'
import { CommandsStateShape } from '@seleniumhq/side-api'
import ReorderableList from 'browser/components/ReorderableList'
import makeKeyboundNav from 'browser/hooks/useKeyboundNav'
import useReorderPreview from 'browser/hooks/useReorderPreview'
import React, { FC } from 'react'
import CommandListItem from './TestCommandListItem'
import EditorToolbar from '../../../../components/Drawer/EditorToolbar'
import { FormattedMessage, useIntl } from 'react-intl'
import languageMap from 'browser/I18N/keys'

export interface CommandListProps {
  activeTest: string
  commands: CommandShape[]
  commandStates: CommandsStateShape
  disabled?: boolean
  selectedCommandIndexes: number[]
}

const useKeyboundNav = makeKeyboundNav(window.sideAPI.state.updateStepSelection)

const CommandList: FC<CommandListProps> = ({
  activeTest,
  commandStates,
  commands,
  disabled = false,
  selectedCommandIndexes,
}) => {
  const intl = useIntl()
  const [preview, reorderPreview, resetPreview] = useReorderPreview(
    commands,
    selectedCommandIndexes,
    (c) => c.id
  )
  useKeyboundNav(commands, selectedCommandIndexes)
  return (
    <>
      <EditorToolbar
        className="z-1"
        elevation={2}
        disabled={disabled}
        onAdd={() =>
          window.sideAPI.tests.addSteps(
            activeTest,
            Math.max(selectedCommandIndexes.slice(-1)[0], 0)
          )
        }
        addText={intl.formatMessage({ id: languageMap.testCore.addCommand })}
        onRemove={
          commands.length > 1
            ? () =>
                window.sideAPI.tests.removeSteps(
                  activeTest,
                  selectedCommandIndexes
                )
            : undefined
        }
        removeText={intl.formatMessage({ id: languageMap.testCore.removeCommand })}
      >
        <span className="ms-4">
          <FormattedMessage id={languageMap.testCore.commands} />
        </span>
      </EditorToolbar>
      <ReorderableList
        classes={{
          root: 'flex-1 flex-col overflow-y pt-0',
        }}
        dense
        aria-disabled={disabled}
      >
        {preview.map(([command, origIndex], index) => {
          if (!command) {
            return null
          }
          const { id } = command
          return (
            <CommandListItem
              activeTest={activeTest}
              command={command}
              commandState={commandStates[id]}
              disabled={disabled}
              key={id}
              index={index}
              reorderPreview={reorderPreview}
              resetPreview={resetPreview}
              selected={selectedCommandIndexes.includes(origIndex)}
            />
          )
        })}
      </ReorderableList>
    </>
  )
}

export default CommandList
