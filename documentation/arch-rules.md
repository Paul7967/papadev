# Архитектура приложения PapaDev

## 🏗 Обзор архитектуры

**Принцип**: Feature-Sliced Design (FSD)  
**Framework**: Next.js 14+ с App Router  
**Подход**: Mobile First, Component-Driven Development  

## 📐 Принципы FSD архитектуры

### 1. **Слои (Layers)**
Архитектура разделена на 6 слоев, каждый имеет свою ответственность:

```
app/                    # Next.js App Router (роутинг) - отдельный слой
shared/                 # Переиспользуемые ресурсы
entities/               # Бизнес-сущности
features/               # Пользовательские сценарии
widgets/                # Композитные блоки UI
pages/                  # Страницы приложения
```

**Важно**: Все слои находятся на одном уровне в папке `src/`, они не вложены друг в друга.

### 2. **Слайсы (Slices)**
Каждый слой разделен на слайсы по функциональности:

```
shared/
├── ui/               # UI компоненты
├── lib/              # Утилиты и хелперы
├── api/              # API клиенты
├── config/           # Конфигурация
└── constants/        # Константы
```

## 🗂 Детальная структура проекта

**Структура FSD слоев** (все на одном уровне в `src/`):

```
src/
├── app/                          # Next.js App Router (отдельный слой)
│   ├── layout.tsx               # Корневой layout
│   └── globals.css              # Глобальные стили
│
├── shared/                      # Переиспользуемые ресурсы
│   ├── ui/                      # UI компоненты
│   ├── lib/                    # Утилиты
│   └── config/                 # Конфигурация
│
├── entities/                    # Бизнес-сущности
│   ├── game/                   # Игровая сущность
│   └── user/                   # Пользовательская сущность
│
├── features/                    # Пользовательские сценарии
│
├── widgets/                     # Композитные блоки UI
│   ├── header/                 # Шапка сайта
│   └── footer/                 # Подвал сайта
│
└── pages/                       # Страницы приложения
    ├── home/                   # Главная страница
    ├── about/                  # Страница "О проекте"
    └── games/                  # Страница "Игры"

```

## 🎯 Принципы организации кода

### 1. **Правила импортов**

```typescript
// ✅ Правильно - импорт из нижележащих слоев
import { Button } from '@/shared/ui/button'
import { GameCard } from '@/entities/game/ui/game-card'
import { GameFilter } from '@/features/game-filter/ui/filter-panel'

// ❌ Неправильно - импорт из вышележащих слоев
import { GamePage } from '@/pages/games/ui/games-page' // из shared
```

### 2. **Структура слайса**

Каждый слайс может содержать содержать:

```
feature-name/
├── ui/                    # UI компоненты
│   ├── component-name/
│   │   ├── component-name.tsx
│   │   ├── component-name.module.css
│   │   └── index.ts
│   └── index.ts
├── model/                 # Бизнес-логика
│   ├── store.ts          # Zustand store
│   ├── selectors.ts      # Селекторы
│   └── types.ts          # Типы
├── lib/                  # Утилиты
│   └── utils.ts
└── index.ts              # Публичный API
```

### 3. **Публичный API**

Каждый слайс должен экспортировать только необходимые компоненты:

```typescript
// shared/ui/button/index.ts
export { Button } from './ui/button'
export type { ButtonProps } from './ui/button'

// entities/game/index.ts
export { GameCard } from './ui/game-card'
export { useGameStore } from './model/store'
export type { Game, GameState } from './model/types'
```

## 🔄 Управление состоянием

### 1. **Zustand Stores**

```typescript
// entities/game/model/store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface GameState {
  games: Game[]
  currentGame: Game | null
  isLoading: boolean
  error: string | null
}

interface GameActions {
  setGames: (games: Game[]) => void
  setCurrentGame: (game: Game) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useGameStore = create<GameState & GameActions>()(
  devtools(
    (set) => ({
      games: [],
      currentGame: null,
      isLoading: false,
      error: null,
      
      setGames: (games) => set({ games }),
      setCurrentGame: (game) => set({ currentGame: game }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    { name: 'game-store' }
  )
)
```

### 2. **Селекторы**

```typescript
// entities/game/model/selectors.ts
import { useGameStore } from './store'

export const useGames = () => useGameStore((state) => state.games)
export const useCurrentGame = () => useGameStore((state) => state.currentGame)
export const useGameLoading = () => useGameStore((state) => state.isLoading)
```

## 🎮 Игровая архитектура

### 1. **Игровой движок**

```typescript
// features/game-play/lib/gameEngine.ts
export class GameEngine {
  private currentQuestion: Question
  private score: number = 0
  private timeLeft: number = 0
  
  startGame(gameConfig: GameConfig): void {
    // Инициализация игры
  }
  
  submitAnswer(answer: Answer): GameResult {
    // Обработка ответа
  }
  
  getNextQuestion(): Question | null {
    // Получение следующего вопроса
  }
}
```

### 2. **Генератор вопросов**

```typescript
// features/game-play/lib/questionGenerator.ts
export class QuestionGenerator {
  generateMathQuestion(difficulty: Difficulty): MathQuestion {
    // Генерация математического вопроса
  }
  
  generateLanguageQuestion(difficulty: Difficulty): LanguageQuestion {
    // Генерация языкового вопроса
  }
}
```

## 🧪 Тестирование

### 1. **Структура тестов**

```
src/
├── __tests__/                 # Тесты
│   ├── shared/               # Тесты shared слоя
│   ├── entities/             # Тесты entities слоя
│   ├── features/             # Тесты features слоя
│   ├── widgets/              # Тесты widgets слоя
│   └── pages/                # Тесты pages слоя
```

### 2. **Пример теста**

```typescript
// __tests__/entities/game/game-card.test.tsx
import { render, screen } from '@testing-library/react'
import { GameCard } from '@/entities/game/ui/game-card'

describe('GameCard', () => {
  it('should render game information', () => {
    const mockGame = {
      id: '1',
      title: 'Math Quiz',
      subject: 'mathematics',
      difficulty: 'easy'
    }
    
    render(<GameCard game={mockGame} />)
    
    expect(screen.getByText('Math Quiz')).toBeInTheDocument()
  })
})
```

## 📱 Mobile First подход

### 1. **Responsive компоненты**

```typescript
// shared/ui/button/ui/button.tsx
export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button 
      className="
        px-4 py-2 text-sm font-medium rounded-lg
        sm:px-6 sm:py-3 sm:text-base
        md:px-8 md:py-4
        lg:text-lg
        transition-all duration-200
        hover:scale-105 active:scale-95
      "
      {...props}
    >
      {children}
    </button>
  )
}
```

### 2. **Breakpoints**

```typescript
// shared/config/breakpoints.ts
export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px'
} as const
```

## 🚀 Производительность

### 1. **Lazy Loading**

```typescript
// pages/games/ui/games-page.tsx
import { lazy, Suspense } from 'react'

const GameGrid = lazy(() => import('@/widgets/game-grid'))
const GameFilter = lazy(() => import('@/features/game-filter'))

export const GamesPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <GameFilter />
        <GameGrid />
      </Suspense>
    </div>
  )
}
```

### 2. **Code Splitting**

```typescript
// app/games/[gameId]/page.tsx
import dynamic from 'next/dynamic'

const GameDetail = dynamic(() => import('@/pages/game-detail'), {
  loading: () => <div>Loading game...</div>
})
```

## 📋 Правила разработки

### 1. **Именование**

- **Компоненты**: PascalCase (`GameCard`)
- **Файлы**: kebab-case (`game-card.tsx`)
- **Папки**: kebab-case (`game-filter`)
- **Хуки**: camelCase с префиксом `use` (`useGameStore`)

### 2. **Импорты**

```typescript
// ✅ Правильный порядок импортов
import React from 'react'
import { NextPage } from 'next'

import { Button } from '@/shared/ui/button'
import { GameCard } from '@/entities/game/ui/game-card'
import { GameFilter } from '@/features/game-filter/ui/filter-panel'
import { GameGrid } from '@/widgets/game-grid'

// Локальные импорты
import { GamesPage } from './ui/games-page'
```

### 3. **Типизация**

```typescript
// Всегда используйте строгую типизацию
// Для типизации props компонента используется interface имя интерфейса это имя компонента + Props
interface GameCardProps {
  game: Game
  onPlay: (gameId: string) => void
  className?: string
}

export const GameCard: React.FC<GameCardProps> = ({ game, onPlay, className }) => {
  // Компонент
}
```

---

**Дата создания**: 23.10.2025  
**Версия документа**: 1.0  
**Автор**: Pavel Ostatochnikov  
**Архитектурный подход**: Feature-Sliced Design
