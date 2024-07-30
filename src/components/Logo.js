import React from 'react'
import PtitLogo from '../assest/logo/PTITimages.png'

const Logo = ({w,h}) => {
  return (
    <img src={PtitLogo} width={w} height={h} alt="PTIT Logo" className='object-contain' />
  )
}

export default Logo