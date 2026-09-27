import type { ComponentType } from 'react'
import type { IllustrationId } from '../content/site'
import { AiFace } from './AiFace'
import { CitySurveillance } from './CitySurveillance'
import { ClimateCurve } from './ClimateCurve'
import { DnaEdit } from './DnaEdit'
import type { IllustrationProps } from './IllustrationSvg'

export const illustrations: Record<IllustrationId, ComponentType<IllustrationProps>> = {
  ai: AiFace,
  bio: DnaEdit,
  climate: ClimateCurve,
  society: CitySurveillance,
}
