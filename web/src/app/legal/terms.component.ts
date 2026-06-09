import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LatamCopyService } from '../shared/services/latam-copy.service';
import { IconComponent } from '../shared/components/icon/icon.component';

interface LegalSection {
  es: { h: string; body: string[] };
  en: { h: string; body: string[] };
}

@Component({
  selector: 'app-terms',
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
      <h1>{{ lang() === 'es' ? 'Términos y Condiciones' : 'Terms & Conditions' }}</h1>
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
export class TermsComponent {
  private copy = inject(LatamCopyService);
  readonly lang = this.copy.currentLang;

  toggleLang(): void {
    void this.copy.toggle();
  }

  readonly sections: LegalSection[] = [
    {
      es: {
        h: '1. Aceptación de los términos',
        body: [
          'Al acceder y utilizar LATAM Tech Talent Network (el "Servicio") aceptas estos Términos y Condiciones. Si no estás de acuerdo, por favor no utilices el Servicio.',
        ],
      },
      en: {
        h: '1. Acceptance of terms',
        body: [
          'By accessing and using LATAM Tech Talent Network (the "Service") you agree to these Terms & Conditions. If you do not agree, please do not use the Service.',
        ],
      },
    },
    {
      es: {
        h: '2. Descripción del servicio',
        body: [
          'LATAM Tech Talent Network conecta talento tecnológico y de negocio de Latinoamérica con oportunidades laborales internacionales. Facilitamos el registro de candidatos y la recepción de solicitudes de talento por parte de empresas.',
        ],
      },
      en: {
        h: '2. Description of the service',
        body: [
          'LATAM Tech Talent Network connects technology and business talent from Latin America with international job opportunities. We facilitate candidate registration and the intake of talent requests from companies.',
        ],
      },
    },
    {
      es: {
        h: '3. Registro de candidatos',
        body: [
          'Al registrarte como candidato declaras que la información proporcionada es veraz, actual y propia. Eres responsable de mantenerla actualizada.',
          'Tu perfil podrá presentarse a empresas de forma anonimizada (sin tu nombre ni datos de contacto) hasta que exista un interés mutuo en avanzar.',
        ],
      },
      en: {
        h: '3. Candidate registration',
        body: [
          'By registering as a candidate you confirm that the information provided is truthful, current and your own. You are responsible for keeping it up to date.',
          'Your profile may be presented to companies in an anonymized form (without your name or contact details) until there is mutual interest in moving forward.',
        ],
      },
    },
    {
      es: {
        h: '4. Solicitudes de empresas',
        body: [
          'Las empresas que envían una solicitud de talento declaran estar autorizadas para hacerlo y se comprometen a utilizar la información recibida únicamente con fines de reclutamiento legítimos.',
        ],
      },
      en: {
        h: '4. Company requests',
        body: [
          'Companies submitting a talent request confirm they are authorized to do so and agree to use any information received solely for legitimate recruitment purposes.',
        ],
      },
    },
    {
      es: {
        h: '5. Uso aceptable',
        body: [
          'No está permitido usar el Servicio para fines ilícitos, enviar información falsa, suplantar a terceros, ni intentar acceder a datos de otros usuarios sin autorización.',
        ],
      },
      en: {
        h: '5. Acceptable use',
        body: [
          'You may not use the Service for unlawful purposes, submit false information, impersonate others, or attempt to access other users’ data without authorization.',
        ],
      },
    },
    {
      es: {
        h: '6. Privacidad',
        body: [
          'El tratamiento de tus datos personales se rige por nuestra Política de Privacidad, que forma parte de estos Términos.',
        ],
      },
      en: {
        h: '6. Privacy',
        body: [
          'The processing of your personal data is governed by our Privacy Policy, which forms part of these Terms.',
        ],
      },
    },
    {
      es: {
        h: '7. Propiedad intelectual',
        body: [
          'La marca, el diseño y los contenidos del Servicio son propiedad de LATAM Tech Talent Network y no pueden reproducirse sin autorización.',
        ],
      },
      en: {
        h: '7. Intellectual property',
        body: [
          'The brand, design and content of the Service are property of LATAM Tech Talent Network and may not be reproduced without authorization.',
        ],
      },
    },
    {
      es: {
        h: '8. Limitación de responsabilidad',
        body: [
          'El Servicio se ofrece "tal cual". No garantizamos la obtención de un empleo ni la contratación de un candidato. No nos responsabilizamos por decisiones tomadas por empresas o candidatos.',
        ],
      },
      en: {
        h: '8. Limitation of liability',
        body: [
          'The Service is provided "as is". We do not guarantee employment or the hiring of any candidate. We are not liable for decisions made by companies or candidates.',
        ],
      },
    },
    {
      es: {
        h: '9. Cambios en los términos',
        body: [
          'Podemos actualizar estos Términos en cualquier momento. El uso continuado del Servicio implica la aceptación de la versión vigente.',
        ],
      },
      en: {
        h: '9. Changes to the terms',
        body: [
          'We may update these Terms at any time. Continued use of the Service implies acceptance of the current version.',
        ],
      },
    },
    {
      es: {
        h: '10. Contacto',
        body: [
          'Para cualquier consulta sobre estos Términos puedes escribirnos desde la sección de Contacto del sitio.',
        ],
      },
      en: {
        h: '10. Contact',
        body: [
          'For any questions about these Terms you can reach us through the Contact section of the site.',
        ],
      },
    },
  ];
}
