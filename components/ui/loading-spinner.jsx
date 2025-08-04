import { Loader2 } from "lucide-react"


function LoadingScreen({ message = "Carregando..." }) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg font-medium text-foreground">{message}</p>
      </div>
    </div>
  )
}

export { LoadingScreen }