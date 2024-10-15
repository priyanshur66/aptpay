"use client"
import LogoImage from '../assets/icons/logo.svg';
import MenuIcon from '../assets/icons/menu.svg';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <>
    <div className="bg-black opacity-90">
      <div className="px-4">
        <div className="container bg-black opacity-90">
          <div className="py-4 flex items-center justify-between">
          <Link href="\">
            <div className="relative">
            
              <div className='absolute w-full top-2 bottom-0  '></div>
              
                <img 
                  src='https://res.cloudinary.com/dxn4bwg6u/image/upload/v1728612664/smart-watch-icon-vector-fitness-gym-concept-thin-line-illustration-editable-stroke-linear-sign-use-web-mobile-193468610_vamgri.jpg' 
                  height={50} 
                  width={50} 
                  className='rounded-full ml-10'
                />
                
              </div>
              </Link>
              <nav className='text-white gap-6 items-center hidden sm:flex'>
                <button className='bg-white py-2 px-8 mr-10 rounded-lg text-black'>Connect wallet</button>
              </nav>
          </div>
        </div>
      </div>
    </div>
    </>
  )
};
