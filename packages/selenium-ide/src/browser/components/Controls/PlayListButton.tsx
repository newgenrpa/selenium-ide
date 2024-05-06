import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, { FC } from 'react'
import baseControlProps from './BaseProps'
import { FormattedMessage } from 'react-intl'
import languageMap from 'browser/I18N/keys'

const PlayListButton: FC = () => (
  <Tooltip
    title={<FormattedMessage id={languageMap.suitesTab.playSuite} />}
    aria-label="play-suite"
  >
    <IconButton
      {...baseControlProps}
      data-play-suite
      onClick={() => window.sideAPI.playback.playSuite()}
    >
      <PlaylistPlayIcon />
    </IconButton>
  </Tooltip>
)

export default PlayListButton
