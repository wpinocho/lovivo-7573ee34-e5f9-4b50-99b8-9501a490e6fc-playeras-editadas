import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "@/contexts/CartContext"
import { useCheckout } from "@/hooks/useCheckout"
import { useSettings } from "@/contexts/SettingsContext"
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const { state, updateQuantity, removeItem, clearCart } = useCart()
  const navigate = useNavigate()
  const { checkout, isLoading: isCreatingOrder } = useCheckout()
  const { currencyCode } = useSettings()

  const handleCreateCheckout = async () => {
    try {
      console.log('Starting checkout process...')

      // Snapshot del carrito antes de crear la orden (el hook limpia el carrito)
      try {
        sessionStorage.setItem('checkout_cart', JSON.stringify({ items: state.items, total: state.total }))
      } catch {}

      console.log('Calling checkout function...')
      const order = await checkout({
        currencyCode: currencyCode
      })

      console.log('Order created:', order)
      console.log('About to save order to sessionStorage...')
      
      // Guardar orden en sessionStorage para la página de checkout
      try {
        sessionStorage.setItem('checkout_order', JSON.stringify(order))
        sessionStorage.setItem('checkout_order_id', String(order.order_id))
        console.log('Order saved to sessionStorage')
      } catch (e) {
        console.error('Error saving to sessionStorage:', e)
      }

      console.log('Closing sidebar...')
      onClose()
      
      console.log('Navigating to /checkout...')
      navigate('/checkout')
      console.log('Navigation call completed')
    } catch (error) {
      console.error('Error in handleCreateCheckout:', error)
    }
  }

  const finalTotal = state.total

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-96 p-0" aria-describedby="cart-description">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl font-bold">Carrito de Compras</SheetTitle>
            </div>
            <div id="cart-description" className="sr-only">
              Revisa y modifica los productos en tu carrito de compras
            </div>
          </SheetHeader>

          {state.items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="bg-muted/50 rounded-full p-6 inline-block mb-4">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Tu carrito está vacío
                </h3>
                <p className="text-muted-foreground mb-6">
                  Agrega productos para comenzar tu compra
                </p>
                <Button onClick={onClose} className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  Seguir Comprando
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {state.items.map((item) => (
                  <Card key={item.key} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                          {item.product.images && item.product.images.length > 0 || item.variant?.image ? (
                            <img
                              src={item.variant?.image || item.product.images![0]}
                              alt={item.product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                              Sin imagen
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-foreground line-clamp-2 mb-1">
                            {item.product.title}{item.variant?.title ? ` - ${item.variant.title}` : ''}
                          </h4>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-1 border-2 rounded-md">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.key, item.quantity - 1)}
                                className="h-8 w-8 hover:bg-accent/10"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="font-semibold px-3 text-sm min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.key, item.quantity + 1)}
                                className="h-8 w-8 hover:bg-accent/10"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-bold text-base">
                                ${(((item.variant?.price ?? item.product.price) || 0) * item.quantity).toFixed(2)}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.key)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 p-0 h-auto mt-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t-2 p-6 bg-muted/30">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between font-bold text-2xl">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base py-6 rounded-md" 
                  size="lg" 
                  onClick={handleCreateCheckout} 
                  disabled={isCreatingOrder}
                >
                  {isCreatingOrder ? 'Procesando...' : 'Finalizar Compra'}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}