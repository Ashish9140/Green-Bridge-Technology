import React from 'react'

const Alert = ({ text }) => {
    setTimeout(function () { document.querySelector('.alrt').innerHTML = ''; }, 5000);
    return (
        <div className='alrt'>
            {text}
        </div>
    )
}

export default Alert