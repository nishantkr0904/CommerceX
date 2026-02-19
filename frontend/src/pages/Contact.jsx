import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
      <img className='w-full md:max-w-[450px]' src={assets.contact_img} alt="" />
      <div className='flex flex-col justify-center gap-6 items-start'>
        <p className='font-semibold text-gray-600 text-xl'>Our Store</p>
        <p className='text-gray-500'>54709 Willms Stations <br />Suite 350, Washington, USA</p>
        <p className='text-gray-500'>Tel: (415) 555-5555 <br />Email: 7Bt7G@example.com</p>
        <p className='font-semibold text-gray-600 text-xl'>Careers at Forever</p>
        <p className='text-gray-500'>Learn more about out teams and job openings.</p>
        <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
      </div>
      </div>
      <NewsletterBox/>
    </div>
  )
}

export default contact