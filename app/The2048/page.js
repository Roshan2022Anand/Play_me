"use client"
import React, { useContext, useEffect, useState } from 'react'
import styles from "@/app/The2048/The2048.module.css"
import gsap from 'gsap'
import MyContext from '@/Helper/Context'
import Screen from '@/Components/Screen'
import NumBox from '@/Components/NumBox'
// --bg - color: #FFFAE3;
// --text - color: #333333;
// --btn - color: #A8E6CF;
// --btn - hover - color: #98FB98;
// --nav - color: #A8E6CF;
// --btn - txt - color: #FFFFFF;
// --link - color: #FFA07A;
// --footer - color: #F08080;
const page = () => {

    //context API 
    const { screenUp, screenDown } = useContext(MyContext);

    //all the states are declared here
    const [BoxIdArr, setBoxIdArr] = useState([]);
    const [numBoxArr, setNumBoxArr] = useState([]);
    const [boxes, setBoxes] = useState([]);

    //for genrating colums
    useEffect(() => {
        let tempBoxes = []
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                tempBoxes.push(i + "" + j)
        setBoxes(tempBoxes)
    }, [])

    //function to start the game
    const setUpGame = () => {
        let indexOne = gsap.utils.random(0, 15, 1)
        let indexTwo = gsap.utils.random(0, 15, 1)
        while (indexOne === indexTwo) {
            indexTwo = gsap.utils.random(0, 15, 1)
        }
        setBoxIdArr([indexOne, indexTwo])
    }
    //funtion to place the number box in a random location
    useEffect(() => {
        setNumBoxArr(prevNumBoxArr => {
            const newNumBoxArr = [...prevNumBoxArr];
            BoxIdArr.forEach(loc => {
                newNumBoxArr[loc] = <NumBox number={2} id={loc} />;
            });
            return newNumBoxArr;
        });
        return () => {
            setNumBoxArr([])
        }

    }, [BoxIdArr])

    //function to display game over screen
    const gameOver = () => {
        alert("Game Over");
        setUpGame();
    }


    //function to generate a new number box at random place
    const placeNewNumBox = () => {
        setNumBoxArr(prevNumBoxArr => {
            const newNumBoxArr = [...prevNumBoxArr];
            const emptySpots = newNumBoxArr.reduce((acc, curr, index) => {
                if (!curr) acc.push(index);
                return acc;
            }, []);

            if (emptySpots.length == 0) {
                gameOver();
                return newNumBoxArr;
            }

            const randomIndex = gsap.utils.random(0, emptySpots.length - 1, 1);
            const chosenSpot = emptySpots[randomIndex];
            newNumBoxArr[chosenSpot] = <NumBox number={2} id={chosenSpot} />;

            return newNumBoxArr;
        });
    }

    //function to move the number box up
    const moveUp = () => {
        console.log("move up");
        let newNumBoxArr = [...numBoxArr];
        for (let col = 0; col < 4; col++) {
            let column = [];
            for (let row = 0; row < 4; row++) {
                if (newNumBoxArr[row * 4 + col]) {
                    column.push(newNumBoxArr[row * 4 + col]);
                    newNumBoxArr[row * 4 + col] = null;
                }
            }
            for (let i = 0; i < column.length; i++) {
                newNumBoxArr[i * 4 + col] = column[i];
            }
        }
        setNumBoxArr(newNumBoxArr);
        placeNewNumBox()
    }

    //function to move the number box down
    const moveDown = () => {
        console.log("move down");
        let newNumBoxArr = [...numBoxArr];
        for (let col = 0; col < 4; col++) {
            let column = [];
            for (let row = 3; row >= 0; row--) {
                if (newNumBoxArr[row * 4 + col]) {
                    column.push(newNumBoxArr[row * 4 + col]);
                    newNumBoxArr[row * 4 + col] = null;
                }
            }
            for (let i = 0; i < column.length; i++) {
                newNumBoxArr[(3 - i) * 4 + col] = column[i];
            }
        }
        setNumBoxArr(newNumBoxArr);
        placeNewNumBox()
    }

    //function to move the number box left
    const moveLeft = () => {
        console.log("move left");
        let newNumBoxArr = [...numBoxArr];
        for (let row = 0; row < 4; row++) {
            let rowArray = [];
            for (let col = 0; col < 4; col++) {
                if (newNumBoxArr[row * 4 + col]) {
                    rowArray.push(newNumBoxArr[row * 4 + col]);
                    newNumBoxArr[row * 4 + col] = null;
                }
            }
            for (let i = 0; i < rowArray.length; i++) {
                newNumBoxArr[row * 4 + i] = rowArray[i];
            }
        }
        setNumBoxArr(newNumBoxArr);
        placeNewNumBox()
    }

    //function to move the number box right
    const moveRight = () => {
        console.log("move right");
        let newNumBoxArr = [...numBoxArr];
        for (let row = 0; row < 4; row++) {
            let rowArray = [];
            for (let col = 3; col >= 0; col--) {
                if (newNumBoxArr[row * 4 + col]) {
                    rowArray.push(newNumBoxArr[row * 4 + col]);
                    newNumBoxArr[row * 4 + col] = null;
                }
            }
            for (let i = 0; i < rowArray.length; i++) {
                newNumBoxArr[row * 4 + (3 - i)] = rowArray[i];
            }
        }
        setNumBoxArr(newNumBoxArr);
        placeNewNumBox()
    }



    //funtion to move the all the number box according to the arrow key pressed
    useEffect(() => {
        const checkArrowKey = (e) => {
            switch (e.key) {
                case "ArrowUp":
                    moveUp();
                    break;
                case "ArrowDown":
                    moveDown();
                    break;
                case "ArrowLeft":
                    moveLeft();
                    break;
                case "ArrowRight":
                    moveRight();
                    break;
                default:
                    // Optional: handle any other key press
                    break;
            }
        }

        window.addEventListener("keydown", checkArrowKey)

        return () => {
            window.removeEventListener("keydown", checkArrowKey)
        }
    })
    // useEffect(() => {
    //     screenUp();
    // }, [])
    return (
        <>
            <Screen />
            <div className='w-screen h-screen flex flex-col justify-evenly items-center'>
                <header>The 2048</header>

                <main className='w-2/3 h-2/3 flex flex-wrap'>
                    {boxes.map((ele, index) => {
                        return <div className={styles.box} id={ele}>{numBoxArr[index]}</div>
                    })}
                </main>
                <button onClick={setUpGame}>START</button>
            </div>
        </>
    )
}

export default page