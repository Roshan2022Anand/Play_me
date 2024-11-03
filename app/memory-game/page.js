"use client"
import React, { useContext, useEffect, useState } from 'react'
import gsap from 'gsap';
import ReactCardFlip from 'react-card-flip';
import styles from '@/app/Memory-game/Memory-game.module.css'
import { MyContext } from '@/Helper/Context'
import Screen from '@/components/Screen';
import Menu from '@/components/Menu';
import { ArrowBigRight } from 'lucide-react';
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
        { imgSrc: "/memory-game-img/cone.jpg", ref: "cone1", flip: true },
        { imgSrc: "/memory-game-img/cone.jpg", ref: "cone2", flip: true },
        { imgSrc: "/memory-game-img/rocket.jpg", ref: "rocket1", flip: true },
        { imgSrc: "/memory-game-img/rocket.jpg", ref: "rocket2", flip: true },
        { imgSrc: "/memory-game-img/panda.jpg", ref: "panda1", flip: true },
        { imgSrc: "/memory-game-img/panda.jpg", ref: "panda2", flip: true },
        { imgSrc: "/memory-game-img/rainbow.jpg", ref: "rainbow1", flip: true },
        { imgSrc: "/memory-game-img/rainbow.jpg", ref: "rainbow2", flip: true },
        { imgSrc: "/memory-game-img/ball.jpg", ref: "ball1", flip: true },
        { imgSrc: "/memory-game-img/ball.jpg", ref: "ball2", flip: true },
        { imgSrc: "/memory-game-img/dino.jpg", ref: "dino1", flip: true },
        { imgSrc: "/memory-game-img/dino.jpg", ref: "dino2", flip: true },
        { imgSrc: "/memory-game-img/fly.jpg", ref: "fly1", flip: true },
        { imgSrc: "/memory-game-img/fly.jpg", ref: "fly2", flip: true },
        { imgSrc: "/memory-game-img/teddy.jpg", ref: "teddy1", flip: true },
        { imgSrc: "/memory-game-img/teddy.jpg", ref: "teddy2", flip: true },
        { imgSrc: "/memory-game-img/star.jpg", ref: "star1", flip: true },
        { imgSrc: "/memory-game-img/star.jpg", ref: "star2", flip: true },
        { imgSrc: "/memory-game-img/train.jpg", ref: "train1", flip: true },
        { imgSrc: "/memory-game-img/train.jpg", ref: "train2", flip: true },
        { imgSrc: "/memory-game-img/sun.jpg", ref: "sun1", flip: true },
        { imgSrc: "/memory-game-img/sun.jpg", ref: "sun2", flip: true },
        { imgSrc: "/memory-game-img/bug.jpg", ref: "bug1", flip: true },
        { imgSrc: "/memory-game-img/bug.jpg", ref: "bug2", flip: true }
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
        if (allCards[userCardFlipped[0]].imgSrc == allCards[userCardFlipped[1]].imgSrc) {
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
            <main className='w-screen h-screen flex flex-col justify-evenly items-center border-2'>
                <header className='absolute top-0'>Memory game</header>
                {(startGameState == 0) ? <Menu start={shuffelCards} /> :
                    <section className='w-screen h-[85vh] flex items-center justify-between'>
                        <div className={styles['cards-board']} style={{ pointerEvents: cardEvents ? 'auto' : 'none' }}>
                            {allCards.map((ele, index) => {
                                return (
                                    <div className={styles.card} key={ele.ref}>
                                        <ReactCardFlip flipDirection='horizontal' isFlipped={ele.flip}>
                                            <div className={styles["card-front"]}>{ele.txt}
                                                <img src={ele.imgSrc} width={0} height={0}
                                                    className='w-full h-full object-fill rounded-[10px]'
                                                />
                                            </div>
                                            <div className={styles["card-back"]} onClick={() => { flipTheCard(index) }}></div>
                                        </ReactCardFlip>
                                    </div>
                                )
                            })}
                            <div className={styles['win-post']} style={{
                                display: playerWon > 0 ? "flex" : "none",
                                color: playerWon == 1 ? "blue" : "red",
                            }}>
                                <p> {playerWon == 1 ? "Blue player won the match" : "Red player won the match"}</p>
                                <button className='normal-btn' onClick={shuffelCards}>Restart</button>
                                <button className='normal-btn' onClick={() => { setstartGameState(0)}}>Back</button>
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
                            <button onClick={() => { setstartGameState(0) }} className={styles.backBtn}><ArrowBigRight /></button>
                            <div
                                className={`${styles.players} border-red-600 rounded-bl-full`}
                                style={{
                                    backgroundColor: playerTwoChance ? "red" : "transparent",
                                    color: playerTwoChance ? "white" : "black"
                                }}>
                                {playerTwoScore}</div>
                        </div>
                    </section>}
            </main>
        </>
    )
}
export default page