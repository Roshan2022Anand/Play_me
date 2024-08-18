"use client"
import React from 'react'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const page = () => {

  return (
    <>
    <header>

    </header>
      <main className='w-full h-screen flex justify-between items-center border-2'>
        <div className='w-1/2'>
          <div className='text-[#50C878] text-[15vw]'>PLAY ME.</div>
          <div className='mx-2'>A fun to play mini games</div>
        </div>
        <div className='flex justify-center w-1/2'>

          <Link href="/GamePg"><button>Let's go</button></Link>
        </div>
      </main>
    </>
  )
}

export default page