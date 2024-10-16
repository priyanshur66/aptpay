"use client"
import WatchImage from '../assets/images/watch.png'
import Image from 'next/image';
import {motion} from 'framer-motion'
import { AnimatedGradientTextDemo } from './animatedtext';
import Link from 'next/link';
import Auth from './Auth';

export const Hero = () => {
  return (
    <div className=" text-white rounded py-[72px] sm:py-24 mt-20 relative overflow-clip"
    >

        <div className="container relative">
          <div className="flex items-center justify-center -mt-10">
            <AnimatedGradientTextDemo/>
          </div>
          <div className="flex justify-center mt-8 ">
            <div className="inline-flex relative">
              <h1 className='text-7xl sm:text-7xl font-bold tracking-tightner text-center inline-flex   mx-48'>Engage, Earn Discounts, Explore New Platforms</h1>
                <motion.div className='ml-48 mt-20 absolute left-[498px] top-[56px] hidden sm:inline'
                  drag
                  dragSnapToOrigin
                  >
                </motion.div>
              </div>
            </div>
              <div className="flex justify-center">
                <p className='text-xl text-center mt-8 max-w-3xl'> Users enjoy flexible campaign choices, ensuring convenience. Service providers benefit from a seamless integration with Indias UPI system, earning 20% of rewards without needing to register or onboard.
                </p>
              </div>
                <div className="flex justify-center mt-10">
                  <div className=''>
                    <Auth />
                  </div>
                </div>
              </div>
          </div>
  )
};
