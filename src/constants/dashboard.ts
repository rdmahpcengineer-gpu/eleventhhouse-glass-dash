import type { Participant, MeetingInsight } from '../types/chatroom';

export const COLORS = {
    PALLADIAN: '#EEE9DF',
    OATMEAL: '#C9C1B1',
    BLUE_FANTASTIC: '#2C3B4D',
    BURNING_FLAME: '#FFB162',
    TRUFFLE_TROUBLE: '#A35139',
    ABYSSAL_BLUE: '#1B2632',
};

export const MOCK_CALL_DATA = [
    { time: '08:00', inbound: 45, outbound: 20 },
    { time: '09:00', inbound: 120, outbound: 45 },
    { time: '10:00', inbound: 250, outbound: 70 },
    { time: '11:00', inbound: 310, outbound: 65 },
    { time: '12:00', inbound: 280, outbound: 40 },
    { time: '13:00', inbound: 350, outbound: 80 },
    { time: '14:00', inbound: 420, outbound: 95 },
    { time: '15:00', inbound: 380, outbound: 60 },
    { time: '16:00', inbound: 290, outbound: 55 },
];

export const MOCK_AGENTS = [
    { id: '1', name: 'Lora Piterson', role: 'Senior Agent', status: 'On Call', avatar: 'https://picsum.photos/seed/lora/200' },
    { id: '2', name: 'Randy Gouse', role: 'Support Specialist', status: 'Available', avatar: 'https://picsum.photos/seed/randy/200' },
    { id: '3', name: 'Giana Schleifer', role: 'Quality Analyst', status: 'Break', avatar: 'https://picsum.photos/seed/giana/200' },
    { id: '4', name: 'Marcus Chen', role: 'Lead Supervisor', status: 'Available', avatar: 'https://picsum.photos/seed/marcus/200' },
];

export const INITIAL_PARTICIPANTS: Participant[] = [
    { id: '1', name: 'AI Assistant', avatar: 'https://picsum.photos/seed/ai-agent/100', isMuted: false, isCameraOff: false, isHost: true },
    { id: '2', name: 'Customer', avatar: 'https://picsum.photos/seed/customer/100', isMuted: true, isCameraOff: false },
];

export const INITIAL_INSIGHTS: MeetingInsight[] = [
    { id: '1', title: 'Customer Onboarding Session', duration: '15 min', tasks: 5, accomplished: 4, icon: 'sync' },
    { id: '2', title: 'Account Setup Review', duration: '8 min', tasks: 3, accomplished: 2, icon: 'strategy' },
];
