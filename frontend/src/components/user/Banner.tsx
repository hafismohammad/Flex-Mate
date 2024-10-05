import BannerImg from '../../assets/banner-img.png'

function Banner() {
  return (
    <section className=" bg-black relative w-full ;h-[75.2vh] flex flex-col lg:flex-row items-center justify-between">
       <div className="ml-20">
       <div className="text-white flex-1 lg:mr-8">
            <h1 className='text-4xl lg:text-4xl  font-bold mb-4'>Get Fit with Your Personal Trainer.</h1>
            <p className='text-lg lg:text-xl mb-6'>Expert fitness coaching, personalized nutrition, and {<br />} holistic wellness — all in one platform.</p>
        <button className='bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded'>
            Get Start
        </button>
        </div>
       </div>
       <div className="flex-1 flex lg:justify-end justify-center">
            <img src={BannerImg} alt="banner-img" className='w-full lg:w-[100%] object-cover ' />
       </div>
    </section>
  )
}

export default Banner