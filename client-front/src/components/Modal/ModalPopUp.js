import React from 'react'
import './ModalPopUp.css'

function ModalPopup (props) {
  return props.trigger ? (
    <div className='popup'>
      <div className='popup-inner'>
        <button className='close-btn' onClick={() => props.setTrigger(false)}>X</button>
        {props.children}
      </div>
    </div>
  ) : null
}

export default ModalPopup
