export const onUpdateUserStatus = (status, id, usersList) => { 
    return usersList.map(user => {
        if(user.user_id === id) {
            return {...user, status: status}
        }

        return user
    })
}

export const onUpdateMessageStatus = (status, id, messages) => { 
    return messages.map(message => {
        if(message?.fromUserId === id) {
            return {...message, status: status}
        }

        return message;
    })
}

export const onUserNotificationUpdate = (userid, usersList, data) => {
    return usersList.map(user => {
        if(user.user_id === userid) {
            return {...user, hasNewMessage: data}
        }

        return user
      })
}

export const onMessageOption = (id, messages, data) => {
    return messages.map(message => {
        if(message.id === id) {
            return { ...message, optionsOpen: !message.optionsOpen}
        }

        return message
    })
}

export const onDeleteMessage = (messages, messageid) => {
    return messages.map((message) => {
        if(message.id === messageid) {
            return { ...message, isDeleted: true}
        }

        return message;
    })
}

export const onEnableMessageEdit = (messages, id, data) => {
    return messages.map((message) => {
        if(message.id === id) {
            return { ...message, isEditMode: data}
        }

        return message;
    })
}

export const onEditMessage = (messages, id, content) => {
    return messages.map((message) => {
        if(message.id === id) {
            return { ...message, content: content}
        }

        return message;
    })
}

export const onSearchChat = (usersList, searchValue) => {
    return usersList.filter(user => user?.nickname
        .toLowerCase()
        .includes(searchValue.toLowerCase())
  );
}

export const onUserOption = (usersList, id, option, loggedUser) => {
    if(option === "remove") {
        return usersList.map(user => {
            if(user.user_id === loggedUser?.user_id) {
                return {...user, removedUsers: [...user.removedUsers, id]}
            }
            return user;
        })
    }

    if(option === "mute") {
        return usersList.map(user => {
            if(user.user_id === loggedUser?.user_id) {
                return {...user, mutedUsers: [...user.mutedUsers, id]}
            }
            return user;
        })
    }
}

export const onRemovedUser = (usersList, loggedUser) => {
    // eslint-disable-next-line 
    let currentUser = usersList.filter(user => {
        if(user?.user_id === loggedUser?.user_id) {
            return user
        }
    })

    return usersList.filter(el => { return !currentUser[0]?.removedUsers?.includes(el?.user_id) } )
}