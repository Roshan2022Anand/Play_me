"use client"
import React, { useEffect, useState } from 'react'
import styles from "@/app/The2048/The2048.module.css"
import gsap from 'gsap'
// --bg - color: #FFFAE3;
// --text - color: #333333;
// --btn - color: #A8E6CF;
// --btn - hover - color: #98FB98;
// --nav - color: #A8E6CF;
// --btn - txt - color: #FFFFFF;
// --link - color: #FFA07A;
// --footer - color: #F08080;
const page = () => {

    const [numBoxArr, setnumBoxArr] = useState([]);

    //for genrating colums
    let boxes = [];
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
            boxes.push(i + "" + j)

    //function to start the game
    const setUpGame = () => {
        let indexOne = gsap.utils.random(0, 3, 1) + "" + gsap.utils.random(0, 3, 1)
        let indexTwo = gsap.utils.random(0, 3, 1) + "" + gsap.utils.random(0, 3, 1)

        setnumBoxArr([indexOne,indexTwo])

    }

    useEffect(() => {

    }, [numBoxArr])


    return (
        <>
            <div className='w-screen h-screen flex flex-col justify-evenly items-center'>
                <header>The 2048</header>

                <main className='border-2 border-red-500 w-2/3 h-2/3 flex flex-wrap'>
                    {boxes.map((ele) => {
                        return <div className={styles.box} id={ele}>{ele}</div>
                    })}
                </main>
                <button onClick={setUpGame}>START</button>
            </div>
        </>
    )
}

export default page