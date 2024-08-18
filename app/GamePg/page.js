import React from 'react'
import Link from 'next/link'
import styles from '@/app/GamePg/GamePg.module.css'
const page = () => {
  return (
    <>
      <header className='text-[#50C878] bg-[#E6E6FA] text-4xl text-center'>PLAY ME.</header>
      <main className={styles["game-board"]}>
        <div className={`${styles['game-card']}`} >
          <Link href='/Memory-game'>
            <img src='\gamePg-img\memory-img.jpg' className={styles.img}/>
          </Link>
          <p className={styles["link-txt"]}>Memory game</p>
        </div>

        <p className='text-lg'>more games comming soon..</p>
      </main>
    </>
  )
}

export default page