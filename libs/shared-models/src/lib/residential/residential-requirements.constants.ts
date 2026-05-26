import { HOME_ENVIRONMENT_REQUIREMENTS } from "../compliance/home-environment";

export const RESIDENTIAL_REQUIREMENT_SECTIONS = [
  {
    key: 'HOME_ENVIRONMENT',
    citation: 'TAC §565.23(b)',
    title: 'Home & Environment',
    route: ['overview'],
    sortOrder: 1,
  },

  {
    key: 'HOT_WATER',
    citation: 'TAC §565.23(c)',
    title: 'Hot Water Safety',
    route: ['hot-water'],
    sortOrder: 2
  },

  {
    key: 'LIFE_SAFETY',
    citation: 'TAC §565.23(d)',
    title: 'Life Safety',
    route: ['life-safety'],
    sortOrder: 3
  },

  {
    key: 'FIRE_DRILLS',
    citation: 'TAC §565.23(e)',
    title: 'Fire Drills',
    route: ['emergency', 'fire-drills'],
    sortOrder: 4
  },

  {
    key: 'EMERGENCY_PLANS',
    citation: 'TAC §565.23(f)',
    title: 'Emergency Plans',
    route: ['emergency', 'plans'],
    sortOrder: 5,
  },

  {
    key: 'INFECTION_CONTROL',
    citation: 'TAC §565.23(g)',
    title: 'Infection Control',
    route: ['infection-control'],
    sortOrder: 6,
  },

  {
    key: 'MEDICATION',
    citation: 'TAC §565.23(h)',
    title: 'Medication',
    route: ['medication'],
    sortOrder: 7
  },

  {
    key: 'FOUR_PERSON',
    citation: 'TAC §565.23(i)',
    title: 'Four-Person Residence',
    route: ['four-person'],
    sortOrder: 8
  },
] as const;

export const RESIDENTIAL_REQUIREMENTS = [
  ...HOME_ENVIRONMENT_REQUIREMENTS,
];