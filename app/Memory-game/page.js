"use client"
import React, { useEffect, useState } from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ReactCardFlip from 'react-card-flip';
import styles from '@/app/Memory-game/Memory-game.module.css'

const page = () => {

    //funtion for stoping the execution of the program 
    const waitExc = (time) => {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    //all the state variables are decalred here
    const [allCards, setallCards] = useState([]);
    const [userCardFlipped, setuserCardFlipped] = useState([]);
    const [cardEvents, setcardEvents] = useState(true);
    const [playerOneScore, setplayerOneScore] = useState(0);
    const [playerTwoScore, setplayerTwoScore] = useState(0);
    const [playerOneChance, setplayerOneChance] = useState(true);
    const [playerTwoChance, setplayerTwoChance] = useState(false);

    //this is the set of all the cards availabel in the game
    let cardInfo = [
        { txt: "🍦", ref: "cone1", flip: true },
        { txt: "🍦", ref: "cone2", flip: true },
        { txt: "🚀", ref: "rocket1", flip: true },
        { txt: "🚀", ref: "rocket2", flip: true },
        { txt: "🐼", ref: "panda1", flip: true },
        { txt: "🐼", ref: "panda2", flip: true },
        { txt: "🌈", ref: "rainbow1", flip: true },
        { txt: "🌈", ref: "rainbow2", flip: true },
        { txt: "⚽", ref: "ball1", flip: true },
        { txt: "⚽", ref: "ball2", flip: true },
        { txt: "🦖", ref: "dino1", flip: true },
        { txt: "🦖", ref: "dino2", flip: true },
        { txt: "🦋", ref: "fly1", flip: true },
        { txt: "🦋", ref: "fly2", flip: true },
        { txt: "🧸", ref: "teddy1", flip: true },
        { txt: "🧸", ref: "teddy2", flip: true },
        { txt: "⭐", ref: "star1", flip: true },
        { txt: "⭐", ref: "star2", flip: true },
        { txt: "🚂", ref: "train1", flip: true },
        { txt: "🚂", ref: "train2", flip: true },
        { txt: "🌞", ref: "sun1", flip: true },
        { txt: "🌞", ref: "sun2", flip: true },
        { txt: "🐞", ref: "bug1", flip: true },
        { txt: "🐞", ref: "bug2", flip: true }
    ];

    //function to shuffel all the cards
    const shuffelCards = () => {
        let tempAllCards = [];
        cardInfo.map((ele) => {
            let Inserted = false;
            do {
                let index = gsap.utils.random(0, 23, 1);
                if (!Inserted)
                    if (!tempAllCards[index]) {
                        tempAllCards[index] = ele;
                        Inserted = true;
                    }
            } while (!Inserted)
        })
        setallCards([...tempAllCards]);
        setplayerOneChance(true)
        setplayerTwoChance(false)
    }

    //function to swap the chances of the players
    const swapPlayesChance = () => {
        setplayerOneChance(!playerOneChance);
        setplayerTwoChance(!playerTwoChance);
    }

    //function to flip the card when clicked
    const flipTheCard = (index) => {
        let tempAllCards = allCards;
        Object.assign(tempAllCards[index], {
            flip: !allCards[index].flip
        })
        setallCards([...tempAllCards])
        setuserCardFlipped([...userCardFlipped, index]);
    }

    //funtion to flip the card back if it is not a pair
    const flipTwoCardBackWards = (cards) => {
        let tempAllCards = allCards;
        cards.map((i) => {
            Object.assign(tempAllCards[i], { flip: true })
        })
        setallCards([...tempAllCards])
    }

    //function to check if both cards match each other
    const checkIfPairMatches = async () => {
        if (allCards[userCardFlipped[0]].txt == allCards[userCardFlipped[1]].txt) {
            playerOneChance ? setplayerOneScore(playerOneScore + 1) : setplayerTwoScore(playerTwoScore + 1)

        } else {
            await waitExc(2000)
            flipTwoCardBackWards(userCardFlipped);//directs to line 80
        }
        swapPlayesChance();
        setcardEvents(true);
    }

    //triggered when user selects two cards
    if (userCardFlipped.length == 2) {
        setcardEvents(false);
        checkIfPairMatches();//directs to line 84
        setuserCardFlipped([]);
    }


    return (
        <>
            <header className='text-center text-[6vw]'>Memory game</header>
            <main className='m-1 h-[80vh] flex flex-col items-center justify-around gap-2'>
                <div className='flex w-screen flex-wrap justify-around' style={{
                    pointerEvents: cardEvents ? 'auto' : 'none'
                }}>
                    {allCards.map((ele, index) => {
                        return (
                            <ReactCardFlip flipDirection='horizontal' isFlipped={ele.flip}>
                                <div className={styles["card-front"]}>{ele.txt}</div>
                                <div className={styles["card-back"]} onClick={() => { flipTheCard(index) }}></div>
                            </ReactCardFlip>
                        )
                    })}
                </div>
                <button className='w-1/5 rounded-lg' onClick={shuffelCards}>Start</button>

                <div className='flex justify-between w-full p-2'>
                    <div className={`${styles.players} border-blue-600`} style={{
                        backgroundColor: playerOneChance ? "blue" : "transparent",
                        color: playerOneChance ? "white" : "black"
                    }}>{playerOneScore}</div>
                    <div className={`${styles.players} border-red-600`} style={{
                        backgroundColor: playerTwoChance ? "red" : "transparent",
                        color: playerTwoChance ? "white" : "black"
                    }}>{playerTwoScore}</div>
                </div>
            </main>
        </>
    )
}

export default page