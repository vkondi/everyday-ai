import { ThemeToggle } from "./theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
            Everyday AI
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
} 