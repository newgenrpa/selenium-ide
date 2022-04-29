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
import classNames from 'classnames'
import { observer } from 'mobx-react'
import SaveButton from '../ActionButtons/Save'
import './style.css'

@observer
export default class Bottomproceed extends React.Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    changed: PropTypes.bool,
	view:PropTypes.bool,
    changeName: PropTypes.func.isRequired,
    openFile: PropTypes.func,
    load: PropTypes.func,
    save: PropTypes.func,
    new: PropTypes.func,
  }
  handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.target.blur()
    }
  }
  handleChange(e) {
    this.props.changeName(e.target.value)
  }
  render() {
    return (
      <div className={classNames('headers', { changed: this.props.changed })}>
        
        <div className="flexer" />
      
        <span className="buttons">
       <button className="custombutton"  onClick={this.props.save}>Save</button>
        {/*{this.props.view? (
      <SaveButton
            data-place="left"
            unsaved={this.props.changed}
            onClick={this.props.save}
          />
      ) : null}
       */}
		 
          
         
        </span>
      </div>
    )
  }
}
