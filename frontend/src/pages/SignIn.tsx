import React from "react"
import { useSignIn } from 'react-auth-kit'
import { useNavigate } from 'react-router-dom'
import { useErrorMessage } from "../components/ErrorMessage";
import CONSTANTS from '../constants'

const SignInComponent = () => {
    const signIn = useSignIn()
    const [formData, setFormData] = React.useState({ username: '', password: '' })

    const { handleMessage } = useErrorMessage();
    const navigate = useNavigate();

    const onSubmit = async (e: any) => {
        e.preventDefault()

        // Make sure formData is entered
        if (!formData || (formData?.username === '' && formData?.password === '')) {
            handleMessage("Please enter a username and password");
            return;
        }

        // Attempt login
        const response = await fetch(`${CONSTANTS.API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const data = await response.json();

            if (signIn) {
                signIn({
                    token: data.token,
                    expiresIn: 86400, // 1 day
                    tokenType: "Bearer",
                    authState: { // What will be STORED in cookies and localStorage
                        username: data.username,
                        id: data.id
                    }
                });

                navigate('/');
            } else {
                //Throw error
            }
        } else {
            handleMessage(`Couldn't log in (Error: ${response.statusText})`);
        }
    }

    return (
        <div className="card" style={{ textAlign: 'center' }}>
            <h1 className="title" style={{ marginBottom: '20px' }}> Welcome Back </h1>
            <div style={{ justifyContent: 'space-between', maxWidth: '360px', display: 'inline-block' }}>
                <table style={{ width: '100%' }}>
                    <tbody>
                        <tr>
                            <td>
                                <input
                                    style={{ fontSize: 20, border: 'none', borderRadius: '10px', width: '80%', padding: '6px', marginBottom: '10px' }}
                                    type="text"
                                    placeholder="username"
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input
                                    style={{ fontSize: 20, border: 'none', borderRadius: '10px', width: '80%', padding: '6px', marginBottom: '10px' }}
                                    type="password"
                                    placeholder="password"
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                                    />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button onClick={onSubmit}>
                                    Login
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default SignInComponent