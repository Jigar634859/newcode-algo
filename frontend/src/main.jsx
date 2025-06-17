import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter , createRoutesFromElements, Route, RouterProvider  } from 'react-router-dom'
import { Layout } from './Layout.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import { AuthProvider } from './context/AuthContext'
import App from './App.jsx'
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout/>}>
      <Route path='/' element={<App/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  </StrictMode>,
)
