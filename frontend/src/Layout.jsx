import React from 'react'
import { Outlet } from 'react-router-dom'
import Topbar from './Components/Topbar'
export const Layout = () => {
  return (
    <>
    <Topbar/>
    <Outlet/>
    </>
  )
}
