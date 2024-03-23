import { Addic7edSubtitle, ExternalSubtitle, InternalSubtitle, Subtitle } from './type';


export const isExternalSubtitle = (
  subtitle: Subtitle
): subtitle is ExternalSubtitle => {
  return subtitle.origin === 'External';
};

export const isInternalSubtitle = (
  subtitle: Subtitle
): subtitle is InternalSubtitle => {
  return subtitle.origin === 'Internal';
};

export const isAddic7edSubtitle = (
  subtitle: Subtitle
): subtitle is Addic7edSubtitle => {
  return subtitle.origin === 'Addic7ed';
};
