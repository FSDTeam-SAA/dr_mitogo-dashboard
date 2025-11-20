interface HeaderProps {
  title: string
  description: string
}

export default function Header({ title, description }: HeaderProps) {
  return (
    <div className="border-b border-border bg-white/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="px-8 py-6">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  )
}
