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
import { Slide12b_RvpPortal } from './Slide12b_RvpPortal';
import { Slide12_BridgeCompetencies } from './Slide12_BridgeCompetencies';
import { Slide13_TeamActivity } from './Slide13_TeamActivity';
import { Slide14_SubjectIntegration } from './Slide14_SubjectIntegration';
import { Slide15b_GeographyPdf } from './Slide15b_GeographyPdf';
import { Slide15c_CurriculumBridgeChallenge } from './Slide15c_CurriculumBridgeChallenge';
import { Slide17_LeadershipFeedback } from './Slide17_LeadershipFeedback';
import { Slide18_ActionPlanMatrix } from './Slide18_ActionPlanMatrix';
import { Slide19_Poll2Evaluation } from './Slide19_Poll2Evaluation';
import { Slide20_Conclusion } from './Slide20_Conclusion';

export interface SlideConfig extends SlideData {
  component: React.ComponentType<{ onNext?: () => void }>;
}

export const SLIDES_REGISTRY: SlideConfig[] = [
  { id: 's0', number: 0, title: 'Úvodní strana: Revize ŠVP GML', chapter: 'Úvod & Naladění', component: Slide00_Title },
  { id: 's1b', number: 1, title: 'Harmonogram setkání', chapter: 'Úvod & Naladění', component: Slide01b_Schedule },
  { id: 's1', number: 2, title: 'Představení lektorky', chapter: 'Úvod & Naladění', component: Slide01_Presenter },
  { id: 's2', number: 3, title: 'Rychlé seznámení s publikem', chapter: 'Úvod & Naladění', component: Slide02_Icebreaker },
  { id: 's3', number: 4, title: 'Záplava pojmů nového RVP', chapter: 'Kontext & Vstupní reflexe', component: Slide03_RvpBuzzwords },
  { id: 's4', number: 5, title: 'Vstupní živá anketa (1/2)', chapter: 'Kontext & Vstupní reflexe', component: Slide04_Poll1 },
  { id: 's5', number: 6, title: 'Přeformátování obav (Reframing)', chapter: 'Vize & Postoj školy', component: Slide05_CanvasReframing },
  { id: 's6', number: 7, title: '4 pilíře pro revizi ŠVP', chapter: 'Vize & Postoj školy', component: Slide06_WhyChange },
  { id: 's7', number: 8, title: 'Společná reflexe: Jaké má být ŠVP?', chapter: 'Vize & Postoj školy', component: Slide07_Reflection },
  { id: 's8', number: 9, title: 'Cílová skupina ŠVP', chapter: 'Práce s nadanými žáky', component: Slide08_TargetAudience },
  { id: 's9', number: 10, title: 'Specifikum žáků na GML', chapter: 'Práce s nadanými žáky', component: Slide09_GiftedInfographic },
  { id: 's10', number: 11, title: 'Podpora nadání v ŠVP (Checklist)', chapter: 'Práce s nadanými žáky', component: Slide10_GiftedSupport },
  { id: 's11', number: 12, title: 'Stavební kameny nového kurikula', chapter: 'Struktura nového RVP ZV', component: Slide11_KeyChanges },
  { id: 's12b', number: 13, title: 'Interaktivní portál RVP ZV', chapter: 'Struktura nového RVP ZV', component: Slide12b_RvpPortal },
  { id: 's12', number: 14, title: 'Klíčové kompetence jako most', chapter: 'Kompetence & Týmová práce', component: Slide12_BridgeCompetencies },
  { id: 's13', number: 15, title: 'Klíčové kompetence napříč předměty', chapter: 'Kompetence & Týmová práce', component: Slide13_TeamActivity },
  { id: 's14', number: 16, title: 'Jak smysluplně propojit předměty', chapter: 'Integrace & Porovnání kurikula', component: Slide14_SubjectIntegration },
  { id: 's15b', number: 17, title: 'Kurikulum Geografie: RVP ZV vs. ŠVP 4G', chapter: 'Integrace & Porovnání kurikula', component: Slide15b_GeographyPdf },
  { id: 's15c', number: 18, title: 'Výzva: Propojení modelového ŠVP a 4G', chapter: 'Integrace & Porovnání kurikula', component: Slide15c_CurriculumBridgeChallenge },
  { id: 's17', number: 19, title: 'Zpětná vazba pro vedení školy (QR)', chapter: 'Zpětná vazba & Akční plán', component: Slide17_LeadershipFeedback },
  { id: 's18', number: 20, title: 'Můj osobní akční krok pro září', chapter: 'Zpětná vazba & Akční plán', component: Slide18_ActionPlanMatrix },
  { id: 's19', number: 21, title: 'Výstupní evaluace (2/2)', chapter: 'Závěr & Výstupní evaluace', component: Slide19_Poll2Evaluation },
  { id: 's20', number: 22, title: 'Závěr a poděkování', chapter: 'Závěr & Výstupní evaluace', component: Slide20_Conclusion },
];
