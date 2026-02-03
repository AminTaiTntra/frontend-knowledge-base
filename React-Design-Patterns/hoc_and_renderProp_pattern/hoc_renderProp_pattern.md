# React Patterns: Higher-Order Components (HOC) & Render Props

## Why Do We Need Patterns in React?

- Multiple components often share the same logic (API calls, authentication, permissions)
- Copy-pasting logic ❌
- We need reusable and maintainable solutions

Before **React Hooks**, there were two major patterns to achieve this:

1. **Higher-Order Components (HOC)**
2. **Render Props**

Both help in **sharing logic**, but they work differently.

---

## 1. Higher-Order Components (HOC)

### What is a Higher-Order Component?

A **Higher-Order Component** is a function that takes a component and returns a new enhanced component.


```jsx
 const EnhancedComponent = withHOC(OriginalComponent);
 ```

Think of it as wrapping a component with extra behavior.

## Why HOCs exist
Before React Hooks were introduced, there was no clean way to reuse logic between components.
### HOCs were discovered as a pattern to:
- Reuse common logic
- Enforce rules consistently
- Keep UI components clean
- Avoid duplicating code

### Common use cases:
- Authentication
- Authorization
- Logging
- Data fetching

---
### Basic HOC Syntax

```jsx
 import React from 'react';
 // The HOC function
 const withExtraInfo = (WrappedComponent) => {
 // Returns a new component (Class or Functional)
  return (props) => {
    // Adds new logic/props
    const extraData = "Enhanced";
    // Renders the original component with its props + new props
    return <WrappedComponent {...props} extraData={extraData} />;
  };
 };
 export default withExtraInfo;
 ```
 Usage
 ```jsx
 const EnhancedComponent = withExtraInfo(OriginalComponent);
```


### HOC Flow (Conceptual)
1. Component passed to HOC
2. HOC adds logic
3. New component returned
4. Original component rendered with extra props

---

### HOC Example 
**Original Component (UI only)**

```jsx
function UsersListPage({ data, loading }) {
 if (loading) return <p>Loading...</p>;
 return (
   <div>
     <h2>Users</h2>
     <ul>
       {data.slice(0, 5).map((user) => (
         <li key={user.id}>{user.name}</li>
       ))}
     </ul>
   </div>
 );
}
export default UsersListPage;
```

 **HOC (Data Fetch Logic)**

 ```jsx
export const withDataFetch = (url) => (WrappedComponent) => {
 return function WithDataFetch(props) {
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(true);
   useEffect(() => {
     fetch(url)
       .then((res) => res.json())
       .then((result) => {
         setData(result);
         setLoading(false);
       });
   }, [url]);
   return <WrappedComponent {...props} data={data} loading={loading}       />;
 }; 
};
```

 **Wrapped Component (New Component)**

 ```jsx
const UsersPage = withDataFetch("https://jsonplaceholder.typicode.com/users")(
 UsersListPage,
);
```

**Using the HOC**
```jsx
<UsersPage />
```
- withDataFetch runs first
- It fetches data from API
- It passes data & loading as props
- UsersListPage receives those props
- UI renders using data

---


### Pros of HOC
- Powerful abstraction
- Logic reuse
- Keeps UI components simple

### Cons of HOC
- Wrapper Hell (deep nesting)
  - Nested HOCs become unreadable
    ```jsx
    const UsersPage = withPermission(
      withLogger(
        withAuth(
          withDataFetch("https://jsonplaceholder.typicode.com/posts")(
            UsersListPage,
          ),
        ),
      ),
    );
    ```
- Harder debugging
  - You need to open multiple files
  - Flow is hidden

- Props collision risk
  - Props can be overwritten or lost

- Less explicit data flow
  - Props source is not obvious

- Limited UI flexibility

---

## 2. Render Props Pattern
### What is Render Props ?

A **render prop** is : 
> A prop whose value is a function that returns JSX.
The component controls logic, and delegates rendering to the consumer.


### Syntax
**Option 1: Using render prop**

```jsx
 <Component render={(data) => <UI data={data} />} />
```

**Option 2: Using children as a function (more common)**

```jsx
 <Component>
   {(data) => <UI data={data} />}
 </Component>
 ```


### Problems with HOCs:
- Too many wrappers
- Hard to trace props
- Limited UI flexibility
### Render Props solve:
- Explicit data flow
- More UI flexibility

### Render Props Example
A **Products** component fetches product data and exposes it via a **render prop**.

```jsx
const Products = ({ render, children }) => {
 const [products, setProducts] = React.useState([]);


 React.useEffect(() => {
   fetch("/api/products")
     .then((res) => res.json())
     .then(setProducts);
 }, []);


 if (render) return render(products);
 if (children) return children(products);
 return null;
};
export default Products;
```

**Usage Example**

**Home Page** : Products are displayed as a list of titles.
```jsx
export const HomePage = () => {
 return (
   <div>
     <Products
       render={(products) => (
         <ul>
           {products?.map((product) => (
             <li key={product.id}>{product.title}</li>
           ))}
         </ul>
       )}
     />
   </div>
 );
};
```

**Products Page** :  Products are displayed with titles and descriptions.
```jsx
export const ProductsSection = () => {
 return (
   <div>
     <h1>Products List</h1>
     <Products>
       {(products) => (
         <ul>
           {products?.map((product) => (
             <li key={product.id}>{product.title}</li>
           ))}
         </ul>
       )}
     </Products>
   </div>
 );
};
```

This allows you to reuse the **Products** component and customize its rendering according to your needs in different parts of your application.

### Pros of Render Props
- Clear data flow
- Highly flexible UI
- No wrapper nesting

### Cons of Render Props

- **JSX can look verbose**
  - Render props often require writing functions inside JSX, which can make UI code longer and harder to read.

    ```jsx
    return (
      <div>
        {isLoggedIn ? (
          <p>Welcome User</p>
        ) : (
          <p>Please Login</p>
        )}
      </div>
    );
    ```
- Inline functions may affect readability
  - Writing functions directly inside JSX can make components harder to understand and maintain.
- Less commonly used after Hooks
  - React Hooks offer a simpler and cleaner way to reuse logic, reducing the need for Render Props.

## Key Comparisons:
- **Structure**: HOCs wrap components (often creating "wrapper hell"), while render props pass a function through a prop, keeping structure flatter.
- **Flexibility**: Render props provide more control over how data is rendered.
- **Naming Collisions**: HOCs can encounter prop name collisions if not careful, whereas render props generally avoid this issue.
- **Usage**: HOCs are better for static, reusable behavior, while render props excel with dynamic rendering. 

### When to Use Which:
- **Use HOCs**: For applying common logic (logging, authentication) across many components.
- **Use Render Props**: When you need full control over the rendering output or to share complex stateful logic.

### Final Summary
- HOCs and Render Props are foundational React patterns
- Important for understanding legacy and advanced codebases
- Hooks are preferred today for cleaner and simpler logic reuse.

















