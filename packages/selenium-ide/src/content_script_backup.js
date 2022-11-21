document.addEventListener('yourCustomEvent', function (e) {
  var data = e.detail;
  console.log('received', data);
  
//browser.runtime.sendMessage(extensionId, { name: 'msg1', key1: 'value1'}, undefined, (response) => {});
 
//testing in local
  var extensionId='nnhckidchinihnfldkcfgbejmkdpoplg';
 //chrome
  //var extensionId='akobpmedfdpmgocehllaondcdhldoedp';
  //mozila
   //var extensionId='155992928d924b8041c7135a5fba8b366430297e@temporary-addon';
   //edge 
  // var extensionId='mmmdfkddgoiebnkkgpdompjmonpnplpl';
  
    var hasExtension = false;
    var completeurl=window.location.href;
	
		


        chrome.runtime.sendMessage(extensionId, {
			 message: "version",   
				rpa:data.rpa,
				versionId:data.versionId,
				scriptId:data.scriptId,
				recordId:data.recordId,
				serverUrl:data.serverUrl,
				previousRecorded:data.previousRecorded
				
            },

            function (reply) {
                console.log(reply);
                if (reply) {
                    if (reply.version) {
                        if (reply.version >= 1.0) {
                            hasExtension = true;
                            // alert("Extension is installed " + hasExtension);
                        }
                    }
                } else {
                    hasExtension = false;
                    alert(WEB_RECORDER_ERROR_MSG + hasExtension);
                }
            });
        






});