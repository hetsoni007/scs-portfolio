// 'off' tier (no WebGL): a static line drawing stands in for the scene, so the
// page is never blank or broken. Pure SVG, no three.js.
import type { SceneKey } from '../routes'

function PhoneDrawing() {
  return (
    <g>
      <rect x="-74" y="-152" width="148" height="304" rx="20" />
      <rect x="-68" y="-146" width="136" height="292" rx="16" className="p-soft" />
      <rect x="-20" y="-136" width="40" height="10" rx="5" />
      {Array.from({ length: 11 }, (_, i) => (
        <line key={i} x1="86" x2={i % 5 === 0 ? 96 : 91} y1={-152 + i * 30.4} y2={-152 + i * 30.4} />
      ))}
      <line x1="86" x2="86" y1="-152" y2="152" />
      <line x1="-120" x2="120" y1="40" y2="40" className="p-scan" />
    </g>
  )
}

function OrbitDrawing() {
  return (
    <g>
      <ellipse cx="0" cy="0" rx="170" ry="60" />
      <ellipse cx="0" cy="0" rx="120" ry="42" className="p-soft" />
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2
        return <rect key={i} x={Math.cos(a) * 170 - 9} y={Math.sin(a) * 60 - 9} width="18" height="18" rx="2" />
      })}
      <circle cx="0" cy="0" r="38" />
    </g>
  )
}

function StackDrawing() {
  return (
    <g>
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M-150 ${-110 + i * 44} L0 ${-150 + i * 44} L150 ${-110 + i * 44} L0 ${-70 + i * 44} Z`} className={i === 2 ? 'p-scan' : ''} />
      ))}
    </g>
  )
}

export function Poster({ scene }: { scene: SceneKey }) {
  const Art = scene === 'services' || scene === 'ai' || scene === 'hire' ? OrbitDrawing : scene === 'devops' || scene === 'calc' ? StackDrawing : PhoneDrawing
  return (
    <div className="stage-fallback" aria-hidden="true">
      <svg className="poster" viewBox="-200 -200 400 400" width="min(38vw, 460px)" height="min(38vw, 460px)" fill="none" stroke="currentColor" strokeWidth="1">
        <Art />
      </svg>
    </div>
  )
}
