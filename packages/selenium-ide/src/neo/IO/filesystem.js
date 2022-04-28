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

import browser from 'webextension-polyfill'
import { js_beautify as beautify } from 'js-beautify'
import UpgradeProject from './migrate'
import {
  verifyFile,
  FileTypes,
  migrateTestCase,
  migrateProject,
  migrateUrls,
} from './legacy/migrate'
import TestCase from '../models/TestCase'
import UiState from '../stores/view/UiState'
import PlaybackState from '../stores/view/PlaybackState'
import ModalState from '../stores/view/ModalState'
import Selianize, { ParseError } from 'selianize'
import Manager from '../../plugin/manager'
import chromeGetFile from './filesystem/chrome'
import firefoxGetFile from './filesystem/firefox'
import { userAgent as parsedUA } from '../../common/utils'
import { project as projectProcessor } from '@seleniumhq/side-utils'
import swal from 'sweetalert';
import Stomp from "stompjs";
var SockJS = require('sockjs-client');

var qwerty;

export function setFileParameters(msg)
{
	
	console.log("inside set file path"+msg);
	qwerty=msg;

}


export function getFileParameters()
{
	console.log("qwerty value inside get file paramer"+ qwerty);
	return qwerty;
	
}


export function getFile(path) {
  const browserName = parsedUA.browser.name
  return (() => {
    if (browserName === 'Chrome') {
      return chromeGetFile(path)
    } else if (browserName === 'Firefox') {
      return firefoxGetFile(path)
    } else {
      return Promise.reject(
        new Error('Operation is not supported in this browser')
      )
    }
  })().then(blob => {
    return new Promise(res => {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        res(reader.result)
      })
      reader.readAsDataURL(blob)
    })
  })
}

/**
Function taking input for project and sending request to fetch saved file

changes done by Vinay for bUG ID 87104 
**/
export function openRecordedProject(_project, serverdetails) {

  var xhr = new XMLHttpRequest();
  
   console.log(serverdetails.cabinetName);
    console.log(serverdetails.activityId);
	 console.log(serverdetails.processDefId);
   console.log(serverdetails.processState);
 var url = serverdetails.baseurl + "pmweb/publish?fileName="+ serverdetails.projectName + "&cabinetName="+serverdetails.cabinetName + "&processDefId="+serverdetails.processDefId + "&activityId="+ serverdetails.activityId + "&processState="+serverdetails.processState;

  xhr.open("GET", url, true);
  xhr.onload = function () {
    console.log("inside on load ");
	console.log(xhr);
    console.log(xhr.responseText);
	var response;
	if(xhr.responseText)
	{
    response = JSON.parse(xhr.responseText);
	}
	
	else
	{
		
     var a= '{"id":"","version":"2.0","name":"" ,"url":"","tests":[],"suites":[],"urls":[],"plugins":[]}';
	 
	// a.name=serverdetails.projectName;
		response = JSON.parse(a);
		var projectName=serverdetails.projectName.split('.');
		response.name=projectName[0];
	}


    var json = JSON.stringify(response);
	console.log(json);
		
    var blob = new Blob([json], {
      type: "application/json"
    });
	
	
	
    if (xhr.status == 200) {
		console.log("status is 200" +xhr);
      console.log("fsdfsd");
	 
      loadProject(_project, blob);
    }

  }

  xhr.send();
  console.log(_project);
}


export function loadAsText(blob) {
  return new Promise(res => {
    const fileReader = new FileReader()
    fileReader.onload = e => {
      res(e.target.result)
    }

    fileReader.readAsText(blob)
  })
}

export function saveProject(_project, serverdetails) {
	console.log("save project with two paramters"+serverdetails);
  const project = _project.toJS()
  downloadProject(project)
  UiState.saved()
}

function sendSaveProjectEvent(project) {
  const saveMessage = {
    action: 'event',
    event: 'saveProject',
    options: {
      project,
    },
  }
  browser.runtime.sendMessage(Manager.controller.id, saveMessage)
}

function downloadProject(project) {
  return exportProject(project).then(snapshot => {
    if (snapshot) {
      project.snapshot = snapshot
      Object.assign(project, Manager.emitDependencies())
    }

	console.log("qwerty value inside sending post request to save "+ qwerty);

	  var serverdetails=getFileParameters();
	  console.log(serverdetails);
	  console.log(serverdetails.message);
	  console.log(serverdetails);
  /*  var port = chrome.extension.connect({
      name: "Sample Communication"
    });
    port.postMessage("Hi BackGround");
    port.onMessage.addListener(function (msg) {
		console.log("inside function filesystem");

      console.log("message recieved" + msg.baseurl);
      console.log("message recieved" + msg.message);
      console.log("message recieved" + msg.username);
      console.log("message recieved" + msg.pass);
      serverdetails = msg;

*/
      console.log(serverdetails);
      console.log(serverdetails.ip);

    //   let filename = sanitizeProjectName(project.name) + '.side';
    //   let url = createBlob(
    //     'application/json',
    //     beautify(JSON.stringify(project), {
    //       indent_size: 2
    // })
    //   )
    //   console.log(filename);
    //   console.log(url);
    //   console.log(JSON.stringify(project));
      serverdetails.rpa==true?
      uploadSingleFileRPA(project, serverdetails):
      uploadSingleFile(project, serverdetails);

 //   });

  })
}


function exportProject(project) {
  return Manager.validatePluginExport(project).then(() => {
    return Selianize(project, {
      silenceErrors: true,
      skipStdLibEmitting: true,
    }).catch(err => {
      const markdown = ParseError((err && err.message) || err)
      ModalState.showAlert({
        title: 'Error saving project',
        description: markdown,
        confirmLabel: 'download log',
        cancelLabel: 'close',
      }).then(choseDownload => {
        if (choseDownload) {
          browser.downloads.download({
            filename: project.name + '-logs.md',
            url: createBlob('text/markdown', markdown),
            saveAs: true,
            conflictAction: 'overwrite',
          })
        }
      })
      return Promise.reject()
    })
  })
}

export function downloadUniqueFile(filename, body, mimeType = 'text/plain') {
  browser.downloads.download({
    filename,
    url: createBlob(mimeType, body),
    saveAs: true,
    conflictAction: 'overwrite',
  })
}

let previousFile = null
// eslint-disable-next-line
function createBlob(mimeType, data) {
  const blob = new Blob([data], {
    type: mimeType,
  })
  // If we are replacing a previously generated file we need to
  // manually revoke the object URL to avoid memory leaks.
  if (previousFile !== null) {
    window.URL.revokeObjectURL(previousFile)
  }
  previousFile = window.URL.createObjectURL(blob)
  return previousFile
}

export function loadProject(project, file) {
  function displayError(error) {
    ModalState.showAlert({
      title: 'Error migrating project',
      description: error.message,
      confirmLabel: 'close',
    })
  }
  return loadAsText(file).then(contents => {
    if (/\.side$/i.test(file.name)) {
      loadJSProject(project, UpgradeProject(JSON.parse(contents)))
    } else {
      try {
        const type = verifyFile(contents)
        if (type === FileTypes.Suite) {
          ModalState.importSuite(contents, files => {
            try {
              loadJSProject(project, migrateProject(files))
            } catch (error) {
              displayError(error)
            }
          })
        } else if (type === FileTypes.TestCase) {
          let { test, baseUrl } = migrateTestCase(contents)
          if (project.urls.length && !project.urls.includes(baseUrl)) {
            ModalState.showAlert({
              title: 'Migrate test case',
              description: `The test case you're trying to migrate has a different base URL (${baseUrl}) than the project's one.  \nIn order to migrate the test case URLs will be made absolute.`,
              confirmLabel: 'migrate',
              cancelLabel: 'discard',
            }).then(choseMigration => {
              if (choseMigration) {
                UiState.selectTest(
                  project.addTestCase(
                    TestCase.fromJS(migrateUrls(test, baseUrl))
                  )
                )
              }
            })
          } else {
            UiState.selectTest(
              project.addTestCase(TestCase.fromJS(test, baseUrl))
            )
          }
        }
      } catch (error) {
        displayError(error)
      }
    }
  })
}

export function loadJSProject(project, data) {
  UiState.changeView('Tests')
  PlaybackState.clearPlayingCache()
  UiState.clearViewCache()
  project.fromJS(data)
  UiState.projectChanged()
  Manager.emitMessage({
    action: 'event',
    event: 'projectLoaded',
    options: {
      projectName: project.name,
      projectId: project.id,
    },
  })
}

function uploadSingleFile(project, serverdetails) {
  console.log("server details received " + serverdetails);
  console.log("upload file to server");
  var formData = new FormData();
  formData.append("file", JSON.stringify(project));
	formData.append("fileName", serverdetails.projectName);
	formData.append("processDefId", serverdetails.processDefId);
	formData.append("activityId", serverdetails.activityId);
	formData.append("cabinetName", serverdetails.cabinetName);
	formData.append("processState", serverdetails.processState);
  console.log(JSON.stringify(project));
  var xhr = new XMLHttpRequest();
	
//  xhr.open("POST", serverdetails.baseurl + "pmweb/publish?file=" + JSON.stringify(project) + "&fileName=" + serverdetails.projectName);

/*
Added by vinay for Bug  86840 
*/
  xhr.open("POST", serverdetails.baseurl + "pmweb/publish");
  xhr.onload = function () {
    console.log("inside on load ");
   if (xhr.status == 200) {
      console.log("fsdfsd");
     swal({
		 html:true,
  title: "WebRecorder",
   position: 'center',
   text: 'File Uploaded Successfully',
  icon: "success",
  
  showConfirmButton: true,
  
}).then(
 function(){
   window.close();
});




 //  window.close();
      
    }
  }
  xhr.send(formData);
}

//RPA changes starts here 

const fetchRPAData = async (project,msg) => {
  console.log("versionid  is "+msg.versionId)
  console.log("record  is "+msg.recordId)
  console.log("message "+msg.saveip)
  const response = await fetch(msg.serverUrl+`/webrecorder/${msg.recordId}/${msg.versionId}`,{
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
      "Access-Control-Allow-Origin":" *"
    },
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    // body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  const data = await response.json();
    console.log(data)
    loadJSProject(project, data.data)
    return data;
}


const postRPAData = async (project,serverdetails) => {
  const response = await fetch(serverdetails.serverUrl+"/webrecorder",{
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
      "Access-Control-Allow-Origin":" *"
    },
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
     body: JSON.stringify(project) // body data type must match "Content-Type" header
  });

  const data = await response.json();
  if(response.status==200){
    console.log(response.data)
   
    console.log(" data save response 200")
    swal({
      html:true,
   title: "WebRecorder",
    position: 'center',
    text: 'File Uploaded Successfully',
   icon: "success",
   
   showConfirmButton: true,
   
  })
  }else{
    console.log("failed data save")
  }
  console.log(data.data[0])
  const temp={
    versionId:serverdetails.versionId,
    recordId:data.data[0]
  }
  try{
    const socket = new SockJS(serverdetails.serverUrl+"/designerWebSockets");
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
      console.log("Connected: " + frame);
      stompClient.send("/socket/rules", {},JSON.stringify({...temp}));
    });
  } catch (error) {
    console.log(error);
  }
  console.log("send messgae" + JSON.stringify({...temp}));
  
    console.log(data)
    return data;
}

export const openRecordedProjectRPA=(project,msg)=>{
console.log("inside RPA Filesystem");
const data= fetchRPAData(project,msg);
console.log("executed succeessfully");


}

const uploadSingleFileRPA=(project, serverdetails)=>{
  console.log("inside RPA Post");
  project.versionId=serverdetails.versionId;
  project.scriptId=serverdetails.scriptId;
  project.recordId=serverdetails.recordId;
  console.log("display after version"+project);
  postRPAData(project,serverdetails)
}
