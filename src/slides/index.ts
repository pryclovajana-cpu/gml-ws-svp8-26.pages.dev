import React from 'react';
import { SlideData } from '../types';

import { Slide00_Title } from './Slide00_Title';
import { Slide01b_Schedule } from './Slide01b_Schedule';
import { Slide01_Presenter } from './Slide01_Presenter';
import { Slide02_Icebreaker } from './Slide02_Icebreaker';
import { Slide03_RvpBuzzwords } from './Slide03_RvpBuzzwords';
import { Slide04_Poll1 } from './Slide04_Poll1';
import { Slide05_CanvasReframing } from './Slide05_CanvasReframing';
import { Slide06_WhyChange } from './Slide06_WhyChange';
import { Slide07_Reflection } from './Slide07_Reflection';
import { Slide08_TargetAudience } from './Slide08_TargetAudience';
import { Slide09_GiftedInfographic } from './Slide09_GiftedInfographic';
import { Slide10_GiftedSupport } from './Slide10_GiftedSupport';
import { Slide11_KeyChanges } from './Slide11_KeyChanges';
import { Slide12_BridgeCompetencies } from './Slide12_BridgeCompetencies';
import { Slide12b_RvpPortal } from './Slide12b_RvpPortal';
import { Slide13_TeamActivity } from './Slide13_TeamActivity';
import { Slide14_SubjectIntegration } from './Slide14_SubjectIntegration';
import { Slide15_PeerMentoring } from './Slide15_PeerMentoring';
import { Slide16_DemandsAccordion } from './Slide16_DemandsAccordion';
import { Slide17_LeadershipFeedback } from './Slide17_LeadershipFeedback';
import { Slide18_ActionPlanMatrix } from './Slide18_ActionPlanMatrix';
import { Slide19_Poll2Evaluation } from './Slide19_Poll2Evaluation';
import { Slide20_Conclusion } from './Slide20_Conclusion';

export interface SlideConfig extends SlideData {
  component: React.ComponentType<{ onNext?: () => void }>;
}

export const SLIDES_REGISTRY: SlideConfig[] = [
  { id: 's0', number: 0, title: 'Úvodní strana', chapter: 'Úvod', component: Slide00_Title },
  { id: 's1b', number: 1, title: 'Harmonogram workshopu', chapter: 'Harmonogram', component: Slide01b_Schedule },
  { id: 's1', number: 2, title: 'Představení lektorky', chapter: 'Úvod', component: Slide01_Presenter },
  { id: 's2', number: 3, title: 'Rychlé seznámení s publikem', chapter: 'Úvod', component: Slide02_Icebreaker },
  { id: 's3', number: 4, title: 'Záplava pojmů nového RVP', chapter: 'RVP & ŠVP 8G', component: Slide03_RvpBuzzwords },
  { id: 's4', number: 5, title: 'První živá anketa', chapter: 'Anketa 1', component: Slide04_Poll1 },
  { id: 's5', number: 6, title: 'Přeformátování obav', chapter: 'Reframing', component: Slide05_CanvasReframing },
  { id: 's6', number: 7, title: 'Proč je změna nutná?', chapter: 'Argumentace', component: Slide06_WhyChange },
  { id: 's7', number: 8, title: 'Reflexe: Jaké by mělo ŠVP být?', chapter: 'Reflexe', component: Slide07_Reflection },
  { id: 's8', number: 9, title: 'Cílová skupina ŠVP', chapter: 'Cíle', component: Slide08_TargetAudience },
  { id: 's9', number: 10, title: 'Specifika žáků 8G (Metafora)', chapter: 'Nadaní žáci', component: Slide09_GiftedInfographic },
  { id: 's10', number: 11, title: 'Podpora nadání v ŠVP', chapter: 'Nadaní žáci', component: Slide10_GiftedSupport },
  { id: 's11', number: 12, title: 'Klíčové změny v RVP', chapter: 'Stavební kameny', component: Slide11_KeyChanges },
  { id: 's12', number: 13, title: 'Klíčové kompetence jako most', chapter: 'Kompetence', component: Slide12_BridgeCompetencies },
  { id: 's12b', number: 14, title: 'Prohlédnout RVP (Portál)', chapter: 'Portál RVP', component: Slide12b_RvpPortal },
  { id: 's13', number: 15, title: 'Týmová aktivita (Timer)', chapter: 'Workshop', component: Slide13_TeamActivity },
  { id: 's14', number: 16, title: 'Integrace předmětů', chapter: 'Synergia', component: Slide14_SubjectIntegration },
  { id: 's15', number: 17, title: 'Podpora přechodu mezi stupni', chapter: 'Peer-mentoring', component: Slide15_PeerMentoring },
  { id: 's16', number: 18, title: 'Nároky, diferenciace a zodpovědnost', chapter: 'Diskuse', component: Slide16_DemandsAccordion },
  { id: 's17', number: 19, title: 'Zpětná vazba pro vedení', chapter: 'Vedení školy', component: Slide17_LeadershipFeedback },
  { id: 's18', number: 20, title: 'Akční plán – další kroky', chapter: 'Akční plán', component: Slide18_ActionPlanMatrix },
  { id: 's19', number: 21, title: 'Výstupní evaluace', chapter: 'Evaluace 2', component: Slide19_Poll2Evaluation },
  { id: 's20', number: 22, title: 'Závěr a poděkování', chapter: 'Závěr', component: Slide20_Conclusion },
];
