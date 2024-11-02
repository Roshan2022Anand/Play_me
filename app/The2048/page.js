"use client"
import React, { useContext, useEffect, useState } from 'react'
import styles from "@/app/The2048/The2048.module.css"
import gsap from 'gsap'
import { MyContext } from '@/Helper/Context'
import Screen from '@/Components/Screen'
import NumBox from '@/Components/NumBox'
import Menu from '@/Components/Menu'
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
    const { screenUp, screenDown, waitExc, startGameState, setstartGameState } = useContext(MyContext);

    //all the states are declared here
    const [BoxIdArr, setBoxIdArr] = useState([]);
    const [numBoxArr, setNumBoxArr] = useState([]);
    const [boxes, setBoxes] = useState([]);
    const [moved, setmoved] = useState(1);

    //for genrating colums
    useEffect(() => {
        let tempBoxes = []
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                tempBoxes.push(i + "" + j)
        setBoxes(tempBoxes);
        setstartGameState(1);
        setUpGame();
        // screenUp();
        console.log("generated column and setup game");

    }, [])

    //function to start the game
    const setUpGame = () => {
        let indexOne = gsap.utils.random(0, 3, 1) + "" + gsap.utils.random(0, 3, 1)
        let indexTwo = gsap.utils.random(0, 3, 1) + "" + gsap.utils.random(0, 3, 1)
        while (indexOne === indexTwo) {
            indexTwo = gsap.utils.random(0, 3, 1) + "" + gsap.utils.random(0, 3, 1)
        }
        setBoxIdArr([indexOne, indexTwo])
    }

    //funtion to place the number box in a random location
    useEffect(() => {
        let tempNumBoxArr = [];
        BoxIdArr.forEach((index) => {
            tempNumBoxArr.push({ x: Number(index.split("")[0]), y: Number(index.split("")[1]) })
        })
        setNumBoxArr(tempNumBoxArr);
    }, [BoxIdArr])

    //animating the movement of the box
    const animateMovement = (ele, yAxis, xAxis) => {
        console.log(yAxis*25,xAxis*25);
        let theBox = document.getElementById(ele);
        gsap.to(theBox, {
            position: "relative",
            top: `${yAxis * 100}%`,
            left: `${xAxis * 100}%`,
            duration:0.2
        })
    }

    //funtion to move all the box upwards
    const moveUp = async () => {
        console.log("move up")
        let tempNumBoxArr = numBoxArr;
        for (let i = 0; i < 4; i++) {
            let space = 0;
            for (let j = 0; j < 4; j++) {
                let loc = j + "" + i;
                let theBox = tempNumBoxArr[tempNumBoxArr.findIndex(pos => pos.x + "" + pos.y == loc)]
                if (theBox) {
                    Object.assign(theBox, { x: theBox.x - space })
                    animateMovement(loc, -space, 0);
                } else space++
            }
        }
        await waitExc(2000)
        setNumBoxArr(tempNumBoxArr);
        setmoved(moved + 1);
    }

    //funtion to move all the box downwards
    const moveDown = async () => {
        console.log("move down")
        let tempNumBoxArr = numBoxArr;
        for (let i = 3; i >= 0; i--) {
            let space = 0;
            for (let j = 3; j >= 0; j--) {
                let loc = j + "" + i;
                let theBox = tempNumBoxArr[tempNumBoxArr.findIndex(pos => pos.x + "" + pos.y == loc)]
                if (theBox) {
                    Object.assign(theBox, { x: theBox.x + space })
                    animateMovement(loc, space, 0);
                } else space++
            }
        }
        await waitExc(5000)
        setNumBoxArr(tempNumBoxArr);
        setmoved(moved + 1);
    }

    //funtion to move all the box to the left
    const moveLeft = async () => {
        console.log("move left")
        let tempNumBoxArr = numBoxArr;
        for (let i = 0; i < 4; i++) {
            let space = 0;
            for (let j = 0; j < 4; j++) {
                let loc = i + "" + j;
                let theBox = tempNumBoxArr[tempNumBoxArr.findIndex(pos => pos.x + "" + pos.y == loc)]
                if (theBox) {
                    Object.assign(theBox, { y: theBox.y - space })
                    animateMovement(loc, 0, -space);
                } else space++
            }
        }
        await waitExc(2000)
        setNumBoxArr(tempNumBoxArr);
        setmoved(moved + 1);
    }

    //funtion to move all the box to the right 
    const moveRight = async () => {
        console.log("move right")
        let tempNumBoxArr = numBoxArr;
        for (let i = 3; i >= 0; i--) {
            let space = 0;
            for (let j = 3; j >= 0; j--) {
                let loc = i + "" + j;
                let theBox = tempNumBoxArr[tempNumBoxArr.findIndex(pos => pos.x + "" + pos.y == loc)]
                if (theBox) {
                    Object.assign(theBox, { y: theBox.y + space })
                    animateMovement(loc, 0, space);
                } else space++
            }
        }
        await waitExc(2000)
        setNumBoxArr(tempNumBoxArr);
        setmoved(moved + 1);
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
    return (
        <>
            <Screen />
            <div className='w-screen h-screen flex flex-col justify-evenly items-center'>
                <header>The 2048</header>
                {(startGameState === 0) ? <Menu start={setUpGame} /> :
                    <main className='game-board w-[65vw] h-[65vw] max-w-[600px] max-h-[600px] flex flex-wrap relative'>
                        {(moved) ?
                            boxes.map((ele, index) => {
                                return (
                                    <div className={styles.box} >
                                        {numBoxArr.some(index => index.x + "" + index.y === ele) ? <NumBox number={2} boxId={ele} /> : null}
                                    </div>
                                );
                            }) : "no movements"
                        }
                    </main>}
            </div>
        </>
    )
}

export default page;
