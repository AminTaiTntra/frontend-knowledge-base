## What are Design Patterns?

When we build software, we keep running into similar design problems again and again.

Over time, developers noticed that some solutions:

- Worked well repeatedly
- Scaled as applications grew
- Made code easier to read and change

These recurring solutions were later documented and named.

**That’s what we call Design Patterns.**

---

### Important Clarifications

Design patterns are **not**:

- ❌ Copy-paste code
- ❌ Libraries or frameworks
- ❌ Strict rules

Design patterns **are**:

- ✅ Ways of structuring code
- ✅ Ways of assigning responsibilities
- ✅ Ways of avoiding known design problems

Think of them as **guidelines learned from experience**, not instructions to follow blindly.

---

## Why Did Design Patterns Exist in the First Place?

Design patterns were **discovered, not invented**.

As software systems grew, developers noticed a repeating trend:

> Quick, ad-hoc solutions worked in the beginning, but caused pain as the application grew.

### Common Pain Points Teams Faced

- Tight coupling between parts of the system
- Code that became hard to read and reason about
- Small changes breaking unrelated features

Developers were solving real problems — but often in ways that didn’t scale.

At first:
- Features shipped
- Tests passed

Over time:
- Maintenance became painful
- Changes became risky

👉 These “solutions that create pain later” are called **Anti-Patterns**.

---

## Why Introduce Anti-Patterns Here?

Design patterns did not appear out of nowhere.

They appeared as:

- A response to repeated mistakes
- A way to fix problems caused by anti-patterns
- A better structure discovered through experience

> Anti-patterns show us what goes wrong.  
> Design patterns show us what works better.

To truly understand design patterns, we must first understand **anti-patterns**.

---

## Common Anti-Patterns in React

### 1️⃣ God Component

#### Problem

A single component handles everything:

- API calls
- Business logic
- State management
- UI rendering

```jsx
function Dashboard() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/data")
      .then(res => res.json())
      .then(setData);
  }, []);

  function calculateStats() {
    // business logic
  }

  function exportPDF() {
    // more logic
  }

  return <DashboardUI data={data} />;
}
```
#### Why this is bad

- Hard to test
- Hard to change
- Hard to reuse
- One small change risks breaking everything

#### Natural solution

**We refactor by:**
- Move API + state logic into **custom hooks**
- Keep components focused only on **UI**

This idea—**separating responsibilities**—is not a random refactor.
It’s a **design pattern**, discovered because this problem kept repeating.

---

### 2️⃣ Prop Drilling Hell

#### Problem

Data is passed through many components that don’t actually need it:

```jsx
<App user="{user}">
  <Layout user="{user}">
    <Sidebar user="{user}">
      <Profile user="{user}" />
    </Sidebar>
  </Layout>
</App>
```
#### Why this is bad
- Unnecessary coupling
- Fragile code
- Hard to refactor
- Components depend on props they don’t use

#### Natural solution

**We introduce:**
- Context API
- Or a global state manager

Now components can **access shared state directly**, without manual wiring.
This solution wasn’t invented randomly — it was discovered to fix this pain.
Later, this idea was named: **Observer Pattern**

---

## Observer Pattern

### The problem it solves

One thing changes → many other things need to react
But we don’t want tight coupling.

### The idea

- One place holds the state
- Others “listen” to changes
- The source doesn’t know who is listening

Real-life example:
 📺 YouTube subscriptions — you subscribe once, updates arrive automatically.

---

### Anti-Pattern: Manual Sync Everywhere

```jsx
let user = null;

function updateHeader(user) {
  console.log("Header updated:", user.name);
}

function updateSidebar(user) {
  console.log("Sidebar updated:", user.name);
}

function updateDashboard(user) {
  console.log("Dashboard updated:", user.name);
}

function updateUser(newUser) {
  user = newUser;
  // manual notifications ❌
  updateHeader(user);
  updateSidebar(user);
  updateDashboard(user);
}
```

#### Why this is bad

- updateUser knows everyone
- Adding a new consumer means editing this function
- Easy to forget someone
- Tight coupling everywhere

Works at first, breaks as the app grows.

---

### Better Solution
Instead of manually calling everyone, we:

- Keep user state in one place
- Let others subscribe to changes
- Notify all listeners automatically
- Observers react automatically

#### Step 1: Create the Subject (UserStore)

```jsx
class UserStore {
  constructor() {
    this.user = null;
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  setUser(user) {
    this.user = user;
    // notify all observers
    this.listeners.forEach(listener => listener(user));
  }
}
```

#### Step 2: Create Observers (Header, Sidebar, Dashboard)

```jsx
const store = new UserStore();
store.subscribe(user => {
  console.log("Header updated:", user.name);
});
store.subscribe(user => {
  console.log("Sidebar updated:", user.name);
});
store.subscribe(user => {
  console.log("Dashboard updated:", user.name);
});
```
#### Step 3: Update the user (one call only)

```jsx
store.setUser({ name: "ABC" });
```
**Output**

```jsx
Header updated: ABC
Sidebar updated: ABC
Dashboard updated: ABC
```

### What changed?

#### Before (Anti-Pattern)

- One function manually updates everyone
- Tight coupling
- Hard to extend

#### After (Observer Pattern)

- One source of truth
- No manual calls
- Observers manage themselves
- Easy to add/remove listeners

“This idea is called the Observer Pattern.”

> “Observer Pattern lets one thing change and many other things react — without knowing about each other.”

In React, this idea appears naturally:

Components automatically re-render when the state they depend on changes.

React state + reactivity = Observer Pattern in practice.

```jsx
function App() {
  const [user, setUser] = React.useState({ name: "ABC" });
  return (
    <>
      <Header user={user} />
      <Sidebar user={user} />
      <Dashboard user={user} />


      <button onClick={() => setUser({ name: "XYZ" })}>
        Update User
      </button>
    </>
  );
}
```

**What’s happening here?**

1️⃣ App holds the state → Subject

2️⃣ Header, Sidebar, Dashboard depend on user → Observers

3️⃣ setUser() changes the state

4️⃣ React automatically:
- Detects who uses user
- Re-renders them

You never **manually call**:

```jsx
updateHeader()
updateSidebar()
updateDashboard()
```
React handles the notification step.

--- 

## Factory Pattern
Instead of creating objects in many places, put the creation logic in one place and let it decide what to create.

### Anti-Pattern: Scattered Creation Logic

```jsx
// pageA.js
function renderButton(label) {
  return `<button>${label}</button>`;
}
// pageB.js
function renderLink(label) {
  return `<a href="#">${label}</a>`;
}
// pageC.js
function renderUI(type, label) {
  if (type === "button") return `<button>${label}</button>`;
  if (type === "link") return `<a href="#">${label}</a>`;
}
```

#### Why this is bad

- Creation logic duplicated
- if / else logic scattered
- Changes require editing many files
- Easy to create inconsistency

This works early, becomes painful as the app grows.

#### Natural Solution: Centralize Creation

We move creation logic to **one place**:
- One file decides what to create
- Other files just ask for it

```jsx
// uiFactory.js
export function renderUI(type, label) {
  if (type === "button") return `<button>${label}</button>`;
  if (type === "link") return `<a href="#">${label}</a>`;
}

// page.js
import { renderUI } from "./uiFactory.js";
renderUI("button", "Save");
renderUI("link", "Go");
```

#### Why this works
- One place decides what to create
- No duplicated logic
- Easy to extend
- Clean separation of responsibility

Only after recognizing this recurring solution did we name it: **Factory Pattern**

---

## Factory Pattern in React

Based on the definition of the Factory Pattern, many people assume that reusable components automatically represent a factory pattern. However, not all reusable components are factories.

**Why?**

- Reusable Component = something that is created
- Factory Pattern = something that decides what to create

That decision part is the key.

#### Normal Reusable Component (❌ Not Factory)

```jsx
function Button({ label }) {
  return <button>{label}</button>;
}
```

#### What is this doing?

- Always creates the same thing
- No decision
- No branching

#### Why this is NOT Factory Pattern

- No “choice”
- No creation logic
- Just rendering

Here is a button. Use it wherever you want.

This is **reusability**, not **factory**.

---

### Factory Pattern in React (✅ Factory)

```jsx 
function ButtonFactory(type, props) {
  if (type === "primary") return <PrimaryButton {...props} />;
  if (type === "secondary") return <SecondaryButton {...props} />;
}
```
#### What is this doing?

- Making a decision
- Choosing which component to create
- Centralizing that decision

“Tell me what you need, I’ll decide what to give you.”

That’s a factory.

---

### When NOT to use Factory Pattern in React

- Only one component
- No variations
- No conditional creation

---

## Final Summary

- Design patterns come from real problems
- Anti-patterns show us what not to do
- Observer = automatic updates without tight coupling
- Factory = centralized creation logic and decision making.

Learn patterns by **recognizing problems**, not memorizing names.
