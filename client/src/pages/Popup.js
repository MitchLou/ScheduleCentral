import React from 'react'
import './Popup.css'
function Popup(employee_ID) {
  return (employee_ID.trigger) ?(
    <div className="popup">
        <div className="popup-inner">
            <button className="close-btn" onClick={()=> employee_ID.setTrigger(false)}>close</button>
            {employee_ID.children}
        </div>

    </div>
  ):"";
}

export default Popup