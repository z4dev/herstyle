"use client"
import { store } from '@/utils/store'
import React from 'react'
import { Provider } from 'react-redux'

function Redux({children}:{children:React.ReactNode}) {
  return (
    <Provider store={store}>
        {children}
    </Provider>
  )
}

export default Redux