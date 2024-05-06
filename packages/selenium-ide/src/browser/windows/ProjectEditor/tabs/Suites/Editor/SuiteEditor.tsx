import FormControl from '@mui/material/FormControl'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { SuiteShape } from '@seleniumhq/side-model'
import React, { FC } from 'react'
import { Checkbox, FormControlLabel } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import languageMap from 'browser/I18N/keys'

export interface SuiteEditorProps {
  suite: SuiteShape
}

export interface MiniSuiteShape {
  id: string
  name: string
}

const SuiteEditor: FC<SuiteEditorProps> = ({ suite }) => (
  <Stack className="p-4 width-100" spacing={1}>
    <FormControl>
      <TextField
        label={<FormattedMessage id={languageMap.suitesTab.name} />}
        name="name"
        onChange={(e: any) => {
          window.sideAPI.suites.update(suite.id, { name: e.target.value })
        }}
        size="small"
        // value={suite.name}
        defaultValue={suite.name}
      />
    </FormControl>
    <FormControl>
      <TextField
        label={<FormattedMessage id={languageMap.suitesTab.timeout} />}
        name="timeout"
        onChange={(e: any) => {
          window.sideAPI.suites.update(suite.id, {
            timeout: Math.max(parseInt(e.target.value || '0'), 0),
          })
        }}
        size="small"
        value={suite.timeout}
      />
    </FormControl>
    <FormControl>
      <FormControlLabel
        control={
          <Checkbox
            onChange={(_e, checked) => {
              window.sideAPI.suites.update(suite.id, {
                parallel: checked,
              })
            }}
            checked={suite.parallel}
          />
        }
        label={<FormattedMessage id={languageMap.suitesTab.parallel} />}
      />
    </FormControl>
    <FormControl>
      <FormControlLabel
        control={
          <Checkbox
            onChange={(_e, checked) => {
              window.sideAPI.suites.update(suite.id, {
                persistSession: checked,
              })
            }}
            checked={suite.persistSession}
          />
        }
        label={<FormattedMessage id={languageMap.suitesTab.persistSession} />}
      />
    </FormControl>
  </Stack>
)

export default SuiteEditor
