import { useChatStore } from '@/stores/useChatStore';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';

const ChatPage = () => {
  const { user } = useUser();
  const { messages, selectedUser, fetchMessage, fetchUsers } = useChatStore();

  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  useEffect(() => {
    if (selectedUser) fetchMessage(selectedUser.clerkId);
  }, [selectedUser, fetchMessage]);

  return <div>ChatPage</div>;
};
export default ChatPage;
