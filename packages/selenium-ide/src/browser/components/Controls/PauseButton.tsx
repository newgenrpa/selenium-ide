import PauseIcon from '@mui/icons-material/Pause'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, { FC } from 'react'
import baseControlProps from './BaseProps'
import { FormattedMessage } from 'react-intl'
import languageMap from 'browser/I18N/keys'

const PauseButton: FC = () => (
  <Tooltip
    title={<FormattedMessage id={languageMap.testCore.pause} />}
    aria-label="pause"
  >
    <IconButton
      {...baseControlProps}
      data-pause
      onClick={() => window.sideAPI.playback.pause()}
    >
      <PauseIcon />
    </IconButton>
  </Tooltip>
)

export default PauseButton
