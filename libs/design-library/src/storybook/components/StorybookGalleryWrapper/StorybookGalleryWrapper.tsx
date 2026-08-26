import type { ComponentPropsWithRef } from "react";

const galleryThemes = [
  { className: "theme-light", label: "Light" },
  { className: "theme-dark", label: "Dark" },
] as const;

/**
 * Renders every gallery twice, once per theme.
 *
 * §3 requires a gallery to be provable in both themes, and the docs page embeds
 * galleries outside a story — so the `preview.ts` theme decorator never wraps
 * them and the toolbar toggle has no effect here. Doing it in the wrapper is
 * what makes the guarantee real rather than a thing you remember to check.
 *
 * The toolbar still drives the interactive `Example` story, which is a real
 * story and does get the decorator.
 */
export const StorybookGalleryWrapper = ({
  children,
  ...props
}: ComponentPropsWithRef<"div">) => (
  <div className="flex flex-col gap-[3rem]" {...props}>
    {galleryThemes.map(({ className, label }) => (
      <section
        key={className}
        className={`${className} bg-bg-default text-fg-default flex flex-col gap-[2rem] rounded-md p-[1.5rem]`}
      >
        <span className="text-fg-muted font-mono text-label-sm tracking-widest uppercase">
          {label}
        </span>
        {children}
      </section>
    ))}
  </div>
);
