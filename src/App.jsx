import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import './App.css'
import Home from './Pages/Home'
import EditorPage from './Pages/EditorPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <Toaster 
      position='top-right'
      toastOptions={{
        success:{
          theme:{
            primary:'#282a80'
          }
        }
      }}></Toaster>
    </div>
     <BrowserRouter>
     <Routes>
      <Route path ="/"element={<Home/>}/>
      <Route path='/editor/:roomid' element={<EditorPage/>}/>
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
