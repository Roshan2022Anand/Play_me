"use client"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import React, { useEffect, useState } from 'react';
import styles from '@/app/Snake-game/Snake-game.module.css'

const page = () => {

    // all the state variables are declared here
    const [score, setscore] = useState(0);
    const [boardBoxs, setboardBoxs] = useState([]);
    const [currentArrowKeyPressed, setcurrentArrowKeyPressed] = useState("");
    const [startBtnSnakeGame, setstartBtnSnakeGame] = useState(0);
    const [sizeOfSnake, setsizeOfSnake] = useState(3);
    const [headPos, setheadPos] = useState({});
    const [snakeBodyPos, setsnakeBodyPos] = useState(undefined);
    const [applePos, setapplePos] = useState(undefined)

    //all the style object declared here
    let bodyOfSnakeStyle = {
        backgroundColor: "red",
        borderRadius: "0%",
        color: 'transparent'
    }
    let headOfSnakeStyle = {
        backgroundColor: "rgb(165, 1, 1)",
        borderTopLeftRadius: '50%',
        borderTopRightRadius: '50%',
        color: 'transparent'
    }
    let normalBoxStyle = {
        backgroundColor: "black",
        border: "none",
        borderRadius: "0%",
        transform: "rotate(0deg)"
    }
    let appleBoxStyle = {
        backgroundColor: "green",
        border: "none",
        borderRadius: "50%",
        transform: "rotate(0deg)"
    }


    // setting up the board for the snake game when game is mounted
    useEffect(() => {
        let createNewBox = [];
        for (let i = 0; i < 10; i++) {
            createNewBox[i] = [];
            for (let j = 0; j < 10; j++)
                createNewBox[i].push(<div id={`${i}${j}`} className={styles.box}></div>);
        }

        setboardBoxs([...createNewBox])
    }, [])
    //settingup the initial position of the snake and apple
    useEffect(() => {

        setcurrentArrowKeyPressed("");

        let i = gsap.utils.random(5, 8, 1)
        let j = gsap.utils.random(2, 8, 1)

        // making all the  box normal if any old snake and apple are in the board
        for (let i = 0; i < boardBoxs.length; i++)
            for (let j = 0; j < boardBoxs.length; j++)
                Object.assign(document.getElementById(`${i}${j}`).style, normalBoxStyle)

        //if the box are in the board then put the snake
        if (document.getElementById(`${i}${j}`)) {

            //accessing the box were snakes body and head are placed in a sequence
            let startingEle1 = document.getElementById(`${i}${j}`)
            let startingEle2 = document.getElementById(`${i - 1}${j}`)
            let startingEle3 = document.getElementById(`${i - 2}${j}`)

            startingEle1.innerText = "S";
            startingEle2.innerText = "S";
            startingEle3.innerText = "S";

            Object.assign(startingEle1.style, bodyOfSnakeStyle)
            Object.assign(startingEle2.style, bodyOfSnakeStyle)
            Object.assign(startingEle3.style, headOfSnakeStyle)

            //initialinzing the position of the snake's body
            let snakeBodyArr = []
            for (let k = 0; k < sizeOfSnake; k++)
                snakeBodyArr.push({ x: i - k, y: j })
            setsnakeBodyPos([...snakeBodyArr]);

            setheadPos({ x: i - 2, y: j });
            //calling the popUpApple function to display the apple
            popUpApple();

            //cleaning up the snake position when restart is pressed
            return () => {
                Object.assign(startingEle1.style, normalBoxStyle)
                Object.assign(startingEle2.style, normalBoxStyle)
                Object.assign(startingEle3.style, normalBoxStyle)
            }
        }
    }, [startBtnSnakeGame])

    //popping up an apple at random position
    const popUpApple = () => {
        let x, y;
        let applePosCheck = true;
        do {
            x = gsap.utils.random(0, 9, 1)
            y = gsap.utils.random(0, 9, 1)
            if (snakeBodyPos)
                snakeBodyPos.map((ele) => {
                    if (ele.x != x && ele.y != y)
                        applePosCheck = false
                })
            else applePosCheck = false
            console.log(x, y);
        } while (applePosCheck)

        Object.assign(document.getElementById(`${x}${y}`).style, appleBoxStyle);
        setapplePos({ x: x, y: y });
    }

    //check if the snake ate the apple
    const checkSnakeAteApple = (head) => {
        if (JSON.stringify(head) == JSON.stringify(applePos)) {
            Object.assign(document.getElementById(`${applePos.x}${applePos.y}`).style, headOfSnakeStyle);
            incSnakeBodySize();
            console.log("ate apple");

            popUpApple();
            setsizeOfSnake(sizeOfSnake + 1);
            setscore(score + 1);
        }
    }

    //increasing the size of the snake when it eat's the apple
    const incSnakeBodySize = () => {

        let tempSnakeBodyPos = snakeBodyPos;
        let x1 = snakeBodyPos[0].x
        let y1 = snakeBodyPos[0].y
        let x2 = snakeBodyPos[1].x
        let y2 = snakeBodyPos[1].y
        let xVal = x1 - x2
        let yVal = y1 - y2
        let newPos;

        if (xVal == 1)
            newPos = { x: x1 + 1, y: y1 }
        else if (xVal == -1)
            newPos = { x: x1 - 1, y: y1 }
        else if (yVal == 1)
            newPos = { x: x1, y: y1 + 1 }
        else if (yVal == -1)
            newPos = { x: x1, y: y1 - 1 }

        Object.assign(document.getElementById(`${newPos.x}${newPos.y}`).style, bodyOfSnakeStyle)
        tempSnakeBodyPos.unshift(newPos)
        setsnakeBodyPos([...tempSnakeBodyPos])
    }

    //making the body to move behind the head
    const moveSnakeBody = (head) => {
        let tempSnakeBodyPos = snakeBodyPos;
        let x = tempSnakeBodyPos[0].x
        let y = tempSnakeBodyPos[0].y
        Object.assign(document.getElementById(`${x}${y}`).style, normalBoxStyle)
        for (let i = 0; i < snakeBodyPos.length - 1; i++) {
            tempSnakeBodyPos[i] = tempSnakeBodyPos[i + 1]
            x = tempSnakeBodyPos[i].x;
            y = tempSnakeBodyPos[i].y;

            Object.assign(document.getElementById(`${x}${y}`).style, bodyOfSnakeStyle)
        }
        tempSnakeBodyPos[tempSnakeBodyPos.length - 1] = head

        setsnakeBodyPos([...tempSnakeBodyPos]);
    }
    //moving the head according to the arrow key pressed direction
    const snakeMoveUp = (x, y) => {
        checkSnakeAteApple({ x: x - 1, y: y });
        let currentHeadBox = document.getElementById(`${x - 1}${y}`);
        Object.assign(currentHeadBox.style, headOfSnakeStyle);
        setheadPos({ x: x - 1, y: y });
        moveSnakeBody({ x: x - 1, y: y });
    }

    const snakeMoveDown = (x, y) => {
        let currentHeadBox = document.getElementById(`${x + 1}${y}`);
        Object.assign(currentHeadBox.style, headOfSnakeStyle);
        Object.assign(currentHeadBox.style, {
            transform: 'rotate(180deg)'
        });

        setheadPos({ x: x + 1, y: y });
        checkSnakeAteApple({ x: x + 1, y: y });
        moveSnakeBody({ x: x + 1, y: y });
    }

    const snakeMoveRight = (x, y) => {
        let currentHeadBox = document.getElementById(`${x}${y + 1}`);
        Object.assign(currentHeadBox.style, headOfSnakeStyle);
        Object.assign(currentHeadBox.style, {
            transform: 'rotate(90deg)'
        });

        setheadPos({ x: x, y: y + 1 });
        checkSnakeAteApple({ x: x, y: y + 1 });
        moveSnakeBody({ x: x, y: y + 1 });
    }

    const snakeMoveLeft = (x, y) => {
        let currentHeadBox = document.getElementById(`${x}${y - 1}`);
        Object.assign(currentHeadBox.style, headOfSnakeStyle);
        Object.assign(currentHeadBox.style, {
            transform: 'rotate(270deg)'
        });

        setheadPos({ x: x, y: y - 1 });
        checkSnakeAteApple({ x: x, y: y - 1 });
        moveSnakeBody({ x: x, y: y - 1 });
    }

    //setting up the intervals for moving of snake
    useEffect(() => {
        const stillMoving = () => {
            if (snakeBodyPos) {
                let x = snakeBodyPos[snakeBodyPos.length - 1].x
                let y = snakeBodyPos[snakeBodyPos.length - 1].y
                switch (currentArrowKeyPressed) {
                    case 'ArrowUp': snakeMoveUp(x, y)
                        break;
                    case 'ArrowDown': snakeMoveDown(x, y);
                        break;
                    case 'ArrowRight': snakeMoveRight(x, y);
                        break;
                    case 'ArrowLeft': snakeMoveLeft(x, y);
                        break;
                }
            }
        }

        const movingintervalId = setInterval(stillMoving, 500)
        return () => {
            clearInterval(movingintervalId)
        }
    }, [currentArrowKeyPressed])

    //changing the state of the keypressed if the direction is valid 
    useEffect(() => {
        const set_current_key = (key) => {
            let previousKey = currentArrowKeyPressed;
            let currentKey = key.code
            if (startBtnSnakeGame > 0)
                if (!(previousKey == "ArrowUp" && currentKey == "ArrowDown" || previousKey == "ArrowDown" && currentKey == "ArrowUp" || previousKey == "ArrowRight" && currentKey == "ArrowLeft" || previousKey == "ArrowLeft" && currentKey == "ArrowRight"))
                    setcurrentArrowKeyPressed(currentKey)
        }

        window.addEventListener("keydown", set_current_key);
        return () => {
            window.removeEventListener("keydown", set_current_key);
        }
    })

    //main page of the game
    return (
        <>
            <header className='text-center text-3xl text-green-600'>SNAKE GAME</header>

            <main>
                <div>Score : {score}</div>

                {/* div containing the board */}
                <div className={`${styles.board} grid grid-cols-10`}>
                    {boardBoxs}
                </div>

                <button onClick={() => { setstartBtnSnakeGame(startBtnSnakeGame + 1) }}>
                    {(startBtnSnakeGame > 0) ? 'RESATRT' : 'START'}
                </button>

            </main>
        </>
    )
}

export default page