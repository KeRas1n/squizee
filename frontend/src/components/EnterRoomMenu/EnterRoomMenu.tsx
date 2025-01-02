import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  emitSocketEvent,
  listenSocketEvent,
} from "../../redux/actions/socketActions";
import { roomActions } from "../../redux/slices/room.slice";

export const EnterRoomMenu = () => {
  const [inputNickname, setInputNickname] = useState<string>("");
  const [inputRoomId, setInputRoomId] = useState<string>("");

  const dispatch = useDispatch();

  useEffect(() => {
    if(localStorage.getItem("username")){
      setInputNickname(localStorage.getItem("username"));
    }



    // Получаем строку параметров
    const queryString = window.location.search;

    // Создаем объект URLSearchParams
    const params = new URLSearchParams(queryString);

    // Извлекаем значение параметра "id"
    const room = params.get('room');
    setInputRoomId(room);
  }, [])



  const joinRoom = (e) => {
    e.preventDefault();

    if (inputNickname && inputRoomId) {
      dispatch(emitSocketEvent("join_room", {room:inputRoomId, name:inputNickname}));
    }

    localStorage.setItem("username", inputNickname);
  };


  const createRoom = (e) => {
    e.preventDefault();

    if (inputNickname && inputRoomId) {
      dispatch(emitSocketEvent("create_room", {room:inputRoomId, name:inputNickname}));
    }
  };

  return (
    <form className="form">
      <h1>JOIN TO ROOM</h1>
      <input
        type="text"
        placeholder="Enter room code"
        value={inputRoomId}
        onChange={(e) => setInputRoomId(e.target.value)}
      />

      <input
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
