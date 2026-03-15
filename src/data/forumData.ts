export interface Author {
  id: string;
  name: string;
  avatar: string;
  karma: number;
}

export interface Post {
  id: string;
  title: string;
  author: Author;
  hub: string;
  tags: string[];
  preview: string;
  votes: number;
  views: number;
  comments: number;
  readTime: number;
  createdAt: Date;
  difficulty: "Простой" | "Средний" | "Сложный";
}

export interface Comment {
  id: string;
  postId: string;
  author: Author;
  content: string;
  votes: number;
  createdAt: Date;
  replies?: Comment[];
}

export const authors: Author[] = [
  { id: "1", name: "devmaster", avatar: "DM", karma: 142 },
  { id: "2", name: "frontend_ninja", avatar: "FN", karma: 87 },
  { id: "3", name: "backender42", avatar: "B4", karma: 234 },
  { id: "4", name: "ml_explorer", avatar: "ML", karma: 56 },
  { id: "5", name: "sysadmin_pro", avatar: "SP", karma: 312 },
];

export const posts: Post[] = [
  {
    id: "1",
    title: "Почему мы отказались от микросервисов и вернулись к монолиту",
    author: authors[2],
    hub: "Архитектура",
    tags: ["микросервисы", "монолит", "devops"],
    preview: "После двух лет работы с микросервисной архитектурой наша команда приняла непопулярное решение — вернуться к монолиту. В этой статье я расскажу, какие проблемы мы встретили, почему оверхед на инфраструктуру оказался слишком велик для нашего масштаба, и как модульный монолит стал нашим спасением.",
    votes: 87,
    views: 14200,
    comments: 43,
    readTime: 12,
    createdAt: new Date(2026, 2, 15, 9, 0),
    difficulty: "Средний",
  },
  {
    id: "2",
    title: "CSS Container Queries: полное руководство с примерами",
    author: authors[1],
    hub: "Фронтенд",
    tags: ["css", "верстка", "responsive"],
    preview: "Container Queries — одна из самых ожидаемых фич CSS за последние годы. Теперь компоненты могут адаптироваться не к размеру окна, а к размеру своего контейнера. Разберём синтаксис, поддержку браузерами и реальные кейсы применения.",
    votes: 134,
    views: 21300,
    comments: 28,
    readTime: 8,
    createdAt: new Date(2026, 2, 14, 15, 30),
    difficulty: "Простой",
  },
  {
    id: "3",
    title: "Обучаем LLM на собственных данных: пошаговый гайд",
    author: authors[3],
    hub: "Машинное обучение",
    tags: ["llm", "fine-tuning", "python", "ai"],
    preview: "Fine-tuning больших языковых моделей стал доступнее, чем когда-либо. В этой статье покажу, как подготовить датасет, настроить LoRA-адаптеры и запустить обучение на одной GPU. Бонус: сравнение результатов с базовой моделью.",
    votes: 256,
    views: 45800,
    comments: 91,
    readTime: 18,
    createdAt: new Date(2026, 2, 14, 10, 0),
    difficulty: "Сложный",
  },
  {
    id: "4",
    title: "Как мы ускорили CI/CD пайплайн в 5 раз",
    author: authors[4],
    hub: "DevOps",
    tags: ["ci/cd", "docker", "github-actions"],
    preview: "Наш пайплайн занимал 45 минут. Через месяц оптимизаций — 9 минут. Расскажу про кеширование слоёв Docker, параллелизацию тестов, умный деплой и другие техники, которые помогли сократить время сборки.",
    votes: 198,
    views: 32100,
    comments: 67,
    readTime: 14,
    createdAt: new Date(2026, 2, 13, 12, 0),
    difficulty: "Средний",
  },
  {
    id: "5",
    title: "TypeScript 6.0: что нового и стоит ли обновляться",
    author: authors[0],
    hub: "Фронтенд",
    tags: ["typescript", "javascript", "обзор"],
    preview: "Релиз TypeScript 6.0 принёс несколько долгожданных фич: pattern matching, декораторы полей и улучшенный вывод типов. Разбираем каждое изменение с примерами и говорим о потенциальных проблемах при миграции.",
    votes: 312,
    views: 58400,
    comments: 124,
    readTime: 10,
    createdAt: new Date(2026, 2, 12, 8, 0),
    difficulty: "Средний",
  },
];

export const hubs = ["Все", "Фронтенд", "Архитектура", "Машинное обучение", "DevOps", "Бэкенд"];
