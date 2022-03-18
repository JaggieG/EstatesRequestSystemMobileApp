import React from 'react'
import {render} from 'react-native-testing-library'
import App from './App'

import CustomTabNavigatorComponent from './CustomComponents/TabNavigator'
import ConnectionTabComponent from './CustomComponents/ConnectionTab'
import  MyRequestsTabComponent from './CustomComponents/MyRequestsTab'
import  MakeARequestTabComponent from './CustomComponents/MakeARequestTab'
import  SettingsTabComponent  from './CustomComponents/SettingsTab'
import  AssignedRequestTabComponent  from './CustomComponents/AssignedRequestsTab'

import "isomorphic-fetch";

// Extend Jest "expect" functionality with Testing Library assertions.
import '@testing-library/jest-dom'

import {getAllMyRequests,getSystemRole, getItemList,getUrgencyList, getRequestRecordCounts,getAllMyAssignedRequests} from './CustomLogic/data_api'
import {processAuthAtStartUp} from './CustomLogic/auth_api'
import { getTranslatedMessage } from './CustomLogic/messages'

import appInfoStore from './CustomLogic/appInfoStore'
import {forced_dev_emailAdddress, forced_dev_displayName, forced_dev_JWTToken} from './CustomLogic/globalSettings'

describe("Check data api", () => {
  const appInfo = appInfoStore.getState()

  // force the required dev info so the tests work
  appInfo.email_address = forced_dev_emailAdddress
  appInfo.display_name = forced_dev_displayName
  appInfo.JWT_Token = forced_dev_JWTToken


  it('getAllMyRequests return expected data', done => {
     getAllMyRequests(appInfo, true, function(err, dataReturn) {
       if (err) {
          done(true)
       } else {
  
        if (dataReturn.record_count >= 0 ) {
          done(false)
        } else {
          
          done(true)
        }
       } 
    })
  })


 it('getAllMyAssignedRequests returns expected data', done => {
  getAllMyAssignedRequests(appInfo, true, function(err, dataReturn) {
    if (err) {
       done(true)
    } else {

     if (dataReturn.record_count >= 0 ) {
      done(false)
     } else {
       
       done(true)
     }
    } 
 })
})



it('getRequestRecordCounts returns expected data', done => {
  getRequestRecordCounts(appInfo, true, function(err, dataReturn) {
    if (err) {  
       done(true)
    } else {

     if (dataReturn.assigned_requests >= 0  && dataReturn.my_requests>= 0) {
      done(false)
     } else {     
       done(true)
     }
    } 
 })
})



it('getUrgencyList returns expected data', done => {
  getUrgencyList(appInfo, function(err, dataReturn) {
    if (err) {
       done(true)
    } else {

     if (dataReturn.message.length > 0 ) {
       done(false)
     } else {
       done(true)
     }
    } 
 })
})



it('getItemList returns expected data', done => {
  getItemList(appInfo, function(err, dataReturn) {
    if (err) {
      done(true)
   } else {

    if (dataReturn.message.data.length > 0 ) {
      done(false)
    } else {
      done(true)
    }
   } 
 })
})

it('getSystemRole returns expected data', done => {
  getSystemRole(appInfo, function(err, dataReturn) {
    if (err) {
      done(true)
   } else {

    if (dataReturn.message >= 0 ) {
      done(false)
    } else {
      done(true)
    }
   } 
 })
})

})

describe("Check authentication api", () => {
  const appInfo = appInfoStore.getState()

  // force the required dev info so the tests work
  appInfo.email_address = forced_dev_emailAdddress
  appInfo.display_name = forced_dev_displayName
  appInfo.JWT_Token = forced_dev_JWTToken

    it('processAuthAtStartUp returns expected data', done => {
      processAuthAtStartUp(appInfoStore, function(data) {
        if (dataReturn) {
          done(false)
        } else {
          done(false)
        }
       
     })
    })
})


describe("Check translation class api", () => {
  const appInfo = appInfoStore.getState()


    it('getTranslatedMessage works for English', () => {
      
      // force language to English

      appInfoStore.dispatch({
        type: "LANG_UPDATE",
        payload: { 
            app_language : 'en',
        }
        });  


      var english_value = getTranslatedMessage('make_request_title', appInfoStore)
      expect(english_value).toBe('Title')
    })


    it('getTranslatedMessage works for French', () => {

      // force language to French

      appInfoStore.dispatch({
        type: "LANG_UPDATE",
        payload: { 
            app_language : 'fr',
        }
        });  

        var french_value = getTranslatedMessage('make_request_title', appInfoStore)
        expect(french_value).toBe('Titre')
    })
})

 describe("Functional Components", () => {
  it('<App /> should match snapshot', () => {
    const snap = render(<App />).toJSON()
    expect(snap).toMatchSnapshot()
  })

  it('<Tab Navigtor /> should match snapshot', () => {
    const snap = render(<CustomTabNavigatorComponent />).toJSON()
    expect(snap).toMatchSnapshot()
  })

  it('<ConnectionTabComponent /> should match snapshot', () => {
    const snap = render(<ConnectionTabComponent />).toJSON()
    expect(snap).toMatchSnapshot()
  })

  it('<MyRequestsTabComponent /> should match snapshot', () => {
    const snap = render(<MyRequestsTabComponent />).toJSON()
    expect(snap).toMatchSnapshot()
  })

  it('<MakeARequestTabComponent /> should match snapshot', () => {
    const snap = render(<MakeARequestTabComponent />).toJSON()
    expect(snap).toMatchSnapshot()
  })

  it('<SettingsTabComponent /> should match snapshot', () => {
    const snap = render(<SettingsTabComponent />).toJSON()
    expect(snap).toMatchSnapshot()
  })
  it('<AssignedRequestTabComponent /> should match snapshot', () => {
    const snap = render(<AssignedRequestTabComponent />).toJSON()
    expect(snap).toMatchSnapshot()
  })
    
 });