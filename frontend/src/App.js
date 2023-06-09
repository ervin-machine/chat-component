import React, { useState, useEffect } from "react";
import './module.scss'

import { useAuth0 } from "@auth0/auth0-react";

import Chat from "./containers/Chat";
import User from "./containers/User"
import Navbar from "./layout/Navbar";
import socket from "./socket";

import { sortUsers } from "./utils/sortUsers";

function App() {
  const [usersList, addUsers] = useState([]);
  const [loggedUser, setLoggedUser] = useState()
  const [curretSocketId, setCurrentSockedId] = useState()
  const { isAuthenticated, user } = useAuth0();

  useEffect(() => {
    if(isAuthenticated) {
      const { nickname, sub, picture } = user;
      console.log(user)
      socket.auth = { nickname, sub, picture };
      socket.connect();
    }
    // eslint-disable-next-line
  }, [isAuthenticated])

  socket.on("users", (users, status) => {

    // eslint-disable-next-line
    users.map((user) => {
      user.self = user.user_id === socket.id;

      if(user.user_id === socket.id) {
        setLoggedUser(user)
        setCurrentSockedId(socket.id)
      }
    });

    users = sortUsers(users)

    addUsers(users);
  });

socket.on("user connected", (users, id) => {
    const updateUser = users.map(u => {
      if(u.user_id === id) {
        return {...u, status: "Active"}
      }
      return u
    })

    addUsers(updateUser);
  })
  

  return isAuthenticated ?
      <div>
        <Navbar 
          usersList={usersList} 
          setUsersList={addUsers} 
          loggedUser={loggedUser} 
          setLoggedUser={setLoggedUser} 
        /> 
        <Chat 
          usersList={usersList} 
          loggedUser={loggedUser} 
          curretSocketId={curretSocketId} 
          setUsersList={addUsers} 
          setLoggedUser={setLoggedUser} 
          />
      </div>
          :
        <User />
}

export default App;
