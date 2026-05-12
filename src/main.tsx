import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Nexwear } from './Nexwear'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Nexwear />
  </StrictMode>,
)
