import { useEffect, useState } from 'react'
import './App.css'
import Room from './components/Room/Room.tsx';
import {
  connectSocket,
  disconnectSocket,
  listenSocketEvent,
} from "./redux/actions/socketActions.ts";
import { useDispatch } from 'react-redux';
import { roomActions } from './redux/slices/room.slice.ts';
import toast, { Toaster } from 'react-hot-toast';

import CreateRoomMenu  from './components/CreateRoomMenu';
import EnterRoomMenu from './components/EnterRoomMenu'

import Logo from '../src/assets/testLogo.png'


function App() {
  const dispatch = useDispatch();
  const [inRoom, setInRoom] = useState<boolean>(false);
  const {updatePlayers, setRoomId} = roomActions;

  useEffect(() => {

    dispatch(connectSocket());    

    dispatch(
      listenSocketEvent("error", (msg) => {
        toast.error(`Error: ${msg}`)
      })
    );
    
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
          <div className='menuContainer'>
           <img src={Logo} width={340}/>
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
