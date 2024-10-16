"use client"
import Bentodemo from './bentogrid';

export const Features = () => {
  return (

    <div className="bg-[linear-gradient(to_bottom,#001F3F,#1E3A8A_34%,#3B82F6_85%,#3B82F6_95%)] relative overflow-clip -mt-28 text-white py-[72px] sm:py-24 mb-20 rounded-t-3xl">

      <div className="container">
        <h2 className="text-center font-bold text-5xl sm:text-6xltracking-tighter">Everything you need </h2>
        <div className='max-w-3xl mx-auto'>
        <p className="text-center mt-5 text-xl pb-8 text-white/70">
        Promopay rewards users with instant discounts on daily purchases by participating in quick promotional campaigns, such as short ads or tasks. 
        </p>
        </div>
        <div className="flex flex-col items-center justify-center sm:flex-row gap-4 mt-32">
          <Bentodemo />
          

        </div>

      </div>


    </div>
  )
}
