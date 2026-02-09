export interface Participant {
    id: string;
    name: string;
    avatar: string;
    isMuted: boolean;
    isCameraOff: boolean;
    isSpeaking?: boolean;
    isHost?: boolean;
}

export interface ChatMessage {
    id: string;
    sender: string;
    role: 'user' | 'assistant' | 'other';
    content: string;
    timestamp: string;
    avatar?: string;
}

export interface MeetingInsight {
    id: string;
    title: string;
    duration: string;
    tasks: number;
    accomplished: number;
    icon: 'sync' | 'strategy';
}
