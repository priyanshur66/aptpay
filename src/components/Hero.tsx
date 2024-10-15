"use client"
import WatchImage from '../assets/images/watch.png'
import Image from 'next/image';
import {motion} from 'framer-motion'
import { AnimatedGradientTextDemo } from './animatedtext';
import Link from 'next/link';

export const Hero = () => {
  return (
    <div className="bg-black text-white bg-[linear-gradient(to_bottom,#000,#200D42_34%,#4F21A1_65%,#A46EDB_82%)] py-[72px] sm:py-24 relative overflow-clip">
      <div className="absolute h-[375px] w-[750px] sm:w-[1536px] sm:h-[768px] lg:w-[2400px] llg:h-[800px] rounded-[100%] bg-black left-1/2 -translate-x-1/2 border border-[#B48CDE] bg-[radial-gradient(closest-side,#000_82%,#9560EB)] top-[calc(100%-96px)] sm:top-[calc(100%-120px)]"></div>
    <div className="container relative">
      <div className="flex items-center justify-center -mt-10">
        <AnimatedGradientTextDemo/>
      </div>
      <div className="flex justify-center mt-8 ">
      <div className="inline-flex relative">
      <h1 className='text-7xl sm:text-9xl font-bold tracking-tightner text-center inline-flex'>Gamify Healthy <br/> Habits</h1>
      <motion.div className='ml-48 mt-20 absolute left-[498px] top-[56px] hidden sm:inline'
      drag
      dragSnapToOrigin
      >
      <Image src={WatchImage} alt="cursor"  height={200} width={200} className='max-w-none' draggable="false"/>
      </motion.div>
      </div>
      </div>
      <div className="flex justify-center">
      <p className='text-xl text-center mt-8 max-w-md'>OmniX helps prevent lifestyle diseases by encouraging healthy habits through gamification. Users join groups, set health goals, and compete to achieve them.</p>
      </div>
      <div className="flex justify-center mt-8">
        <Link href="\landing">
      <button className='bg-white text-black py-3 px-5 rounded-lg font-medium'>Know More</button></Link>
      </div>


    </div>
    

    </div>
  )
};
