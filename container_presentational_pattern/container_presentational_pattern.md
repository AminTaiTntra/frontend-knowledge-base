# Container / Presentational Pattern in React

## Overview

The **Container/Presentational Pattern** is a fundamental design pattern in React that separates business logic from UI rendering. This pattern promotes better separation of concerns, improved testability, and enhanced component reusability by dividing components into two distinct categories: containers that handle logic and presentational components that handle display.

In this guide, we'll explore what the Container/Presentational pattern is, why it's essential, and how to implement it effectively. We'll use a practical example: building a **DogImages component** that fetches and displays dog images from an API.

---

## What is the Container / Presentational Pattern?

The pattern splits a component into two parts:

- **Container Component** → Handles **how things work**
- **Presentational Component** → Handles **how things look**

This separation creates a clear boundary between business logic and user interface, making your codebase more maintainable and scalable.

---

## Why This Pattern Exists?

### The Problem

In real-world projects, components often:

- Grow beyond 500–1000 lines
- Mix API calls with JSX
- Contain pagination, filters, search, permissions, and UI logic together
- Become difficult to navigate and understand

This makes code:

- ❌ Hard to debug
- ❌ Hard to reuse
- ❌ Hard to test
- ❌ Hard for new developers to understand

### The Solution

The Container/Presentational Pattern solves this by **enforcing separation of responsibilities**. Each component type has a clear, focused purpose.

---

## Core Responsibilities

| Container | Presentational |
|-----------|----------------|
| API calls | JSX only |
| State management | Receives props |
| Business logic | No business logic |
| Permissions | UI rendering |
| Hooks, Redux, services | Stateless or minimal state |
| Data fetching | Data display |
| Error handling | Visual feedback |

---

## Example: Building a Dog Images Gallery

### Without the Pattern (❌ Anti-Pattern)

```tsx
// ❌ Anti-Pattern: Logic and UI mixed together
import { useState, useEffect } from 'react';

export default function DogImages() {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dog.ceo/api/breed/labrador/images/random/6');
        const data = await response.json();
        setDogs(data.message);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, []);

  // All rendering logic mixed with business logic
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <p className="text-xl font-semibold">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Labrador Dogs
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dogs.map((dog, index) => (
          <div
            key={index}
            className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={dog}
              alt={`Dog ${index + 1}`}
              className="w-full h-64 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### Problems with This Approach:

1. **Logic and UI are tightly coupled** → Can't reuse the UI with different data
2. **Hard to test** → Must mock API calls to test UI rendering
3. **Hard to reuse** → Can't use this UI for cat images or other data
4. **Poor maintainability** → Changes to logic require touching UI code
5. **Difficult to extend** → Adding features like pagination requires modifying everything

---

### With Container / Presentational Pattern (✅ Recommended)

#### 1. Container Component (Business Logic)

```tsx
// containers/DogImagesContainer.tsx
import { useState, useEffect } from 'react';
import DogImagesPresentation from '../components/DogImagesPresentation';

export default function DogImagesContainer() {
  const [dogs, setDogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://dog.ceo/api/breed/labrador/images/random/6'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch dog images');
        }
        
        const data = await response.json();
        setDogs(data.message);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, []);

  // Container only passes data down, no UI logic
  return (
    <DogImagesPresentation
      dogs={dogs}
      loading={loading}
      error={error}
    />
  );
}
```

#### 2. Presentational Component (UI Rendering)

```tsx
// components/DogImagesPresentation.tsx
type DogImagesPresentationProps = {
  dogs: string[];
  loading: boolean;
  error: string | null;
};

export default function DogImagesPresentation({
  dogs,
  loading,
  error,
}: DogImagesPresentationProps) {
  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <p className="ml-4 text-xl text-gray-600">Loading adorable dogs...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <svg
          className="w-16 h-16 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-xl font-semibold">Oops! Something went wrong</p>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    );
  }

  // Success state
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Beautiful Labrador Dogs
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dogs.map((dog, index) => (
          <div
            key={index}
            className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white"
          >
            <img
              src={dog}
              alt={`Labrador dog ${index + 1}`}
              className="w-full h-64 object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <p className="text-sm text-gray-600 text-center">
                Image {index + 1} of {dogs.length}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### 3. Usage

```tsx
// App.tsx
import DogImagesContainer from './containers/DogImagesContainer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DogImagesContainer />
    </div>
  );
}

export default App;
```

---

## Advantages of Container/Presentational Pattern

### 1. **Improved Testability**

```tsx
// Easy to test presentational component without mocking APIs
describe('DogImagesPresentation', () => {
  it('renders loading state', () => {
    render(<DogImagesPresentation dogs={[]} loading={true} error={null} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(<DogImagesPresentation dogs={[]} loading={false} error="Failed" />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('renders dog images', () => {
    const dogs = ['dog1.jpg', 'dog2.jpg'];
    render(<DogImagesPresentation dogs={dogs} loading={false} error={null} />);
    expect(screen.getAllByRole('img')).toHaveLength(2);
  });
});
```

### 2. **Enhanced Reusability**

```tsx
// Reuse the same presentational component with different data sources
<DogImagesPresentation dogs={catImages} loading={false} error={null} />
<DogImagesPresentation dogs={birdImages} loading={false} error={null} />
```

### 3. **Better Separation of Concerns**

- **Container**: Handles all data fetching, state, and business logic
- **Presentational**: Focuses purely on rendering UI based on props

### 4. **Easier Maintenance**

Changes to business logic only affect the container. UI changes only affect the presentational component.

### 5. **Clearer Code Organization**

```
src/
├── containers/
│   ├── DogImagesContainer.tsx
│   ├── UserProfileContainer.tsx
│   └── ProductListContainer.tsx
└── components/
    ├── DogImagesPresentation.tsx
    ├── UserProfilePresentation.tsx
    └── ProductListPresentation.tsx
```

---

## Using React Hooks as an Alternative

With the introduction of React Hooks, many use cases of the Container/Presentational pattern can be simplified. 
Hooks allow developers to add state, side effects, and data-fetching logic to components without creating separate container components.

### Custom Hook Approach

Instead of placing data-fetching logic inside a Container component, we can extract that logic into a **reusable custom hook**.

#### 1. Custom Hook (Replaces Container)

```tsx
// hooks/useDogImages.ts
import { useState, useEffect } from 'react';

type UseDogImagesReturn = {
  dogs: string[];
  loading: boolean;
  error: string | null;
};

export default function useDogImages(): UseDogImagesReturn {
  const [dogs, setDogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://dog.ceo/api/breed/labrador/images/random/6'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch dog images');
        }
        
        const data = await response.json();
        setDogs(data.message);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, []);

  return { dogs, loading, error };
}
```

This hook:
- ✅ Manages state
- ✅ Handles side effects (API calls)
- ✅ Returns only the required data
- ✅ Can be reused across multiple components

#### 2. Component Using the Hook

```tsx
// components/DogImages.tsx
import useDogImages from '../hooks/useDogImages';

export default function DogImages() {
  const { dogs, loading, error } = useDogImages();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <p className="text-xl font-semibold">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Labrador Dogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dogs.map((dog, index) => (
          <div key={index} className="rounded-lg overflow-hidden shadow-lg">
            <img
              src={dog}
              alt={`Dog ${index + 1}`}
              className="w-full h-64 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

Here, the `DogImages` component:
- Contains no business logic
- Uses data returned from the custom hook
- Focuses only on rendering the UI

### Benefits of Using Hooks Over Container Components

| Benefit | Description |
|---------|-------------|
| **Removes unnecessary wrapper components** | No need for separate Container components |
| **Reduces component nesting** | Flatter component tree |
| **Improves code readability** | Logic is clearly separated in hooks |
| **Makes logic easily reusable** | Hooks can be used across multiple components |
| **Modern React approach** | Aligns with current React best practices |

---

## When to Use This Pattern?

### ✅ Use When:

- Building complex tables with sorting, filtering, and pagination
- Handling permissions and role-based access
- Managing multiple API calls and business logic
- Maintaining large, long-lived projects
- Creating reusable UI components
- Need to test business logic separately from UI
- Working with teams where different developers handle logic vs. UI

### ❌ Avoid When:

- Components are very small and simple
- UI is static with no business logic
- Using modern hooks is more appropriate
- Over-engineering simple features
- The component will never be reused

---

## Conclusion

The **Container/Presentational Pattern** is a fundamental design pattern that promotes clean architecture, testability, and maintainability in React applications. While modern React Hooks provide an alternative approach through custom hooks, understanding this pattern helps you think about separation of concerns and build better-structured applications.

### Quick Recap:

- **Container Component**: Handles business logic, state, and data fetching
- **Presentational Component**: Handles UI rendering based on props
- **Modern Alternative**: Custom hooks can replace containers while maintaining separation
- **Key Benefits**: Better testability, reusability, and maintainability
- **Best For**: Complex applications with significant business logic

Whether you choose the traditional Container/Presentational pattern or the modern custom hooks approach, the core principle remains the same: **separate your concerns** to build more maintainable and scalable React applications.