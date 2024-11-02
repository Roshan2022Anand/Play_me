"use client"
import React, { useContext, useEffect, useRef, useState } from 'react';
import { MyContext } from '@/Helper/Context';
import { Search } from 'lucide-react';
import axios from 'axios';
import gsap from 'gsap';
import styles from "./wordly.module.css";

const page = () => {


  // https://api.datamuse.com/words?rel_jjb=(anyword)
  // https://api.datamuse.com/words?ml=(anyword) ->to find words

  //context API
  const { screenUp, waitExc, startGameState, setstartGameState } = useContext(MyContext);

  const [answer, setanswer] = useState("");
  const [starTyping, setstarTyping] = useState(true);
  const [currCol, setcurrCol] = useState(1);
  const [focusNum, setfocusNum] = useState(0);
  const [errMsg, seterrMsg] = useState("");

  let currInputBox;

  const inputRef = useRef();

  //to get a random word
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

  //to show the correct letter from the word
  const showCorrectLetter = (arrOfWrods) => {
    const answerArr = answer.split('');
    arrOfWrods.forEach((ele, index) => {
      if (ele.value == answerArr[index]) {
        ele.style.backgroundColor = "#98FB98";
      }
    })
  }

  //to check the current word is valid or not
  const checkValidWord = async (word, arrOfWrods) => {
    const res = await axios.get(`https://api.datamuse.com/words?rel_jjb=${word}`)
    if (res.data.length == 0) {
      popUpErrMsg("Invalid word");
      arrOfWrods.forEach((ele) => {
        ele.value = '';
      })
      setfocusNum(0);
      return
    }
    showCorrectLetter(arrOfWrods);
  }

  //to pop error message
  const popUpErrMsg = (msg) => {
    seterrMsg(msg);
    setTimeout(() => {
      seterrMsg("")
    }, 2000);
  }

  //to check the given letters
  const checkGivenLetters = () => {
    let arrOfWrods = document.querySelectorAll(`.ans-input-${currCol}`)
    let fullWords = "";
    arrOfWrods.forEach((ele) => {
      fullWords += ele.value;
    })
    console.log(fullWords);
    checkValidWord(fullWords, arrOfWrods);
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

    if (focusNum == 4) {
      checkGivenLetters();
      console.log("done");
      return
    }
    setfocusNum(prevNum => prevNum + 1);
  }

  //to remove the word from current box
  const backSpace = (e) => {
    if (e.key == 'Backspace') {
      if (focusNum == 0) {
        currInputBox.value = ''
        return
      }
      setfocusNum(prevNum => prevNum - 1);
    }
  }

  //setup of the box after focus
  useEffect(() => {
    const setFocus = (e) => {
      let currEle = e.target.className;
      if (currEle == 'final-ans-input' || currEle == 'wordly_answer-box-container__KJwkB') return
      currInputBox.focus()
    }

    currInputBox = document.querySelectorAll(`.ans-input-${currCol}`)[focusNum];
    if (!currInputBox) return
    currInputBox.focus();
    currInputBox.addEventListener('input', getInputBoxValue)
    window.addEventListener('keydown', backSpace)
    window.addEventListener("mousemove", setFocus)
    return () => {
      currInputBox.removeEventListener('input', getInputBoxValue)
      window.removeEventListener('keydown', backSpace)
      window.removeEventListener("mouseover", setFocus)
      window.removeEventListener("mousemove", setFocus)
    }
  }, [focusNum, starTyping])

  //initial setup
  useEffect(() => {
    screenUp();
    setstartGameState(0)
  }, [])

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
              <>
                <section className={styles['main-boxes-container']}>

                  <div className={styles['input-box-container']}>
                    <input type='text' className='ans-input-1' />
                    <input type='text' className='ans-input-1' />
                    <input type='text' className='ans-input-1' />
                    <input type='text' className='ans-input-1' />
                    <input type='text' className='ans-input-1' />
                  </div>
                  <div className={styles['input-box-container']}>
                    <input type='text' className='ans-input-2' />
                    <input type='text' className='ans-input-2' />
                    <input type='text' className='ans-input-2' />
                    <input type='text' className='ans-input-2' />
                    <input type='text' className='ans-input-2' />
                  </div>
                  <div className={styles['input-box-container']}>
                    <input type='text' className='ans-input-3' />
                    <input type='text' className='ans-input-3' />
                    <input type='text' className='ans-input-3' />
                    <input type='text' className='ans-input-3' />
                    <input type='text' className='ans-input-3' />
                  </div>
                  <div className={styles['input-box-container']}>
                    <input type='text' className='ans-input-4' />
                    <input type='text' className='ans-input-4' />
                    <input type='text' className='ans-input-4' />
                    <input type='text' className='ans-input-4' />
                    <input type='text' className='ans-input-4' />
                  </div>
                  <div className={styles['input-box-container']}>
                    <input type='text' className='ans-input-5' />
                    <input type='text' className='ans-input-5' />
                    <input type='text' className='ans-input-5' />
                    <input type='text' className='ans-input-5' />
                    <input type='text' className='ans-input-5' />
                  </div>
                  <div className={styles['answer-box-container']}>
                    <input type='text' className='final-ans-input' />
                    <input type='text' className='final-ans-input' />
                    <input type='text' className='final-ans-input' />
                    <input type='text' className='final-ans-input' />
                    <input type='text' className='final-ans-input' />
                  </div>

                </section>
              </>
          }
          <p>{answer}</p>
          <p className='w-full text-center text-[var(--footer-color)]'>{errMsg}</p>
        </section>
      </main>
    </>
  )
}

export default page