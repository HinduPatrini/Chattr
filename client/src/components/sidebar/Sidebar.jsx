import React, { useState } from "react";
import { MessageCircle, SquarePen, Users, UserCircle } from "lucide-react";
import SearchBar from "./SearchBar";
import ConversationList from "./ConversationList";
import NewChatModal from "../modals/NewChatModal";
import CreateGroupModal from "../modals/CreateGroupModal";
import ProfileModal from "../modals/ProfileModal";

import { useChatStore } from "../../store/useChatStore";

const Sidebar = () => {
  const [showNewChat, setShowNewChat] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const unreadCounts = useChatStore((state) => state.unreadCounts);
  const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="w-full h-full flex flex-col bg-background-secondary border-r border-border">
      
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between border-b border-border">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 select-none">
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-accent" />
            {totalUnread > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                {totalUnread}
              </span>
            )}
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent tracking-tight">
            Chattr
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* New Chat Button */}
          <button
            onClick={() => setShowNewChat(true)}
            title="New Chat"
            className="p-2 rounded-xl hover:bg-background-hover text-text-secondary hover:text-accent transition-all duration-200 focus:outline-none"
          >
            <SquarePen className="w-5 h-5" />
          </button>

          {/* Create Group Button */}
          <button
            onClick={() => setShowCreateGroup(true)}
            title="Create Group"
            className="p-2 rounded-xl hover:bg-background-hover text-text-secondary hover:text-accent transition-all duration-200 focus:outline-none"
          >
            <Users className="w-5 h-5" />
          </button>

          {/* Profile Button */}
          <button
            onClick={() => setShowProfile(true)}
            title="Profile"
            className="p-2 rounded-xl hover:bg-background-hover text-text-secondary hover:text-accent transition-all duration-200 focus:outline-none"
          >
            <UserCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3">
        <SearchBar />
      </div>

      {/* Conversations List */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <ConversationList />
      </div>

      {/* Modals */}
      {showNewChat && <NewChatModal onClose={() => setShowNewChat(false)} />}
      {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} />}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}

    </div>
  );
};

export default Sidebar;
