import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Navibar = () => {
  return (
    <header>
        <nav>
            <Link href='/' className='logo'>
                <Image src="/icons/logo.png" alt='Logo' height={24} width={24}/>
                <p>DevEvents</p>
            </Link>
            <ul>
                <Link href="/">Home</Link>
                <Link href="/">Events</Link>
                <Link href="/">Create Events</Link>
            </ul>
        </nav>
    </header>
  )
}

export default Navibar
