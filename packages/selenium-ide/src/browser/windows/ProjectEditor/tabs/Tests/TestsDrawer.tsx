import List from '@mui/material/List'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import React, { FC, useContext } from 'react'
import Drawer from 'browser/components/Drawer/Wrapper'
import EditorToolbar from 'browser/components/Drawer/EditorToolbar'
import RenamableListItem from 'browser/components/Drawer/RenamableListItem'
import TestCreateDialog from './TestCreateDialog'
import { context as activeTestContext } from 'browser/contexts/active-test'
import { context as suitesContext } from 'browser/contexts/suites'
import { context as testsContext } from 'browser/contexts/tests'
import { context as testResultsContext } from 'browser/contexts/playback-test-results'
import { FormattedMessage, useIntl } from 'react-intl'
import languageMap from 'browser/I18N/keys'
import { QuestionMark } from '@mui/icons-material'

const {
  state: { setActiveTest: setSelected, setActiveSuite },
  tests: { rename },
} = window.sideAPI

const TestsDrawer: FC = () => {
  const intl = useIntl()
  const { activeSuiteID, activeTestID } = useContext(activeTestContext)
  const suites = useContext(suitesContext)
  const tests = useContext(testsContext)
  const testResults = useContext(testResultsContext)
  const [confirmNew, setConfirmNew] = React.useState(false)
  const testList = activeSuiteID
    ? suites
        .find((s) => s.id === activeSuiteID)
        ?.tests.map((id) => tests.find((t) => t.id === id)!) ?? tests
    : tests
  const safeSuiteID = suites.find((s) => s.id === activeSuiteID)?.id ?? ''
  return (
    <Drawer>
      <TestCreateDialog open={confirmNew} setOpen={setConfirmNew} />
      <Stack>
        <EditorToolbar
          onAdd={() => setConfirmNew(true)}
          onRemove={
            tests.length > 1
              ? () => {
                  const doDelete = window.confirm(
                    intl.formatMessage({
                      id: languageMap.testsTab.deleteNotice,
                    })
                  )
                  if (doDelete) {
                    window.sideAPI.tests.delete(activeTestID)
                  }
                }
              : () => {
                  window.confirm(
                    intl.formatMessage({
                      id: languageMap.testsTab.notDeleteNotice,
                    })
                  )
                }
          }
        >
          <Tooltip
            title={<FormattedMessage id={languageMap.testsTab.tooltip} />}
          >
            <QuestionMark
              className="mx-2"
              sx={{ color: 'primary.main', scale: 0.75 }}
            />
          </Tooltip>
        </EditorToolbar>
        <FormControl size="small">
          <Select
            MenuProps={{
              anchorOrigin: {
                horizontal: 'center',
                vertical: 'top',
              },
              transformOrigin: {
                horizontal: 'center',
                vertical: 'bottom',
              },
            }}
            className="flex-initial"
            displayEmpty
            onChange={(e) => setActiveSuite(e.target.value as string)}
            placeholder="[All tests]"
            sx={{ bottom: 0 }}
            value={safeSuiteID}
          >
            <MenuItem value="">
              <FormattedMessage id={languageMap.testsTab.allTests} />
            </MenuItem>
            {suites.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <List className="flex-col flex-1 overflow-y" dense>
        {testList
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(({ id, name }) => {
            const testState = testResults[id]?.state
            return (
              <RenamableListItem
                id={id}
                name={name}
                onContextMenu={() => {
                  window.sideAPI.menus.open('testManager', [id])
                }}
                rename={rename}
                selected={id === activeTestID}
                setSelected={setSelected}
                state={testState}
              />
            )
          })}
      </List>
    </Drawer>
  )
}

export default TestsDrawer
