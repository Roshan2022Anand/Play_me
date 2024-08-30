"use client"
import React, { createContext, useState } from 'react'
import gsap from 'gsap';
export const MyContext = createContext();
const Context = ({ children }) => {

  const [startGameState, setstartGameState] = useState(0);

  const waitExc = (time) => {
    return new Promise(resolve => setTimeout(resolve, time))
  }

  const screenDown = () => {
    gsap.to(".screen", {
      duration: 2,
      marginTop: 0
    })
  }

  const screenUp = () => {
    gsap.fromTo(".screen", {marginTop: 0}, {
      duration: 2,
      marginTop: -1200
    })


  }

  return (
    <>
      <MyContext.Provider value={{ waitExc, screenDown, screenUp,startGameState,setstartGameState }}>
        {children}
      </MyContext.Provider>
    </>
  )
}

export default Context