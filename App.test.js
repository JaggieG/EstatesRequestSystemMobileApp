import React from 'react'
import {render} from 'react-native-testing-library'
import App from './App'

import 'whatwg-fetch'
// Extend Jest "expect" functionality with Testing Library assertions.
import '@testing-library/jest-dom'


import {} from './CustomLogic/auth_api'
import {getAllMyRequests} from './CustomLogic/data_api'

import appInfoStore from './CustomLogic/appInfoStore'

describe("Check data api", () => {
  const appInfo = appInfoStore.getState()
  it('All My request return expected data', () => {
    
    getAllMyRequests(appInfo, true, function(dataReturn) {
      console.log(dataReturn)
    })
  })

})

// describe("<App />", () => {
//   it("should match snapshot", () => {
//     const snap  = render(<App />).toJSON()
//     expect(snap).toMatchSnapshot()
//   })
// })
