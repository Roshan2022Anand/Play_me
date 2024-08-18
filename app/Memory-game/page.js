"use client"
import React, { useEffect, useState } from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ReactCardFlip from 'react-card-flip';

const page = () => {

    //all the state variables are decalred here
    const [allCards, setallCards] = useState([]);
    const [userCardFlipped, setuserCardFlipped] = useState([]);


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

    const flipTwoCardBackWards = (cards) => {

        let tempAllCards = allCards;
        cards.map((i) => {
            Object.assign(tempAllCards[i], { flip: true })
        })
        setallCards([...tempAllCards])
    }
    useEffect(() => {
        if (userCardFlipped.length == 2) {
            console.log();

            if (allCards[userCardFlipped[0]].txt == allCards[userCardFlipped[1]].txt){
                console.log("both are same");
                
            }else{
                console.log("both are not same");
                setTimeout(() => {
                    flipTwoCardBackWards(userCardFlipped);
                }, 2000)
            } 

            setuserCardFlipped([]);
        }
    }, [userCardFlipped])


    return (
        <>
            <header className='text-center text-[6vw]'>Memory game</header>
            <main className='m-1 h-[85vh] flex flex-col items-center justify-around'>
                <div className='flex w-screen flex-wrap justify-around'>
                    {allCards.map((ele, index) => {
                        return (
                            <ReactCardFlip flipDirection='horizontal' isFlipped={ele.flip}>
                                <div className={"card-front"}>{ele.txt}</div>
                                <div className={"card-back"} onClick={() => { flipTheCard(index) }}></div>
                            </ReactCardFlip>
                        )
                    })}
                </div>
                <button className='w-1/5 rounded-lg' onClick={shuffelCards}>Start</button>
            </main>
        </>
    )
}

export default page