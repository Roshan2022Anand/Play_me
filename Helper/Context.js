"use client"
import React, { createContext } from 'react'
import gsap from 'gsap';
export const MyContext = createContext();
const Context = ({ children }) => {
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
      <MyContext.Provider value={{ waitExc, screenDown, screenUp }}>
        {children}
      </MyContext.Provider>
    </>
  )
}

export default Context