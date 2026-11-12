import Stop1Source from './stops/Stop1Source'
import Stop2Barrage from './stops/Stop2Barrage'
import Stop3Drains from './stops/Stop3Drains'
import Stop4Festival from './stops/Stop4Festival'
import Stop5Sanctuary from './stops/Stop5Sanctuary'

/** The five stops, in downstream order. */
export default function Journey() {
  return (
    <>
      <Stop1Source />
      <Stop2Barrage />
      <Stop3Drains />
      <Stop4Festival />
      <Stop5Sanctuary />
    </>
  )
}
