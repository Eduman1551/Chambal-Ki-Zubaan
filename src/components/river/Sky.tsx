// Small hand-built SVG sky pieces: sun, clouds and birds.
// Motion is pure CSS (see index.css); GSAP adds scroll parallax via data-speed.

interface SunProps {
  className?: string
  color?: string
}

export function Sun({ className = '', color = '#F28C38' }: SunProps) {
  return (
    <svg viewBox="0 0 120 120" className={`absolute ${className}`} aria-hidden data-speed="0.15">
      <circle cx="60" cy="60" r="56" fill={color} opacity="0.18" />
      <circle cx="60" cy="60" r="42" fill={color} opacity="0.3" />
      <circle cx="60" cy="60" r="30" fill={color} />
    </svg>
  )
}

function CloudShape({ className = '', opacity = 0.9 }: { className?: string; opacity?: number }) {
  return (
    <svg viewBox="0 0 160 70" className={className} aria-hidden>
      <g fill="#fff" opacity={opacity}>
        <ellipse cx="50" cy="45" rx="42" ry="20" />
        <ellipse cx="85" cy="32" rx="34" ry="24" />
        <ellipse cx="115" cy="46" rx="36" ry="18" />
      </g>
    </svg>
  )
}

/** A few clouds drifting slowly across the scene. */
export function Clouds({ dim = false }: { dim?: boolean }) {
  const o = dim ? 0.45 : 0.9
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="drift absolute top-[9%] left-0" style={{ animationDuration: '90s', animationDelay: '-20s' }}>
        <CloudShape className="w-36 md:w-52" opacity={o} />
      </div>
      <div className="drift absolute top-[22%] left-0" style={{ animationDuration: '120s', animationDelay: '-75s' }}>
        <CloudShape className="w-24 md:w-36" opacity={o * 0.8} />
      </div>
      <div className="drift absolute top-[4%] left-0" style={{ animationDuration: '150s', animationDelay: '-110s' }}>
        <CloudShape className="w-28 md:w-44" opacity={o * 0.7} />
      </div>
    </div>
  )
}

function Bird({ size = 34, color = '#14506B' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 40 20" width={size} height={size / 2} aria-hidden>
      <path
        className="flap"
        d="M2 12 Q11 0 20 11 Q29 0 38 12"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** A small flock crossing the sky. */
export function Birds({ color }: { color?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="drift absolute top-[16%] left-0" style={{ animationDuration: '38s', animationDelay: '-8s' }}>
        <div className="flex items-end gap-3">
          <Bird color={color} />
          <div className="-translate-y-4">
            <Bird size={26} color={color} />
          </div>
          <div className="translate-y-2">
            <Bird size={22} color={color} />
          </div>
        </div>
      </div>
      <div className="drift absolute top-[30%] left-0" style={{ animationDuration: '52s', animationDelay: '-30s' }}>
        <Bird size={24} color={color} />
      </div>
    </div>
  )
}
