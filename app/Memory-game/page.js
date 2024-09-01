"use client"
import React, { useContext, useEffect, useState } from 'react'
import gsap from 'gsap';
import ReactCardFlip from 'react-card-flip';
import styles from '@/app/Memory-game/Memory-game.module.css'
import { MyContext } from '@/Helper/Context'
import Screen from '@/Components/Screen';
import Menu from '@/Components/Menu';

const page = () => {


    //context API
    const { screenUp, waitExc, startGameState, setstartGameState } = useContext(MyContext);

    //all the state variables are decalred here
    const [allCards, setallCards] = useState([]);
    const [userCardFlipped, setuserCardFlipped] = useState([]);
    const [cardEvents, setcardEvents] = useState(true);
    const [playerOneScore, setplayerOneScore] = useState(0);
    const [playerTwoScore, setplayerTwoScore] = useState(0);
    const [playerOneChance, setplayerOneChance] = useState(true);
    const [playerTwoChance, setplayerTwoChance] = useState(false);
    const [startBtn, setstartBtn] = useState(0);
    const [playerWon, setplayerWon] = useState(0);

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
        setplayerOneChance(true);
        setplayerTwoChance(false);
        setplayerOneScore(0);
        setplayerTwoScore(0);
        setuserCardFlipped([]);
        setplayerWon(0);
        setstartBtn(startBtn + 1)
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
            await waitExc(1000)
            playerOneChance ? setplayerOneScore(playerOneScore + 1) : setplayerTwoScore(playerTwoScore + 1)

        } else {
            await waitExc(2000)
            flipTwoCardBackWards(userCardFlipped);//directs to line 80
            swapPlayesChance();
        }
        setcardEvents(true);
    }

    //triggered when user selects two cards
    if (userCardFlipped.length == 2) {
        setcardEvents(false);
        checkIfPairMatches();//directs to line 84
        setuserCardFlipped([]);
    }

    //triggered when a player wins
    useEffect(() => {
        if (playerOneScore + playerTwoScore == 12)
            if (playerOneScore > playerTwoScore) setplayerWon(1);
            else setplayerWon(2);
    }, [playerOneScore, playerTwoScore])

    useEffect(() => {
        screenUp();
        setstartGameState(0)
    }, [])

    return (
        <>
            <Screen />
            <div className='w-screen h-screen flex flex-col justify-evenly items-center border-2'>
                <header>Memory game</header>

                {(startGameState == 0) ? <Menu start={shuffelCards} /> :
                    <main className='w-screen h-[85vh] flex items-center justify-between'>
                        <div className={styles['cards-board']} style={{ pointerEvents: cardEvents ? 'auto' : 'none' }}>
                            {allCards.map((ele, index) => {
                                return (
                                    <div className={styles.card} id='card'>
                                        <ReactCardFlip flipDirection='horizontal' isFlipped={ele.flip}>
                                            <div className={styles["card-front"]}>{ele.txt}</div>
                                            <div className={styles["card-back"]} onClick={() => { flipTheCard(index) }}></div>
                                        </ReactCardFlip>
                                    </div>
                                )
                            })}
                            <div className={styles['win-post']} style={{
                                display: playerWon > 0 ? "block" : "none",
                                color: playerWon == 1 ? "blue" : "red",
                            }}>
                                {playerWon == 1 ? "Blue player won the match" : "Red player won the match"}
                            </div>
                        </div>

                        <div className={styles["score-board"]}>
                            <div
                                className={`${styles.players} border-blue-600 rounded-tl-full`}
                                style={{
                                    backgroundColor: playerOneChance ? "blue" : "transparent",
                                    color: playerOneChance ? "white" : "black"
                                }}>
                                {playerOneScore}</div>

                            <button onClick={() => { setstartGameState(0) }} className={styles.backBtn}>{'>'}</button>

                            <div
                                className={`${styles.players} border-red-600 rounded-bl-full`}
                                style={{
                                    backgroundColor: playerTwoChance ? "red" : "transparent",
                                    color: playerTwoChance ? "white" : "black"
                                }}>
                                {playerTwoScore}</div>
                        </div>
                    </main>}
            </div>

        </>
    )
}

export default page