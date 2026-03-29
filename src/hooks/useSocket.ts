import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

export const useSocket = (conversationId: string | null) => {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;

    // Connect to institutional signal server
    const socket = io(window.location.origin);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('📡 Institutional Node Connected (Client)');
      socket.emit('join-curation-channel', conversationId);
    });

    socket.on('institutional-pulse', (message) => {
      console.log('💓 Institutional Pulse Received:', message);
      
      // Update the cache immediately for real-time curation
      queryClient.setQueryData(['messages', conversationId], (old: any[] = []) => {
        // Prevent duplicates
        if (old.some(m => m.id === message.id)) return old;
        return [...old, message];
      });

      // Also invalidate conversations list to update last message
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    });

    return () => {
      socket.disconnect();
    };
  }, [conversationId, queryClient]);

  return socketRef.current;
};
