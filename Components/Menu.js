import { MyContext } from '@/Helper/Context'
import React, { useContext } from 'react'
import gsap from 'gsap'
const Menu = ({ start }) => {

    const { startGameState, setstartGameState, waitExc, screenDown,router } = useContext(MyContext);
    const animateMenu = () => {
        gsap.to(".menu", {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
                gsap.set(".menu", { display: "none" });
            }
        });
    }
    return (
        <>
            <div className='menu border-4 border-[#A8E6CF] rounded-lg shadow-lg w-1/2 h-1/2 lg:w-[500px] flex flex-col justify-evenly items-center bg-[#FFFAE3]'>
                <button onClick={async () => {
                    animateMenu()
                    start()
                    await waitExc(2000)
                    setstartGameState(startGameState + 1)
                }} className='w-1/2 py-8 text-[3.5vw] lg:text-2xl bg-[#A8E6CF] text-white rounded-md hover:bg-[#98FB98] transition-colors duration-300'>START</button>
                <button className='w-1/2 py-8 text-[3.5vw] lg:text-2xl bg-[#A8E6CF] text-white rounded-md hover:bg-[#98FB98] transition-colors duration-300'>HIGHSCORE</button>
                <button className='w-1/2 py-8 text-[3.5vw] lg:text-2xl bg-[#A8E6CF] text-white rounded-md hover:bg-[#98FB98] transition-colors duration-300' onClick={async () => {
                    screenDown();
                    await waitExc(2000)
                    router.push("/GamePg")
                }}>BACK</button>
            </div>
        </>
    )
}

export default Menu