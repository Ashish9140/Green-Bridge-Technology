import React from 'react'

const Alert = ({ text }) => {
    return (
        <div className='alert-container'>
            <div className='alert-inner'>
                {text}
            </div>
        </div>
    )
}

export default Alert