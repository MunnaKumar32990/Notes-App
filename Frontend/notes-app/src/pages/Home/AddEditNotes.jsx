import React, { useState } from 'react'
import TagInput from '../../components/Navbar/Input/TagInput'
import {MdClose } from "react-icons/md"
import axiosInstance from '../../utils/axiosInstance'
const AddEditNotes = ({ type, getAllNotes, onClose, noteData,showToastMessage }) => {

  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  
  const [error, setError] = useState(null);

const addNewNote = async () => {
  try {
    const response = await axiosInstance.post('/add-note',   {
      title,
      content,
      tags,
      });

      if(response.data && response.data.note){
        showToastMessage("Note Added successfully")
        getAllNotes();
        onClose();
      }
  }
  catch (error) {
    if(error.response && error.response.data && error.response.data.message){
      setError(error.response.data.message)
    }
  }
};
const EditNote= async () => {

  const noteId = noteData._id
  try{
    const response = await axiosInstance.put('/edit-note/'+noteId,   {
      title,
      content,
      tags,
    });
    if(response.data && response.data.note){
      showToastMessage("Note updated successfully")
      getAllNotes();
      onClose();
      }
    }
    catch (error) {
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message)
        }
  }
};

  const handleAddNote =()=>{
    if(!title){
      setError("Please enter a title")
      return;
    }
    if(!content){
      setError("Please enter a content")
      return;
  }
  setError("")

  if (type == 'edit'){
    EditNote()
  }
  else{
    addNewNote()
  }
};
  return (
    <div className='relative'>

      <button 
      className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
      onClick={onClose} >
        <MdClose className='text-xl text-slate-400'/>
      </button>



      <div className='flex flex-col gap-2'>
        <label className='text-slate-400'>TITLE</label>
        <input 
        type='text'
        className='text-2xl text-slate-950 outline-none'
        placeholder='Go To Gym At 5'  
        value={title}
        onChange={({ target }) => setTitle(target.value)} 
        />
      </div>
      <div className='flex flex-col gap-2 mt-4'>
        <label className='text-slate-400'>CONTENT</label>
        <textarea
        type='text'
        className=' text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
        placeholder='Content'
        rows={10}
        value={content}
        onChange={({ target }) => setContent(target.value)}
        />
      </div>
      <div className='mt-3'>
        <label className='input-label'>TAGS</label>
        <TagInput tags={tags} setTags={setTags}/>
      </div>

      {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}
      <button 
      className='bg-blue-500 hover:bg-blue-600 font-medium mt-5 p-3' onClick={handleAddNote}>
        {type === 'edit' ? 'UPDATE' : 'ADD' }
      </button>
    </div>
  )
}

export default AddEditNotes
