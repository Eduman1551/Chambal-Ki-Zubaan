import { STOPS } from '../content/story'
import Scene, { NextButton, StoryCard } from './Scene'
import { HillsScenery } from './river/Scenery'
import { Clouds } from './river/Sky'

/** The five stops, in downstream order. */
export default function Journey() {
  return (
    <>
      {STOPS.map((stop, i) => (
        <Scene
          key={stop.id}
          id={stop.id}
          stop={i + 1}
          label={stop.name}
          sky="linear-gradient(#BFE6EE, #FFF3D6)"
          scenery={
            <>
              <Clouds />
              <HillsScenery />
            </>
          }
        >
          <StoryCard kicker={`Stop ${i + 1}`} title={stop.name}>
            <p>Coming up…</p>
            {i < STOPS.length - 1 && <NextButton to={STOPS[i + 1].id}>Flow on</NextButton>}
          </StoryCard>
        </Scene>
      ))}
    </>
  )
}
