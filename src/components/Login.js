import React, {useState, useEffect} from 'react'
import firebase from '../config/fbConfig'
import {useHistory} from 'react-router-dom'

function Login() {

    const history = useHistory()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLogin = (e) => {
        e.preventDefault()

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((cred) => {
                console.log('Login')
                setError('')
                history.push('/chat')
            }).catch(err => {
                setError('Email or password is incorrect')
            })
    }

    return (
        <div className="vh-100 d-flex justify-content-center align-items-center">
            <form onSubmit={handleLogin} className="d-flex flex-column w-50">
                <label htmlFor="email">Email
                    <input type="email" className="form-control w-100" name="email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                </label>

                <label htmlFor="password">Password
                    <input type="password" className="form-control w-100" name="password" id="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                </label>

                <button type="submit" className="btn btn-primary mt-3">Login</button>

                <div className="text-danger mt-2 mb-2">{error}</div>

                <small className="form-text text-muted">Don't have an account? <button type="button" className="btn btn-link link-button" onClick={()=>history.push('/')}><small>Sign Up</small></button></small>

            </form>
        </div>
    )
}

export default Login
