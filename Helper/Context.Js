"use client"
import React, { createContext } from 'react'

export const MyContext = createContext();

const Context = ({ children }) => {


    const screenDown=()=>{
        gsap.to(".screen", {
            marginTop: '0px',
            duration: 2
        })
    }

    const screenUp = () => {
        gsap.from(".screen", {
            marginTop: '0px',
            duration: 2
        })
    }
    const a = 10;
    return (
        <>
            <MyContext.Provider value={{screenDown,screenUp,a}}>
                {children}
            </MyContext.Provider>
        </>
    )
}

export default Context