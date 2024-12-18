import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Client from '../Components/Client';
import Editor from '../Components/Editor';
import { initSocket } from '../socket.js';
import { BorderBeam} from '../Components/ui/border-beam.tsx'
import { Navigate, useLocation,useNavigate, useParams } from 'react-router-dom';
import ACTIONS from '../Actions.js';

const EditorPage = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  const codeRef = useRef(null)
  const {roomid} = useParams();
  const reactNavigator = useNavigate();
  const [clients,setClients] = useState([]);
  const [isSocketInitialised,setIsSocketInitialised] = useState(false);


  useEffect(() => {
    const init = async () => {
      try {
        socketRef.current = await initSocket();

      //   socketRef.current.on('connect', () => {
      //     console.log('Socket connected successfully');
      //     console.log('Socket ID:', socketRef.current.id);
      // });
        
        socketRef.current.on('connect_failed', handleErrors);
        
        socketRef.current.on('connect_error', handleErrors);

        function handleErrors(e){
          console.log('socket error',e);
          toast.error('Socket connection failed,try again later.')
          reactNavigator('/')
        }
  
        socketRef.current.emit(ACTIONS.JOIN, {
          roomid,
          username: location.state?.username,
        });

        //Listening for joined event
        socketRef.current.on(ACTIONS.JOINED,({clients,username,socketID})=>{
          if(username!==location.state?.username){
            toast.success(`${username} joined the room`)
            
          }
          setClients(clients)
          setIsSocketInitialised(true)
          socketRef.current.emit(ACTIONS.SYNC_CODE,{
            code:codeRef.current,
            socketID
          })

        })

        
        // Listening for disconnected event
        socketRef.current.on(ACTIONS.DISCONNECTED,({socketID,username})=>{
          toast.success(`${username} left the room`)
          setClients((prev)=>{
            return prev.filter(client =>client.socketID !== socketID)
          })

        })
      } catch (error) {
        console.error('Socket initialization failed:', error);
        setIsSocketInitialised(false)
      }
    };
    
    init();
    
    return ()=>{
      if(socketRef.current){
        
        socketRef.current.off(ACTIONS.JOINED)
        socketRef.current.off(ACTIONS.DISCONNECTED)
        socketRef.current.disconnect()
      }
    }
  }, [roomid,location.state?.username]);


  async function copyRoomId(){
    try{
      await navigator.clipboard.writeText(roomid);
      console.log(roomid)
      toast.success('Room Id has been copied  to your clip board')

    }catch(err){
      toast.error('could not copy room id')
      console.error(err);

    }
  }

  function leaveRoom() {
    try {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
        socketRef.current.disconnect();
        console.log("you left the room")
      }
      toast.success("You have left the room.");
    } catch (error) {
      console.error("Error while leaving the room:", error);
      toast.error("Failed to leave the room.");
    } finally {
      reactNavigator('/'); // Navigate back home
    }
  }
 
  if(!location.state){
   return <Navigate to="/"/>
  }


return (
  <div className='mainWrap'>
      <div className='aside'>
        <div className='asideInner'>
          <div className='logo'>
            <img className='logoImage' 
            src="/wolfSync.png"
             alt="logo" 
             style={{  display: 'block',width:'100px', height:'95px', margin: "0 auto"}}  />
          </div>
          <h3>Connected</h3>
          <div className='clientsList'>
            {
              clients.map((client)=>(
                <Client 
                   key={client.socketID} 
                   username={client.username}
                   />
              ))}
          </div>

        </div>
        {/* <button className='btn copyBtn' >Copy ROOM ID</button> */}
        <div className="relative flex h-[50px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-black bg-black md:shadow-xl cursor-pointer"  onClick={copyRoomId}>
        <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-l font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        Copy ROOM ID
        <BorderBeam size={90} duration={8} delay={9}  />
      </span>

        </div>
        <button className='btn leave' onClick={leaveRoom}>Leave</button>
      </div>
    <div className='editorWrap'> 
    {isSocketInitialised ? (
          <Editor 
            socketRef={socketRef} 
            roomid={roomid} 
            onChangeCode = {(code)=>{
              codeRef.current = code;

            }}
           
          />
        ) : (
          <div>Initializing socket...</div>
        )}
    
        
      </div>
  </div>
  )
}

export default EditorPage