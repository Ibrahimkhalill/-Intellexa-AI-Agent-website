import React, { useState } from 'react';
import { 
  Home, 
  MessageCircle, 
  Workflow, 
  User, 
  LogOut,
  Mail,
  Search,
  Settings,
  Plus,
  Send
} from 'lucide-react';

const EmailAutomation = () => {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [message, setMessage] = useState('');

  const emails = [
    {
      id: 1,
      sender: 'Figma',
      subject: 'Get the Figma mobile app',
      preview: 'Collaborate on the go\nCollaborate on the go Scan th...',
      time: '12:14AM',
      isUnread: true
    },
    {
      id: 2,
      sender: 'Google',
      subject: 'Security alert',
      preview: 'Make was granted access to your Google Account...',
      time: 'May 9',
      isUnread: true
    },
    {
      id: 3,
      sender: 'Google',
      subject: 'Security alert',
      preview: 'Make was granted access to your Google Account...',
      time: 'May 9',
      isUnread: true
    },
    {
      id: 4,
      sender: 'Google',
      subject: 'Security alert',
      preview: 'Make was granted access to your Google Account...',
      time: 'May 9',
      isUnread: true
    },
    {
      id: 5,
      sender: 'Google',
      subject: 'Security alert',
      preview: 'Make was granted access to your Google Account...',
      time: 'May 9',
      isUnread: true
    }
  ];

  const tags = ['Booking', 'Finding', 'Inquiries'];

  return (
    <div className="min-h-[83vh] bg-[#F2F4F3] flex">
      {/* Sidebar */}
    

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Email List */}
        <div className="w-72 bg-white border-r border-gray-200 pr-3">
          {/* Header */}
          <div className="py-4 border-b border-gray-200">
            <div className="flex items-center mb-4">
              <Mail className="w-6 h-6 text-gray-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Inbox</h2>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search mail"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Settings className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" />
            </div>
          </div>

          {/* Email List */}
          <div className="overflow-y-auto h-full mt-3">
            {emails.map((email) => (
              <div
                key={email.id}
                className={`p-4 border-b rounded-l-xl mb-2 border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedEmail === email.id ? 'bg-blue-50 border-l-6 border-l-blue-500' : ''
                } ${email.isUnread ? 'border-l-6  border-l-[#C4E8DA]' : ''}`}
                onClick={() => setSelectedEmail(email.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-medium ${email.isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                    {email.sender}
                  </span>
                  <span className="text-xs text-gray-500">{email.time}</span>
                </div>
                <div className={`text-sm ${email.isUnread ? 'font-medium text-gray-900' : 'text-gray-600'} mb-1`}>
                  {email.subject}
                </div>
                <div className="text-sm text-gray-500 line-clamp-2 whitespace-pre-line">
                  {email.preview}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedEmail ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200 bg-white">
                <h3 className="text-lg font-semibold text-gray-900">
                  {emails.find(e => e.id === selectedEmail)?.sender} - {emails.find(e => e.id === selectedEmail)?.subject}
                </h3>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 p-6 bg-gray-50">
                <div className="text-center text-gray-500">
                  <p>Start conversation about this email...</p>
                </div>
              </div>

              {/* Chat Input */}
              <div className="m-2 p-4 rounded-lg bg-white border border-gray-200">
               
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Ask any think"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 px-4 py-3 outline-none rounded-lg "
                  />
                 
                </div>
                <div className='flex items-center justify-between'>

                  
                 <div className="flex items-center space-x-3 ">
                  <div className='bg-[#E2F4EC] p-2 rounded-full'>

                  <Plus className="w-5 h-5 text-gray-400" />
                  </div>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-full text-sm cursor-pointer hover:bg-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="px-6 py-1 bg-[#1B4635] text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium">
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
              <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center mb-6">
                <Mail className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select an email</h3>
              <p className="text-gray-500 text-center max-w-sm">
                Choose an email to read its content
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailAutomation;