import { resolveDriverName } from '@seleniumhq/get-driver'
import { ChildProcess, spawn } from 'child_process'
import { app } from 'electron'
import * as fs from 'fs-extra'
import { BrowserInfo, Session } from 'main/types'
import * as path from 'node:path'
import * as os from 'os'
import { COLOR_MAGENTA, COLOR_YELLOW, isAutomated, vdebuglog } from 'main/util'

const successMessage = 'was started successfully.'
export interface DriverStartSuccess {
  driver: ChildProcess
  success: true
}
export interface DriverStartFailure {
  error: string
  success: false
}

export const WebdriverDebugLog = vdebuglog('webdriver', COLOR_MAGENTA)
export const WebdriverDebugLogErr = vdebuglog('webdriver-error', COLOR_YELLOW)

export const port = isAutomated ? 9518 : app.isPackaged ? 9516 : 9515

/**
 * This module is just an async function that does the following:
 *   1. Grab driver from the node_modules, as fetched by electron-driver
 *   2. Spawn a process of it and waits for `driver was started successfully.`
 *   3. Return successfully if this occurs, or promote the failure if it doesn't work
 *   4. When Electron is quitting, close the child driver process
 */

const electronBinary = `chromedriver${os.platform() === 'win32' ? '.exe' : ''}`
const ourElectronPath = __non_webpack_require__.resolve(
  path.join('electron-chromedriver', 'bin', electronBinary)
)

const getDriver = ({ browser, version }: BrowserInfo) =>
  (browser === 'electron'
    ? ourElectronPath
    : path.resolve(
        path.join(
          __dirname,
          '..',
          'files',
          resolveDriverName({
            browser,
            platform: os.platform(),
            version,
          })
        )
      )
  ).replace('app.asar', 'app.asar.unpacked')

export type StartDriver = (
  session: Session
) => (info: BrowserInfo) => Promise<DriverStartSuccess | DriverStartFailure>

const startDriver: StartDriver = (session: Session) => (info) =>
  new Promise((resolve) => {
    let initialized = false
    const args = ['--verbose', `--port=${port}`]
    const driverPath = getDriver(info)
    console.log(
      'Starting driver',
      info.browser,
      'at',
      driverPath,
      'with args',
      args.join(' ')
    )
    if (fs.existsSync(driverPath)) {
      const driver = spawn(driverPath.replace(/\s/g, ' '), args, {
        detached: true,
        env: {},
        shell: false,
      })
      driver.stdout.on('data', (out: string) => {
        const outStr = `${out}`
        WebdriverDebugLog(outStr)
        const fullyStarted = outStr.includes(successMessage)
        if (fullyStarted) {
          initialized = true
          WebdriverDebugLog('Driver has initialized!')
          resolve({ success: true, driver: driver })
          process.on('beforeExit', async () => {
            try {
              if (!driver.killed) {
                await driver.kill(9)
              }
            } catch (e) {
              console.warn('Failed to kill driver', e)
            }
          })
        }
      })
      driver.stderr.on('data', (err: string) => {
        const errStr = `${err}`
        WebdriverDebugLogErr(errStr)
        if (!initialized) {
          resolve({ success: false, error: errStr })
        }
      })
      driver.on('error', (err: Error) => {
        err.message = 'Webdriver process error: ' + err.message
        WebdriverDebugLogErr(err)
        if (!initialized) {
          return resolve({
            success: false,
            error: err.message,
          })
        }
        if (!session.driver.stopped) {
          startDriver(session)(info)
        }
      })

      driver.on('close', (code: number) => {
        if (code) {
          WebdriverDebugLogErr(`driver has exited with code ${code}`)
          if (!initialized) {
            return resolve({
              success: false,
              error: 'Process has exited before starting with code ' + code,
            })
          }
        }
        if (!session.driver.stopped) {
          startDriver(session)(info)
        }
      })
    } else {
      resolve({
        success: false,
        error: `Missing executable at path ${driverPath}`,
      })
    }
  })

export default startDriver
