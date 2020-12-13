import React, {useEffect} from 'react'
import firebase from '../config/fbConfig'

function Logout() {
    useEffect(() => {
        firebase.firestore().signOut()
        console.log('Logout')
    }, [])
    return (
        <div>
        </div>
    )
}

export default Logout
