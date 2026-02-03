import AntiPostCard from './anti-components/AntiPostCard'
import PostCardComponent from './componets/PostCardComponent'

function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-black mb-2">Compound Components</h1>
      </div>

      <div className="w-full max-w-md">
        <AntiPostCard
          post={{
            isOnProfilePage: true,
            id: 1,
            title: "Anti Design Pattern",
            content: "This demonstrates an anti-pattern approach to component composition. Learn why this pattern should be avoided in favor of compound components.",
            user: { id: 1, name: "Amin Tai" }
          }}
        />
      </div>

      <div className="w-full max-w-md mt-10">
        <PostCardComponent
          post={{
            isOnProfilePage: false,
            id: 2,
            title: "Compound Components Pattern",
            content: "The recommended approach using compound components pattern. This provides better composition, flexibility, and separation of concerns for building reusable UI components.",
            user: { id: 2, name: "Amin Tai" }
          }}
        >
          <PostCardComponent.Id />
          <div className='p-6'>
            <PostCardComponent.Title />
            <PostCardComponent.Content />
            <PostCardComponent.Author />
            <PostCardComponent.Actions />
          </div>
        </PostCardComponent>
      </div>
    </div>
  )
}

export default App
