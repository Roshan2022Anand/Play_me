"use client"
import React, { useContext, useEffect, useRef, useState } from 'react';
import { MyContext } from '@/Helper/Context';
import { ArrowBigRight, Loader, Loader2, Search, TicketCheck } from 'lucide-react';
import axios from 'axios';
import gsap from 'gsap';
import styles from "./wordly.module.css";
import Menu from '@/Components/Menu';

const page = () => {
  //context API
  const { screenUp, waitExc, startGameState, setstartGameState } = useContext(MyContext);

  const [answer, setanswer] = useState("");
  const [starTyping, setstarTyping] = useState(false);
  const [colNum, setcolNum] = useState(1);
  const [focusNum, setfocusNum] = useState(0);
  const [ansFocusNum, setansFocusNum] = useState(0);
  const [currCol, setcurrCol] = useState(0);
  const [currFocusNum, setcurrFocusNum] = useState(0);
  const [score, setscore] = useState(0);
  const [resultMsg, setresultMsg] = useState("");
  const [errMsg, seterrMsg] = useState("");
  const [currLoader, setcurrLoader] = useState(0);
  const [srchWordState, setsrchWordState] = useState(false)

  let currInputBox;

  const inputRef = useRef();

  //to rotate the loader
  document.querySelectorAll('.loader').forEach((ele) => {
    gsap.to(ele, { rotate: 360, duration: 2, repeat: -1, ease: 'linear' })
  })

  //function to reset the game
  const resetGame = () => {
    setanswer("");
    setstarTyping(false);
    setcolNum(1);
    setfocusNum(0);
    setansFocusNum(0);
    setcurrCol(0);
    setcurrFocusNum(0);
    setscore(0);
    setresultMsg("");
    seterrMsg("");
  }

  //function to pop up the result
  const resultPopUp = (result) => {
    if (result) {
      setresultMsg("Congratulation! You have found the word : " + answer);
      setscore(100 - ((colNum - 1) * 20))
    } else {
      setresultMsg("Sorry! The correct answer is : " + answer);
    }
  }

  //function to check the final result
  const checkFinalResult = () => {
    let finalAns = "";
    document.querySelectorAll('.ans-input-6').forEach((ele) => {
      if (ele.value == "") {
        popUpErrMsg("Fill the Answer boxes");
        return
      }
      finalAns += ele.value;
    })
    if (finalAns == answer) resultPopUp(true)
    else resultPopUp(false)
  }

  //to get a random word
  const srchWords = async () => {
    setsrchWordState(true);
    const srchWord = inputRef.current.value;
    if (!srchWord) return null;

    const resOne = await axios.get(`https://api.datamuse.com/words?rel_jjb=${srchWord}`)

    if (resOne.data.length == 0) {
      popUpErrMsg("Write something meaningfull")
      inputRef.current.value = "";
      return null;
    }

    const resTwo = await axios.get(`https://api.datamuse.com/words?ml=${srchWord}`)
    const randomWordArr = [];
    resTwo.data.map((ele) => {
      if (ele.word.split('').length == 5)
        randomWordArr.push(ele.word)
    })
    setanswer(randomWordArr[gsap.utils.random(0, randomWordArr.length, 1)]);
    setstarTyping(true);
    return null;
  }

  //to pop error message
  const popUpErrMsg = (msg) => {
    seterrMsg(msg);
    setTimeout(() => {
      seterrMsg("")
    }, 2000);
  }

  //to remove the word from current box
  const backSpace = (e) => {
    if (e.key == 'Backspace') {
      if (currFocusNum == 0) {
        currInputBox.value = ''
        return
      }

      if (currCol == 6) {
        setansFocusNum(prevNum => prevNum - 1);
        setcurrFocusNum(prevNum => prevNum - 1);
      } else {
        setfocusNum(prevNum => prevNum - 1);
        setcurrFocusNum(prevNum => prevNum - 1);
      }
    }
  }

  //function to switch between answer and input box
  const switchTo = (choice) => {
    currInputBox?.focus();
    if (choice == 'initial') {
      setcurrCol(colNum)
      setcurrFocusNum(focusNum)
    } else {
      setcurrCol(6)
      setcurrFocusNum(ansFocusNum)
    }
  }

  //to show the correct letter from the word
  const showCorrectLetter = async (arrOfWrods) => {
    const answerArr = answer.split('');
    arrOfWrods.forEach((ele, index) => {
      if (ele.value == answerArr[index])
        ele.style.backgroundColor = "#98FB98";
    })

    setcolNum(prevNum => prevNum + 1);
    setfocusNum(0);
    setcurrCol(prevNum => prevNum + 1);
    setcurrFocusNum(0);
    setcurrLoader(0);
  }

  //to check the current word is valid or not
  const checkValidWord = async (word, arrOfWrods) => {
    setcurrLoader(currCol)
    const res = await axios.get(`https://api.datamuse.com/words?rel_jjb=${word}`)
    await waitExc(500);
    if (res.data.length == 0) {
      popUpErrMsg("Invalid word");//line 55
      arrOfWrods.forEach((ele) => {
        ele.value = '';
      })
      setfocusNum(0);
      setcurrFocusNum(0);
      setcurrLoader(0);
      return
    }
    showCorrectLetter(arrOfWrods);//line 93
  }

  //to check the given letters
  const checkGivenLetters = () => {
    let arrOfWrods = document.querySelectorAll(`.ans-input-${colNum}`)
    let fullWords = "";
    arrOfWrods.forEach((ele) => {
      fullWords += ele.value;
    })
    checkValidWord(fullWords, arrOfWrods);//line 107
  }

  //to get the value from input box
  const getInputBoxValue = () => {
    if (currInputBox.value == "") return
    const wordPattern = /^[A-Za-z]+$/;

    if (!wordPattern.test(currInputBox.value)) {
      currInputBox.value = '';
      popUpErrMsg("Only alphabets are allowed")//line 55
      return
    }

    //condition for the letters in the final answer column
    if (currCol == 6) {
      if (currFocusNum == 4) return
      setansFocusNum(prevNum => prevNum + 1);
      setcurrFocusNum(prevNum => prevNum + 1);
      return
    }

    //condition for the letters in the initial answer column
    if (currFocusNum == 4) {
      checkGivenLetters();
      return
    }
    setfocusNum(prevNum => prevNum + 1);
    setcurrFocusNum(prevNum => prevNum + 1);
  }


  //setup of the box after focus
  useEffect(() => {
    currInputBox = document.querySelectorAll(`.ans-input-${currCol}`)[currFocusNum];

    if (!currInputBox) return

    currInputBox.focus();
    currInputBox.addEventListener('input', getInputBoxValue)//line 132

    window.addEventListener('keydown', backSpace)//line 63
    return () => {
      currInputBox.removeEventListener('input', getInputBoxValue)
      window.removeEventListener('keydown', backSpace)
    }
  }, [currFocusNum, starTyping, currCol])

  //initial setup
  useEffect(() => {
    switchTo('initial')//line 81
    screenUp();
    setstartGameState(0)
  }, [])
  return (
    <>
      {/* <Screen /> */}
      <main className='w-screen h-screen flex flex-col justify-center items-center'>
        <header className='absolute top-0'>Wordly game</header>

        {(startGameState == 0) ? <Menu start={() => { setstartGameState(1) }} /> :
          <section>
            {
              !starTyping ? <>
                <div className='border-2 border-[#333333] rounded-xl px-3 flex ' >
                  <input type='text' placeholder='Type any thing' className=' bg-transparent outline-none grow' ref={inputRef} />
                  <button onClick={async() => {
                    let val = await srchWords()
                    console.log(val);

                    if (val == null) setsrchWordState(false);
                  }}>{srchWordState ? <Loader className='loader' /> : <ArrowBigRight />}</button>
                </div>
                <ul className='mt-5 list-disc pl-5 space-y-2'>
                  <li>Write anythig to get a starting point.</li>
                  <li>Then try to find a word with 5 letters based on your search.</li>
                  <li>Try to find the word by typing the letters.</li>
                </ul>
              </> : <>
                <section className={styles['main-boxes-container']}>
                  <div className={styles['other-utility-container']} onClick={() => { switchTo('initial') }}>
                    <p>{currLoader == 1 ? <Loader className='loader' /> : "1"}</p>
                    <p>{currLoader == 2 ? <Loader className='loader' /> : "2"}</p>
                    <p>{currLoader == 3 ? <Loader className='loader' /> : "3"}</p>
                    <p>{currLoader == 4 ? <Loader className='loader' /> : "4"}</p>
                    <p>{currLoader == 5 ? <Loader className='loader' /> : "5"}</p>
                  </div>
                  <div className='bg-transparent w-full h-[18%] absolute bottom-0 z-10' onClick={() => { switchTo('final') }}></div>

                  {/* final result */}
                  {resultMsg != "" && <article className='w-2/3 h-2/3 bg-[var(--btn-txt-color)] rounded-lg backdrop:blur-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col justify-evenly items-center gap-2 text-center'>
                    <p style={{
                      color: score > 0 ? 'var(--btn-hover-color)' : 'var(--footer-color)',
                      fontSize: '2.5vw'
                    }}>{resultMsg}</p>
                    <p className='text-[2vw]'>Score :<span>{score}/100</span></p>
                    <div className='w-1/2 flex flex-col gap-2'>
                      <button className='bg-[var(--btn-color)] rounded-lg' onClick={resetGame}>Restart</button>
                      <button className='bg-[var(--btn-color)] rounded-lg' onClick={() => { setstartGameState(0) }}>Back</button>
                    </div>
                  </article>}


                  <fieldset className={styles['input-box-container']}>
                    <input type='text' className='ans-input-1' />
                    <input type='text' className='ans-input-1' />
                    <input type='text' className='ans-input-1' />
                    <input type='text' className='ans-input-1' />
                    <input type='text' className='ans-input-1' />
                  </fieldset>
                  <fieldset className={styles['input-box-container']}>
                    <input type='text' className='ans-input-2' />
                    <input type='text' className='ans-input-2' />
                    <input type='text' className='ans-input-2' />
                    <input type='text' className='ans-input-2' />
                    <input type='text' className='ans-input-2' />
                  </fieldset>
                  <fieldset className={styles['input-box-container']}>
                    <input type='text' className='ans-input-3' />
                    <input type='text' className='ans-input-3' />
                    <input type='text' className='ans-input-3' />
                    <input type='text' className='ans-input-3' />
                    <input type='text' className='ans-input-3' />
                  </fieldset>
                  <fieldset className={styles['input-box-container']}>
                    <input type='text' className='ans-input-4' />
                    <input type='text' className='ans-input-4' />
                    <input type='text' className='ans-input-4' />
                    <input type='text' className='ans-input-4' />
                    <input type='text' className='ans-input-4' />
                  </fieldset>
                  <fieldset className={styles['input-box-container']}>
                    <input type='text' className='ans-input-5' />
                    <input type='text' className='ans-input-5' />
                    <input type='text' className='ans-input-5' />
                    <input type='text' className='ans-input-5' />
                    <input type='text' className='ans-input-5' />
                  </fieldset>
                  <fieldset className={styles['input-box-container']}>
                    <input type='text' className='ans-input-6' />
                    <input type='text' className='ans-input-6' />
                    <input type='text' className='ans-input-6' />
                    <input type='text' className='ans-input-6' />
                    <input type='text' className='ans-input-6' />
                  </fieldset>
                </section>
                <button onClick={checkFinalResult} className='w-1/3 mt-2 mx-auto bg-[var(--btn-color)] rounded-md flex justify-center gap-3'>Next <TicketCheck /></button>
              </>
            }
            <p className='w-full text-center text-[var(--footer-color)]'>{errMsg}</p>
          </section >}

      </main>
    </>
  )
}

export default page