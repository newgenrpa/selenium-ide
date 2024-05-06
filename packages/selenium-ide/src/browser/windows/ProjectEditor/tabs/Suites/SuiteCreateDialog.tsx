import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import TextField from '@mui/material/TextField'
import { FormattedMessage } from 'react-intl'
import languageMap from 'browser/I18N/keys'

const {
  state: { setActiveSuite: setSelected },
} = window.sideAPI

type CloseReason = 'Create' | 'Cancel'

export interface SuiteNewDialogProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SuiteNewDialog: React.FC<SuiteNewDialogProps> = ({ open, setOpen }) => {
  const [suiteName, setSuiteName] = React.useState('')

  const createSuite = async () => {
    const newSuite = await window.sideAPI.suites.create(suiteName)
    setSelected(newSuite.id)
  }

  const handleClose = async (value: CloseReason) => {
    if (value === 'Create') {
      createSuite()
    }
    setOpen(false)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      handleClose('Create')
    }
  }
  return (
    <Dialog
      classes={{
        container: 'justify-content-start',
      }}
      onClose={handleClose}
      open={open}
    >
      <DialogContent>
        <DialogContentText>
          {<FormattedMessage id={languageMap.suitesTab.dialogTitle} />}
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          id="name"
          label={<FormattedMessage id={languageMap.suitesTab.suiteName} />}
          margin="dense"
          onChange={(e) => setSuiteName(e.target.value)}
          onKeyDown={onKeyDown}
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose('Cancel')}>
          {<FormattedMessage id={languageMap.suitesTab.cancel} />}
        </Button>
        <Button onClick={() => handleClose('Create')}>
          {<FormattedMessage id={languageMap.suitesTab.create} />}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SuiteNewDialog
