"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-secondary group-[.toaster]:text-secondary-foreground group-[.toaster]:border-2 group-[.toaster]:border-primary/20 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground hover:group-[.toast]:bg-primary/90",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground hover:group-[.toast]:bg-muted/90",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
