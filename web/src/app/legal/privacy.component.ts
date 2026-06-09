import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LatamCopyService } from '../shared/services/latam-copy.service';
import { IconComponent } from '../shared/components/icon/icon.component';

interface LegalSection {
  es: { h: string; body: string[] };
  en: { h: string; body: string[] };
}

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink, IconComponent],
  styleUrl: './legal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="legal-header">
      <a class="legal-back" routerLink="/"><span aria-hidden="true">←</span> {{ lang() === 'es' ? 'Volver al inicio' : 'Back to home' }}</a>
      <button type="button" class="legal-lang" (click)="toggleLang()">
        <app-icon name="globe" /><span>{{ lang() === 'es' ? 'ES' : 'EN' }}</span>
      </button>
    </header>
    <main class="legal-main">
      <h1>{{ lang() === 'es' ? 'Política de Privacidad' : 'Privacy Policy' }}</h1>
      <p class="legal-updated">{{ lang() === 'es' ? 'Última actualización: junio de 2026' : 'Last updated: June 2026' }}</p>
      @for (s of sections; track s) {
        <section>
          <h2>{{ lang() === 'es' ? s.es.h : s.en.h }}</h2>
          @for (p of lang() === 'es' ? s.es.body : s.en.body; track p) {
            <p>{{ p }}</p>
          }
        </section>
      }
    </main>
  `,
})
export class PrivacyComponent {
  private copy = inject(LatamCopyService);
  readonly lang = this.copy.currentLang;

  toggleLang(): void {
    void this.copy.toggle();
  }

  readonly sections: LegalSection[] = [
    {
      es: {
        h: '1. Responsable del tratamiento',
        body: [
          'LATAM Tech Talent Network es responsable del tratamiento de los datos personales que nos proporcionas a través del sitio. Esta política explica qué datos recopilamos, con qué fines y cuáles son tus derechos.',
        ],
      },
      en: {
        h: '1. Data controller',
        body: [
          'LATAM Tech Talent Network is responsible for the processing of the personal data you provide through the site. This policy explains what data we collect, for what purposes, and what your rights are.',
        ],
      },
    },
    {
      es: {
        h: '2. Datos que recopilamos',
        body: [
          'De candidatos: nombre, correo, teléfono, ubicación, perfil profesional (rol, stack, experiencia, nivel de inglés, expectativa salarial, disponibilidad), enlace de LinkedIn y CV.',
          'De empresas: nombre de contacto, empresa, correo, rol buscado y detalles de la solicitud.',
        ],
      },
      en: {
        h: '2. Data we collect',
        body: [
          'From candidates: name, email, phone, location, professional profile (role, stack, experience, English level, salary expectation, availability), LinkedIn link and CV.',
          'From companies: contact name, company, email, requested role and request details.',
        ],
      },
    },
    {
      es: {
        h: '3. Finalidad del tratamiento',
        body: [
          'Usamos tus datos para conectar talento con oportunidades laborales: evaluar perfiles, presentar candidatos (de forma anonimizada hasta que haya interés mutuo) y poner en contacto a empresas y candidatos.',
        ],
      },
      en: {
        h: '3. Purpose of processing',
        body: [
          'We use your data to connect talent with job opportunities: evaluating profiles, presenting candidates (anonymized until there is mutual interest) and putting companies and candidates in contact.',
        ],
      },
    },
    {
      es: {
        h: '4. Base legal',
        body: [
          'El tratamiento se basa en tu consentimiento, otorgado al enviar el formulario correspondiente. Puedes retirarlo en cualquier momento contactándonos.',
        ],
      },
      en: {
        h: '4. Legal basis',
        body: [
          'Processing is based on your consent, given when you submit the relevant form. You may withdraw it at any time by contacting us.',
        ],
      },
    },
    {
      es: {
        h: '5. Con quién compartimos tus datos',
        body: [
          'Los datos de candidatos pueden compartirse con empresas potencialmente interesadas, inicialmente de forma anonimizada. No vendemos tus datos a terceros.',
        ],
      },
      en: {
        h: '5. Who we share your data with',
        body: [
          'Candidate data may be shared with potentially interested companies, initially in an anonymized form. We do not sell your data to third parties.',
        ],
      },
    },
    {
      es: {
        h: '6. Conservación',
        body: [
          'Conservamos tus datos mientras tu perfil esté activo en la red o hasta que solicites su eliminación.',
        ],
      },
      en: {
        h: '6. Retention',
        body: [
          'We keep your data while your profile is active in the network or until you request its deletion.',
        ],
      },
    },
    {
      es: {
        h: '7. Tus derechos',
        body: [
          'Puedes solicitar el acceso, la rectificación, la actualización o la eliminación de tus datos personales, así como retirar tu consentimiento, escribiéndonos desde la sección de Contacto.',
        ],
      },
      en: {
        h: '7. Your rights',
        body: [
          'You can request access, rectification, update or deletion of your personal data, as well as withdraw your consent, by contacting us through the Contact section.',
        ],
      },
    },
    {
      es: {
        h: '8. Seguridad',
        body: [
          'Aplicamos medidas técnicas y organizativas razonables para proteger tus datos frente a accesos no autorizados, pérdida o alteración.',
        ],
      },
      en: {
        h: '8. Security',
        body: [
          'We apply reasonable technical and organizational measures to protect your data against unauthorized access, loss or alteration.',
        ],
      },
    },
    {
      es: {
        h: '9. Cambios en esta política',
        body: [
          'Podemos actualizar esta Política de Privacidad. Publicaremos la versión vigente en esta misma página.',
        ],
      },
      en: {
        h: '9. Changes to this policy',
        body: [
          'We may update this Privacy Policy. The current version will be published on this same page.',
        ],
      },
    },
    {
      es: {
        h: '10. Contacto',
        body: [
          'Para ejercer tus derechos o resolver dudas sobre esta política, puedes escribirnos desde la sección de Contacto del sitio.',
        ],
      },
      en: {
        h: '10. Contact',
        body: [
          'To exercise your rights or resolve questions about this policy, you can reach us through the Contact section of the site.',
        ],
      },
    },
  ];
}
