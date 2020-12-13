import React, {useState, useEffect, useRef} from 'react'
import firebase from '../config/fbConfig'
import Pusher from 'pusher-js'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import {Users, Plus, Send} from 'react-feather'
import randomize from 'randomatic'

function Chat() {

    const history = useHistory()

    const [pusher, setPusher] = useState(null)
    const [name, setName] = useState('')
    const [profilePic, setProfilePic] = useState('')
    const [userId, setUserId] = useState('')
    const [chat, setChat] = useState('')
    const [curChat, setCurChat] = useState('')
    const [message, setMessage] = useState('')
    const [msgHistory, setMsgHistory] = useState([])
    const [chatList, setChatList] = useState([])

    const msgFeed = useRef(null)

    useEffect(() => {

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // User logged in
                console.log('user logged in: ', user.uid);
                firebase.firestore().collection('users').doc(user.uid).get().then(doc => {
                        console.log('User doc data', doc.data())
                        setName(doc.data().name)
                        setProfilePic(doc.data().profilePic ? doc.data().profilePic : 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQM-cV8YG95BoV7ocurYmh5pmjOPphsPa90DQ&usqp=CAU')
                        setUserId(user.uid)

                        if (doc.data().chats.length)
                            firebase.firestore().collection('chats').where(firebase.firestore.FieldPath.documentId(), 'in', [...doc.data().chats]).get().then(snapshot => {
                                console.log("CHATS", snapshot)
                                let newChatList = []

                                snapshot.docs.forEach(doc => {
                                    const chatData = {
                                        id: doc.id,
                                        name: doc.data().name
                                    }
                                    console.log("FIREBASE CHAT", chatData)
                                    newChatList.push(chatData)
                                })

                                setChatList(newChatList)
                            }).catch(err => console.log(err))
                        else
                            setChatList([])
                    }).catch(err => console.log(err))
            } else {
                // User logged out
                console.log('user logged out')
                setName('')
                history.push('/login')
            }
        })

        var pusher = new Pusher('3d3505a324650e8c364b', {
            cluster: 'us2',
            useTLS: true
        });

        setPusher(pusher)
    }, [])

    const joinChat = (chat) => {
        if (chat.id !== curChat.id) {
            pusher.unsubscribe(curChat.id)
            var channel = pusher.subscribe(chat.id);

            firebase.firestore().collection('chats').doc(chat.id).get().then(doc => {
                setMsgHistory([...doc.data().messages])
                if (msgFeed)
                    msgFeed.current.scrollTop = msgFeed.current.scrollHeight
            }).catch(err => console.log(err))
    
            channel.bind('message', (data) => {
                console.log("MESSAGE", data)
                setMsgHistory(prevChatHistory => [...prevChatHistory, {username: data.name, message: data.message, profilePic: data.profilePic}])

                // Auto scroll whenever new message appears
                if (msgFeed)
                    msgFeed.current.scrollTop = msgFeed.current.scrollHeight
            })
    
            axios.put(`http://localhost:5000/user/${chat.id}`)
    
            setCurChat(chat)
        }
    }

    const handleMessageSubmit = (e) => {
        e.preventDefault()

        axios.post('http://localhost:5000/message', {
            chat: curChat.id,
            name: name,
            message: message,
            profilePic: profilePic
        })

        firebase.firestore().collection('chats').doc(curChat.id).update({
            messages: firebase.firestore.FieldValue.arrayUnion({username: name, message: message, profilePic: profilePic})
        })

        setMessage('')
    }

    const handleNewChat = (e) => {
        if (chat.length) {
            const chatId = randomize('Aa0', 4)
            const chatName = chat
    
            firebase.firestore().collection('chats').doc(chatId).set({
                name: chatName,
                messages: [],
                users: []
            }).then(() => {
    
                const newChat = {
                    name: chatName,
                    id: chatId
                }
                console.log("New Chat", newChat)
    
                setChatList(prevChatList => [...prevChatList, newChat])
                joinChat(newChat)
    
                setChat('')
    
                firebase.firestore().collection('users').doc(userId).update({
                    chats: firebase.firestore.FieldValue.arrayUnion(chatId)
                })
            })
        }

    }

    const handleJoinChat = (e) => {
        if (chat.length) {
            const chatId = chat
            firebase.firestore().collection('chats').doc(chatId).get().then(doc => {
                console.log("Join CHat", doc.data())
                const chatData = {
                    id: doc.id,
                    name: doc.data().name
                }
    
                joinChat(chatData)
                setChatList(prevChatList => [...prevChatList, chatData])
                setMsgHistory([...doc.data().messages])
                setChat('')
    
                firebase.firestore().collection('users').doc(userId).update({
                    chats: firebase.firestore.FieldValue.arrayUnion(chatId)
                })
            }).catch(err => console.log(err))
        }
    }

    return (
      <div className="chat-container">

        {/* CHANNEL SIDEBAR */}
        <div className="channel-container bg-dark d-flex flex-column p-2">

            {/* DISPLAY CHATS */}
            <h5 className="m-2 text-light h2">Chats</h5>
            <ul className="chat-list">
                {chatList.map(chat => {
                    const isSelected = chat.id === curChat.id ? 'selected-chat' : 'unselected-chat'
                    return (
                        <li className={`text-light ml-4 chat-selection ${isSelected}`} onClick={()=>joinChat(chat)}>{chat.name}</li>
                        )
                    })}
                <li>
                    <input type="text" className="flex-grow-1 form-control mt-2" name="chat" id="chat" placeholder="New (Name) || Join (ID)" value={chat} onChange={(e)=>setChat(e.target.value)} />
                    <div className="d-flex justify-content-around">
                        <button type="button" className="btn btn-secondary pl-2 pr-2" onClick={handleNewChat}><Plus className="mb-1" color="white" size="20" /> New</button>
                        <button type="button" className="btn btn-secondary pl-2 pr-2" onClick={handleJoinChat}><Plus className="mb-1" color="white" size="20" /> Join</button>
                    </div>
                </li>
            </ul>

            {/* USER INFO */}
            <div className="d-flex flex-grow-1">
                <img className="msg-profile-pic align-self-end m-0" src={profilePic ? profilePic : 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQM-cV8YG95BoV7ocurYmh5pmjOPphsPa90DQ&usqp=CAU'}></img>
                <div className="h5 align-self-end text-light font-weight-bold ml-2">{name}</div>
                <button type="button" className="btn btn-link align-self-end text-light ml-auto" onClick={()=>{firebase.auth().signOut(); history.push('/')}}>Logout</button>
            </div>
        </div>

        {/* MESSAGE FEED */}
        <div className="msg-feed-container">
            <div className="w-100 bg-light p-3 m-0 h5">{curChat ? <div><span className="h5">{curChat.name}</span> · <span className="h6 text-muted">{curChat.id}</span></div> : ''}</div>
            {/* DISPLAY MESSAGES */}
            <div className="msg-feed m-0" ref={msgFeed}>
                {msgHistory.map(msg => {
                    return (
                        <div className="msg-container">
                            <img className="msg-profile-pic" src={msg.profilePic ? msg.profilePic : 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQM-cV8YG95BoV7ocurYmh5pmjOPphsPa90DQ&usqp=CAU'}></img>
                            <div>
                                <div className="msg-name text-dark">{msg.username}</div>
                                <div className="msg-message text-dark">{msg.message}</div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* SEND MESSAGE */}
            <div className="msg-form-container p-3 pb-4">
                <form className="d-flex" onSubmit={handleMessageSubmit}>
                    <input type="text" className="flex-grow-1 form-control" name="message" id="message" placeholder="Message" value={message} onChange={(e)=>setMessage(e.target.value)} />
                    <button type="submit" className="btn btn-secondary ml-3 pl-2 pr-2"><Send color="white" size="20" /></button>
                </form>
            </div>
        </div>
      </div>
    );
  
}

export default Chat;
