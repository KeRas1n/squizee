import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  emitSocketEvent,
  listenSocketEvent,
} from "../../redux/actions/socketActions";
import { roomActions } from "../../redux/slices/room.slice";

export const CreateRoomMenu = () => {
  const [inputNickname, setInputNickname] = useState<string>("");
  const [inputRoomId, setInputRoomId] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [category, setCategory] = useState("any");
  const [difficulty, setDifficulty] = useState();


  
  const dispatch = useDispatch();
  useEffect(() => {
      if(localStorage.getItem("username")){
        setInputNickname(localStorage.getItem("username"));
      }
    }, [])

  const createRoom = (e) => {
    e.preventDefault();

    if (inputNickname && inputRoomId) {
      dispatch(emitSocketEvent("create_room", {
        room:inputRoomId, 
        name:inputNickname,
        questionCount:questionCount,
        category:category,
        difficulty:difficulty,
      }));
    }
    console.log({
      room:inputRoomId, 
      name:inputNickname,
      questionCount:questionCount,
      category:category,
      difficulty:difficulty,
    })

    localStorage.setItem("username", inputNickname);

  };

  return (
    <form className="form">
      <h1>... OR CREATE A NEW ONE</h1>
      <input
        type="text"
        placeholder="Create a room code"
        value={inputRoomId}
        onChange={(e) => setInputRoomId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Your Nickname"
        value={inputNickname}
        onChange={(e) => setInputNickname(e.target.value)}
      />

      <label for="questionCount">Number of questions</label>
      <input
        id="questionCount"
        min={5}
        max={50}
        type="number"
        value={questionCount}
        onChange={(e) => setQuestionCount(Number(e.target.value))}
      />

<label for="trivia_category">Select Category: </label>
		<select className="select" value={category} onChange={e => setCategory(e.target.value)} name="trivia_category">
			<option value="any">Any Category</option>
			<option value="9">General Knowledge</option>
      <option value="10">Entertainment: Books</option>
      <option value="11">Entertainment: Film</option>
      <option value="12">Entertainment: Music</option>
      <option value="13">Entertainment: Musicals &amp; Theatres</option>
      <option value="14">Entertainment: Television</option>
      <option value="15">Entertainment: Video Games</option>
      <option value="16">Entertainment: Board Games</option>
      <option value="17">Science &amp; Nature</option>
      <option value="18">Science: Computers</option>
      <option value="19">Science: Mathematics</option>
      <option value="20">Mythology</option>
      <option value="21">Sports</option>
      <option value="22">Geography</option>
      <option value="23">History</option>
      <option value="24">Politics</option>
      <option value="25">Art</option>
      <option value="26">Celebrities</option>
      <option value="27">Animals</option>
      <option value="28">Vehicles</option>
      <option value="29">Entertainment: Comics</option>
      <option value="30">Science: Gadgets</option>
      <option value="31">Entertainment: Japanese Anime &amp; Manga</option>
      <option value="32">Entertainment: Cartoon &amp; Animations</option>		
      </select>

      <label for="difficulty">Select Difficulty: </label>
		<select className="select" value={difficulty} onChange={e => setDifficulty(e.target.value)} name="difficulty">
			<option>Any</option>
			<option value="easy">Easy</option>
			<option value="medium">Medium</option>
      <option value="hard">Hard</option>	
      </select>


      <button className="secondary-btn" onClick={createRoom}>
        Create room
      </button>
    </form>
  );
};
