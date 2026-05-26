import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { RESIDENTIAL_REQUIREMENT_SECTIONS } from '@hhsc-compliance/shared-models';

type ResidentialRequirementSectionVm =
  (typeof RESIDENTIAL_REQUIREMENT_SECTIONS)[number];

@Component({
  standalone: true,
  selector: 'lib-residential-compliance-page',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page">
      <header class="pageHead">
        <div>
          <h1>Residential Compliance</h1>
          <p>
            TAC §565.23 — residential requirements, evidence tracking, and survey-ready compliance sections.
          </p>
          <div class="subtle">
            Location:
            <code>{{ locationId }}</code>
          </div>
        </div>
      </header>

      <section class="grid">
        <a
          class="card"
          *ngFor="let section of sections(); trackBy: trackByKey"
          [routerLink]="section.route"
        >
          <div class="citation">{{ section.citation }}</div>
          <div class="title">{{ section.title }}</div>
          <div class="desc">{{ descriptionFor(section.key) }}</div>

          <div class="footer">
            <span class="pill">{{ section.key }}</span>
            <span class="arrow">Open →</span>
          </div>
        </a>
      </section>
    </section>
  `,
  styles: [`
    .page {
      display: grid;
      gap: 18px;
    }

    .pageHead {
      display: grid;
      gap: 6px;
    }

    h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 850;
      color: var(--clr-text-strong, #111827);
    }

    p {
      margin: 0;
      max-width: 820px;
      color: var(--clr-text-muted, #4b5563);
    }

    .subtle {
      font-size: 12px;
      color: #6b7280;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }

    .card {
      display: grid;
      gap: 8px;
      padding: 16px;
      border: 1px solid var(--clr-line, #e5e7eb);
      border-radius: 16px;
      background: var(--clr-card, #fff);
      color: inherit;
      text-decoration: none;
      box-shadow: var(--shadow-sm, 0 1px 2px rgba(15, 23, 42, 0.06));
      transition:
        transform 140ms ease,
        border-color 140ms ease,
        box-shadow 140ms ease;
    }

    .card:hover {
      transform: translateY(-1px);
      border-color: color-mix(in srgb, var(--clr-accent, #10b981) 45%, #e5e7eb);
      box-shadow: var(--shadow-md, 0 10px 20px rgba(15, 23, 42, 0.10));
    }

    .citation {
      font-size: 12px;
      font-weight: 800;
      color: var(--clr-accent, #047857);
    }

    .title {
      font-size: 17px;
      font-weight: 800;
      color: var(--clr-text-strong, #111827);
    }

    .desc {
      min-height: 42px;
      font-size: 13px;
      line-height: 1.45;
      color: var(--clr-text-muted, #4b5563);
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      margin-top: 6px;
    }

    .pill {
      max-width: 70%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 4px 8px;
      border-radius: 999px;
      border: 1px solid var(--clr-line, #e5e7eb);
      background: var(--clr-muted-surface, #f9fafb);
      font-size: 11px;
      font-weight: 750;
      color: var(--clr-text-muted, #4b5563);
    }

    .arrow {
      font-size: 13px;
      font-weight: 800;
      color: var(--clr-accent, #047857);
    }

    @media (max-width: 860px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class ResidentialCompliancePage {
  private readonly route = inject(ActivatedRoute);

   readonly locationId = this.getRouteParam('locationId');


  readonly sections = computed<ResidentialRequirementSectionVm[]>(() =>
    RESIDENTIAL_REQUIREMENT_SECTIONS
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder),
  );

 private getRouteParam(name: string): string {
    let current: ActivatedRoute | null = this.route;

    while (current) {
      const value = current.snapshot.paramMap.get(name);
      if (value) return value;
      current = current.parent;
    }

    return '';
  }

  trackByKey(_: number, section: ResidentialRequirementSectionVm): string {
    return section.key;
  }

  descriptionFor(key: ResidentialRequirementSectionVm['key']): string {
    switch (key) {
      case 'HOME_ENVIRONMENT':
        return 'Residence condition, hazards, furnishings, sanitation, utilities, and general safety.';
      case 'HOT_WATER':
        return 'Hot water temperature safety, monitoring, access, and scald prevention readiness.';
      case 'LIFE_SAFETY':
        return 'Egress, alarms, fire safety equipment, inspection readiness, and life safety controls.';
      case 'FIRE_DRILLS':
        return 'Emergency drill documentation, Form 4719 workflow, evacuation practice, and staff response.';
      case 'EMERGENCY_PLANS':
        return 'Written emergency plans, evacuation procedures, severe weather, contacts, and preparedness.';
      case 'INFECTION_CONTROL':
        return 'Sanitation practices, protective supplies, infection-control monitoring, and staff awareness.';
      case 'MEDICATION':
        return 'Medication storage, access control, safety, documentation support, and monitoring.';
      case 'FOUR_PERSON':
        return 'Four-person residence eligibility, layout, oversight, safety, and compliance monitoring.';
      default:
        return 'Residential compliance review section.';
    }
  }
}