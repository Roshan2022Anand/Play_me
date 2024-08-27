"use client"
import React from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRouter } from 'next/navigation'

const page = () => {
  const router = useRouter();

  const waitExc = (time) => {
    return new Promise(resolve => setTimeout(resolve, time))
  }

  useGSAP(() => {
    gsap.from(".logo", {
      x: -300,
      duration: 1,
      stagger: 0.5
    })
    gsap.from("button", {
      x: 700,
      duration: 1,
      stagger: 0.5
    })
  })

  const goToGamePg = async () => {
    gsap.to("button", {
      scale: 100,
      duration: 2
    })
    await waitExc(2000);
    console.log("go");
    router.push("/GamePg")
  }
  return (
    <>
      <header>

      </header>
      <main className='w-full h-screen flex justify-between items-center border-2'>
        <div className='w-1/2'>
          <div className='text-[#50C878] text-[15vw]'>
            <p className='logo'>PLAY</p><p className='logo'>ME.</p>
          </div>
          <div className='mx-2'>A fun to play mini games</div>
        </div>
        <div className='flex justify-center w-1/2'>

          <button onClick={goToGamePg} className='p-3'>Let's go</button>
        </div>
      </main>
    </>
  )
}

export default page