# 🏗️ Production Architecture Documentation

## Overview

This document describes the complete architecture of the AI Platform Explorer application after the comprehensive refactoring for production readiness.

**Architecture Style:** Layered Architecture with Context-based State Management  
**Primary Pattern:** Service-oriented with Repository abstraction  
**State Management:** React Context API + Custom Hooks  
**Version:** 3.2.0 (Production-ready)

---

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  React Components (UI)                                       │  │
│  │  - Pages, Layouts, Forms, Modals                            │  │
│  │  - Lazy-loaded feature components                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────────┐
│                         STATE MANAGEMENT LAYER                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Context Providers                                           │  │
│  │  - AppContext (global state)                                 │  │
│  │  - ErrorBoundary (error handling)                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Custom Hooks                                                │  │
│  │  - useLocalStorage, useDebounce, useAnalytics, etc.         │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────────┐
│                         BUSINESS LOGIC LAYER                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Services                                                    │  │
│  │  - recommendationEngine (scoring algorithm)                  │  │
│  │  - validationService (input validation)                      │  │
│  │  - storageService (localStorage abstraction)                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Utilities                                                   │  │
│  │  - Data transformations, formatters, helpers                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────────┐
│                           DATA LAYER                                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Data Sources                                                │  │
│  │  - platforms.ts (16+ AI platforms)                           │  │
│  │  - questions.ts (recommendation questions)                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Storage                                                     │  │
│  │  - localStorage (user preferences, answers)                  │  │
│  │  - sessionStorage (temporary data)                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Directory Structure (Production-Grade)

```
/
├── config/                      # Application configuration
│   └── app.config.ts           # Centralized config (feature flags, etc.)
│
├── constants/                   # Application constants
│   └── index.ts                # All constants (categories, sort options, etc.)
│
├── context/                     # React Context providers
│   └── AppContext.tsx          # Global application state
│
├── hooks/                       # Custom React hooks
│   ├── useLocalStorage.ts      # localStorage hook
│   ├── useDebounce.ts          # Debounce hook
│   ├── useAnalytics.ts         # Analytics tracking
│   └── useMediaQuery.ts        # Responsive design hook
│
├── services/                    # Business logic services
│   ├── storageService.ts       # Storage abstraction
│   └── validationService.ts    # Input validation
│
├── utils/                       # Utility functions
│   └── recommendationEngine.ts # Scoring algorithm
│
├── data/                        # Static data
│   ├── platforms.ts            # Platform data (16+)
│   └── questions.ts            # Recommendation questions
│
├── types/                       # TypeScript types
│   └── recommendation.ts       # Recommendation engine types
│
├── types.ts                     # Core application types
│
├── components/                  # React components
│   ├── ErrorBoundary.tsx       # Error handling component
│   │
│   ├── # Core UI Components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Navigation.tsx
│   ├── ToastContainer.tsx
│   │
│   ├── # Feature Components
│   ├── PlatformCard.tsx
│   ├── PlatformTable.tsx
│   ├── PlatformModal.tsx
│   ├── FilterBar.tsx
│   ├── Statistics.tsx
│   ├── ComparisonSidebar.tsx
│   ├── ComparisonModal.tsx
│   ├── FeatureMatrix.tsx
│   ├── EnhancedROICalculator.tsx
│   ├── Glossary.tsx
│   │
│   ├── # Recommendation Engine Components
│   ├── RecommendationWizard.tsx
│   ├── QuestionCard.tsx
│   └── RecommendationResults.tsx
│
├── styles/                      # Stylesheets
│   └── globals.css             # Global styles + Tailwind
│
├── App.tsx                      # Root application component
│
└── # Documentation
    ├── README.md
    ├── ARCHITECTURE.md          # This file
    ├── PRODUCTION_ROADMAP.md
    ├── RECOMMENDATION_ENGINE_DOCS.md
    ├── PHASE1_IMPLEMENTATION_SUMMARY.md
    └── ... (other docs)
```

---

## 🔄 Data Flow Architecture

### 1. User Interaction Flow

```
User Action
    ↓
React Component
    ↓
Event Handler
    ↓
Context Action / Hook
    ↓
Service Layer (validation, processing)
    ↓
State Update
    ↓
Re-render Components
    ↓
UI Update
```

### 2. Recommendation Engine Flow

```
User Starts Wizard
    ↓
RecommendationWizard Component
    ↓
QuestionCard renders (current question)
    ↓
User answers question
    ↓
Answer stored in state (UserAnswers)
    ↓
Progress to next question
    ↓
(Repeat for 11 questions)
    ↓
Calculate Recommendations button clicked
    ↓
calculateRecommendations() service called
    ├─ Calculate Requirements Score (40%)
    ├─ Calculate Constraints Score (40%)
    ├─ Calculate Priorities Score (20%)
    ├─ Calculate Confidence Score
    └─ Generate Reasoning
    ↓
RecommendationScore[] returned
    ↓
Sort by totalScore (descending)
    ↓
Assign ranks (1-16)
    ↓
RecommendationResults component renders
    ↓
Display top 3 + others
```

### 3. State Management Flow

```
Component needs state
    ↓
useApp() hook
    ↓
Access AppContext
    ↓
Read current state
    ↓
Call action (e.g., setFilters)
    ↓
Context updates state
    ↓
All consuming components re-render
```

---

## 🎯 Layer Responsibilities

### Presentation Layer

**Responsibilities:**
- Render UI components
- Handle user interactions
- Display data from state
- Trigger actions via context/hooks
- Lazy load heavy components

**Key Components:**
- `App.tsx` - Root component with lazy loading
- `ErrorBoundary.tsx` - Error handling wrapper
- Feature components (PlatformCard, RecommendationWizard, etc.)

**Rules:**
- ✅ Components should be presentational
- ✅ Business logic should be in services
- ✅ State should come from context/hooks
- ❌ No direct localStorage access
- ❌ No complex calculations in components

---

### State Management Layer

**Responsibilities:**
- Manage global application state
- Provide state to components via context
- Handle state updates through actions
- Persist state to localStorage where needed

**Key Files:**
- `/context/AppContext.tsx` - Global state provider
- `/hooks/*` - Reusable stateful logic

**State Structure:**
```typescript
{
  // Navigation
  currentTab: 'explorer' | 'matrix' | 'financial' | 'assessment' | 'glossary',
  
  // Platform Data
  platforms: Platform[],
  selectedPlatforms: string[],
  selectedPlatform: Platform | null,
  
  // Filters
  filters: {
    provider: string,
    category: string,
    search: string,
    sortBy: string,
  },
  currentView: 'cards' | 'table',
  
  // UI State
  toasts: ToastMessage[],
  showComparison: boolean,
  isLoading: boolean,
  error: Error | null,
}
```

**Actions Available:**
```typescript
{
  // Navigation
  setCurrentTab(tab),
  
  // Platform Selection
  togglePlatformSelection(platformId),
  clearPlatformSelection(),
  setSelectedPlatform(platform),
  
  // Filters
  setFilters(filters),
  clearFilters(),
  setCurrentView(view),
  
  // Comparison
  setShowComparison(show),
  handleCompare(),
  
  // Toasts
  addToast(message, type),
  removeToast(id),
  
  // Export
  exportData(format),
  
  // Loading & Error
  setLoading(loading),
  setError(error),
}
```

---

### Business Logic Layer

**Responsibilities:**
- Implement business rules
- Perform calculations and algorithms
- Validate user input
- Transform data
- Abstract external dependencies

**Key Services:**

#### 1. Recommendation Engine (`/utils/recommendationEngine.ts`)

```typescript
calculateRecommendations(platforms, answers): RecommendationScore[]
├─ calculateRequirementsScore()   // 40% weight
├─ calculateConstraintsScore()    // 40% weight
├─ calculatePrioritiesScore()     // 20% weight
├─ calculateConfidence()          // Data quality
└─ generateReasons()              // Human explanations
```

**Algorithm:**
- Multi-factor weighted scoring
- Penalty system for constraint violations
- Bonus points for ecosystem matches
- Confidence based on data completeness

#### 2. Validation Service (`/services/validationService.ts`)

```typescript
validateEmail(email): ValidationResult
validateSearch(query): ValidationResult
validateTeamSize(size): ValidationResult
validateBudget(budget): ValidationResult
validateRequired(value, fieldName): ValidationResult
validateRange(value, min, max, fieldName): ValidationResult
validateMultiple(...results): ValidationResult
sanitize(input): string
```

**Validation Rules:**
- Search: 1-100 characters
- Team size: 1-10,000
- Budget: $0-$100/user/month
- Email: RFC 5322 compliant
- URL: Must start with http:// or https://

#### 3. Storage Service (`/services/storageService.ts`)

```typescript
get<T>(key, defaultValue): T | null
set<T>(key, value): boolean
remove(key): boolean
clear(): boolean
getMany<T>(keys): Record<string, T | null>
setMany(items): boolean
has(key): boolean
keys(): string[]
getSize(): number
migrate(oldVersion): boolean
```

**Features:**
- Automatic key prefixing
- Version management
- Error handling
- Migration support
- Size tracking

---

### Data Layer

**Responsibilities:**
- Provide platform data
- Provide question data
- Abstract storage mechanisms
- Handle data persistence

**Data Sources:**

#### 1. Platform Data (`/data/platforms.ts`)

```typescript
export const PLATFORMS_DATA: Platform[] = [
  {
    id: 'copilot',
    name: 'Microsoft Copilot',
    provider: 'Microsoft',
    // ... 40+ fields
    scores: {
      codeGeneration: 9,
      creativeWriting: 8,
      // ... 10 capability scores
    },
    // ...
  },
  // 16+ platforms
]
```

#### 2. Question Data (`/data/questions.ts`)

```typescript
export const RECOMMENDATION_QUESTIONS: Question[] = [
  {
    id: 'primary-use-case',
    text: 'What is your primary use case?',
    type: 'single',
    category: 'requirements',
    weight: 1.0,
    options: [...],
  },
  // 11 questions
]
```

#### 3. Storage Layer

**localStorage Keys:**
```
ai-explorer-v1-preferences
ai-explorer-v1-recent-searches
ai-explorer-v1-favorites
ai-explorer-v1-rec-answers
ai-explorer-v1-comparison
ai-explorer-v1-filters
```

**Persistence Strategy:**
- User preferences → localStorage (persistent)
- Recent searches → localStorage (7 days)
- Recommendation answers → localStorage (session + persistent)
- Filter state → sessionStorage (session only)
- Platform selection → Context (in-memory)

---

## 🔌 Integration Points

### 1. Configuration System

**Centralized Config** (`/config/app.config.ts`):
```typescript
APP_CONFIG = {
  app: { name, version, environment, buildDate },
  features: { /* Feature flags */ },
  ui: { maxPlatformsToCompare, defaultView, ... },
  recommendation: { scoreWeights, confidenceThresholds, ... },
  export: { formats, maxFileSize, ... },
  analytics: { enabled, trackPageViews, ... },
  api: { baseUrl, timeout, retryAttempts, ... },
  storage: { prefix, version, keys, ... },
  validation: { search, teamSize, budget limits },
  urls: { documentation, support, feedback, ... },
}
```

**Usage:**
```typescript
import { APP_CONFIG, isFeatureEnabled } from '../config/app.config';

if (isFeatureEnabled('recommendationEngine')) {
  // Feature is enabled
}

const maxCompare = APP_CONFIG.ui.maxPlatformsToCompare; // 4
```

---

### 2. Constants Management

**All Constants** (`/constants/index.ts`):
```typescript
PLATFORM_CATEGORIES, PLATFORM_CATEGORY_LABELS
PROVIDERS
SORT_OPTIONS, SORT_OPTION_LABELS
TABS, TAB_LABELS
TOAST_TYPES
EXPORT_FORMATS
QUESTION_CATEGORIES, QUESTION_CATEGORY_LABELS
QUESTION_TYPES
MATCH_LEVELS, MATCH_LEVEL_CONFIG
CONFIDENCE_LEVELS, CONFIDENCE_LEVEL_CONFIG
STORAGE_KEYS
ANALYTICS_EVENTS
ERROR_TYPES
KEYBOARD_SHORTCUTS
API_ENDPOINTS
PATTERNS (regex)
BREAKPOINTS
ANIMATION_DURATION
Z_INDEX
FILE_SIZE_LIMITS
DATE_FORMATS
COMPLIANCE_CERTS
```

**Usage:**
```typescript
import { TABS, TOAST_TYPES, SORT_OPTIONS } from '../constants';

setCurrentTab(TABS.EXPLORER);
addToast('Success!', TOAST_TYPES.SUCCESS);
```

---

### 3. Custom Hooks

#### useLocalStorage
```typescript
const [value, setValue, removeValue] = useLocalStorage('key', defaultValue);
```

#### useDebounce
```typescript
const debouncedValue = useDebounce(searchTerm, 300);
```

#### useAnalytics
```typescript
const { trackPageView, trackEvent, trackError } = useAnalytics();

trackPageView('Platform Explorer');
trackEvent(ANALYTICS_EVENTS.PLATFORM_VIEW, { platformId: 'copilot' });
trackError(error, { context: 'Recommendation calculation' });
```

#### useMediaQuery
```typescript
const { isMobile, isTablet, isDesktop } = useResponsive();

if (isMobile) {
  // Mobile-specific logic
}
```

---

## 🛡️ Error Handling Strategy

### Error Boundary Hierarchy

```
<App>
  <ErrorBoundary>              ← Top-level: Catches all errors
    <AppProvider>
      <Navigation />
      <main>
        {currentTab === 'explorer' && <Suspense fallback={<Loading />}>
          <AsyncErrorBoundary>  ← Feature-level: Catches lazy load errors
            <FeatureComponent />
          </AsyncErrorBoundary>
        </Suspense>}
      </main>
    </AppProvider>
  </ErrorBoundary>
</App>
```

### Error Types

```typescript
ERROR_TYPES = {
  VALIDATION: 'validation',    // User input errors
  NETWORK: 'network',          // API call failures
  STORAGE: 'storage',          // localStorage errors
  CALCULATION: 'calculation',  // Business logic errors
  UNKNOWN: 'unknown',          // Unexpected errors
}
```

### Error Handling Flow

```
Error occurs
    ↓
ErrorBoundary catches it
    ↓
Log to console (dev) or error service (prod)
    ↓
Display user-friendly message
    ↓
Provide recovery actions (retry, go home)
    ↓
Track in analytics
```

---

## 📊 Analytics Architecture

### Event Tracking

```typescript
// Page view
trackPageView('Platform Explorer', { filter: 'enterprise' });

// User action
trackEvent(ANALYTICS_EVENTS.PLATFORM_COMPARE, {
  platforms: ['copilot', 'gemini'],
  duration: 45,
});

// Error
trackError(new Error('Calculation failed'), {
  component: 'ROICalculator',
  userId: 'user123',
});
```

### Event Batching

```
Events queued in memory
    ↓
Batch when:
  - 10 events collected, OR
  - 5 seconds elapsed
    ↓
Send to analytics endpoint via navigator.sendBeacon
    ↓
Retry on failure (3 attempts)
```

---

## 🔒 Security Architecture

### Input Validation

```
User input
    ↓
Client-side validation (validationService)
    ↓
Sanitization (XSS prevention)
    ↓
Type checking (TypeScript)
    ↓
Business logic
```

### XSS Prevention

```typescript
// Sanitize user input
const sanitized = validation.sanitize(userInput);

// Use dangerouslySetInnerHTML sparingly
// Prefer {text} over dangerouslySetInnerHTML

// Validate URLs before navigation
const { isValid } = validation.validateURL(url);
```

### Content Security Policy

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
connect-src 'self' https://api.openai.com https://analytics.google.com;
```

---

## ⚡ Performance Optimizations

### Code Splitting

```typescript
// Lazy load heavy components
const FeatureMatrix = lazy(() => import('./components/FeatureMatrix'));
const ROICalculator = lazy(() => import('./components/EnhancedROICalculator'));
const RecommendationWizard = lazy(() => import('./components/RecommendationWizard'));

// Wrap in Suspense
<Suspense fallback={<LoadingFallback />}>
  <FeatureMatrix />
</Suspense>
```

### Memoization

```typescript
// Expensive calculations
const filteredPlatforms = useMemo(() => {
  return filterAndSortPlatforms(platforms, filters);
}, [platforms, filters]);

// Callback stability
const handleSubmit = useCallback(() => {
  // ...
}, [dependencies]);
```

### Debouncing

```typescript
// Search input
const debouncedSearch = useDebounce(searchTerm, 300);

useEffect(() => {
  // Only fires after 300ms of no typing
  performSearch(debouncedSearch);
}, [debouncedSearch]);
```

---

## 🧪 Testing Strategy

### Unit Tests (Target: 80% coverage)

```typescript
// Service tests
describe('recommendationEngine', () => {
  test('calculates correct total score', () => {
    const result = calculateRecommendations(platforms, answers);
    expect(result[0].totalScore).toBeGreaterThan(0);
  });
});

// Hook tests
describe('useLocalStorage', () => {
  test('persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    act(() => result.current[1]('newValue'));
    expect(localStorage.getItem('ai-explorer-v1-key')).toBe('"newValue"');
  });
});
```

### Integration Tests

```typescript
// Feature flow tests
test('complete recommendation flow', async () => {
  render(<App />);
  
  // Navigate to recommendation tab
  fireEvent.click(screen.getByText('Get Recommendation'));
  
  // Answer questions
  for (let i = 0; i < 11; i++) {
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
  }
  
  // Check results
  await waitFor(() => {
    expect(screen.getByText(/Top 3 Recommendations/i)).toBeInTheDocument();
  });
});
```

### E2E Tests (Playwright)

```typescript
test('user can complete recommendation and export', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Get Recommendation');
  
  // Answer all questions
  for (let i = 0; i < 11; i++) {
    await page.click('text=Next');
  }
  
  // Export results
  const downloadPromise = page.waitForEvent('download');
  await page.click('text=Export');
  const download = await downloadPromise;
  
  expect(download.suggestedFilename()).toContain('recommendations');
});
```

---

## 📈 Scalability Considerations

### Current Limits

- Platforms in database: 16+
- Questions in wizard: 11
- Max platforms to compare: 4
- localStorage size: ~5MB
- Concurrent users: Unlimited (static site)

### Future Scaling Needs

**When to add backend:**
- User accounts (Phase 2)
- Real-time collaboration (Phase 2)
- Analytics data warehouse (Phase 2)
- Custom platform data (Phase 5)

**When to add database:**
- >100 platforms
- User-generated content
- Vendor marketplace (Phase 5)

**When to add caching:**
- API response times >200ms
- Database queries >50ms
- High traffic (>10K users/hour)

---

## 🔄 Future Architecture Evolution

### Phase 2: Add Backend

```
Current: Static React App
Future:
  ┌─────────────────┐
  │  React Frontend │
  └────────┬────────┘
           │ REST API
  ┌────────┴────────┐
  │  Node.js Backend│
  └────────┬────────┘
           │
  ┌────────┴────────┐
  │  PostgreSQL DB  │
  └─────────────────┘
```

### Phase 3: Add Microservices

```
Frontend
    ↓
API Gateway
    ├─ Auth Service (authentication)
    ├─ Recommendation Service (scoring)
    ├─ Analytics Service (tracking)
    ├─ Export Service (file generation)
    └─ Notification Service (emails)
```

### Phase 4: Add Caching

```
Frontend
    ↓
CDN (Cloudflare)
    ↓
API Gateway
    ↓
Redis Cache
    ↓
Backend Services
    ↓
Database
```

---

## 📝 Best Practices & Conventions

### Code Organization

- ✅ One component per file
- ✅ Export const functions (not default)
- ✅ Place types near usage
- ✅ Group related files in folders
- ✅ Use barrel exports (index.ts)

### Naming Conventions

```
Components:     PascalCase     (UserProfile.tsx)
Hooks:          camelCase      (useAuth.ts)
Services:       camelCase      (authService.ts)
Constants:      UPPER_SNAKE    (MAX_USERS)
Types:          PascalCase     (UserProfile)
Functions:      camelCase      (calculateTotal)
Files:          kebab-case     (user-profile.tsx) or PascalCase for components
```

### TypeScript

- ✅ Strict mode enabled
- ✅ No `any` types (use `unknown`)
- ✅ Interface for objects, Type for unions
- ✅ Explicit return types for functions
- ✅ Use const assertions for literals

### Performance

- ✅ Lazy load heavy components
- ✅ Memoize expensive calculations
- ✅ Debounce user input
- ✅ Use keys in lists
- ✅ Avoid inline function definitions

---

**Architecture Version:** 3.2.0  
**Last Updated:** December 2025  
**Next Review:** January 2026  
**Owner:** INT Inc. Architecture Team
