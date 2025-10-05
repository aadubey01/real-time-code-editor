import express from  'express';
import { createServer } from "http";
import cors from 'cors';
import { Server } from "socket.io";
import ACTIONS from './src/Actions.js';


const app = express();
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5000"],
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: true
}));

app.use(express.static('dist'));

app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'dist','index.html'))

})



const server = createServer(app);
const io = new Server(server,{
    cors: {
        origin: ["http://localhost:5173","http://127.0.0.1:5173",  "http://localhost:5000"], // Your React app's URL
        methods: ["GET", "POST"],
        allowedHeaders:["*"],
        credentials:true
      }

})
const userSocketMap={}
function getAllConnectedClients(roomid){

    return Array.from(io.sockets.adapter.rooms.get(roomid)||[]).map((socketID)=>{
        return{
            socketID,
            username:userSocketMap[socketID]
        }


    })
}

io.on('connection',(socket)=>{
    
    console.log('socket connected',socket.id);
    socket.on(ACTIONS.JOIN,({roomid,username})=>{
        userSocketMap[socket.id] = username
        socket.join(roomid);
        const clients = getAllConnectedClients(roomid);
        clients.forEach(({socketID})=>{
            io.to(socketID).emit(ACTIONS.JOINED,{
                clients,
                username,
                socketID:socket.id
            })

        })


    })

    socket.on(ACTIONS.CODE_CHANGE, ({roomid,code}) => {
        console.log('recieving',code)
        socket.to(roomid).emit(ACTIONS.CODE_CHANGE,{code})
    })
    // socket.on(ACTIONS.SYNC_CODE, ({socketID,code}) => {
    //     console.log('recieving',code)
    //     socket.to(socketID).emit(ACTIONS.CODE_CHANGE,{code})
    // })

    socket.on('disconnecting',()=>{
        const rooms = [...socket.rooms]
        rooms.forEach((roomid)=>{
            socket.in(roomid).emit(ACTIONS.DISCONNECTED,{
                socketID:socket.id,
                username:userSocketMap[socket.id],
            })


        })
        delete userSocketMap[socket.id]
        socket.leave()

    })
})


const PORT= process.env.PORT || 5000;
server.listen(PORT,'0.0.0.0',()=>console.log(`served at http://localhost:${PORT}`))
