import React from 'react'
import styles from "@/app/The2048/The2048.module.css"
const NumBox = ({ number, boxId }) => {
    return (
        <>
            <div className={styles['num-box']} id={boxId}><div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl'>{number}</div></div>
        </>
    )
}
export default NumBox