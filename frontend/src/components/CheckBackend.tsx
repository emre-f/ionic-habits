import { useState } from 'react'

function CheckBackend() {
    const [backendState, setBackendState] = useState('unknown')

    async function checkBackend() {
        fetch('http://localhost:3500/users/')
            .then((res) => {
                var respondStatus = 'unknown'
                if (res.status === 200) {
                    respondStatus = 'working'
                } else {
                    respondStatus = 'not-working'
                }

                setBackendState(respondStatus)
                document.getElementsByClassName('checkBackendButton')[0].setAttribute('id', respondStatus);
            })
            .catch((err) => { 
                setBackendState('not-working') 
                document.getElementsByClassName('checkBackendButton')[0].setAttribute('id', 'not-working');
            })
    }

    return (
        <div className="card">
            <p> Check if the backend service is working </p>
            <button onClick={checkBackend} className="checkBackendButton" id='unknown'>
                Backend Working?
            </button>
        </div>
    )
}

export default CheckBackend