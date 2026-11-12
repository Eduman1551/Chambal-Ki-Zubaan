import { DORIA_COLORS } from '../logic/config'

/**
 * Easter egg: type "kota" on the title screen and bands of Kota Doria colours
 * (with the saree's tiny "khat" checks) sweep across the screen.
 */
export default function DoriaWave() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden" aria-hidden>
      {DORIA_COLORS.map((color, i) => (
        <div
          key={color}
          className="absolute inset-y-[-10%] left-0 w-[45%]"
          style={{
            backgroundColor: color,
            // fine white grid = the square "khat" weave of Kota Doria
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.35) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.35) 2px, transparent 2px)',
            backgroundSize: '18px 18px',
            opacity: 0.9,
            transform: 'translateX(-110%)',
            animation: `doria-sweep 1.5s cubic-bezier(0.45, 0, 0.55, 1) ${i * 0.13}s forwards`,
          }}
        />
      ))}
      <p
        className="font-display absolute inset-x-0 top-[18%] text-center text-4xl font-extrabold text-white drop-shadow-[0_3px_0_rgba(20,80,107,0.7)] md:text-6xl"
        style={{ animation: 'doria-label 2.2s ease forwards' }}
      >
        Kota Doria! 🧵
      </p>
    </div>
  )
}
