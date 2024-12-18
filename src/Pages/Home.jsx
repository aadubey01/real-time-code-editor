import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import {v4 as uuidv4} from 'uuid'

const Home = () => {

    const navigate = useNavigate();
    const[roomid,setRoomid] = useState('');
    const[username,setUsername] = useState('')

    const createNewRoom=(e)=>{
        e.preventDefault()
        const id = uuidv4()
        setRoomid(id);
        toast.success('Created new room')
    }

    const joinRoom=()=>{
    if(!roomid ||!username){
        toast.error('Room Id and UserName is required')
        return;
    }
    navigate(`/editor/${roomid}`,{
        state:{
            username,
        },
    });
};
const handleInputEnter=(e)=>{
    console.log(e.code)
     if(e.code ==='Enter'){
        joinRoom()
     }
}



  return (
    <div>
    <div className='homePageWrapper' >
        <div className='formWrapper'>
            <img src='/wolfSync.png' alt='wolf-sync' style={{  display: 'block',width:'100px', height:'95px', margin: "0 auto"}} ></img>
            <h4 className='mainLabel'>Paste invitation Room Id</h4>
            <div className='inputGroup'>
                <input type='text'
                className='inputBox'
                placeholder='Room Id'
                onChange={(e)=>setRoomid(e.target.value)}
                value={roomid}
                onKeyUp={handleInputEnter}
                />
                 <input type='text'
                className='inputBox'
                placeholder='User Name'
                onChange={(e)=>setUsername(e.target.value)}
                value={username}
                onKeyUp={handleInputEnter}
                />
                <button className='btn joinBtn' onClick={joinRoom}>Join</button>
                <span className='createInfo'> If you don't have invite then create &nbsp;
                    <a onClick={createNewRoom}href='' className='createNewBtn'>
                        new room
                    </a></span>

            </div>

        </div>
        <footer> Built with ❣️ by<a href='https://x.com/AAKRITIDUBEY10'> WhitePanda🐻‍❄️</a></footer>
    </div>
    </div>
  )
}

export default Home