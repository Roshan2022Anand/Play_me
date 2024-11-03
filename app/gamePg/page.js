"use client"
import React, { useContext, useEffect } from 'react'
import styles from "./gamePg.module.css"
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { MyContext } from '@/Helper/Context'
import Screen from '@/components/Screen'
import { ArrowBigRight } from 'lucide-react'
const page = () => {
    const router = useRouter();
    const { screenDown, screenUp, waitExc } = useContext(MyContext);
    //redirecting to games page
    const goToSelectedGamesPage = async (gameFile) => {
        screenDown();
        await waitExc(2000)
        router.push(gameFile);
    }
    //redirect to home page
    const goToHomePg = async () => {
        gsap.to("button", {
            scale: 700,
            duration: 2
        })
        await waitExc(2000)
        router.push("/")
    }
    useEffect(() => {
        screenUp();
    }, [])
    return (
        <>
            <Screen />
            <header className='text-[#50C878] bg-[#E6E6FA] text-[4vw] flex p-1'>
                <p className='text-center grow w-1/2'>PLAY ME.</p>
                <button className='normal-btn p-2 ml-auto ' onClick={goToHomePg}> <ArrowBigRight /></button>
            </header>
            <main className={styles["game-board"]}>
                {/* memory-game-card */}
                <div className={styles['game-card']} onClick={() => { goToSelectedGamesPage("/memory-game") }}>
                    <img src='\gamePg-img\memory-img.jpg' className={styles.img} />
                    <p className={styles["link-txt"]}>Memory game</p>
                </div>
                {/* Wordly-game-card */}
                <div className={styles['game-card']} onClick={() => { goToSelectedGamesPage("/wordly-game") }}>
                    <img src='\gamePg-img\wordly.png' className={styles.img} />
                    <p className={styles["link-txt"]}>Wordly game</p>
                </div>
                {/* the 2048 game */}
                <div className={styles['game-card']} onClick={() => { goToSelectedGamesPage("/the2048") }}>
                    <img src='\gamePg-img\the2048.jpg' alt='img' className={styles.img} />
                    <p className={styles["link-txt"]}>2048</p>
                </div>
                {/* snake-game-card */}
                <div className={styles['game-card']} onClick={() => { goToSelectedGamesPage("/snake-game") }}>
                    <img src='\gamePg-img\snake-game.jpg' alt='img' className={styles.img} />
                    <p className={styles["link-txt"]}>Snake-game</p>
                </div>
            </main>
            <p className='text-lg absolute bottom-8 left-2 -z-10'>more games comming soon..</p>
        </>
    )
}
export default page