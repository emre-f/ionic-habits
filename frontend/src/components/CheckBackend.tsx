import { useState } from 'react'
import CONSTANTS from '../constants'

function CheckBackend() {
    const [backendState, setBackendState] = useState('unknown')

    async function checkBackend() {
        fetch(`${CONSTANTS.API_URL}/users/`)
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
            <button onClick={checkBackend} className="checkBackendButton" id='unknown'>
                Backend Working?
            </button>
        </div>
    )
}

export default CheckBackend