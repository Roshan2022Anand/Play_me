"use client"
import React, { useContext, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRouter } from 'next/navigation'
import { MyContext } from '@/Helper/Context'
const page = () => {
  const router = useRouter();
  const { waitExc } = useContext(MyContext)

  useGSAP(async () => {
    gsap.from(".logo", {
      opacity: 0,
      duration: 1,
      stagger: 0.5
    })


    gsap.from("button", {
      x: 700,
      duration: 1,
      stagger: 0.5
    })
    await waitExc(2000);

    gsap.to(".logo", {
      textShadow: "8px 1px rgb(55, 181, 55)",
      duration: 1,
      stagger: 0.5
    })
  })

  return (
    <>
      <main className='w-full h-screen flex justify-between items-center border-2'>
        <div className='w-1/2'>
          <div className='text-[#50C878] text-[15vw]'>
            <p className='logo'>PLAY</p><p className='logo'>ME.</p>
          </div>
          <div className='mx-2'>A fun to play mini games</div>
        </div>
        <div className='flex justify-center w-1/2'>
          <button onClick={() => router.push("/gamePg")} className='normal-btn p-3'>Let's go</button>
        </div>
      </main>
    </>
  )
}

export default page