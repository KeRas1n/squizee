import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  emitSocketEvent,
} from "../../redux/actions/socketActions";

const EnterRoomMenu = () => {
  const [inputNickname, setInputNickname] = useState<string>("");
  const [inputRoomId, setInputRoomId] = useState<string>("");

  const dispatch = useDispatch();

  useEffect(() => {
    if(localStorage.getItem("username")){
      setInputNickname((localStorage.getItem("username")) ?? '');
    }


    // Получаем строку параметров
    const queryString = window.location.search;

    // Создаем объект URLSearchParams
    const params = new URLSearchParams(queryString);

    // Извлекаем значение параметра "id"
    const room = params.get('room');
    setInputRoomId((room ?? ''));
  }, [])



  const joinRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (inputNickname && inputRoomId) {
      dispatch(emitSocketEvent("join_room", {room:inputRoomId, name:inputNickname}));
    }

    localStorage.setItem("username", inputNickname);
  };


  return (
    <form className="form">
      <h1>JOIN TO ROOM</h1>
      <label htmlFor="code">Room code</label>
      <input
        id="code"
        type="text"
        placeholder="Enter room code"
        value={inputRoomId}
        onChange={(e) => setInputRoomId(e.target.value)}
      />

      <label htmlFor="nick">Your name</label>
      <input
        id="nick"
        type="text"
        placeholder="Your Nickname"
        value={inputNickname}
        onChange={(e) => setInputNickname(e.target.value)}
      />

      <button className="primary-btn" onClick={joinRoom}>
        Join
      </button>

    </form>
  );
};

export default EnterRoomMenu;
