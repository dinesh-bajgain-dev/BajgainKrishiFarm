import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import { Button, type buttonVariants } from "@/components/ui/button";

type LinkButtonProps = Omit<ComponentProps<typeof Link>, "children"> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    children: ReactNode;
  };

/** Button styled as a Next.js Link — Base UI's Button defaults to expecting a
 * native <button> in `render`, so this bakes in `nativeButton={false}` for the
 * common "styled link" case instead of repeating it at every call site. */
export function LinkButton({
  variant,
  size,
  className,
  children,
  ...linkProps
}: LinkButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      nativeButton={false}
      render={<Link {...linkProps} />}
    >
      {children}
    </Button>
  );
}
