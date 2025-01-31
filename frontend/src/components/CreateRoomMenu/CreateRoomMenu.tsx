import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  emitSocketEvent,
} from "../../redux/actions/socketActions";

const CreateRoomMenu = () => {
  const [inputNickname, setInputNickname] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [category, setCategory] = useState("any");
  const [difficulty, setDifficulty] = useState<string>();

  
  const dispatch = useDispatch();
  useEffect(() => {
      if(localStorage.getItem("username")){
        setInputNickname((localStorage.getItem("username")) ?? '');
      }
    }, [])

  const createRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (inputNickname) {
      dispatch(emitSocketEvent("create_room", {
        name:inputNickname,
        questionCount:questionCount,
        category:category,
        difficulty:difficulty,
      }));
    }
    console.log({
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
      <label htmlFor="nick2">Your name</label>
      <input
        type="text"
        placeholder="Your Nickname"
        id="nick2"
        value={inputNickname}
        onChange={(e) => setInputNickname(e.target.value)}
      />

      <label htmlFor="questionCount">Number of questions</label>
      <input
        id="questionCount"
        min={5}
        max={50}
        type="number"
        value={questionCount}
        onChange={(e) => setQuestionCount(Number(e.target.value))}
      />

<label htmlFor="trivia_category">Select Category: </label>
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

      <label htmlFor="difficulty">Select Difficulty: </label>
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
export default CreateRoomMenu;