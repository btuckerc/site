import { GameCapture } from './StarterSelectionCapture'

export default function GrainCapture({ className = '' }) {
  return <GameCapture
    className={`grain-capture ${className}`}
    src="/media/s3-amoled/grain-bounce-off-on-catch-v4.mp4"
    poster="/media/s3-amoled/grain-bounce-off-on-catch-v4-poster.png"
    downloadSrc="/media/s3-amoled/grain-bounce-off-on-catch-v4.gif"
    width={368} height={448}
    title="Grain" label="motion capture"
    alt="Grain gameplay with bounce off, then on, followed by a bubble pop and the score increasing from zero to one."
    caption="Bounce off, then on · simulated taps and movement."
    captureNote="This demo runs the device’s real settings screen and game code on a computer. Each run starts from the same position with the same simulated movement, first with bounce off and then on. The bubble pop and score change come from the game."
  />
}
