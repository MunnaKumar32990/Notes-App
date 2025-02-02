import React from 'react'
import ProfileInfo from './cards/ProfileInfo'
import { useNavigate, Link } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar'
import { useState } from 'react'


const Navbar = ({userInfo , onSearchNote,handleClearSearch}) => {

const[searchQuery,setSearchQuery]=useState("");

const navigate =useNavigate();
  const onLogout=()=>  {
    localStorage.clear()

    navigate("/");
  }

  const handleSearch =()=>{
 if(searchQuery){
  onSearchNote(searchQuery)
 }
  }

  const onClearSearch=()=>{
    setSearchQuery("")
  }
  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop drop-shadow'>
      <h2 className='text-xl font-medium-black py-2'>Notes</h2>

      <SearchBar value={searchQuery}
      onChange={(e)=>setSearchQuery(e.target.value)}
      handleSearch={handleSearch}
      onClearSearch={onClearSearch}
      />

      <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>

    </div>
  )
}

export default Navbar
