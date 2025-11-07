import React from 'react';
import { FiFile, FiImage, FiMusic } from 'react-icons/fi';

const MessageItem = ({ message, isOwn }) => {
  const renderAttachment = (attachment) => {
    const isImage = attachment.mimeType?.startsWith('image/');
    const isAudio = attachment.mimeType?.startsWith('audio/');
    
    if (isImage) {
      return (
        <a href={attachment.url} target="_blank" rel="noopener noreferrer">
          <img src={attachment.url} alt={attachment.filename} className="max-w-xs rounded-lg mt-2" />
        </a>
      );
    }
    
    if (isAudio) {
      return (
        <audio controls className="mt-2 max-w-xs">
          <source src={attachment.url} type={attachment.mimeType} />
        </audio>
      );
    }
    
    return (
      <a 
        href={attachment.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center space-x-2 mt-2 p-2 bg-gray-100 rounded hover:bg-gray-200"
      >
        <FiFile className="w-5 h-5" />
        <span className="text-sm">{attachment.filename}</span>
      </a>
    );
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-md ${isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'} rounded-lg p-3`}>
        {!isOwn && message.from && (
          <p className="text-xs font-semibold mb-1">
            {message.from.firstName} {message.from.lastName}
          </p>
        )}
        {message.content && <p className="text-sm">{message.content}</p>}
        {message.attachments && message.attachments.length > 0 && (
          <div className="space-y-2">
            {message.attachments.map((att, idx) => (
              <div key={idx}>{renderAttachment(att)}</div>
            ))}
          </div>
        )}
        <p className="text-xs opacity-75 mt-1">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default MessageItem;