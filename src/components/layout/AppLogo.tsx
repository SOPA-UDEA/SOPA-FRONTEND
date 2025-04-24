// src/components/AppLogo.tsx (or your preferred location)
import Link from "next/link";
import { twMerge } from "tailwind-merge";

// Define the SVG icon as a separate component for clarity
const SopaIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24" // Standard viewBox for easy sizing
    fill="none"
    stroke="currentColor" // Inherit color from parent
    strokeWidth="1.5" // Slightly thinner lines can look cleaner
    strokeLinecap="round"
    strokeLinejoin="round"
    className={twMerge("w-6 h-6", className)} // Default size, overridable
    {...props}>
    {/* Outer circle of the magnifying glass */}
    <circle cx="11" cy="11" r="8"></circle>
    {/* Handle of the magnifying glass */}
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    {/* Inner circles suggesting "depth" */}
    <circle cx="11" cy="11" r="5" strokeWidth="1"></circle>
    <circle cx="11" cy="11" r="2" strokeWidth="0.5"></circle>
  </svg>
);

interface IAppLogoProps {
  /** Control the size of the icon using Tailwind height/width classes (e.g., "h-8 w-8") */
  iconClassName?: string;
  /** Hide the text, show only the icon */
  isIconOnly?: boolean;
  /** Additional classes for the main Link element */
  className?: string;
  /** Font size class for the text (e.g., "text-3xl") */
  textSizeClassName?: string;
}

const AppLogo = ({
  iconClassName,
  isIconOnly,
  className,
  textSizeClassName = "text-2xl", // Default text size
}: IAppLogoProps) => {
  return (
    <Link
      href="/"
      className={twMerge(
        "inline-flex items-center gap-2 group", // Add 'group' for potential hover effects
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded", // Accessibility
        className
      )}
      aria-label={isIconOnly ? "Sopa Home" : undefined} // Better accessibility when icon only
    >
      <SopaIcon
        className={twMerge(
          "transition-transform duration-200 ease-in-out group-hover:scale-110", // Add subtle hover effect
          iconClassName // Apply custom icon size/styles
        )}
      />
      {!isIconOnly && (
        <span
          className={twMerge(
            textSizeClassName, // Control text size
            "font-extrabold tracking-tight", // Make text bolder and tighter
            // Cool Gradient Text Effect
            "text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
            "dark:from-blue-400 dark:via-purple-400 dark:to-pink-400" // Adjust gradient for dark mode if needed
          )}>
          SOPA
        </span>
      )}
    </Link>
  );
};

export default AppLogo;
