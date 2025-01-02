import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listenSocketEvent,
  emitSocketEvent,removeSocketEvent
} from "../../redux/actions/socketActions";

import styles from './Scoreboard.module.css';
import { roomActions } from "../../redux/slices/room.slice";


const Scoreboard = () => {
  const users = useSelector((state) => state.room.players);
  const roomId = useSelector((state) => state.room.roomId);
  const gameStarted = useSelector((state) => state.room.gameStarted);

  const [showScoreboard, setShowScoreboard] = useState(true);

  const dispatch = useDispatch();
  console.log(users)

  const ready = (e) => {
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


        {/*<div><input type="text" value={`${window.location.href}/?room=${roomId}`}/></div>*/}
        

      </div>
      </>
  );
};

export default Scoreboard;
