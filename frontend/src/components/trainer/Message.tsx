import React from 'react';
import { formatTime } from '../../utils/timeAndPriceUtils';

interface MessageProps {
    message: string;
    sender: 'User' | 'Trainer';
    time: string;
    avatarUrl: string;
  }
function Message({ sender, message, time, avatarUrl }: MessageProps) {
  return (
    <div className={`chat ${sender === 'Trainer' ? 'chat-end' : 'chat-start'}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="Avatar" src={avatarUrl} />
        </div>
      </div>

      <div className={`chat-bubble text-white ${sender === 'Trainer' ? 'bg-blue-500' : 'bg-gray-500'}`}>
        {message}
      </div>

      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        {formatTime(time)}
      </div>
    </div>
  );
}

export default Message;
