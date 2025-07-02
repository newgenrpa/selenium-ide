// This is a big import block area but I'm just gonna write some stuff

type Variables = Record<string, any>
const globalVars: Variables = {}

const suiteBlock = async (name: string, fn: () => any) => {
  console.log('Begin suite', name)
  await fn()
  console.log('End suite', name)
}

const testBlock = async (name: string, fn: () => any) => {
  console.log('Begin test', name)
  await fn()
  console.log('End test', name)
}

const findElement = (locatorType: 'css' | 'xpath', locator: string) => {
  console.log(
    'Finding element using locator type',
    locatorType,
    'and locator',
    locator
  )
  return {
    clear: () => null,
    click: () => null,
    select: (_selectorType: 'label' | 'name' | 'value', _selector: any) => null,
    sendKeys: (_keys: string) => null,
    sendMultiKeys: (_keys: string[]) => null,
    storeAttribute: (_attribute: string) => null,
    storeText: (_text: string) => null,
    storeValue: (_value: any) => null,
    waitForAttribute: (_attribute: string, _value: any, _time: number) => null,
    waitForText: (_text: string, _time: number) => null,
    waitForValue: (_value: any, _time: number) => null,
  }
}

const performCustomAction = (
  _actionName: string,
  _actionVariable1: string,
  _actionVariable2: number
) => null

const executeScript = (_script: string) => _script

suiteBlock('BEGIN_SUITE', async () => {
  const suiteVars: Variables = {}
  testBlock('BEGIN_TEST', async () => {
    const testVars: Variables = {}
    const NUM_TIMEOUT = 0
    // COMMENT_STRING
    console.log('LOG_STRING_STATIC')
    console.log(`${'LOG_STRING_WITH_VARIABLES'}`)
    globalVars.foo = 'SET_GLOBAL_VARIABLE'
    suiteVars.foo = 'SET_SUITE_VARIABLE'
    testVars.foo = 'SET_TEST_VARIABLE'
    suiteVars.nestedVars = [{ a: '' }]
    suiteVars.nestedVars[0]['a'] = 'SET_NESTED_VARIABLE'

    findElement('css', '.LOCATOR_CSS')
    findElement('xpath', '//*[@id="LOCATOR_XPATH"]')
    findElement('css', '.CLICK').click()
    findElement('css', '.SEND_KEYS').sendKeys('SEND_KEYS_STRING')

    // BEGIN_SEND_MULTI_KEYS
    findElement('css', '.SEND_MULTI_KEYS').sendMultiKeys([
      'SEND_MULTI_KEYS_1',
      'SEND_MULTI_KEYS_2',
    ])
    // END_SEND_MULTI_KEYS

    findElement('css', '.SELECT_LABEL').select('label', 'SELECTOR')
    findElement('css', '.SELECT_NAME').select('name', 'SELECTOR')
    findElement('css', '.SELECT_VALUE').select('value', 'SELECTOR')

    findElement('css', '.STORE_ATTRIBUTE').storeAttribute('ATTRIBUTE')
    findElement('css', '.STORE_TEXT').storeText('TEXT')
    findElement('css', '.STORE_VALUE').storeValue('VALUE')

    // BEGIN_WAIT_FOR_ATTRIBUTE
    findElement('css', '.WAIT_FOR_ATTRIBUTE').waitForAttribute(
      'ATTRIBUTE',
      'VALUE',
      NUM_TIMEOUT
    )
    // END_WAIT_FOR_ATTRIBUTE

    findElement('css', '.WAIT_FOR_TEXT').waitForText('TEXT', NUM_TIMEOUT)
    findElement('css', '.WAIT_FOR_VALUE').waitForValue('VALUE', NUM_TIMEOUT)

    // BEGIN EXECUTE_SCRIPT
    globalVars.EXECUTE_SCRIPT_VARIABLE_NAME = executeScript(
      'return "EXECUTE_SCRIPT_BODY";'
    )
    // END EXECUTE_SCRIPT

    const NUM_ACTION_VARIABLE_2 = 5
    // BEGIN_PERFORM_CUSTOM_ACTION
    performCustomAction(
      'PERFORM_CUSTOM_ACTION_ACTION_NAME',
      'ACTION_VARIABLE_1',
      NUM_ACTION_VARIABLE_2
    )
    // END_PERFORM_CUSTOM_ACTION
    // END TEST
  })
  // END SUITE
})
