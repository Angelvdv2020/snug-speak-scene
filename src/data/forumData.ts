export interface Channel {
  id: string;
  name: string;
  icon: string;
  unread: number;
  category: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

export interface Message {
  id: string;
  channelId: string;
  user: User;
  content: string;
  timestamp: Date;
  replies?: number;
}

export const users: User[] = [
  { id: "1", name: "darkwave", avatar: "D", online: true },
  { id: "2", name: "synthex", avatar: "S", online: true },
  { id: "3", name: "null_ptr", avatar: "N", online: false },
  { id: "4", name: "echo.sys", avatar: "E", online: true },
  { id: "5", name: "glitch_0x", avatar: "G", online: false },
  { id: "6", name: "bytecraft", avatar: "B", online: true },
];

export const channels: Channel[] = [
  { id: "general", name: "general", icon: "#", unread: 3, category: "Основные" },
  { id: "dev", name: "разработка", icon: "#", unread: 0, category: "Основные" },
  { id: "offtopic", name: "оффтопик", icon: "#", unread: 12, category: "Основные" },
  { id: "projects", name: "проекты", icon: "#", unread: 1, category: "Творчество" },
  { id: "design", name: "дизайн", icon: "#", unread: 0, category: "Творчество" },
  { id: "music", name: "музыка", icon: "#", unread: 5, category: "Творчество" },
];

export const messages: Message[] = [
  {
    id: "1", channelId: "general", user: users[0],
    content: "Кто-нибудь пробовал новый фреймворк? Говорят, он в 10 раз быстрее React.",
    timestamp: new Date(2026, 2, 15, 10, 23), replies: 4,
  },
  {
    id: "2", channelId: "general", user: users[1],
    content: "Каждый год одна и та же история 😄 Но стоит посмотреть, бенчмарки выглядят интересно.",
    timestamp: new Date(2026, 2, 15, 10, 25),
  },
  {
    id: "3", channelId: "general", user: users[3],
    content: "Я попробовал на выходных. DX отличный, но экосистема пока слабая. Ждём плагинов.",
    timestamp: new Date(2026, 2, 15, 10, 31), replies: 2,
  },
  {
    id: "4", channelId: "general", user: users[0],
    content: "Согласен. Без нормального роутера и стейт-менеджера сложно на продакшн тащить.",
    timestamp: new Date(2026, 2, 15, 10, 34),
  },
  {
    id: "5", channelId: "general", user: users[5],
    content: "А я тут свой CLI написал для генерации компонентов. Кому интересно — скину ссылку на гитхаб.",
    timestamp: new Date(2026, 2, 15, 11, 2), replies: 7,
  },
  {
    id: "6", channelId: "general", user: users[4],
    content: "Скинь обязательно! Как раз ищу что-то подобное для своего проекта.",
    timestamp: new Date(2026, 2, 15, 11, 5),
  },
  {
    id: "7", channelId: "general", user: users[2],
    content: "Кстати, митап в эту субботу кто-нибудь идёт? Будет доклад про WebAssembly.",
    timestamp: new Date(2026, 2, 15, 11, 15), replies: 3,
  },
  {
    id: "8", channelId: "general", user: users[1],
    content: "Буду! Там ещё after-party обещали. Кто со мной? 🍕",
    timestamp: new Date(2026, 2, 15, 11, 18),
  },
];
