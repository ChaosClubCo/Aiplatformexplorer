# Production Architecture - AI Platform Explorer v3.2

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AI PLATFORM EXPLORER v3.2                            │
│                          Production Architecture                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────── PRESENTATION LAYER ─────────────────────────────┐
│                                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │   App.tsx    │  │ ErrorBoundary│  │   Providers  │  │   Routes    │  │
│  │  (Enhanced)  │  │   (Global)   │  │   (Context)  │  │  (Tabs)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘  │
│                                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                      COMPONENT LAYER                               │   │
│  │                                                                    │   │
│  │  Feature Components     UI Components        Layout Components   │   │
│  │  ├─ PlatformCard        ├─ Button            ├─ Header          │   │
│  │  ├─ FeatureMatrix       ├─ Modal             ├─ Navigation      │   │
│  │  ├─ ROICalculator       ├─ Table             ├─ Footer          │   │
│  │  ├─ RecommendationWizard├─ Form              ├─ Sidebar         │   │
│  │  ├─ ComparisonModal     ├─ Input             └─ Container       │   │
│  │  └─ PlatformTable       └─ Card                                 │   │
│  └────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────── BUSINESS LOGIC LAYER ──────────────────────────┐
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │                         CONTEXT / STATE                          │    │
│  │                                                                  │    │
│  │   AppContext          RecommendationContext      ThemeContext    │    │
│  │   ├─ Global State     ├─ Wizard State           ├─ UI Prefs     │    │
│  │   ├─ Platform Data    ├─ Answers                ├─ Colors       │    │
│  │   ├─ Filters          ├─ Results                └─ Typography   │    │
│  │   └─ Selection        └─ Progress                               │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │                            HOOKS                                 │    │
│  │                                                                  │    │
│  │   Custom Hooks            React Hooks             External       │    │
│  │   ├─ useLocalStorage     ├─ useState              ├─ useQuery   │    │
│  │   ├─ useAnalytics        ├─ useEffect             └─ useMutation│    │
│  │   ├─ useDebounce         ├─ useCallback                         │    │
│  │   ├─ useMediaQuery       ├─ useMemo                             │    │
│  │   └─ useResponsive       └─ useRef                              │    │
│  └──────────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────── SERVICE LAYER ────────────────────────────────┐
│                                                                            │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────┐ │
│  │    Storage     │  │   Validation   │  │   Analytics    │  │  API   │ │
│  │    Service     │  │    Service     │  │    Service     │  │Service │ │
│  ├────────────────┤  ├────────────────┤  ├────────────────┤  ├────────┤ │
│  │• LocalStorage  │  │• Email         │  │• Page Views    │  │• HTTP  │ │
│  │• SessionStorage│  │• URL           │  │• Events        │  │• Retry │ │
│  │• Versioning    │  │• Forms         │  │• Errors        │  │• Cache │ │
│  │• Migration     │  │• Data Types    │  │• Performance   │  │• Auth  │ │
│  └────────────────┘  └────────────────┘  └────────────────┘  └────────┘ │
│                                                                            │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
│  │  Recommendation│  │    Export      │  │   Formatter    │             │
│  │     Engine     │  │    Service     │  │    Service     │             │
│  ├────────────────┤  ├────────────────┤  ├────────────────┤             │
│  │• Scoring       │  │• JSON          │  │• Dates         │             │
│  │• Confidence    │  │• CSV           │  │• Numbers       │             │
│  │• Reasoning     │  │• PDF (future)  │  │• Currency      │             │
│  │• Matching      │  │• Email (future)│  │• Percentages   │             │
│  └────────────────┘  └────────────────┘  └────────────────┘             │
└────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────── DATA LAYER ───────────────────────────────────┐
│                                                                            │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
│  │   Platforms    │  │   Questions    │  │   Constants    │             │
│  │     Data       │  │     Data       │  │                │             │
│  ├────────────────┤  ├────────────────┤  ├────────────────┤             │
│  │• 16+ Platforms │  │• 11 Questions  │  │• Categories    │             │
│  │• Features      │  │• 3 Categories  │  │• Sort Options  │             │
│  │• Scores        │  │• Weights       │  │• Breakpoints   │             │
│  │• Compliance    │  │• Options       │  │• Z-indexes     │             │
│  └────────────────┘  └────────────────┘  └────────────────┘             │
│                                                                            │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
│  │      Types     │  │   Interfaces   │  │  Configurations│             │
│  ├────────────────┤  ├────────────────┤  ├────────────────┤             │
│  │• Platform      │  │• Filters       │  │• App Config    │             │
│  │• Question      │  │• UserAnswers   │  │• Feature Flags │             │
│  │• Recommendation│  │• ValidationRes │  │• Environment   │             │
│  │• Toast         │  │• Analytics     │  │• Validation    │             │
│  └────────────────┘  └────────────────┘  └────────────────┘             │
└────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────── INFRASTRUCTURE LAYER ─────────────────────────────┐
│                                                                            │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
│  │ Error Handling │  │   Performance  │  │  Accessibility │             │
│  ├────────────────┤  ├────────────────┤  ├────────────────┤             │
│  │• ErrorBoundary │  │• Lazy Loading  │  │• ARIA Labels   │             │
│  │• Try/Catch     │  │• Code Splitting│  │• Keyboard Nav  │             │
│  │• Error Logging │  │• Memoization   │  │• Screen Reader │             │
│  │• User Feedback │  │• Debouncing    │  │• Focus Mgmt    │             │
│  └────────────────┘  └────────────────┘  └────────────────┘             │
│                                                                            │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
│  │    Security    │  │     Testing    │  │   Monitoring   │             │
│  ├────────────────┤  ├────────────────┤  ├────────────────┤             │
│  │• XSS Protection│  │• Unit Tests    │  │• Analytics     │             │
│  │• Input Sanit.  │  │• Integration   │  │• Error Track   │             │
│  │• CSP Headers   │  │• E2E Tests     │  │• Performance   │             │
│  │• HTTPS Only    │  │• A11y Tests    │  │• User Behavior │             │
│  └────────────────┘  └────────────────┘  └────────────────┘             │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure (Production-Grade)

```
/
├── public/                           # Static assets
│   ├── favicon.ico
│   ├── manifest.json
│   └── robots.txt
│
├── src/                              # Source code
│   │
│   ├── App.tsx                       # Main application (refactored)
│   │
│   ├── components/                   # React components
│   │   ├── common/                   # Shared/reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Input.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   │
│   │   ├── layout/                   # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Container.tsx
│   │   │
│   │   ├── features/                 # Feature-specific components
│   │   │   ├── platform-explorer/
│   │   │   │   ├── PlatformCard.tsx
│   │   │   │   ├── PlatformTable.tsx
│   │   │   │   ├── PlatformModal.tsx
│   │   │   │   ├── FilterBar.tsx
│   │   │   │   └── Statistics.tsx
│   │   │   │
│   │   │   ├── recommendation/
│   │   │   │   ├── RecommendationWizard.tsx
│   │   │   │   ├── QuestionCard.tsx
│   │   │   │   ├── RecommendationResults.tsx
│   │   │   │   └── ProgressTracker.tsx
│   │   │   │
│   │   │   ├── roi-calculator/
│   │   │   │   ├── EnhancedROICalculator.tsx
│   │   │   │   ├── InputSection.tsx
│   │   │   │   └── ResultsSection.tsx
│   │   │   │
│   │   │   ├── feature-matrix/
│   │   │   │   └── FeatureMatrix.tsx
│   │   │   │
│   │   │   ├── comparison/
│   │   │   │   ├── ComparisonSidebar.tsx
│   │   │   │   └── ComparisonModal.tsx
│   │   │   │
│   │   │   └── glossary/
│   │   │       └── Glossary.tsx
│   │   │
│   │   ├── ui/                       # UI library components (shadcn/ui)
│   │   │   ├── accordion.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ... (30+ components)
│   │   │
│   │   ├── ErrorBoundary.tsx         # Error boundary
│   │   └── ToastContainer.tsx        # Toast notifications
│   │
│   ├── context/                      # React Context
│   │   ├── AppContext.tsx            # Global app state
│   │   ├── ThemeContext.tsx          # Theme/UI preferences (future)
│   │   └── AuthContext.tsx           # Authentication (future)
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useLocalStorage.ts        # ✅ Implemented
│   │   ├── useSessionStorage.ts      # Session storage hook
│   │   ├── useAnalytics.ts           # ✅ Implemented
│   │   ├── useDebounce.ts            # ✅ Implemented
│   │   ├── useMediaQuery.ts          # ✅ Implemented
│   │   ├── useResponsive.ts          # Responsive breakpoints
│   │   ├── useKeyboard.ts            # Keyboard shortcuts
│   │   ├── useClickOutside.ts        # Click outside detection
│   │   ├── usePrevious.ts            # Previous value
│   │   └── useToggle.ts              # Toggle state
│   │
│   ├── services/                     # Business logic services
│   │   ├── storageService.ts         # ✅ Implemented
│   │   ├── validationService.ts      # ✅ Implemented
│   │   ├── analyticsService.ts       # Analytics wrapper
│   │   ├── exportService.ts          # Data export
│   │   ├── apiService.ts             # API calls (future)
│   │   └── formatterService.ts       # Data formatting
│   │
│   ├── utils/                        # Utility functions
│   │   ├── recommendationEngine.ts   # ✅ Implemented
│   │   ├── sortUtils.ts              # Sorting helpers
│   │   ├── filterUtils.ts            # Filtering helpers
│   │   ├── formatUtils.ts            # Formatting helpers
│   │   ├── dateUtils.ts              # Date utilities
│   │   ├── stringUtils.ts            # String utilities
│   │   ├── arrayUtils.ts             # Array utilities
│   │   └── mathUtils.ts              # Math utilities
│   │
│   ├── data/                         # Static data
│   │   ├── platforms.ts              # ✅ Platform data
│   │   ├── questions.ts              # ✅ Recommendation questions
│   │   ├── benchmarks.ts             # ROI benchmarks
│   │   └── glossary.ts               # Glossary terms
│   │
│   ├── types/                        # TypeScript types
│   │   ├── index.ts                  # Main types export
│   │   ├── platform.types.ts         # Platform-related types
│   │   ├── recommendation.types.ts   # ✅ Recommendation types
│   │   ├── roi.types.ts              # ROI calculator types
│   │   ├── filter.types.ts           # Filter types
│   │   └── common.types.ts           # Common types
│   │
│   ├── constants/                    # Constants
│   │   └── index.ts                  # ✅ All constants
│   │
│   ├── config/                       # Configuration
│   │   ├── app.config.ts             # ✅ App configuration
│   │   ├── theme.config.ts           # Theme configuration
│   │   └── routes.config.ts          # Routes configuration
│   │
│   ├── styles/                       # Styles
│   │   └── globals.css               # ✅ Global CSS
│   │
│   └── lib/                          # Third-party integrations
│       ├── supabase.ts               # Supabase client
│       └── analytics.ts              # Analytics SDKs
│
├── docs/                             # Documentation
│   ├── RECOMMENDATION_ENGINE_DOCS.md # ✅ Rec engine docs
│   ├── PHASE1_IMPLEMENTATION.md      # ✅ Phase 1 summary
│   ├── QUICK_START_RECOMMENDATION.md # ✅ Quick start
│   ├── VISUAL_FEATURE_MAP.md         # ✅ Visual guide
│   ├── PRODUCTION_ARCHITECTURE.md    # This file
│   ├── PRODUCTION_ROADMAP.md         # Roadmap (to create)
│   └── API_DOCUMENTATION.md          # API docs (future)
│
├── tests/                            # Test files (future)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .github/                          # GitHub configuration
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
└── config files
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── vite.config.ts
    ├── .eslintrc.json
    └── .prettierrc
```

---

## 🔄 Data Flow Architecture

### 1. User Interaction Flow

```
User Action
    ↓
Component Event Handler
    ↓
Analytics Tracking (automatic)
    ↓
Context Action (via useApp hook)
    ↓
State Update (immutable)
    ↓
Services (if needed)
    ├─ Validation Service
    ├─ Storage Service
    ├─ API Service
    └─ Analytics Service
    ↓
State Changed (React re-render)
    ↓
UI Updated
```

### 2. Recommendation Flow

```
User Starts Wizard
    ↓
RecommendationWizard Component
    ↓
QuestionCard (current question)
    ↓
User Answers Question
    ↓
Validation Service (validate answer)
    ↓
Store Answer (local state)
    ↓
Track Analytics (question_answer event)
    ↓
Next Question or Calculate
    ↓
Recommendation Engine (scoring)
    ├─ Requirements Score (40%)
    ├─ Constraints Score (40%)
    └─ Priorities Score (20%)
    ↓
Generate Reasoning
    ├─ Strengths
    ├─ Concerns
    └─ Differentiators
    ↓
Sort & Rank Results
    ↓
RecommendationResults Component
    ↓
Display Top 3 + Others
    ↓
Export Option (JSON/PDF)
```

### 3. Storage Flow

```
State Change
    ↓
Storage Service
    ├─ Add Prefix (ai-platform-explorer-v1-)
    ├─ Stringify (JSON.stringify)
    ├─ Try/Catch Error Handling
    └─ localStorage.setItem()
    ↓
Cross-Tab Sync (storage event)
    ↓
Other Tabs Updated
```

---

## 🛠️ Technology Stack

### Core

- **React 18.x** - UI library with concurrent features
- **TypeScript 5.x** - Type safety and developer experience
- **Vite 5.x** - Fast build tool and dev server
- **Tailwind CSS 4.x** - Utility-first CSS framework

### State Management

- **React Context API** - Global state (AppContext)
- **Custom Hooks** - Reusable stateful logic
- **Local State** - Component-level state (useState)

### UI Components

- **shadcn/ui** - Accessible component library
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library
- **Framer Motion (motion/react)** - Animation library

### Data & Forms

- **React Hook Form** - Form management
- **Zod** - Schema validation (future)

### Storage & Data

- **localStorage** - Client-side persistence
- **sessionStorage** - Session-scoped data
- **IndexedDB** - Large data storage (future)

### Backend (Future)

- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Storage
  - Edge Functions

### Analytics & Monitoring

- **Custom Analytics Hook** - Event tracking
- **Google Analytics 4** - User analytics (future)
- **Sentry** - Error monitoring (future)
- **Web Vitals** - Performance monitoring (future)

### Testing (Future)

- **Vitest** - Unit testing
- **Testing Library** - Component testing
- **Playwright** - E2E testing
- **MSW** - API mocking

### DevOps (Future)

- **GitHub Actions** - CI/CD
- **Vercel/Netlify** - Hosting & deployment
- **CloudFlare** - CDN & edge caching

---

## 🎯 Design Patterns

### 1. Component Patterns

**Container/Presentational Pattern**
```typescript
// Container (smart component)
export function PlatformExplorer() {
  const { platforms, filters, setFilters } = useApp();
  const { trackEvent } = useAnalytics();
  
  return (
    <PlatformExplorerView 
      platforms={platforms}
      filters={filters}
      onFilterChange={(f) => {
        setFilters(f);
        trackEvent('filter_apply', { filters: f });
      }}
    />
  );
}

// Presentational (dumb component)
interface PlatformExplorerViewProps {
  platforms: Platform[];
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export function PlatformExplorerView({ 
  platforms, 
  filters, 
  onFilterChange 
}: PlatformExplorerViewProps) {
  return <div>...</div>;
}
```

**Compound Component Pattern**
```typescript
export function Accordion({ children }: { children: ReactNode }) {
  const [openItems, setOpenItems] = useState<string[]>([]);
  
  return (
    <AccordionContext.Provider value={{ openItems, setOpenItems }}>
      {children}
    </AccordionContext.Provider>
  );
}

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

// Usage
<Accordion>
  <Accordion.Item value="1">
    <Accordion.Trigger>Question</Accordion.Trigger>
    <Accordion.Content>Answer</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

**Higher-Order Component Pattern**
```typescript
export function withAnalytics<P extends object>(
  Component: React.ComponentType<P>,
  eventName: string
) {
  return function WithAnalytics(props: P) {
    const { trackEvent } = useAnalytics();
    
    useEffect(() => {
      trackEvent(eventName);
    }, []);
    
    return <Component {...props} />;
  };
}

// Usage
export const AnalyticsROICalculator = withAnalytics(
  ROICalculator,
  'roi_calculator_view'
);
```

**Render Props Pattern**
```typescript
interface DataFetcherProps<T> {
  url: string;
  children: (data: T | null, loading: boolean, error: Error | null) => ReactNode;
}

export function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch logic...
  
  return <>{children(data, loading, error)}</>;
}

// Usage
<DataFetcher<Platform[]> url="/api/platforms">
  {(data, loading, error) => {
    if (loading) return <Loading />;
    if (error) return <Error error={error} />;
    return <PlatformList platforms={data} />;
  }}
</DataFetcher>
```

### 2. Hook Patterns

**Custom Hook Composition**
```typescript
export function usePlatformFiltering() {
  const { platforms, filters } = useApp();
  const debouncedSearch = useDebounce(filters.search, 300);
  
  const filteredPlatforms = useMemo(() => {
    return filterPlatforms(platforms, { ...filters, search: debouncedSearch });
  }, [platforms, filters, debouncedSearch]);
  
  return { filteredPlatforms };
}
```

**Async State Hook**
```typescript
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const execute = useCallback(() => {
    setStatus('pending');
    setValue(null);
    setError(null);
    
    return asyncFunction()
      .then((response) => {
        setValue(response);
        setStatus('success');
      })
      .catch((error) => {
        setError(error);
        setStatus('error');
      });
  }, [asyncFunction]);
  
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);
  
  return { execute, status, value, error };
}
```

### 3. Service Patterns

**Singleton Pattern**
```typescript
// storageService.ts
export class StorageService {
  private static instance: StorageService;
  
  private constructor() {
    // Private constructor
  }
  
  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }
  
  // Methods...
}

export const storage = StorageService.getInstance();
```

**Factory Pattern**
```typescript
export class ExportFactory {
  static create(format: 'json' | 'csv' | 'pdf'): BaseExporter {
    switch (format) {
      case 'json':
        return new JSONExporter();
      case 'csv':
        return new CSVExporter();
      case 'pdf':
        return new PDFExporter();
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }
}

// Usage
const exporter = ExportFactory.create('json');
await exporter.export(data);
```

**Strategy Pattern**
```typescript
interface SortStrategy {
  sort(platforms: Platform[]): Platform[];
}

class MarketShareSort implements SortStrategy {
  sort(platforms: Platform[]) {
    return [...platforms].sort((a, b) => 
      b.marketSharePercent - a.marketSharePercent
    );
  }
}

class PriceSort implements SortStrategy {
  sort(platforms: Platform[]) {
    return [...platforms].sort((a, b) => 
      a.pricingValue - b.pricingValue
    );
  }
}

export class PlatformSorter {
  constructor(private strategy: SortStrategy) {}
  
  sort(platforms: Platform[]) {
    return this.strategy.sort(platforms);
  }
  
  setStrategy(strategy: SortStrategy) {
    this.strategy = strategy;
  }
}
```

---

## 🔒 Security Best Practices

### 1. Input Sanitization

```typescript
// validationService.ts
sanitize(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '');
}
```

### 2. XSS Protection

- Never use `dangerouslySetInnerHTML` without sanitization
- Validate all user inputs
- Use Content Security Policy headers
- Escape HTML in user-generated content

### 3. Data Protection

- No sensitive data in localStorage (use encryption if needed)
- HTTPS only in production
- Secure cookies (HttpOnly, Secure, SameSite)
- No hardcoded secrets or API keys

### 4. CORS & CSP

```typescript
// Future: Server-side configuration
const corsConfig = {
  origin: ['https://yourdomain.com'],
  methods: ['GET', 'POST'],
  credentials: true,
};

const cspConfig = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
};
```

---

## 📈 Performance Optimization

### 1. Code Splitting

```typescript
// App.tsx
const FeatureMatrix = lazy(() => import('./components/features/feature-matrix/FeatureMatrix'));
const ROICalculator = lazy(() => import('./components/features/roi-calculator/EnhancedROICalculator'));
const RecommendationWizard = lazy(() => import('./components/features/recommendation/RecommendationWizard'));

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <FeatureMatrix />
</Suspense>
```

### 2. Memoization

```typescript
// Expensive calculations
const filteredPlatforms = useMemo(() => {
  return filterAndSortPlatforms(platforms, filters);
}, [platforms, filters]);

// Callback functions
const handleFilterChange = useCallback((newFilters: Filters) => {
  setFilters(newFilters);
  trackEvent('filter_change', { filters: newFilters });
}, [trackEvent]);
```

### 3. Virtualization (Future)

```typescript
import { useVirtual } from '@tanstack/react-virtual';

export function VirtualPlatformList({ platforms }: { platforms: Platform[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const rowVirtualizer = useVirtual({
    size: platforms.length,
    parentRef,
    estimateSize: useCallback(() => 200, []),
  });
  
  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${rowVirtualizer.totalSize}px` }}>
        {rowVirtualizer.virtualItems.map((virtualRow) => (
          <div key={virtualRow.index}>
            <PlatformCard platform={platforms[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 4. Bundle Optimization

- Tree-shaking enabled
- Minimize dependencies
- Use production builds
- Enable compression (gzip/brotli)
- CDN for static assets
- Image optimization

---

## ♿ Accessibility (WCAG 2.1 AA)

### 1. Semantic HTML

```tsx
<nav aria-label="Main navigation">
  <ul>
    <li><button aria-selected={currentTab === 'explorer'}>Explorer</button></li>
  </ul>
</nav>

<main id="main-content">
  <h1>Platform Explorer</h1>
</main>
```

### 2. Keyboard Navigation

```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowRight':
      nextQuestion();
      break;
    case 'ArrowLeft':
      previousQuestion();
      break;
    case 'Escape':
      closeModal();
      break;
  }
};
```

### 3. Screen Reader Support

```tsx
<button aria-label="Close modal" onClick={onClose}>
  <X aria-hidden="true" />
</button>

<div role="status" aria-live="polite">
  {loading ? 'Loading...' : 'Content loaded'}
</div>
```

### 4. Focus Management

```typescript
const firstFocusableElementRef = useRef<HTMLElement>(null);

useEffect(() => {
  if (isOpen) {
    firstFocusableElementRef.current?.focus();
  }
}, [isOpen]);
```

---

## 🧪 Testing Strategy (Future)

### 1. Unit Tests

```typescript
// recommendationEngine.test.ts
describe('calculateRecommendations', () => {
  it('should calculate correct scores', () => {
    const platforms = [mockPlatform1, mockPlatform2];
    const answers = mockAnswers;
    
    const results = calculateRecommendations(platforms, answers);
    
    expect(results[0].totalScore).toBeGreaterThan(results[1].totalScore);
  });
  
  it('should apply budget constraints correctly', () => {
    const platform = { ...mockPlatform, pricingValue: 50 };
    const answers = { 'budget-per-user': { value: 30 } };
    
    const result = calculateConstraintsScore(platform, answers);
    
    expect(result).toBeLessThan(100);
  });
});
```

### 2. Integration Tests

```typescript
// RecommendationWizard.test.tsx
describe('RecommendationWizard', () => {
  it('should complete full wizard flow', async () => {
    const { getByText, getByRole } = render(<RecommendationWizard />);
    
    // Answer all questions
    for (let i = 0; i < 11; i++) {
      const nextButton = getByText('Next Question');
      fireEvent.click(nextButton);
    }
    
    // Check results displayed
    await waitFor(() => {
      expect(getByText('Your Personalized Recommendations')).toBeInTheDocument();
    });
  });
});
```

### 3. E2E Tests

```typescript
// recommendation-flow.spec.ts (Playwright)
test('complete recommendation flow', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Get Recommendation');
  
  // Answer questions
  await page.click('text=Code Generation');
  await page.click('text=Next Question');
  
  // ... answer remaining questions
  
  // Verify results
  await expect(page.locator('text=Best Match')).toBeVisible();
});
```

---

## 📊 Monitoring & Analytics

### 1. Performance Metrics

- **FCP** (First Contentful Paint): < 1.8s
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTI** (Time to Interactive): < 3.5s

### 2. Business Metrics

- Wizard completion rate
- Recommendation acceptance rate
- Time to platform selection
- Export rate
- ROI calculator usage

### 3. Error Tracking

```typescript
// Automatic error boundary reporting
if (APP_CONFIG.features.errorReporting) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: APP_CONFIG.app.environment,
    tracesSampleRate: 0.1,
  });
}
```

---

## 🚀 Deployment Architecture

### Development

```
Local Dev Server (Vite)
  ↓
Hot Module Replacement
  ↓
localhost:5173
```

### Staging

```
GitHub Push (main branch)
  ↓
GitHub Actions CI
  ├─ Run Tests
  ├─ Lint Code
  ├─ Type Check
  └─ Build Production
  ↓
Deploy to Vercel (Preview)
  ↓
https://staging.example.com
```

### Production

```
GitHub Release Tag
  ↓
GitHub Actions CD
  ├─ Run Full Test Suite
  ├─ Security Audit
  ├─ Build Optimized Bundle
  └─ Generate Source Maps
  ↓
Deploy to Vercel/Netlify
  ├─ CloudFlare CDN
  ├─ Edge Caching
  └─ Auto-Scaling
  ↓
https://www.example.com
```

---

## 🔄 CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      
  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

**Version:** 3.2.0  
**Last Updated:** December 2025  
**Architecture Status:** ✅ Production-Grade  
**Maintained By:** INT Inc. Engineering Team
