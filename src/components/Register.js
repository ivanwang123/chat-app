import React, {useState, useEffect} from 'react'
import firebase from '../config/fbConfig'
import {useHistory} from 'react-router-dom'

function Register() {

    const history = useHistory()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [name, setName] = useState('')
    const [profilePic, setProfilePic] = useState('')
    const [error, setError] = useState('')

    const handleRegister = (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError('Confirmed password does not match the password')
        } else if (password.length < 8) {
            setError('Password must be at least 8 characters long')
        } else if (name.length < 2) {
            setError('Name must be at least 2 characters long')
        } else {
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((cred) => {
                    setError('')
                    firebase.firestore().collection('users').doc(cred.user.uid).set({
                        name: name,
                        profilePic: profilePic,
                        chats: []
                    })
                }).then(() => {
                    console.log('Register')
                    history.push('/login')
                }).catch(err => {
                    setError(err.message)
                })
        }
    }

    return (
        <div className="vh-100 d-flex justify-content-center align-items-center">
            <form onSubmit={handleRegister} className="d-flex flex-column w-50">
                <label htmlFor="email">Email
                    <input type="email" className="form-control w-100" name="email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                </label>

                <label htmlFor="password">Password
                    <input type="password" className="form-control w-100" name="password" id="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                </label>

                <label htmlFor="confirmPassword">Confirm Password
                    <input type="password" className="form-control w-100" name="confirmPassword" id="confirmPassword" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required />
                </label>

                <label htmlFor="name">Display Name
                    <input type="text" className="form-control w-100" name="name" id="name" value={name} onChange={(e)=>setName(e.target.value)} required />
                </label>

                <label htmlFor="pic">Profile Picture
                    <input type="text" className="form-control w-100" name="pic" id="pic" value={profilePic} onChange={(e)=>setProfilePic(e.target.value)} required />
                </label>

                <button type="submit" className="btn btn-primary mt-3">Sign Up</button>

                <div className="text-danger mt-2 mb-2">{error}</div>

                <small className="form-text text-muted">Already have an account? <button type="button" className="btn btn-link link-button" onClick={()=>history.push('/login')}><small>Login</small></button></small>
            </form>
        </div>
    )
}

export default Register
