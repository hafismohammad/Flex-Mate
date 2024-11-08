import 'daisyui/dist/styled.css'
import { useEffect } from 'react';

function Message() {
  useEffect(() => {
    // Import DaisyUI styles dynamically
    import('daisyui/dist/styled.css');
  }, []);


  // useEffect(() => {
  //   const fetchTraierMessages = () => {

  //   }
  // },[])

  return (
    <>
    <div className="chat chat-start">
    <div className="chat-image avatar">
      <div className="w-10 rounded-full">
        <img
          alt="Tailwind CSS chat bubble component"
          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
      </div>
    </div>
   
    <div className={`chat-bubble text-white bg-blue-500`}>You were the Chosen One!</div>
    <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>12:30</div>

    {/* <div className="chat-footer opacity-50">Delivered</div> */}
  </div>
  
    </>
  )
}

export default Message