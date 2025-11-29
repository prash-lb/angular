import { Section } from '../interface/Place.interface';
import { Voyage } from '../interface/Voyage.interface';
import { TimelineKind, TimelineStep } from '../interface/Timeline.interface';

export function formatNavitiaTime(navitiaDateTime: string): string {
  if (!navitiaDateTime || navitiaDateTime.length < 13) return '';
  const hour = navitiaDateTime.slice(9, 11);
  const minute = navitiaDateTime.slice(11, 13);
  return `${hour}h${minute}`;
}

export function formatDurationSeconds(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 1) return '< 1 min'; // Gestion des durées très courtes
  if (minutes < 60) return `${minutes} min`;

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}


export function inferKindFromSection(section: Section): TimelineKind {
  const anySection = section as any;

  if (section.type === 'waiting') {
    return 'waiting';
  }

  if (
    section.type === 'street_network' ||
    section.type === 'crow_fly' ||
    section.type === 'transfer' || 
    anySection.mode === 'walking' ||
    anySection.transfer_type === 'walking'
  ) {
    // Si c'est un transfert officiel, on peut le distinguer, sinon c'est de la marche
    return section.type === 'transfer' ? 'transfer' : 'walk';
  }

  // Gestion des Transports Publics
  if (section.type === 'public_transport' && section.display_informations) {
    const di = section.display_informations;
    const cm = (di.commercial_mode || '').toLowerCase();
    const pm = (di.physical_mode || '').toLowerCase();
    const net = (di.network || '').toLowerCase();

    if (cm.includes('rer') || net.includes('rer')) return 'rer';
    if (cm.includes('tgv') || cm.includes('ouigo') || cm.includes('inoui') || cm.includes('intercités')) return 'train';
    if (cm.includes('métro') || cm.includes('metro') || pm.includes('metro')) return 'metro';
    if (cm.includes('bus')) return 'bus';
    
    return 'transport';
  }

  return 'other';
}


export function mapSectionToTimelineStep(section: Section): TimelineStep {
  const startTime = formatNavitiaTime(section.departure_date_time);
  const endTime = formatNavitiaTime(section.arrival_date_time);
  const duration = formatDurationSeconds(section.duration);
  
  // Gestion des noms de lieux (parfois null pour 'waiting')
  const fromName = section.from?.name ?? '';
  const toName = section.to?.name ?? '';

  const kind = inferKindFromSection(section);
  const anySection = section as any;

  // cas d'attente
  if (kind === 'waiting') {
    return {
      id: section.id,
      kind,
      label: 'Correspondance',
      from: '', // Souvent vide pour waiting
      to: '',
      startTime,
      endTime,
      duration,
      description: 'Temps d\'attente en gare',
    };
  }

  // cas marche / transfert
  if (kind === 'walk' || kind === 'transfer') {
    return {
      id: section.id,
      kind: 'walk', // On garde 'walk' pour l'UI générique (icône bonhomme)
      label: kind === 'transfer' ? 'Correspondance à pied' : 'Marche',
      from: fromName,
      to: toName,
      startTime,
      endTime,
      duration,
      description: toName ? `Vers ${toName}` : 'Déplacement piéton',
    };
  }

  // cas transport public
  if (section.type === 'public_transport' && section.display_informations) {
    const di = section.display_informations;
    const modeLabel = di.commercial_mode || di.physical_mode || 'Transport';
    const code = di.code ? ` ${di.code}` : '';
    const direction = di.direction ? `Direction ${di.direction}` : '';

    return {
      id: section.id,
      kind, // 'rer', 'train', etc.
      label: `${modeLabel}${code}`,
      from: fromName,
      to: toName,
      startTime,
      endTime,
      duration,
      description: direction,
    };
  }

  // Fallback
  return {
    id: section.id,
    kind: 'other',
    label: '',
    from: fromName,
    to: toName,
    startTime,
    endTime,
    duration,
    description: '',
  };
}

export function buildTimelineStepsFromVoyage(voyage: Voyage): TimelineStep[] {
  const sections = voyage.sections ?? [];
  if (sections.length === 0) return [];

  return sections
    // On enlève les sections de type 'boarding' qui ne sont pas utiles
    .filter(section => section.type !== 'boarding')
    // Mapping des sections vers des étapes de la timeline
    .map(mapSectionToTimelineStep);
}