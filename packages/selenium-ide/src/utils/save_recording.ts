
import { ProjectShape } from '@seleniumhq/side-model'

// Function to extract path up to but not including 'WebRecorder'


function extractPath(actualPath: string) {
  const target = "\\WebRecorder";
  const targetIndex = actualPath.indexOf(target);
  if (targetIndex !== -1) {
    // Return the substring up to but not including 'WebRecorder'
    return actualPath.substring(0, targetIndex);
  } else {
    // If 'WebRecorder' is not found in the path
    return null;
  }
}


function showToastMessage(message: string | null) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;
  document.body.appendChild(toast);
  // Inject CSS into the document head
  const styleElement = document.createElement("style");
  styleElement.textContent = toastStyles;
  document.head.appendChild(styleElement);
  setTimeout(() => {
    toast.remove();
  }, 3000); 
}

// CSS styles
const toastStyles = `
  .toast {
    position: fixed;
    top: 23px;
    right: 20px;
    background-color: rgba(0, 128, 0, 0.8);
    color: #fff;
    padding: 12px 20px;
    border-radius: 5px;
    z-index: 9999;
  }
`;




export async function saveRecording(project: ProjectShape) {
  try {
    const path = window.location.pathname;
    var actualPath = decodeURIComponent(path).substring(1).replace(/\//g, '\\');
    console.log("Current Path is " + actualPath);
    const result = extractPath(actualPath);
    let finalPath = "";
    if (result !== null) {
      finalPath = result + "\\config.properties";
      console.log(finalPath); // Output: C:\Users\pragya.rai\Downloads\Bot-RPA (11)\config.properties
    } else {
      console.log("Path not found");
      return false;
    }
    const responseFile = await fetch(finalPath);
    const configText = await responseFile.text();
    const lines = configText.split('\n');

    // Initialize configuration object
    const config: { [key: string]: string } = {};

    // Parse configuration properties
    lines.forEach(line => {
      const [key, value] = line.split('=');
      config[key.trim()] = value;
    });
    const IP = `${config['client.url']}`;
    const PORT = `${config['robot.port']}`;
    if (!IP || !PORT) {
      console.log("Invalid IP or PORT in config");
      return false;
    }

    const response = await fetch(`http://${IP}:${PORT}/webrecorder/actions`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
        "Access-Control-Allow-Origin": " *"
      },
            body: JSON.stringify(project, undefined, 2) // body data type must match "Content-Type" header
    });

    if (response.status == 200) {
      console.log(response)
      console.log(" data save response 200")
      showToastMessage("Script saved sucessfully !");
      setTimeout(() => {
        globalThis.window.close();
      }, 1500); // 2000 milliseconds = 1.5seconds 

    } else {
      showToastMessage("Failed data save !");
      console.log(response)
    }
  }
  catch (e) {
    console.log(e);
    return false

  }
  return true
}
