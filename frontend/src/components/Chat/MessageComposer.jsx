import React, { useState, useRef } from 'react';
import { FiSend, FiPaperclip, FiMic, FiSmile, FiX } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';

const MessageComposer = ({ onSend, onAttachment, onVoiceSend }) => {
  const [message, setMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage(prev => prev + emojiObject.emoji);
    setShowEmoji(false);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploading(true);
      try {
        await onAttachment(file);
        setSelectedFile(null);
      } catch (error) {
        console.error('Upload error:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, { type: 'audio/webm' });
        if (onVoiceSend) await onVoiceSend(audioFile);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
      alert('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="border-t p-4 bg-white">
      {selectedFile && (
        <div className="mb-2 p-2 bg-gray-100 rounded flex items-center justify-between">
          <span className="text-sm">{selectedFile.name}</span>
          <button onClick={() => setSelectedFile(null)} className="text-red-500">
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}
      {uploading && <div className="mb-2 text-sm text-blue-500">Uploading...</div>}
      <div className="flex items-center space-x-2">
        <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-gray-100 rounded" disabled={uploading}>
          <FiPaperclip className="w-5 h-5" />
        </button>
        <button onClick={() => setShowEmoji(!showEmoji)} className="p-2 hover:bg-gray-100 rounded">
          <FiSmile className="w-5 h-5" />
        </button>
        <button 
          onClick={recording ? stopRecording : startRecording} 
          className={`p-2 rounded ${recording ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-gray-100'}`}
        >
          <FiMic className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder={recording ? 'Recording...' : 'Type a message...'}
          disabled={recording}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={handleSend} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" disabled={uploading || recording}>
          <FiSend className="w-5 h-5" />
        </button>
        <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" />
      </div>
      {showEmoji && (
        <div className="absolute bottom-20 z-10">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default MessageComposer;