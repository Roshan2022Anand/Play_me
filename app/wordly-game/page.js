"use client"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { MyContext } from '@/Helper/Context'
import { Search } from 'lucide-react';
import axios from 'axios';
import gsap from 'gsap';
import styles from "./wordly.module.css"

const page = () => {

  //context API
  const { screenUp, waitExc, startGameState, setstartGameState } = useContext(MyContext);

  const [answer, setanswer] = useState("");
  const [starTyping, setstarTyping] = useState(true);
  const [focusNum, setfocusNum] = useState(0);
  const [errMsg, seterrMsg] = useState("");

  let currInputBox;

  const inputRef = useRef();

  const srchWords = async () => {
    const srchWord = inputRef.current.value;
    if (!srchWord) return;

    const resOne = await axios.get(`https://api.datamuse.com/words?rel_jjb=${srchWord}`)

    if (resOne.data.lenght == 0) {
      inputRef.current.value = "Write something meaningfull";
      return
    }

    const resTwo = await axios.get(`https://api.datamuse.com/words?ml=${srchWord}`)
    const randomWordArr = [];
    resTwo.data.map((ele) => {
      if (ele.word.split('').length == 5)
        randomWordArr.push(ele.word)
    })
    setanswer(randomWordArr[gsap.utils.random(0, randomWordArr.length, 1)]);
    setstarTyping(true);
  }

  useEffect(() => {
    screenUp();
    setstartGameState(0)
  }, [])
  // https://api.datamuse.com/words?rel_jjb=(anyword)
  // https://api.datamuse.com/words?ml=(anyword) ->to find words

  //to pop error message
  const popUpErrMsg = (msg) => {
    seterrMsg(msg);
    setTimeout(() => {
      seterrMsg("")
    }, 2000);
  }

  //to get the value from input box
  const getInputBoxValue = () => {
    if (currInputBox.value == "") return
    const wordPattern = /^[A-Za-z]+$/;
    if (!wordPattern.test(currInputBox.value)) {
      currInputBox.value = '';
      popUpErrMsg("Only alphabets are allowed")
      return
    }
    setfocusNum(prevNum => prevNum + 1);
  }

  //to remove the word from current box
  const backSpace = (e) => {
    if (e.key == 'Backspace') {
      console.log("hai");

      if (focusNum == 0) {
        currInputBox.value = ''
        return
      }
      setfocusNum(prevNum => prevNum - 1);
      // currInputBox = document.querySelectorAll('.ans-input')[focusNum];
    }
  }

  useEffect(() => {
    const setFocus = () => { currInputBox.focus() }

    currInputBox = document.querySelectorAll('.ans-input')[focusNum];
    currInputBox.focus();
    currInputBox.addEventListener('input', getInputBoxValue)
    window.addEventListener('keydown', backSpace)
    window.addEventListener("mouseover", setFocus)
    window.addEventListener("mousemove", setFocus)
    return () => {
      currInputBox.removeEventListener('input', getInputBoxValue)
      window.removeEventListener('keydown', backSpace)
      window.removeEventListener("mouseover", setFocus)
      window.removeEventListener("mousemove", setFocus)
    }
  }, [focusNum])

  return (
    <>
      {/* <Screen /> */}
      <main className='w-screen h-screen flex flex-col justify-evenly items-center border-2'>
        <header className='absolute top-0'>Wordly game</header>

        {/* {(startGameState == 0) ? <Menu start={null}/> :
          <section className='w-screen h-[85vh] flex items-center justify-between'>
           
          </section>} */}

        <section>
          {
            !starTyping ? <div className='border-2 border-[#333333] rounded-xl px-3 flex ' >
              <input type='text' placeholder='Type any thing' className=' bg-transparent outline-none' ref={inputRef} />
              <button onClick={srchWords}><Search /></button>
            </div> :
              <section className='flex flex-col'
                style={{
                  width: "min(80vw,650px)",
                  height: "min(80vw,650px)",
                }}>

                <div className={styles['input-box-container']}>
                  <input type='text' className='ans-input' />
                  <input type='text' className='ans-input' />
                  <input type='text' className='ans-input' />
                  <input type='text' className='ans-input' />
                  <input type='text' className='ans-input' />
                </div>

                <div className={styles['input-box-container']}>
                  <input type='text' className='ans-input' />
                  <input type='text' className='ans-input' />
                  <input type='text' className='ans-input' />
                  <input type='text' className='ans-input' />
                  <input type='text' className='ans-input' />
                </div>

                <div className={styles['input-box-container']}>
                  <input type='text' className='ans-input' />
                  <input type='text' className='ans-input' />
                  <input type='text' className='ans-input' />
                  <input type='text' className='ans-input' />
                  <input type='text' className='ans-input' />
                </div>

                <div className={styles['input-box-container']}>
                  <input type='text' className='ans-input' />
                  <input type='text' className='ans-input' />
                  <input type='text' className='ans-input' />
                  <input type='text' className='ans-input' />
                  <input type='text' className='ans-input' />
                </div>

                <div className={styles['input-box-container']}>
                  <input type='text' />
                  <input type='text' />
                  <input type='text' />
                  <input type='text' />
                  <input type='text' />
                </div>

              </section>
          }
          <p>{answer}</p>
          <p className='w-full text-center text-[var(--footer-color)]'>{errMsg}</p>
        </section>
      </main>
    </>
  )
}

export default page