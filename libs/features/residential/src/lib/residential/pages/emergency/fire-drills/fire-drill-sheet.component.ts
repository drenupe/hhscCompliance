import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  AmPm,
  CreateFireDrillInput,
  DrillLocation,
  DrillShift,
  ExtentOfFire,
  ExtentOfSmoke,
  ExitUsed,
  FireDrillDto,
  FireDrillForm4719,
  FIRE_DRILL_4719_DEFAULTS,
  FireType,
  SimulatedSituation,
  UpdateFireDrillInput,
  YesNo,
} from '@hhsc-compliance/shared-models';

type Mode = 'create' | 'edit';

function toggleInArray<T extends string>(arr: T[] | null | undefined, v: T): T[] {
  const list = Array.isArray(arr) ? [...arr] : [];
  const i = list.indexOf(v);
  if (i >= 0) list.splice(i, 1);
  else list.push(v);
  return list;
}

@Component({
  standalone: true,
  selector: 'lib-fire-drill-sheet',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.25);
      z-index: 40;
      border: 0;
      width: 100%;
      height: 100%;
      padding: 0;
      margin: 0;
      cursor: pointer;
    }
    .sheet {
      position: fixed;
      top: 0;
      right: 0;
      height: 100vh;
      width: min(820px, 100vw);
      background: #fff;
      border-left: 1px solid #e5e7eb;
      box-shadow: -8px 0 24px rgba(0,0,0,.08);
      padding: 16px;
      overflow: auto;
      z-index: 50;
    }
    .title { display:flex; align-items:center; justify-content: space-between; margin-bottom: 12px; }
    .h2 { font-size: 18px; font-weight: 700; color: #111827; }
    .subtle { color:#6b7280; font-size: 12px; margin-top: 2px; }

    .row { display:grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
    .row3 { display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 12px; }

    label { display:grid; gap: 6px; font-size: 12px; color:#374151; }
    input, textarea, select {
      padding: 10px; border:1px solid #d1d5db; border-radius: 10px; font-size: 14px;
    }
    textarea { min-height: 90px; resize: vertical; }

    .group { border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; margin: 12px 0; }
    .groupTitle { font-size: 13px; font-weight: 700; color:#111827; margin-bottom: 8px; }
    .checks { display:flex; flex-wrap: wrap; gap: 10px; }
    .check { display:flex; gap:8px; align-items:center; font-size: 13px; color:#111827; }

    .actions { display:flex; gap:8px; justify-content:flex-end; margin-top: 12px; }
    button { padding:10px 12px; border-radius: 10px; border:1px solid #d1d5db; background:#fff; cursor:pointer; }
    .primary { background:#111827; border-color:#111827; color:#fff; }
  `],
  template: `
    <button
      type="button"
      class="backdrop"
      aria-label="Close fire drill form"
      (click)="closed.emit()"
      (keydown.enter)="closed.emit()"
      (keydown.space)="closed.emit()"
    ></button>

    <div class="sheet" role="dialog" aria-modal="true" aria-label="Fire drill form (4719)">
      <div class="title">
        <div>
          <div class="h2">{{ mode === 'edit' ? 'Edit Fire Drill (Form 4719)' : 'Add Fire Drill (Form 4719)' }}</div>
          <div class="subtle">Matches your FireDrillDto + FireDrillEntity columns.</div>
        </div>
        <button type="button" (click)="closed.emit()">Close</button>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <!-- Header -->
        <div class="row">
          <label>
            Date drill conducted
            <input type="date" formControlName="dateDrillConducted" />
          </label>

          <label>
            Time drill conducted (HH:MM)
            <input type="time" formControlName="timeDrillConducted" />
          </label>
        </div>

        <div class="row">
          <label>
            Shift
            <select formControlName="shift">
              <option value="DAY">DAY</option>
              <option value="EVENING">EVENING</option>
              <option value="NIGHT">NIGHT</option>
            </select>
          </label>

          <label>
            Rally point (optional)
            <input type="text" formControlName="rallyPoint" />
          </label>
        </div>

        <!-- BEFORE DRILL -->
        <div class="group">
          <div class="groupTitle">Complete before conducting the drill</div>

          <div class="group">
            <div class="groupTitle">Simulated Situation (check all that apply)</div>
            <div class="checks">
              <label class="check"><input type="checkbox" [checked]="hasSim('FIRE')" (change)="toggleSim('FIRE')" /> Fire</label>
              <label class="check"><input type="checkbox" [checked]="hasSim('SMOKE')" (change)="toggleSim('SMOKE')" /> Smoke</label>
              <label class="check"><input type="checkbox" [checked]="hasSim('OTHER')" (change)="toggleSim('OTHER')" /> Other</label>
            </div>
            <label *ngIf="hasSim('OTHER')" style="margin-top:8px;">
              Other (specify)
              <input type="text" formControlName="simulatedOtherText" />
            </label>
          </div>

          <div class="group">
            <div class="groupTitle">Location / Area (check all that apply)</div>
            <div class="checks">
              <label class="check"><input type="checkbox" [checked]="hasLoc('KITCHEN')" (change)="toggleLoc('KITCHEN')" /> Kitchen</label>
              <label class="check"><input type="checkbox" [checked]="hasLoc('DINING')" (change)="toggleLoc('DINING')" /> Dining</label>
              <label class="check"><input type="checkbox" [checked]="hasLoc('LOBBY')" (change)="toggleLoc('LOBBY')" /> Lobby</label>
              <label class="check"><input type="checkbox" [checked]="hasLoc('OFFICE')" (change)="toggleLoc('OFFICE')" /> Office</label>
              <label class="check"><input type="checkbox" [checked]="hasLoc('BEDROOM')" (change)="toggleLoc('BEDROOM')" /> Bedroom</label>
              <label class="check"><input type="checkbox" [checked]="hasLoc('OTHER')" (change)="toggleLoc('OTHER')" /> Other</label>
            </div>
            <label *ngIf="hasLoc('OTHER')" style="margin-top:8px;">
              Other (specify)
              <input type="text" formControlName="locationOtherText" />
            </label>
          </div>

          <div class="group">
            <div class="groupTitle">Type of Fire (check all that apply)</div>
            <div class="checks">
              <label class="check"><input type="checkbox" [checked]="hasFireType('BED')" (change)="toggleFireType('BED')" /> Bed</label>
              <label class="check"><input type="checkbox" [checked]="hasFireType('WASTEBASKET')" (change)="toggleFireType('WASTEBASKET')" /> Wastebasket</label>
              <label class="check"><input type="checkbox" [checked]="hasFireType('KITCHEN_RANGE')" (change)="toggleFireType('KITCHEN_RANGE')" /> Kitchen range</label>
              <label class="check"><input type="checkbox" [checked]="hasFireType('LAUNDRY')" (change)="toggleFireType('LAUNDRY')" /> Laundry</label>
              <label class="check"><input type="checkbox" [checked]="hasFireType('OTHER')" (change)="toggleFireType('OTHER')" /> Other</label>
            </div>
            <label *ngIf="hasFireType('OTHER')" style="margin-top:8px;">
              Other (specify)
              <input type="text" formControlName="fireTypeOtherText" />
            </label>
          </div>

          <div class="group">
            <div class="groupTitle">Extent of Fire (check all that apply)</div>
            <div class="checks">
              <label class="check"><input type="checkbox" [checked]="hasEOF('LARGE')" (change)="toggleEOF('LARGE')" /> Large</label>
              <label class="check"><input type="checkbox" [checked]="hasEOF('SMALL')" (change)="toggleEOF('SMALL')" /> Small</label>
              <label class="check"><input type="checkbox" [checked]="hasEOF('EXPLOSION')" (change)="toggleEOF('EXPLOSION')" /> Explosion</label>
              <label class="check"><input type="checkbox" [checked]="hasEOF('ELECTRICAL')" (change)="toggleEOF('ELECTRICAL')" /> Electrical</label>
              <label class="check"><input type="checkbox" [checked]="hasEOF('PAPER')" (change)="toggleEOF('PAPER')" /> Paper</label>
              <label class="check"><input type="checkbox" [checked]="hasEOF('WOOD')" (change)="toggleEOF('WOOD')" /> Wood</label>
              <label class="check"><input type="checkbox" [checked]="hasEOF('CONTROLLABLE')" (change)="toggleEOF('CONTROLLABLE')" /> Controllable</label>
              <label class="check"><input type="checkbox" [checked]="hasEOF('OTHER')" (change)="toggleEOF('OTHER')" /> Other</label>
            </div>
            <label *ngIf="hasEOF('OTHER')" style="margin-top:8px;">
              Other (specify)
              <input type="text" formControlName="extentOfFireOtherText" />
            </label>
          </div>

          <div class="group">
            <div class="groupTitle">Extent of Smoke (check all that apply)</div>
            <div class="checks">
              <label class="check"><input type="checkbox" [checked]="hasEOS('NOXIOUS')" (change)="toggleEOS('NOXIOUS')" /> Noxious</label>
              <label class="check"><input type="checkbox" [checked]="hasEOS('WHOLE_ROOM')" (change)="toggleEOS('WHOLE_ROOM')" /> Whole room</label>
              <label class="check"><input type="checkbox" [checked]="hasEOS('CORRIDOR')" (change)="toggleEOS('CORRIDOR')" /> Corridor</label>
              <label class="check"><input type="checkbox" [checked]="hasEOS('HEAVY')" (change)="toggleEOS('HEAVY')" /> Heavy</label>
              <label class="check"><input type="checkbox" [checked]="hasEOS('LIGHT')" (change)="toggleEOS('LIGHT')" /> Light</label>
              <label class="check"><input type="checkbox" [checked]="hasEOS('SMOLDERING')" (change)="toggleEOS('SMOLDERING')" /> Smoldering</label>
              <label class="check"><input type="checkbox" [checked]="hasEOS('OTHER')" (change)="toggleEOS('OTHER')" /> Other</label>
            </div>
            <label *ngIf="hasEOS('OTHER')" style="margin-top:8px;">
              Other (specify)
              <input type="text" formControlName="extentOfSmokeOtherText" />
            </label>
          </div>

          <div class="group">
            <div class="groupTitle">Exits used (check all that apply)</div>
            <div class="checks">
              <label class="check"><input type="checkbox" [checked]="hasExit('FRONT_DOOR')" (change)="toggleExit('FRONT_DOOR')" /> Front door</label>
              <label class="check"><input type="checkbox" [checked]="hasExit('BACK_DOOR')" (change)="toggleExit('BACK_DOOR')" /> Back door</label>
              <label class="check"><input type="checkbox" [checked]="hasExit('SIDE_DOOR')" (change)="toggleExit('SIDE_DOOR')" /> Side door</label>
              <label class="check"><input type="checkbox" [checked]="hasExit('GARAGE_DOOR')" (change)="toggleExit('GARAGE_DOOR')" /> Garage door</label>
              <label class="check"><input type="checkbox" [checked]="hasExit('WINDOW')" (change)="toggleExit('WINDOW')" /> Window</label>
              <label class="check"><input type="checkbox" [checked]="hasExit('OTHER')" (change)="toggleExit('OTHER')" /> Other</label>
            </div>
            <label *ngIf="hasExit('OTHER')" style="margin-top:8px;">
              Other (specify)
              <input type="text" formControlName="exitOtherText" />
            </label>
          </div>
        </div>

        <!-- AFTER DRILL -->
        <div class="group">
          <div class="groupTitle">Complete after conducting the drill</div>

          <div class="row">
            <label>
              Staff used proper judgment (YES/NO)
              <select formControlName="staffUsedProperJudgment">
                <option [ngValue]="null">—</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </label>

            <label>
              Residents removed to safety (YES/NO)
              <select formControlName="residentsRemovedToSafety">
                <option [ngValue]="null">—</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </label>
          </div>

          <div class="row">
            <label>
              Egress clear (YES/NO)
              <select formControlName="egressClear">
                <option [ngValue]="null">—</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </label>

            <label>
              Corridor doors closed (YES/NO)
              <select formControlName="corridorDoorsClosed">
                <option [ngValue]="null">—</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </label>
          </div>

          <label>
            Who responded and equipment used
            <textarea formControlName="whoRespondedAndEquipment"></textarea>
          </label>

          <div class="row">
            <label>
              Staff monitored exits (YES/NO)
              <select formControlName="staffMonitoredExits">
                <option [ngValue]="null">—</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </label>

            <label>
              Building evacuated (YES/NO)
              <select formControlName="buildingEvacuated">
                <option [ngValue]="null">—</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </label>
          </div>

          <div class="row">
            <label>
              Fire extinguished (YES/NO)
              <select formControlName="fireExtinguished">
                <option [ngValue]="null">—</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </label>

            <label>
              Emergency plan executed correctly (YES/NO)
              <select formControlName="emergencyPlanExecutedCorrectly">
                <option [ngValue]="null">—</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </label>
          </div>

          <div class="row">
            <label>
              Staff carried out responsibilities (YES/NO)
              <select formControlName="staffCarriedOutResponsibilities">
                <option [ngValue]="null">—</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </label>

            <label>
              Fire department called (YES/NO)
              <select formControlName="fireDepartmentCalled">
                <option [ngValue]="null">—</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </label>
          </div>

          <div class="row3">
            <label>
              Fire dept called time (HH:MM)
              <input type="time" formControlName="fireDepartmentCalledTime" />
            </label>
            <label>
              AM/PM
              <select formControlName="fireDepartmentCalledAmPm">
                <option [ngValue]="null">—</option>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </label>
            <label>
              All clear by
              <input type="text" formControlName="allClearBy" />
            </label>
          </div>

          <div class="row3">
            <label>
              All clear time (HH:MM)
              <input type="time" formControlName="allClearTime" />
            </label>
            <label>
              AM/PM
              <select formControlName="allClearAmPm">
                <option [ngValue]="null">—</option>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </label>

            <label>
              Actions taken
              <textarea formControlName="actionsTaken"></textarea>
            </label>
          </div>

          <label>
            Comments / Problems encountered
            <textarea formControlName="commentsProblems"></textarea>
          </label>

          <label>
            Participants (names)
            <textarea formControlName="participantsNames"></textarea>
          </label>

          <div class="group">
            <div class="groupTitle">Staff areas checks (Q15)</div>
            <div class="checks">
              <label class="check"><input type="checkbox" [checked]="staffCheck('hearAlarm')" (change)="toggleStaffCheck('hearAlarm')" /> Hear alarm</label>
              <label class="check"><input type="checkbox" [checked]="staffCheck('respondPromptly')" (change)="toggleStaffCheck('respondPromptly')" /> Respond promptly</label>
              <label class="check"><input type="checkbox" [checked]="staffCheck('followAcceptedProceduresCalmly')" (change)="toggleStaffCheck('followAcceptedProceduresCalmly')" /> Follow calmly / efficiently</label>
              <label class="check"><input type="checkbox" [checked]="staffCheck('knowProperProcedures')" (change)="toggleStaffCheck('knowProperProcedures')" /> Know proper procedures</label>
              <label class="check"><input type="checkbox" [checked]="staffCheck('returnToStations')" (change)="toggleStaffCheck('returnToStations')" /> Return to stations</label>
              <label class="check"><input type="checkbox" [checked]="staffCheck('standByUntilAllClear')" (change)="toggleStaffCheck('standByUntilAllClear')" /> Stand by until all clear</label>
              <label class="check"><input type="checkbox" [checked]="staffCheck('hearAllClear')" (change)="toggleStaffCheck('hearAllClear')" /> Hear all clear</label>
            </div>
          </div>
        </div>

        <!-- Report completed -->
        <div class="row">
          <label>
            Report completed by
            <input type="text" formControlName="reportCompletedBy" />
          </label>
          <label>
            Title
            <input type="text" formControlName="reportCompletedByTitle" />
          </label>
        </div>

        <div class="actions">
          <button type="button" (click)="closed.emit()">Cancel</button>
          <button class="primary" type="submit" [disabled]="form.invalid">
            {{ mode === 'edit' ? 'Save changes' : 'Create drill' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class FireDrillSheetComponent implements OnChanges {
  @Input({ required: true }) locationId!: string;
  @Input() row: FireDrillDto | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<{ id?: string; payload: CreateFireDrillInput | UpdateFireDrillInput }>();

  get mode(): Mode {
    return this.row ? 'edit' : 'create';
  }

  readonly form = new FormGroup({
    dateDrillConducted: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    timeDrillConducted: new FormControl<string | null>(null),
    shift: new FormControl<DrillShift>('DAY', { nonNullable: true, validators: [Validators.required] }),

    simulatedSituations: new FormControl<SimulatedSituation[]>([], { nonNullable: true }),
    simulatedOtherText: new FormControl<string | null>(null),

    locations: new FormControl<DrillLocation[]>([], { nonNullable: true }),
    locationOtherText: new FormControl<string | null>(null),

    fireTypes: new FormControl<FireType[]>([], { nonNullable: true }),
    fireTypeOtherText: new FormControl<string | null>(null),

    extentOfFire: new FormControl<ExtentOfFire[]>([], { nonNullable: true }),
    extentOfFireOtherText: new FormControl<string | null>(null),

    extentOfSmoke: new FormControl<ExtentOfSmoke[]>([], { nonNullable: true }),
    extentOfSmokeOtherText: new FormControl<string | null>(null),

    exitsUsed: new FormControl<ExitUsed[]>([], { nonNullable: true }),
    exitOtherText: new FormControl<string | null>(null),

    rallyPoint: new FormControl<string | null>(null),

    staffUsedProperJudgment: new FormControl<YesNo | null>(null),
    actionsTaken: new FormControl<string | null>(null),

    fireDepartmentCalled: new FormControl<YesNo | null>(null),
    fireDepartmentCalledTime: new FormControl<string | null>(null),
    fireDepartmentCalledAmPm: new FormControl<AmPm | null>(null),

    residentsRemovedToSafety: new FormControl<YesNo | null>(null),
    egressClear: new FormControl<YesNo | null>(null),
    corridorDoorsClosed: new FormControl<YesNo | null>(null),

    whoRespondedAndEquipment: new FormControl<string | null>(null),

    staffMonitoredExits: new FormControl<YesNo | null>(null),
    buildingEvacuated: new FormControl<YesNo | null>(null),
    fireExtinguished: new FormControl<YesNo | null>(null),

    allClearBy: new FormControl<string | null>(null),
    allClearTime: new FormControl<string | null>(null),
    allClearAmPm: new FormControl<AmPm | null>(null),

    emergencyPlanExecutedCorrectly: new FormControl<YesNo | null>(null),
    staffCarriedOutResponsibilities: new FormControl<YesNo | null>(null),

    staffAreasChecks: new FormControl<FireDrillDto['staffAreasChecks']>({
      hearAlarm: false,
      respondPromptly: false,
      followAcceptedProceduresCalmly: false,
      knowProperProcedures: false,
      returnToStations: false,
      standByUntilAllClear: false,
      hearAllClear: false,
    }, { nonNullable: true }),

    commentsProblems: new FormControl<string | null>(null),
    participantsNames: new FormControl<string | null>(null),

    reportCompletedBy: new FormControl<string | null>(null),
    reportCompletedByTitle: new FormControl<string | null>(null),
  });

  ngOnChanges(_: SimpleChanges): void {
    if (this.row) {
      this.form.patchValue({
        dateDrillConducted: this.row.dateDrillConducted,
        timeDrillConducted: this.row.timeDrillConducted ?? null,
        shift: this.row.shift,

        simulatedSituations: this.row.simulatedSituations ?? [],
        simulatedOtherText: this.row.simulatedOtherText ?? null,

        locations: this.row.locations ?? [],
        locationOtherText: this.row.locationOtherText ?? null,

        fireTypes: this.row.fireTypes ?? [],
        fireTypeOtherText: this.row.fireTypeOtherText ?? null,

        extentOfFire: this.row.extentOfFire ?? [],
        extentOfFireOtherText: this.row.extentOfFireOtherText ?? null,

        extentOfSmoke: this.row.extentOfSmoke ?? [],
        extentOfSmokeOtherText: this.row.extentOfSmokeOtherText ?? null,

        exitsUsed: this.row.exitsUsed ?? [],
        exitOtherText: this.row.exitOtherText ?? null,

        rallyPoint: this.row.rallyPoint ?? null,

        staffUsedProperJudgment: this.row.staffUsedProperJudgment ?? null,
        actionsTaken: this.row.actionsTaken ?? null,

        fireDepartmentCalled: this.row.fireDepartmentCalled ?? null,
        fireDepartmentCalledTime: this.row.fireDepartmentCalledTime ?? null,
        fireDepartmentCalledAmPm: this.row.fireDepartmentCalledAmPm ?? null,

        residentsRemovedToSafety: this.row.residentsRemovedToSafety ?? null,
        egressClear: this.row.egressClear ?? null,
        corridorDoorsClosed: this.row.corridorDoorsClosed ?? null,

        whoRespondedAndEquipment: this.row.whoRespondedAndEquipment ?? null,

        staffMonitoredExits: this.row.staffMonitoredExits ?? null,
        buildingEvacuated: this.row.buildingEvacuated ?? null,
        fireExtinguished: this.row.fireExtinguished ?? null,

        allClearBy: this.row.allClearBy ?? null,
        allClearTime: this.row.allClearTime ?? null,
        allClearAmPm: this.row.allClearAmPm ?? null,

        emergencyPlanExecutedCorrectly: this.row.emergencyPlanExecutedCorrectly ?? null,
        staffCarriedOutResponsibilities: this.row.staffCarriedOutResponsibilities ?? null,

        staffAreasChecks: this.row.staffAreasChecks ?? FIRE_DRILL_4719_DEFAULTS.staffAreasChecks,

        commentsProblems: this.row.commentsProblems ?? null,
        participantsNames: this.row.participantsNames ?? null,

        reportCompletedBy: this.row.reportCompletedBy ?? null,
        reportCompletedByTitle: this.row.reportCompletedByTitle ?? null,
      });
      return;
    }

    const d: FireDrillForm4719 = { ...FIRE_DRILL_4719_DEFAULTS, locationId: this.locationId };
    this.form.reset(d as any); // safe: keys align with form controls
  }

  // Array checkbox helpers
  hasSim(v: SimulatedSituation) { return this.form.controls.simulatedSituations.value.includes(v); }
  toggleSim(v: SimulatedSituation) { this.form.controls.simulatedSituations.setValue(toggleInArray(this.form.controls.simulatedSituations.value, v)); }

  hasLoc(v: DrillLocation) { return this.form.controls.locations.value.includes(v); }
  toggleLoc(v: DrillLocation) { this.form.controls.locations.setValue(toggleInArray(this.form.controls.locations.value, v)); }

  hasExit(v: ExitUsed) { return this.form.controls.exitsUsed.value.includes(v); }
  toggleExit(v: ExitUsed) { this.form.controls.exitsUsed.setValue(toggleInArray(this.form.controls.exitsUsed.value, v)); }

  hasFireType(v: FireType) { return this.form.controls.fireTypes.value.includes(v); }
  toggleFireType(v: FireType) { this.form.controls.fireTypes.setValue(toggleInArray(this.form.controls.fireTypes.value, v)); }

  hasEOF(v: ExtentOfFire) { return this.form.controls.extentOfFire.value.includes(v); }
  toggleEOF(v: ExtentOfFire) { this.form.controls.extentOfFire.setValue(toggleInArray(this.form.controls.extentOfFire.value, v)); }

  hasEOS(v: ExtentOfSmoke) { return this.form.controls.extentOfSmoke.value.includes(v); }
  toggleEOS(v: ExtentOfSmoke) { this.form.controls.extentOfSmoke.setValue(toggleInArray(this.form.controls.extentOfSmoke.value, v)); }

  // staff checks stored as object
  staffCheck(k: keyof FireDrillDto['staffAreasChecks']) {
    return !!this.form.controls.staffAreasChecks.value?.[k];
  }
  toggleStaffCheck(k: keyof FireDrillDto['staffAreasChecks']) {
    const cur = this.form.controls.staffAreasChecks.value ?? FIRE_DRILL_4719_DEFAULTS.staffAreasChecks;
    this.form.controls.staffAreasChecks.setValue({ ...cur, [k]: !cur[k] });
  }

  submit(): void {
    if (this.form.invalid) return;

    const v = this.form.getRawValue();

    const payload: CreateFireDrillInput | UpdateFireDrillInput = {
      locationId: this.locationId,

      dateDrillConducted: v.dateDrillConducted,
      timeDrillConducted: v.timeDrillConducted ?? null,
      shift: v.shift,

      simulatedSituations: v.simulatedSituations ?? [],
      simulatedOtherText: (v.simulatedOtherText ?? null)?.trim() || null,

      locations: v.locations ?? [],
      locationOtherText: (v.locationOtherText ?? null)?.trim() || null,

      fireTypes: v.fireTypes ?? [],
      fireTypeOtherText: (v.fireTypeOtherText ?? null)?.trim() || null,

      extentOfFire: v.extentOfFire ?? [],
      extentOfFireOtherText: (v.extentOfFireOtherText ?? null)?.trim() || null,

      extentOfSmoke: v.extentOfSmoke ?? [],
      extentOfSmokeOtherText: (v.extentOfSmokeOtherText ?? null)?.trim() || null,

      exitsUsed: v.exitsUsed ?? [],
      exitOtherText: (v.exitOtherText ?? null)?.trim() || null,

      rallyPoint: (v.rallyPoint ?? null)?.trim() || null,

      staffUsedProperJudgment: v.staffUsedProperJudgment ?? null,
      actionsTaken: (v.actionsTaken ?? null)?.trim() || null,

      fireDepartmentCalled: v.fireDepartmentCalled ?? null,
      fireDepartmentCalledTime: v.fireDepartmentCalledTime ?? null,
      fireDepartmentCalledAmPm: v.fireDepartmentCalledAmPm ?? null,

      residentsRemovedToSafety: v.residentsRemovedToSafety ?? null,
      egressClear: v.egressClear ?? null,
      corridorDoorsClosed: v.corridorDoorsClosed ?? null,

      whoRespondedAndEquipment: (v.whoRespondedAndEquipment ?? null)?.trim() || null,

      staffMonitoredExits: v.staffMonitoredExits ?? null,
      buildingEvacuated: v.buildingEvacuated ?? null,
      fireExtinguished: v.fireExtinguished ?? null,

      allClearBy: (v.allClearBy ?? null)?.trim() || null,
      allClearTime: v.allClearTime ?? null,
      allClearAmPm: v.allClearAmPm ?? null,

      emergencyPlanExecutedCorrectly: v.emergencyPlanExecutedCorrectly ?? null,
      staffCarriedOutResponsibilities: v.staffCarriedOutResponsibilities ?? null,

      staffAreasChecks: v.staffAreasChecks ?? FIRE_DRILL_4719_DEFAULTS.staffAreasChecks,

      commentsProblems: (v.commentsProblems ?? null)?.trim() || null,
      participantsNames: (v.participantsNames ?? null)?.trim() || null,

      reportCompletedBy: (v.reportCompletedBy ?? null)?.trim() || null,
      reportCompletedByTitle: (v.reportCompletedByTitle ?? null)?.trim() || null,
    };

    this.submitted.emit(this.row ? { id: this.row.id, payload } : { payload });
  }
}
