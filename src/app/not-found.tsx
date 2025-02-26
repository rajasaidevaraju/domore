'use client'

import PressableLink from './types/PressableLink'
import styles from './not-found.module.css'
export default function NotFound() {
  return (
    <div className={styles.container}>
      <h2 className={styles.returnHomeText}>404 Not Found | The requested resource could not be found</h2>
      <PressableLink className={styles.returnHome} href="/">Return Home</PressableLink>
    </div>
  )
}