import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { type Collection } from '@/lib/supabase'
import { ArrowRight } from 'lucide-react'

interface CollectionCardProps {
  collection: Collection
  onViewProducts: (collectionId: string) => void
}

export const CollectionCard = ({ collection, onViewProducts }: CollectionCardProps) => {
  return (
    <Card className="group bg-card border hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => onViewProducts(collection.id)}
    >
      <CardContent className="p-0">
        <div className="aspect-[4/3] bg-muted overflow-hidden relative">
          {collection.image ? (
            <img 
              src={collection.image} 
              alt={collection.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              Sin imagen
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Featured badge */}
          {collection.featured && (
            <div className="absolute top-3 right-3">
              <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Destacada
              </span>
            </div>
          )}
        </div>
        
        <div className="p-5">
          <h3 className="text-foreground font-bold text-xl mb-2 line-clamp-1 group-hover:text-accent transition-colors">
            {collection.name}
          </h3>
          
          {collection.description && (
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {collection.description}
            </p>
          )}
          
          <Button 
            variant="outline" 
            className="w-full border-2 font-semibold group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-all"
            onClick={(e) => {
              e.stopPropagation()
              onViewProducts(collection.id)
            }}
          >
            Ver Productos
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}