import React from 'react'

function Bookings() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
    <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <h2 className="text-4xl font-bold text-gray-800">Bookings</h2>
  </div>
  
  <div className='bg-white shadow-lg p-6'>
     <div className='grid grid-cols-7 gap-1 text-lg font-semibold text-gray-600 mb-4 border-b border-gray-200 pb-2'>
     <div>BOOKING ID</div>
      <div>USER NAME</div>
      <div>TRAINER NAME</div>
      <div>SESSION DATE</div>
      <div>SESSION TIME</div>
      <div>AMOUNT PAID</div>
      <div>PAYMENT STATUS</div>
     </div>

      <div className='grid grid-cols-7 gap-1 items-center p-4 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-none mb-2'>
        <div className='text-gray-800 font-medium'>4445</div>
        <div className='text-gray-800 font-medium'>John</div>
        <div className='text-gray-800 font-medium'>Trainer 1</div>
        <div className='text-gray-800 font-medium'>20/33/222 / 33/33/333</div>
        <div className='text-gray-800 font-medium'>10:30 to 11:30</div>
        <div className='text-gray-800 font-medium'>1000</div>
        <div className='text-gray-800 font-medium'>Confirmed</div>

      </div>
  </div>
</div>
  )
}

export default Bookings