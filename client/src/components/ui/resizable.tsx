import * as React from "react"
import { cn } from "@/lib/utils"

interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultWidth?: number
  defaultCollapsed?: boolean
  minWidth?: number
  maxWidth?: number
  collapsedWidth?: number
  direction?: "horizontal" | "vertical"
  onWidthChange?: (width: number) => void
}

const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
  ({
    className,
    defaultWidth = 280,
    defaultCollapsed = false,
    minWidth = 200,
    maxWidth = 500,
    collapsedWidth = 0,
    direction = "horizontal",
    onWidthChange,
    children,
    ...props
  }, ref) => {
    const [width, setWidth] = React.useState(defaultCollapsed ? collapsedWidth : defaultWidth)
    const [isDragging, setIsDragging] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)
    
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(true)
    }
    
    const handleMouseUp = () => {
      setIsDragging(false)
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      
      if (direction === "horizontal") {
        const currentWidth = e.clientX - (containerRef.current?.getBoundingClientRect().left || 0)
        const newWidth = Math.max(
          minWidth,
          Math.min(maxWidth, currentWidth)
        )
        
        setWidth(newWidth)
        onWidthChange?.(newWidth)
      }
    }
    
    React.useEffect(() => {
      if (isDragging) {
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)
      }
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }, [isDragging])
    
    return (
      <div 
        ref={ref} 
        className={cn(
          "relative flex",
          direction === "horizontal" ? "h-full" : "w-full",
          className
        )}
        style={{ 
          width: direction === "horizontal" ? `${width}px` : "100%",
          height: direction === "vertical" ? `${width}px` : "100%"
        }}
        {...props}
      >
        <div ref={containerRef} className="grow overflow-auto">
          {children}
        </div>
        <div 
          className={cn(
            "absolute cursor-col-resize z-10",
            direction === "horizontal" 
              ? "right-0 h-full w-1.5 transform translate-x-1/2 hover:bg-primary/50 active:bg-primary/70" 
              : "bottom-0 w-full h-1.5 transform translate-y-1/2 hover:bg-primary/50 active:bg-primary/70"
          )}
          onMouseDown={handleMouseDown}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    )
  }
)

ResizablePanel.displayName = "ResizablePanel"

export { ResizablePanel } 