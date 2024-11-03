"use client"
import gsap from 'gsap';
import React, { useEffect, useState, useRef, useContext } from 'react';
import styles from '@/app/Snake-game/Snake-game.module.css'
import { MyContext } from '@/Helper/Context';
import Screen from '@/components/Screen';
const Page = () => {
    const { screenUp, screenDown, waitExc, router } = useContext(MyContext);

    const [score, setScore] = useState(0);
    const [boardBoxes, setBoardBoxes] = useState([]);
    const [currentArrowKeyPressed, setCurrentArrowKeyPressed] = useState("");
    const [startBtnSnakeGame, setStartBtnSnakeGame] = useState(0);
    const [sizeOfSnake, setSizeOfSnake] = useState(3);
    const [headPos, setHeadPos] = useState({});
    const [snakeBodyPos, setSnakeBodyPos] = useState([]);
    const [applePos, setApplePos] = useState({});

    const boardRef = useRef(null);

    const bodyOfSnakeStyle = {
        backgroundColor: "red",
        borderRadius: "0%",
        color: 'transparent'
    };
    const headOfSnakeStyle = {
        backgroundColor: "rgb(165, 1, 1)",
        borderTopLeftRadius: '50%',
        borderTopRightRadius: '50%',
        color: 'transparent'
    };
    const normalBoxStyle = {
        backgroundColor: "black",
        border: "none",
        borderRadius: "0%",
        transform: "rotate(0deg)"
    };
    const appleBoxStyle = {
        backgroundColor: "green",
        border: "none",
        borderRadius: "50%",
        transform: "rotate(0deg)"
    };

    useEffect(() => {
        let createNewBox = [];
        for (let i = 0; i < 10; i++) {
            createNewBox[i] = [];
            for (let j = 0; j < 10; j++)
                createNewBox[i].push(<div key={`${i}${j}`} id={`box-${i}-${j}`} className={styles.box}></div>);
        }
        setBoardBoxes([...createNewBox]);
    }, []);

    useEffect(() => {
        if (!boardRef.current) return;

        setCurrentArrowKeyPressed("");

        let i = gsap.utils.random(5, 8, 1);
        let j = gsap.utils.random(2, 8, 1);

        // Reset all boxes to normal style
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const box = boardRef.current.querySelector(`#box-${i}-${j}`);
                if (box) Object.assign(box.style, normalBoxStyle);
            }
        }

        const startingEle1 = boardRef.current.querySelector(`#box-${i}-${j}`);
        const startingEle2 = boardRef.current.querySelector(`#box-${i - 1}-${j}`);
        const startingEle3 = boardRef.current.querySelector(`#box-${i - 2}-${j}`);

        if (startingEle1 && startingEle2 && startingEle3) {
            startingEle1.innerText = "S";
            startingEle2.innerText = "S";
            startingEle3.innerText = "S";

            Object.assign(startingEle1.style, bodyOfSnakeStyle);
            Object.assign(startingEle2.style, bodyOfSnakeStyle);
            Object.assign(startingEle3.style, headOfSnakeStyle);

            let snakeBodyArr = [];
            for (let k = 0; k < sizeOfSnake; k++)
                snakeBodyArr.push({ x: i - k, y: j });
            setSnakeBodyPos([...snakeBodyArr]);

            setHeadPos({ x: i - 2, y: j });
            popUpApple();
        }
    }, [startBtnSnakeGame]);

    const popUpApple = () => {
        if (!boardRef.current) return;

        let x, y;
        let applePosCheck = true;
        do {
            x = gsap.utils.random(0, 9, 1);
            y = gsap.utils.random(0, 9, 1);
            applePosCheck = snakeBodyPos.some(ele => ele.x === x && ele.y === y);
        } while (applePosCheck);

        const appleBox = boardRef.current.querySelector(`#box-${x}-${y}`);
        if (appleBox) Object.assign(appleBox.style, appleBoxStyle);
        setApplePos({ x, y });
    };

    const checkSnakeAteApple = (head) => {
        if (head.x === applePos.x && head.y === applePos.y) {
            const headBox = boardRef.current.querySelector(`#box-${applePos.x}-${applePos.y}`);
            if (headBox) Object.assign(headBox.style, headOfSnakeStyle);
            incSnakeBodySize();
            popUpApple();
            setSizeOfSnake(prevSize => prevSize + 1);
            setScore(prevScore => prevScore + 1);
        }
    };

    const incSnakeBodySize = () => {
        setSnakeBodyPos(prevBody => {
            const newBody = [...prevBody];
            const tail = newBody[newBody.length - 1];
            const newTail = { ...tail };
            newBody.push(newTail);
            return newBody;
        });
    };

    const moveSnakeBody = (head) => {
        setSnakeBodyPos(prevBody => {
            const newBody = [...prevBody];
            for (let i = newBody.length - 1; i > 0; i--) {
                newBody[i] = { ...newBody[i - 1] };
            }
            newBody[0] = head;
            return newBody;
        });
    };

    const moveSnake = (direction) => {
        if (!boardRef.current) return;

        setHeadPos(prevHead => {
            let newHead;
            switch (direction) {
                case 'ArrowUp':
                    newHead = { x: prevHead.x - 1, y: prevHead.y };
                    break;
                case 'ArrowDown':
                    newHead = { x: prevHead.x + 1, y: prevHead.y };
                    break;
                case 'ArrowRight':
                    newHead = { x: prevHead.x, y: prevHead.y + 1 };
                    break;
                case 'ArrowLeft':
                    newHead = { x: prevHead.x, y: prevHead.y - 1 };
                    break;
                default:
                    return prevHead;
            }

            if (newHead.x < 0 || newHead.x >= 10 || newHead.y < 0 || newHead.y >= 10) {
                alert("Game Over! You hit the wall.");
                setStartBtnSnakeGame(0);
                return prevHead;
            }

            checkSnakeAteApple(newHead);
            moveSnakeBody(newHead);

            const headElement = boardRef.current.querySelector(`#box-${newHead.x}-${newHead.y}`);
            if (headElement) {
                Object.assign(headElement.style, headOfSnakeStyle);
                headElement.style.transform = direction === 'ArrowDown' ? 'rotate(180deg)' :
                    direction === 'ArrowRight' ? 'rotate(90deg)' :
                        direction === 'ArrowLeft' ? 'rotate(270deg)' : 'rotate(0deg)';
            }

            return newHead;
        });
    };

    useEffect(() => {
        if (startBtnSnakeGame > 0 && currentArrowKeyPressed) {
            const movingIntervalId = setInterval(() => {
                moveSnake(currentArrowKeyPressed);
            }, 500);

            return () => clearInterval(movingIntervalId);
        }
    }, [currentArrowKeyPressed, startBtnSnakeGame]);

    useEffect(() => {
        const set_current_key = (key) => {
            if (startBtnSnakeGame > 0) {
                const newDirection = key.code;
                setCurrentArrowKeyPressed(prevDirection => {
                    if (
                        (prevDirection === "ArrowUp" && newDirection === "ArrowDown") ||
                        (prevDirection === "ArrowDown" && newDirection === "ArrowUp") ||
                        (prevDirection === "ArrowRight" && newDirection === "ArrowLeft") ||
                        (prevDirection === "ArrowLeft" && newDirection === "ArrowRight")
                    ) {
                        return prevDirection;
                    }
                    return newDirection;
                });
            }
        };

        window.addEventListener("keydown", set_current_key);
        return () => {
            window.removeEventListener("keydown", set_current_key);
        };
    }, [startBtnSnakeGame]);

    useEffect(() => {
        screenUp();
    }, [])

    return (
        <>
            <Screen />
            <header className='text-center text-3xl text-green-600'>SNAKE GAME</header>

            <main>
                <div>Score : {score}</div>

                <div ref={boardRef} className={`${styles.board} grid grid-cols-10`}>
                    {boardBoxes}
                </div>

                <button onClick={() => {
                    setStartBtnSnakeGame(prev => prev + 1);
                    setScore(0);
                    setSizeOfSnake(3);
                }}>
                    {(startBtnSnakeGame > 0) ? 'RESTART' : 'START'}
                </button>

                <button className='absolute top-0 left-0 m-1' onClick={async () => {
                    screenDown();
                    await waitExc(2000)
                    router.push("/GamePg")
                }}>BACK</button>
            </main>
        </>
    );
};

export default Page;