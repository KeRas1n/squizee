import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  emitSocketEvent
} from "../../redux/actions/socketActions";

import styles from './Scoreboard.module.css';
import { RootState } from "../../redux/store"; 

// Define Player type
interface Player {
  id: string;
  name: string;
  score: number;
  ready: boolean;
}


const Scoreboard = () => {
  const users = useSelector((state:RootState) => state.room.players) as Player[];
  const roomId = useSelector((state:RootState) => state.room.roomId);
  const gameStarted = useSelector((state:RootState) => state.room.gameStarted) as boolean;

  const [showScoreboard, setShowScoreboard] = useState(true);

  const dispatch = useDispatch();
  console.log(users)

  const ready = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    dispatch(emitSocketEvent("ready", {room:roomId}));
  }

  return (
    <>
    <div className={styles.showScoreboard} onClick={() => setShowScoreboard(!showScoreboard)}>Scoreboard</div>

      <div className={`${styles.userlist} ${!showScoreboard ? styles.hidden : '' }`}>
        <h2>Players</h2>
        <h4>Room - {roomId}</h4>
        <table className={styles.userlist_content}>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Score</th>
          
          {!gameStarted ? (<th></th>) : ''}
        </tr>
          {[...users]?.sort((a, b) => (b.score - a.score)).map((user) => (
            <tr key={user.id}>

              <td><img src={`https://robohash.org/` + user.id} width={50}/></td>
              <td><span>{user.name}</span></td>
              <td><span>{user.score}</span></td>
              
              {!gameStarted ? 
              <td>{
                user.ready ? (<span className={styles.green}>ready</span>) : (<span className={styles.red}>not ready</span>)
                }
              </td>
              :''
              }

            </tr>
            ))}
        </table>

        {!gameStarted ? (<button onClick={(e) => ready(e)}>Ready</button>) : ''}
        

      </div>
      </>
  );
};

export default Scoreboard;
