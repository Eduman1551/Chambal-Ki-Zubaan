// story.ts: the river's voice. Narration, mascot lines, choices and pledges.
// This file is STORY text only. Anything that sounds like a fact belongs in facts.ts.

import type { FestivalChoice } from '../logic/meter'

export const TITLE = {
  name: 'Chambal Ki Zubaan',
  hindi: 'चंबल की ज़ुबान',
  tagline: 'Let the river speak.',
  note: 'Awareness story, not live data.',
  start: 'Start the journey',
}

/** The 5 stops, in downstream order. */
export const STOPS = [
  { id: 'stop-1', short: 'Source', name: 'Source of the story' },
  { id: 'stop-2', short: 'Barrage', name: 'Kota Barrage & riverfront' },
  { id: 'stop-3', short: 'Drains', name: 'The drains' },
  { id: 'stop-4', short: 'Festival', name: 'Festival time' },
  { id: 'stop-5', short: 'Sanctuary', name: 'The sanctuary' },
] as const

export const STOP1 = {
  kicker: 'Stop 1 · Source of the story',
  title: 'Namaste! I am the Chambal.',
  body: [
    'I have been flowing past Kota for longer than anyone can remember. I have seen forts rise, festivals glow and children learn to swim.',
    'Today I want to tell you my story myself. And here is the fun part: you decide how it ends.',
  ],
  guruIntro:
    'And this long-nosed gentleman is Ghariyal Guru, my oldest friend. He will keep an eye on things. Mostly one eye. He naps a lot.',
  cta: 'Flow downstream',
}

export type ItemKind = 'bottle' | 'offering' | 'coconut'

export interface FloatingItem {
  id: string
  kind: ItemKind
  label: string
  /** Position inside the water area, in percent. */
  x: number
  y: number
  /** What Ghariyal Guru says when it is collected. */
  line: string
}

export const STOP2 = {
  kicker: 'Stop 2 · Kota Barrage & riverfront',
  title: 'Something is tickling my waves…',
  body: 'Welcome to the riverfront! So many people come to say hello. But a few things got left behind in my water. Tap them and pop them in the basket for me?',
  hint: 'Tap each floating item to collect it',
  done: 'Aha, that feels so much better! Thank you, dost.',
  basket: 'Basket',
  cta: 'Keep flowing',
  items: [
    { id: 'bottle-1', kind: 'bottle', label: 'Plastic bottle', x: 9, y: 18, line: 'One bottle less. It can be recycled now!' },
    { id: 'offering-1', kind: 'offering', label: 'Flower offering in a plastic bag', x: 27, y: 52, line: 'The flowers are lovely. The plastic bag, not so much.' },
    { id: 'coconut-1', kind: 'coconut', label: 'Coconut', x: 44, y: 16, line: 'A coconut! That one belongs in a compost pit.' },
    { id: 'bottle-2', kind: 'bottle', label: 'Plastic bottle', x: 60, y: 56, line: 'Got it! My snout thanks you.' },
    { id: 'offering-2', kind: 'offering', label: 'Flower offering in a plastic bag', x: 76, y: 20, line: 'Devotion is beautiful. Next time, skip the bag!' },
    { id: 'coconut-2', kind: 'coconut', label: 'Coconut', x: 88, y: 58, line: 'Last one? You are on a roll!' },
  ] satisfies FloatingItem[],
}

export const STOP3 = {
  kicker: 'Stop 3 · The drains',
  title: 'Uh oh. This part is a bit murky.',
  body: 'As the city grows, its used water has to go somewhere. When it reaches me without being cleaned first, I turn cloudy and tired.',
  sliderLabel: 'Treatment valve',
  sliderLow: 'Untreated',
  sliderHigh: 'Fully treated',
  hint: 'Slide the valve and watch my water',
  levels: [
    'Cough, cough. It is all coming straight in.',
    'A little better. Keep turning!',
    'Now we are talking. I can see my own pebbles!',
    'Ahh. Treated water. That is the good stuff.',
  ],
  cta: 'Flow on',
}

export interface FestivalOption {
  id: FestivalChoice
  title: string
  detail: string
  /** The river's reply. Never judgemental. */
  consequence: string
}

export const STOP4 = {
  kicker: 'Stop 4 · Festival time',
  title: 'Dhol, diyas and so much joy!',
  body: 'I love festivals. The whole city comes to my banks. This year, the celebration is in your hands. How shall we do the immersion and offerings?',
  hint: 'Pick one. You can change your mind.',
  options: [
    {
      id: 'eco',
      title: 'Clay idol, tank immersion',
      detail: 'A natural clay idol immersed in a tank or tub. Flowers go to compost.',
      consequence:
        'Wah! The clay goes back to the soil, the flowers feed a garden, and I get to enjoy the music with clear water.',
    },
    {
      id: 'partial',
      title: 'River immersion, plastic goes home',
      detail: 'Immerse in the river, but carry the bags and decorations back.',
      consequence:
        'Thank you for taking the plastic home, that truly helps. The paint still lingers with me a while, so maybe a tank next year?',
    },
    {
      id: 'dump',
      title: 'Everything into the river',
      detail: 'Idol, flowers, bags and decorations all go in together.',
      consequence:
        'I know this comes from love, and I feel it. But these things stay with me long after the festival. Want to try another way?',
    },
  ] satisfies FestivalOption[],
  cta: 'On to the sanctuary',
}

export const STOP5 = {
  kicker: 'Stop 5 · The sanctuary',
  title: 'Welcome to my quiet stretch.',
  body: 'Here the city noise fades. This is where gharials bask, birds fish and turtles sunbathe. What they find here depends on everything upstream. Take a look at what your journey brought them.',
  sceneLabels: {
    best: 'Clear, lively water. The whole family came out to play!',
    okay: 'Getting clearer. A few friends are coming back.',
    help: 'Dull and quiet today. The wildlife is waiting for cleaner water.',
  },
  loading: 'Filling the sanctuary with water…',
  cta: 'See how my story ends',
}

export const ENDING = {
  kicker: 'The ending you wrote',
  meterLabel: 'Final River Health',
  pledgeTitle: 'Make your River Pledge',
  pledgeIntro: 'A story is nice. A habit is better. Pick 3 small things you will really do.',
  nameLabel: 'Your name (optional)',
  namePlaceholder: 'Type your name',
  download: 'Download my pledge card',
  downloading: 'Making your card…',
  playAgain: 'Play again',
  cardHeading: 'My River Pledge',
  cardPromise: 'promises the Chambal to',
}

/** Simple, real-life actions anyone can take. */
export const PLEDGES = [
  { id: 'no-plastic-offerings', text: 'Offer flowers without plastic bags' },
  { id: 'cloth-bag', text: 'Carry a cloth bag when I go out' },
  { id: 'report-dumping', text: 'Report waste dumping near the river' },
  { id: 'join-cleanup', text: 'Join a riverfront clean-up' },
  { id: 'clay-idol', text: 'Choose clay idols and tank immersion' },
  { id: 'no-litter', text: 'Never throw litter in or near water' },
  { id: 'own-bottle', text: 'Carry my own water bottle' },
  { id: 'tell-friends', text: "Tell 3 friends the river's story" },
] as const

/** Ghariyal Guru's lines. */
export const GURU = {
  name: 'Ghariyal Guru',
  byMood: {
    happy: 'Snap snap! This water feels amazing.',
    okay: 'Hmm, not bad. Keep going, dost.',
    worried: 'My snout is a bit itchy in this water…',
  },
  stopGreetings: [
    'Psst. Scroll down, the river has a story.',
    'Namaste! I am Ghariyal Guru. Yes, the nose is real.',
    'Tap the floating stuff. My arms are too short.',
    'Try that orange valve. Slowly, slowly.',
    'Festival time! I brought my dancing tail.',
    'Home sweet home. Shhh, the turtles are napping.',
    'What a journey! Now make it count.',
  ],
  spin: [
    'Wheee! Okay okay, I am dizzy now. Happy?',
    'Five pokes! You have unlocked: one free spin.',
    'I am a gharial, not a fidget spinner!',
  ],
  fish: 'Look, look! The fish came to say hello!',
  valveOpen: 'Ahh, clean water. My favourite flavour.',
  allCollected: 'Basket full! You are officially my favourite human.',
  festival: {
    eco: 'Eco-friendly and festive. Double celebration!',
    partial: 'Good step! Small steps make big rivers.',
    dump: 'No worries, dost. You can always pick again.',
  },
}

export const CREDITS = {
  heading: 'Credits',
  course: 'Engineering for Social Empowerment',
  // TODO(team): replace the placeholders with your real names.
  team: ['Team Member 1', 'Team Member 2', 'Team Member 3', 'Team Member 4'],
  thanks: 'Made with love for the Chambal and the people of Kota.',
}
