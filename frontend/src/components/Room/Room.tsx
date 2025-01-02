import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listenSocketEvent,
  emitSocketEvent,removeSocketEvent
} from "../../redux/actions/socketActions";

import styles from './Room.module.css';
import { roomActions } from "../../redux/slices/room.slice";
import Scoreboard from "../Scoreboard/Scoreboard";
import { Timer } from "../Timer/Timer";
import toast from "react-hot-toast";


const Room = () => {

  const [question, setQuestion] = useState({question:"Waiting for players!"});
  const [answered, setAnswered] = useState(false);
  const [answerOption, setAnswerOption] = useState('');

  const dispatch = useDispatch();
  
  const {setGameStatus} = roomActions;

  const roomId = useSelector((state) => state.room.roomId);
  const gameStarted = useSelector((state) => state.room.gameStarted);

  const colors = ['#ff2146', '#187af3', '#36c912', '#fffa54'];
  const [currentColor, setCurrentColor] = useState<string>('');

  let filteredColorsCache = [];

const assignRandomColor = () => {
    // Обновляем кэш только когда currentColor меняется
    if (filteredColorsCache.length === 0 || filteredColorsCache.includes(currentColor)) {
        filteredColorsCache = colors.filter(item => item !== currentColor);
    }

    console.log(filteredColorsCache);
    const randomIndex = Math.floor(Math.random() * filteredColorsCache.length);
    setCurrentColor(filteredColorsCache[randomIndex]);
};

useEffect(() => {
  assignRandomColor();
}, [])

useEffect(() => {
  if (!roomId) return; // Проверяем, что roomId существует

  // Получаем текущий URL
  const currentUrl = new URL(window.location);

  // Устанавливаем или обновляем параметр "room"
  currentUrl.searchParams.set('room', roomId);

  // Обновляем URL без перезагрузки страницы
  window.history.replaceState({}, '', currentUrl);
}, [roomId]); // Добавляем roomId в зависимости

  useEffect(() => {
    
    dispatch(
      listenSocketEvent("start_game", () => {
        dispatch(setGameStatus(true));
        console.log("GAME STARTED")
      })
    );

    dispatch(
      listenSocketEvent("end_game", () => {
        setQuestion({question:"Game ended!"})
        dispatch(setGameStatus(false));
      })
    );

    dispatch(
      listenSocketEvent("new_question", (question) => {
        console.log(question)
        setQuestion(question);
        setAnswered(false);
        assignRandomColor();
      })
    );

    dispatch(
      listenSocketEvent("right_answer", ({timeBonus}) => {
        toast.success("Right answer! (+20)")
        toast.success(`Time bonus! (+${timeBonus})`)
      })
    );
    
    return () => {
      dispatch(removeSocketEvent("start_game"));
      dispatch(removeSocketEvent("new_question"));
    };

  }, [dispatch]);


//answered
  const answer = (answer:string) =>{
    if(!answered){
      setAnswerOption(answer);
      setAnswered(true);
      console.log("ANSWERED")
      dispatch(emitSocketEvent("answer", {room:roomId, answer:answer}));
    }

  }

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/?room=${roomId}`);
    toast.success("Link copied!")
  }
  

  return (
    <div>
      <Scoreboard/>
      


      <div className={styles.mainContainer}>
        <div style={{ backgroundColor: currentColor }} className={styles.questionContainer}>
          {!gameStarted
          ? 
          (
            <>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${window.location.origin}/?room=${roomId}`}/>
            <div className={styles.invite}>
              <input type="text" value={`${window.location.origin}/?room=${roomId}`}/>
              <button onClick={copyLink}>Copy</button>
            </div>
            </>
          )
          :
          (
            <>
            <Timer time = {question?.info?.time} question={question.question}/>
            <div className={styles.questionInfo}>

              <div>{`${question.info?.questionCount + 1} / ${question.info?.maxQuestions}`}</div>
              <div>{question.category?.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")}</div>
            </div>
            </>
          )
          }

          <div>
            <h1>{question.question?.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")}</h1>
          </div>

        </div>

        <div className={styles.answersContainer}>
          {question.options?.map((option) => (
            <div className={`${styles.answer}`} onClick={() => answer(option)}>
              <div id={`${answerOption === option ? 'answered' :''}`} >{option.replace(/&quot;/g, '"')}</div>
            </div>
          ))}

        </div>

        


      </div>




    </div>
  );
};

export default Room;
