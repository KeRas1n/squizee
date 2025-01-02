import { useEffect, useState } from 'react'
import './App.css'
import { EnterRoomMenu } from './components/EnterRoomMenu/EnterRoomMenu.tsx'
import { io, Socket } from 'socket.io-client';
import Room from './components/Room/Room.js';
import {
  connectSocket,
  disconnectSocket,
  emitSocketEvent,
  listenSocketEvent,
} from "./redux/actions/socketActions.ts";
import { useDispatch } from 'react-redux';
import { roomActions } from './redux/slices/room.slice.ts';
import toast, { Toaster } from 'react-hot-toast';
import { CreateRoomMenu } from './components/CreateRoomMenu/CreateRoomMenu.tsx';

import Logo from '../src/assets/testLogo.png'


function App() {
  const dispatch = useDispatch();
  const [inRoom, setInRoom] = useState<boolean>(false);
  const {updatePlayers, setRoomId, setGameStatus} = roomActions;

  useEffect(() => {

    dispatch(connectSocket());


    dispatch(
      listenSocketEvent("user_joined", (data) => {
        //alert(data);
      })
    );
    
    dispatch(listenSocketEvent("room_not_found", (room) => {
      console.log("TEST")
      toast.error(`Room - ${room}, was not found `)
    })
    )

    dispatch(listenSocketEvent("room_exists", (room) => {
      toast.error(`Room - ${room}, is already exist `)

    })
    )
    
    dispatch(
      listenSocketEvent("join_success", (roomId) => {
        setInRoom(true);
        
        dispatch(setRoomId(roomId));
      }),
    );

    dispatch(
      listenSocketEvent("update_users", (players) => {
        console.warn(players);
        dispatch(updatePlayers(players));
      })
    );

    // disconnect if unmount
    return () => {
      dispatch(disconnectSocket());
    };
  }, [dispatch]);


  return (
    <>
      <div>


        {!inRoom
         ?
         (<>
           <img src={Logo} width={340}/>
          <div className='menuContainer'>
            <EnterRoomMenu/>
            <CreateRoomMenu/>
          </div>
          </>
        )
        :(
         <Room/>
        )

        }
      </div>

      <Toaster
    position="top-center"
    reverseOrder={false}
  />

    </>
  )
}

export default App
