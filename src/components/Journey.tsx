import { STOPS } from '../content/story'
import Scene, { NextButton, StoryCard } from './Scene'
import { HillsScenery } from './river/Scenery'
import { Clouds } from './river/Sky'
import Stop1Source from './stops/Stop1Source'
import Stop2Barrage from './stops/Stop2Barrage'

/** Temporary page for stops that are not built yet. */
function ComingSoon({ n }: { n: number }) {
  const stop = STOPS[n - 1]
  return (
    <Scene
      id={stop.id}
      stop={n}
      label={stop.name}
      sky="linear-gradient(#BFE6EE, #FFF3D6)"
      scenery={
        <>
          <Clouds />
          <HillsScenery />
        </>
      }
    >
      <StoryCard kicker={`Stop ${n}`} title={stop.name}>
        <p>Coming up…</p>
        {n < STOPS.length && <NextButton to={STOPS[n].id}>Flow on</NextButton>}
      </StoryCard>
    </Scene>
  )
}

/** The five stops, in downstream order. */
export default function Journey() {
  return (
    <>
      <Stop1Source />
      <Stop2Barrage />
      <ComingSoon n={3} />
      <ComingSoon n={4} />
      <ComingSoon n={5} />
    </>
  )
}
