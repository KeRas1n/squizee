const { getQuestionsFromOpenTDB } = require("../services/trivia");
const { generateRoomKey } = require('../utils/roomKeyGenerator');

let rooms = {};

// Initialize a room with default properties
const initializeRoom = (overrides = {}) => ({
    players: {}, // Dictionary of players
    readyPlayers: 0, 
    answersCount: 0,
    maxQuestions: 5, 
    questionCount: 0, 
    questions: [], 
    category: null, 
    difficulty: null, 
    currentQuestion: null, 
    timer: null,
    ...overrides,
});

// Initialize a player with default properties
const initializePlayer = (id, name) => ({
    id,
    name, 
    score: 0, 
    ready: false,
    answer: null, 
});

const updateRoomUsers = (io, room) => {
    if (rooms[room]) {
        io.to(room).emit("update_users", Object.values(rooms[room].players));
    }
    console.log(`PLAYER LEFT IN A ROOM - ${(Object.values(rooms[room].players)).length}`)
};

const addUserToRoom = (io, socket, room, name) => {
    socket.join(room);

    if (!rooms[room]) {
        rooms[room] = initializeRoom();
    }

    rooms[room].players[socket.id] = initializePlayer(socket.id, name);

    io.to(room).emit("user_joined", `User ${name} joined the room`);
    socket.emit("join_success", room);
    //socket.emit("start_game");


    //SEND DATA FOR NEWLY CONNECTED
    if (rooms[room].questionCount > 0) {
        setTimeout(() => {
            console.log("Sending new question:", rooms[room].currentQuestion);
            //socket.emit("new_question", rooms[room].currentQuestion);
            socket.emit("start_game");
        }, 800); // Задержка 100ms, чтобы дать время подготовиться
    }
    else {
        console.log("No active questions at the moment.");
    }

    updateRoomUsers(io, room);
};

const notifyRoomAboutDisconnect = (io, socket) => {
    Array.from(socket.rooms).forEach((room) => {
        if (rooms[room]) {
            delete rooms[room].players[socket.id];
            updateRoomUsers(io, room);

            if (Object.keys(rooms[room].players).length < 1) {
                delete rooms[room];
                console.log(`Room ${room} deleted.`);
            }
        }
    });
};

const sendNextQuestion = (io, room) => {
    let time = 15000;

    if (!rooms[room]?.questions.length) return;

    const question = rooms[room].questions[rooms[room].questionCount];
    rooms[room].currentQuestion = {...question, date:Date.now()};

    const info = {time:time, questionCount:rooms[room].questionCount, maxQuestions:rooms[room].maxQuestions};

    

    io.to(room).emit("new_question", {...question, info});

    rooms[room].timer = setTimeout(() => {
        handleNextQuestion(io, room);
    }, time);
};

const evaluateResult = (io, room) => {
    const currentQuestion = rooms[room]?.currentQuestion;

    if (!currentQuestion) {
        console.log("No current question for room:", room);
        return;
    }

    const players = rooms[room]?.players;

    if (!players) {
        console.log("No players in room:", room);
        return;
    }

    Object.entries(players).forEach(([socketId, player]) => {
        if (currentQuestion.answer === player.answer?.answer) {
            let timeBonus = 10;
            player.score += 20;

            const timeToAnswer = Math.floor((Date.now() - currentQuestion.date) / 1000);

            if(timeBonus - timeToAnswer > 0){
                timeBonus -= timeToAnswer;

                player.score += timeBonus;
                io.to(socketId).emit("right_answer", {timeBonus:timeBonus - timeToAnswer});
            }
            else{
                io.to(socketId).emit("right_answer", {timeBonus:null});
            }



            console.log(`Player ${player} got it right! Score: ${player.score}`);
        }
    });
};

const handleNextQuestion = (io, room) => {
    if (!rooms[room]) return;

    if (rooms[room].timer) {
        clearTimeout(rooms[room].timer);
        rooms[room].timer = null;
    }

    evaluateResult(io,room);
    updateRoomUsers(io, room);

    rooms[room].answersCount = 0;

    if (rooms[room].questionCount + 1 >= rooms[room].maxQuestions) {
        io.to(room).emit("end_game");
    } else {
        rooms[room].questionCount += 1;
        sendNextQuestion(io, room);
    }
};

const startGame = async (io, room) => {
    if (!rooms[room]) return;

    //CLEAR ALL OLD DATA
    rooms[room].answersCount = 0;
    rooms[room].questionCount = 0;

    Object.values(rooms[room].players).forEach((player) => {
        player.ready = false;
        player.score = 0;
    });


    io.to(room).emit("start_game");

    // load 10 questions
    const questions = await getQuestionsFromOpenTDB(rooms[room].maxQuestions, rooms[room].category, rooms[room].difficulty);
    
    rooms[room].questions = questions;
    console.log(rooms[room].category)

    if (questions.length > 0) {
        sendNextQuestion(io, room);
    } else {
        io.to(room).emit("error", "Failed to load questions. Please try again later.");
    }
    updateRoomUsers(room);



};

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected - ${socket.id}`);

        socket.on("create_room", ({ room, name, questionCount, category, difficulty }) => {
            if (!rooms[room]) {

                //validate
                if (questionCount < 5 || questionCount > 50){
                    socket.emit("error", "Choose number of questions from 5 to 50");
                    return null;
                }



                //generate unique CODE
                let newRoomKey;
                do {
                    newRoomKey = generateRoomKey();
                } while (rooms[newRoomKey]);

                const room = newRoomKey;

                addUserToRoom(io, socket, room, name);

                socket.emit("room_created", room);

                //set game settings
                rooms[room].maxQuestions = questionCount;
                rooms[room].category = category;
                rooms[room].difficulty = difficulty;


            } else {
                socket.emit("room_exists", room);
                socket.emit("error", `Room - ${room}, is already exist `);
            }
        });

        socket.on("join_room", ({ room, name }) => {
            if (rooms[room]) {
                addUserToRoom(io, socket, room, name);
            } else {
                socket.emit("room_not_found", room);
                socket.emit("error", `Room - ${room}, was not found `);
            }
        });
        

        socket.on("ready", ({ room }) => {
            if(!rooms[room]){
                socket.emit("error", "This room not exists anymore");
                return null;
            };

            const player = rooms[room]?.players[socket.id];
            if (player) {
                player.ready = !player.ready;
                rooms[room].readyPlayers = Object.values(rooms[room].players).filter((p) => p.ready).length;
                updateRoomUsers(io, room);
            }

            if (rooms[room]?.readyPlayers === Object.keys(rooms[room].players).length) {
                startGame(io, room);
            }
        });

        socket.on("answer", ({ room, answer }) => {
            if(!rooms[room]) return null;

            rooms[room].players[socket.id].answer = { answer: answer, time: 0 };
            rooms[room].answersCount += 1;

            if (rooms[room].answersCount === Object.keys(rooms[room].players).length) {
                handleNextQuestion(io, room);
            }
        });

        socket.on("leaveRoom", () => {
            console.log("DISCONNECT USERRR");
            notifyRoomAboutDisconnect(io, socket);
            socket.emit("left_room");
        });

        socket.on("disconnecting", () => {
            notifyRoomAboutDisconnect(io, socket);
        });
    });
};
