import { m } from 'framer-motion'
import { IllustrationSvg, type IllustrationProps } from './IllustrationSvg'
import { inkLayer, redStroke, redText } from './shared'
import styles from './Illustration.module.css'

/* A coding strand written out like prose: codon over its amino acid. */
const LINES: [string, string][][] = [
  [
    ['ATG', 'Met'],
    ['CGT', 'Arg'],
    ['TAC', 'Tyr'],
    ['GGA', 'Gly'],
    ['TTC', 'Phe'],
  ],
  [
    ['CAG', 'Gln'],
    ['TGG', 'Trp'],
    ['ACC', 'Thr'],
    ['TTA', 'Leu'],
    ['GCG', 'Ala'],
  ],
  [
    ['GAT', 'Asp'],
    ['CCA', 'Pro'],
    ['TGC', 'Cys'],
    ['AAG', 'Lys'],
    ['TCT', 'Ser'],
  ],
  [
    ['ACG', 'Thr'],
    ['GTA', 'Val'],
    ['CTG', 'Leu'],
    ['AGC', 'Ser'],
    ['TAA', 'Stop'],
  ],
]

const X0 = 104
const DX = 92
const Y0 = 118
const DY = 90
const FS = 26
const CODON_W = FS * 0.6 * 3 // JetBrains Mono advance is 0.6em

/** The edit: line 3, codon 2 (CCA → CGA). */
const EDIT = { line: 2, col: 1, replacement: 'CGA' }

/** Bioethics & Health — gene editing shown literally as text editing. */
export function DnaEdit(props: IllustrationProps) {
  const ex = X0 + EDIT.col * DX
  const ey = Y0 + EDIT.line * DY
  return (
    <IllustrationSvg {...props}>
      <m.g variants={inkLayer} aria-hidden="true">
        <text x={40} y={46} className={styles.mono}>
          5′ → 3′ · CODING STRAND
        </text>
        <line x1={40} x2={520} y1={62} y2={62} className={styles.grid} />
        {LINES.map((line, li) => {
          const y = Y0 + li * DY
          return (
            <g key={li}>
              <text x={40} y={y} className={styles.mono}>
                {String(li * 15 + 1).padStart(3, '0')}
              </text>
              <line x1={X0} x2={520} y1={y + 32} y2={y + 32} className={styles.grid} />
              {line.map(([codon, aa], ci) => (
                <g key={ci}>
                  <text x={X0 + ci * DX} y={y} className={styles.monoInk} fontSize={FS}>
                    {codon}
                  </text>
                  <text x={X0 + ci * DX} y={y + 22} className={styles.mono}>
                    {aa}
                  </text>
                </g>
              ))}
            </g>
          )
        })}
      </m.g>

      <g aria-hidden="true">
        {/* strike the codon */}
        <m.path
          className={styles.red}
          variants={redStroke}
          custom={0}
          d={`M ${ex - 5} ${ey - 7} C ${ex + 12} ${ey - 10}, ${ex + 30} ${ey - 6}, ${ex + CODON_W + 5} ${ey - 10}`}
        />
        {/* insertion caret beneath the line */}
        <m.path
          className={styles.red}
          variants={redStroke}
          custom={1}
          d={`M ${ex + CODON_W / 2 - 8} ${ey + 42} L ${ex + CODON_W / 2} ${ey + 30} L ${ex + CODON_W / 2 + 8} ${ey + 42}`}
        />
        {/* the replacement, written above */}
        <m.text
          variants={redText}
          custom={0}
          x={ex}
          y={ey - 38}
          className={styles.redMono}
          fontSize={22}
        >
          {EDIT.replacement}
        </m.text>
        <m.path
          className={styles.red}
          variants={redStroke}
          custom={2}
          d={`M ${ex + CODON_W + 10} ${ey - 50} q 16 2 24 14`}
        />
      </g>
    </IllustrationSvg>
  )
}
