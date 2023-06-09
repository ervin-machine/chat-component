import React from 'react'

function SearchChat(props) {
  const { setSearchValue} = props

  const handleSearchValue = (e) => {
    setSearchValue(e.target.value)
  }

  return (
    <div>
        <input className='search-input' placeholder='Search a chat ...' onChange={handleSearchValue} />
    </div>
  )
}

export default SearchChat