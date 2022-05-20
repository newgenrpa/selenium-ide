// Licensed to the Software Freedom Conservancy (SFC) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The SFC licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

import React from 'react'
import PropTypes from 'prop-types'
import { observe } from 'mobx'
import { observer } from 'mobx-react'
import TabBar from '../../components/TabBar'
import LogList from '../../components/LogList'
import Bottomproceed from '../../components/Bottomproceed'
import ClearButton from '../../components/ActionButtons/Clear'
import { output } from '../../stores/view/Logs'
import PlaybackLogger from '../../side-effects/playback-logging'
import CommandReference from '../../components/CommandReference'
import UiState from '../../stores/view/UiState'
import { Commands } from '../../models/Command'
import PlaybackState from '../../stores/view/PlaybackState'
import ExecutionPlan from '../../components/ExecutionPlan'
import Runs from '../../components/Runs'
import './style.css'

@observer
export default class Console extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: 'Log',
      logsUnread: false,
    }
    this.playbackLogger = new PlaybackLogger()
    this.loggerDisposer = observe(output.logs, () => {
      this.setState({ logsUnread: this.state.tab === 'Log' ? false : true })
    })
    this.tabClicked = this.tabClicked.bind(this)
    this.tabChangedHandler = this.tabChangedHandler.bind(this)
    this.setViewportRef = element => {
      this.viewport = element
    }
    this.scroll = this.scroll.bind(this)
  }
  componentWillUnmount() {
    this.loggerDisposer()
    this.playbackLogger.dispose()
  }
  tabChangedHandler(tab) {
    this.setState({
      tab,
      logsUnread: tab === 'Log' ? false : this.state.logsUnread,
    })
  }
  tabClicked() {
    this.props.restoreSize()
  }
  scroll(to) {
    this.viewport.scrollTo(0, to)
  }
  render() {
    const command = UiState.selectedCommand
      ? Commands.list.get(UiState.selectedCommand.displayedName)
      : undefined
    const tabs = [
      { name: 'Output', unread: this.state.logsUnread }
      
    ]
    return (
      <footer
        className="console"
        style={{
          height: this.props.height ? `${this.props.height}px` : 'initial',
        }}
      >
        <TabBar
          tabs={tabs}
          tabWidth={90}
          buttonsMargin={0}
          tabChanged={this.tabChangedHandler}
        >
          <ClearButton onClick={output.clear} />
        </TabBar>
        <div className="viewport" ref={this.setViewportRef}>
        {UiState.selectedView === 'Executing' && (
              <React.Fragment>
                <ExecutionPlan />
                <Runs
                  runs={PlaybackState.finishedTestsCount}
                  failures={PlaybackState.failures}
                  hasError={!!PlaybackState.failures}
                  progress={PlaybackState.finishedTestsCount}
                  totalProgress={PlaybackState.testsCount}
                />
              </React.Fragment>
            )}
          {this.state.tab === 'Log' && (
            <LogList
              output={output}
              scrollTo={this.scroll}
              id="Log"
              role="tabpanel"
            />
          )}
          {this.state.tab === 'Reference' && (
            <CommandReference
              currentCommand={command}
              id="Reference"
              role="tabpanel"
            />
          )}
        </div>
        <div className="customdiv">
              <Bottomproceed
              changed={this.props.changed}
    save={this.props.save}
    view={this.props.view}></Bottomproceed>
            </div>
      </footer>
    )
  }
  static propTypes = {
    height: PropTypes.number,
    restoreSize: PropTypes.func,
  }
}
