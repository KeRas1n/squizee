import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listenSocketEvent,
  emitSocketEvent,removeSocketEvent
} from "../../redux/actions/socketActions";
import { RootState } from "../../redux/store"; 

import styles from './Room.module.css';
import { roomActions } from "../../redux/slices/room.slice";
import Scoreboard from "../Scoreboard/Scoreboard";
import { Timer } from "../Timer/Timer";
import toast from "react-hot-toast";

const colors = ['#ff2146', '#187af3', '#36c912', '#fffa54'];


interface Question {
  question: string;
  options?: string[];
  info?: {
    time?: number;
    questionCount?: number;
    maxQuestions?: number;
  };
  category?: string;
}



const Room = () => {

  const [question, setQuestion] = useState<Question>({question:"Waiting for players!"});
  const [answered, setAnswered] = useState<boolean>(false);
  const [answerOption, setAnswerOption] = useState<string>('');

  const dispatch = useDispatch();
  
  const {setGameStatus} = roomActions;

  const roomId = useSelector((state:RootState) => state.room.roomId);
  const gameStarted = useSelector((state:RootState) => state.room.gameStarted);

  const allColors = ['#ff2146', '#187af3', '#36c912', '#fffa54'];

  const [currentColor, setCurrentColor] = useState<string>('');
  const lastColorRef = useRef<string>(colors[0]);



  const assignRandomColor = () => {
    let newColor;
    do {
      newColor = colors[Math.floor(Math.random() * colors.length)];
    } while (newColor === lastColorRef.current);
    
    lastColorRef.current = newColor;
    setCurrentColor(newColor);
  };

useEffect(() => {
  assignRandomColor();
}, [])

useEffect(() => {
  if (!roomId) return; 

  const currentUrl = new URL(window.location.toString());

  currentUrl.searchParams.set('room', roomId.toString());


  window.history.replaceState({}, '', currentUrl);
}, [roomId]); 

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
      listenSocketEvent("new_question", (question:Question) => {
        console.log(question)
        setQuestion(question);
        setAnswered(false);
        assignRandomColor();
      })
    );

    dispatch(
      listenSocketEvent("right_answer", ({timeBonus}:{timeBonus:boolean}) => {
        toast.success("Right answer! (+20)")

        if(timeBonus){
          toast.success(`Time bonus! (+${timeBonus})`)
        }
      })
    );
    
    return () => {
      dispatch(removeSocketEvent("start_game"));
      dispatch(removeSocketEvent("end_game"));
      dispatch(removeSocketEvent("new_question"));
      dispatch(removeSocketEvent("right_answer"));
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
  

  function unescapeHtml(htmlString:string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.documentElement.textContent;
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

              <div>{`${question.info?.questionCount! + 1} / ${question.info?.maxQuestions}`}</div>
              <div>{unescapeHtml((question.category ?? ''))}</div>
            </div>
            </>
          )
          }

          <div>
            <h1>{unescapeHtml(question.question)}</h1>
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
