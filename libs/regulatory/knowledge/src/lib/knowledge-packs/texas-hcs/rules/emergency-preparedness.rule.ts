import { DocumentDefinition } from '../../../models/document-definition.model';
import { EvidenceRequirement } from '../../../models/evidence-requirement.model';
import { RegulatoryGuidance } from '../../../models/regulatory-guidance.model';
import { RegulatoryQuestion } from '../../../models/regulatory-question.model';
import { RegulatoryRequirement } from '../../../models/regulatory-requirement.model';
import { RegulatoryRule } from '../../../models/regulatory-rule.model';
import { RegulatorySource } from '../../../models/regulatory-source.model';
import { RenewalRule } from '../../../models/renewal-rule.model';
import { ValidationRule } from '../../../models/validation-rule.model';

export const TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS = {
  source: 'tx-hcs-source-26-tac-chapter-565',
  rule: 'tx-hcs-rule-emergency-preparedness',
  requirement: 'tx-hcs-requirement-emergency-plan',

  questions: {
    residenceName: 'tx-hcs-emergency-question-residence-name',
    residenceAddress: 'tx-hcs-emergency-question-residence-address',
    coordinatorName: 'tx-hcs-emergency-question-coordinator-name',
    alternateCoordinatorName:
      'tx-hcs-emergency-question-alternate-coordinator-name',
    coordinatorPhone: 'tx-hcs-emergency-question-coordinator-phone',
    localEmergencyContact:
      'tx-hcs-emergency-question-local-emergency-contact',
    identifiedHazards: 'tx-hcs-emergency-question-identified-hazards',
    individualSupportNeeds:
      'tx-hcs-emergency-question-individual-support-needs',
    evacuationProcedure:
      'tx-hcs-emergency-question-evacuation-procedure',
    shelterInPlaceProcedure:
      'tx-hcs-emergency-question-shelter-in-place-procedure',
    communicationProcedure:
      'tx-hcs-emergency-question-communication-procedure',
    transportationProcedure:
      'tx-hcs-emergency-question-transportation-procedure',
    continuityProcedure:
      'tx-hcs-emergency-question-continuity-procedure',
    utilityFailureProcedure:
      'tx-hcs-emergency-question-utility-failure-procedure',
    medicationProcedure:
      'tx-hcs-emergency-question-medication-procedure',
    fireSafetyProcedure:
      'tx-hcs-emergency-question-fire-safety-procedure',
    approvalDate: 'tx-hcs-emergency-question-approval-date',
    approvedBy: 'tx-hcs-emergency-question-approved-by',
  },

  evidence: {
    emergencyPlan: 'tx-hcs-emergency-evidence-plan',
    evacuationMap: 'tx-hcs-emergency-evidence-evacuation-map',
    emergencyContacts: 'tx-hcs-emergency-evidence-contact-list',
    approvalSignature: 'tx-hcs-emergency-evidence-approval-signature',
  },

  validation: {
    residenceNameRequired:
      'tx-hcs-emergency-validation-residence-name-required',
    residenceAddressRequired:
      'tx-hcs-emergency-validation-residence-address-required',
    coordinatorRequired:
      'tx-hcs-emergency-validation-coordinator-required',
    coordinatorPhoneRequired:
      'tx-hcs-emergency-validation-coordinator-phone-required',
    hazardsRequired: 'tx-hcs-emergency-validation-hazards-required',
    supportNeedsRequired:
      'tx-hcs-emergency-validation-support-needs-required',
    evacuationRequired:
      'tx-hcs-emergency-validation-evacuation-required',
    shelterRequired: 'tx-hcs-emergency-validation-shelter-required',
    communicationRequired:
      'tx-hcs-emergency-validation-communication-required',
    continuityRequired:
      'tx-hcs-emergency-validation-continuity-required',
    fireSafetyRequired:
      'tx-hcs-emergency-validation-fire-safety-required',
    approvalDateRequired:
      'tx-hcs-emergency-validation-approval-date-required',
    approvedByRequired:
      'tx-hcs-emergency-validation-approved-by-required',
  },

  document: 'tx-hcs-document-emergency-plan',
  renewal: 'tx-hcs-renewal-emergency-plan',
  guidance: 'tx-hcs-guidance-emergency-plan',
} as const;

export const texasHcsEmergencyPreparednessSource: RegulatorySource = {
  id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.source,
  code: 'TX-26-TAC-CH-565',
  name: 'Texas HCS and CFC Certification Standards',
  publisher: 'Texas Health and Human Services Commission',
  sourceType: 'RULE',
  jurisdiction: 'Texas',
  version: '2026.1',
  status: 'ACTIVE',
  description:
    'Texas certification standards governing Home and Community-Based Services and Community First Choice program providers.',
 
};

export const texasHcsEmergencyPreparednessRule: RegulatoryRule = {
  id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.rule,
  sourceId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.source,
  code: 'TX-HCS-EMERGENCY-PREPAREDNESS',
  citation: '26 TAC Chapter 565',
  title: 'Emergency Preparedness and Residential Emergency Planning',
  description:
    'Requires a program provider to maintain location-appropriate emergency planning that protects individuals during fires, disasters, utility failures, evacuations, shelter-in-place events, and other emergencies.',
  chapter: '565',
  version: '2026.1',
  status: 'UNDER_REVIEW',
  tags: [
    'EMERGENCY_PREPAREDNESS',
    'EMERGENCY_PLAN',
    'RESIDENTIAL',
    'HEALTH_AND_SAFETY',
  ],
};

export const texasHcsEmergencyPlanRequirement: RegulatoryRequirement = {
  id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
  ruleId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.rule,
  code: 'TX-HCS-EP-001',
  title: 'Maintain a Location-Specific Emergency Plan',
  description:
    'The provider must maintain an accessible emergency plan appropriate to the residence, the individuals served, the geographic area, and reasonably foreseeable internal and external emergencies.',
  intent:
    'Ensure staff can protect individuals, maintain essential supports, communicate effectively, and safely evacuate or shelter in place during an emergency.',
  domains: ['RESIDENTIAL', 'ADMINISTRATION', 'QUALITY'],
  providerTypes: ['HCS_PROGRAM_PROVIDER'],
  serviceTypes: [
    'HOST_HOME_COMPANION_CARE',
    'SUPERVISED_LIVING',
    'RESIDENTIAL_SUPPORT_SERVICES',
  ],
  severity: 'CRITICAL',
  frequency: 'ONGOING',
  status: 'UNDER_REVIEW',
  responsibleRoles: [
    'PROVIDER_ADMIN',
    'PROGRAM_MANAGER',
    'RESIDENTIAL_MANAGER',
    'QUALITY_MANAGER',
  ],
  tags: [
    'EMERGENCY_PLAN',
    'DISASTER_RESPONSE',
    'EVACUATION',
    'SHELTER_IN_PLACE',
  ],
};

export const texasHcsEmergencyPreparednessQuestions: RegulatoryQuestion[] = [
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.questions.residenceName,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    key: 'residenceName',
    label: 'Residence name',
    helpText: 'Enter the name used to identify this residential location.',
    inputType: 'TEXT',
    required: true,
    sourcePath: 'residentialLocation.name',
    displayOrder: 10,
    placeholder: 'Example: Rockheaven Residence',
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.questions.residenceAddress,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    key: 'residenceAddress',
    label: 'Residence address',
    helpText:
      'Enter the complete physical address for the emergency plan location.',
    inputType: 'ADDRESS',
    required: true,
    sourcePath: 'residentialLocation.address',
    displayOrder: 20,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.questions.coordinatorName,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    key: 'emergencyCoordinatorName',
    label: 'Emergency coordinator',
    helpText:
      'Identify the person responsible for directing the emergency response.',
    inputType: 'TEXT',
    required: true,
    displayOrder: 30,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.questions
      .alternateCoordinatorName,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    key: 'alternateEmergencyCoordinatorName',
    label: 'Alternate emergency coordinator',
    helpText:
      'Identify the person who assumes responsibility when the primary coordinator is unavailable.',
    inputType: 'TEXT',
    required: true,
    displayOrder: 40,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.questions.coordinatorPhone,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    key: 'emergencyCoordinatorPhone',
    label: 'Emergency coordinator phone number',
    inputType: 'PHONE',
    required: true,
    displayOrder: 50,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.questions.localEmergencyContact,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    key: 'localEmergencyManagementContact',
    label: 'Local emergency management contact',
    helpText:
      'Provide the local emergency management office, coordinator, or other designated local authority.',
    inputType: 'TEXTAREA',
    required: true,
    displayOrder: 60,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.questions.identifiedHazards,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    key: 'identifiedEmergencyHazards',
    label: 'Identified emergency hazards',
    helpText:
      'Select the internal and external emergencies reasonably foreseeable for this residence and geographic area.',
    inputType: 'MULTI_SELECT',
    required: true,
    options: [
      { label: 'Fire or smoke', value: 'FIRE' },
      { label: 'Severe weather or tornado', value: 'SEVERE_WEATHER' },
      { label: 'Flooding', value: 'FLOOD' },
      { label: 'Extreme heat', value: 'EXTREME_HEAT' },
      { label: 'Extreme cold or winter weather', value: 'WINTER_WEATHER' },
      { label: 'Power failure', value: 'POWER_FAILURE' },
      { label: 'Water interruption', value: 'WATER_INTERRUPTION' },
      { label: 'Gas leak', value: 'GAS_LEAK' },
      { label: 'Medical emergency', value: 'MEDICAL_EMERGENCY' },
      { label: 'Missing individual', value: 'MISSING_INDIVIDUAL' },
      { label: 'Violence or security threat', value: 'SECURITY_THREAT' },
      { label: 'Transportation emergency', value: 'TRANSPORTATION_EMERGENCY' },
      { label: 'Other', value: 'OTHER' },
    ],
    displayOrder: 70,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.questions
      .individualSupportNeeds,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    key: 'individualEmergencySupportNeeds',
    label: 'Individual emergency support needs',
    helpText:
      'Describe mobility, communication, behavioral, medical, dietary, supervision, equipment, and staffing needs that must be maintained during an emergency.',
    inputType: 'TEXTAREA',
    required: true,
    displayOrder: 80,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.questions.evacuationProcedure,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    key: 'evacuationProcedure',
    label: 'Evacuation procedure',
    helpText:
      'Describe who initiates evacuation, how individuals are assisted, primary and alternate exits, assembly locations, accountability, and destination arrangements.',
    inputType: 'TEXTAREA',
    required: true,
    displayOrder: 90,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.questions
      .shelterInPlaceProcedure,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    key: 'shelterInPlaceProcedure',
    label: 'Shelter-in-place procedure',
    helpText:
      'Describe the designated shelter area, required supplies, supervision, accountability, and decision-making process.',
    inputType: 'TEXTAREA',
    required: true,
    displayOrder: 100,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.questions.communicationProcedure,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    key: 'emergencyCommunicationProcedure',
    label: 'Emergency communication procedure',
    helpText:
      'Describe how staff, emergency responders, individuals, legally authorized representatives, and provider leadership will communicate.',
    inputType: 'TEXTAREA',
    required: true,
    displayOrder: 110,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.questions
      .transportationProcedure,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    key: 'emergencyTransportationProcedure',
    label: 'Emergency transportation procedure',
    helpText:
      'Describe available vehicles, drivers, accessible transportation, backup arrangements, destinations, and accountability during transport.',
    inputType: 'TEXTAREA',
    required: true,
    displayOrder: 120,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.questions.continuityProcedure,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    key: 'continuityOfOperationsProcedure',
    label: 'Continuity of essential services',
    helpText:
      'Describe how staffing, supervision, food, water, medications, medical supports, records, communications, and other essential services will continue.',
    inputType: 'TEXTAREA',
    required: true,
    displayOrder: 130,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.questions.utilityFailureProcedure,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    key: 'utilityFailureProcedure',
    label: 'Utility failure procedure',
    helpText:
      'Describe responses to loss of electricity, water, gas, heating, cooling, communications, or other essential utilities.',
    inputType: 'TEXTAREA',
    required: true,
    displayOrder: 140,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.questions.medicationProcedure,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    key: 'emergencyMedicationProcedure',
    label: 'Medication and medical support procedure',
    helpText:
      'Describe secure medication transport, refrigeration, emergency supplies, medical equipment, orders, and access to health information.',
    inputType: 'TEXTAREA',
    required: true,
    displayOrder: 150,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.questions.fireSafetyProcedure,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    key: 'fireSafetyProcedure',
    label: 'Fire safety procedure',
    helpText:
      'Describe alarm response, evacuation, emergency calls, staff responsibilities, individual assistance, assembly, and accountability.',
    inputType: 'TEXTAREA',
    required: true,
    displayOrder: 160,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.questions.approvalDate,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    key: 'emergencyPlanApprovalDate',
    label: 'Plan approval date',
    inputType: 'DATE',
    required: true,
    displayOrder: 170,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.questions.approvedBy,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    key: 'emergencyPlanApprovedBy',
    label: 'Approved by',
    helpText: 'Identify the authorized person who approved the plan.',
    inputType: 'TEXT',
    required: true,
    displayOrder: 180,
  },
];

export const texasHcsEmergencyPreparednessEvidenceRequirements: EvidenceRequirement[] =
  [
    {
      id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.evidence.emergencyPlan,
      requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
      code: 'TX-HCS-EP-EVIDENCE-PLAN',
      title: 'Current Location-Specific Emergency Plan',
      description:
        'A complete emergency plan for the residence that addresses identified hazards, individual support needs, evacuation, sheltering, communication, continuity, utilities, medications, and fire safety.',
      evidenceType: 'DOCUMENT',
      required: true,
      frequency: 'ONGOING',
      acceptedMimeTypes: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      minimumCount: 1,
      requiresApproval: true,
      requiresSignature: true,
      binderSectionKey: 'emergency-preparedness',
      tags: ['EMERGENCY_PLAN', 'SURVEY_BINDER'],
    },
    {
      id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.evidence.evacuationMap,
      requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
      code: 'TX-HCS-EP-EVIDENCE-EVACUATION-MAP',
      title: 'Residence Evacuation Map',
      description:
        'A location-specific map showing primary and alternate exits, assembly locations, fire extinguishers, and other emergency equipment.',
      evidenceType: 'DOCUMENT',
      required: true,
      frequency: 'ONGOING',
      acceptedMimeTypes: ['application/pdf', 'image/png', 'image/jpeg'],
      minimumCount: 1,
      binderSectionKey: 'emergency-preparedness',
      tags: ['EVACUATION', 'MAP'],
    },
    {
      id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.evidence.emergencyContacts,
      requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
      code: 'TX-HCS-EP-EVIDENCE-CONTACTS',
      title: 'Emergency Contact List',
      description:
        'Current contact information for emergency services, local emergency management, provider leadership, staff, individuals, and legally authorized representatives as applicable.',
      evidenceType: 'DOCUMENT',
      required: true,
      frequency: 'ONGOING',
      acceptedMimeTypes: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      minimumCount: 1,
      binderSectionKey: 'emergency-preparedness',
      tags: ['EMERGENCY_CONTACTS'],
    },
    {
      id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.evidence.approvalSignature,
      requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
      code: 'TX-HCS-EP-EVIDENCE-APPROVAL',
      title: 'Emergency Plan Approval',
      description:
        'Documented approval of the current emergency plan by an authorized provider representative.',
      evidenceType: 'SIGNATURE',
      required: true,
      frequency: 'ONGOING',
      minimumCount: 1,
      requiresSignature: true,
      binderSectionKey: 'emergency-preparedness',
      tags: ['APPROVAL', 'SIGNATURE'],
    },
  ];

export const texasHcsEmergencyPreparednessValidationRules: ValidationRule[] = [
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.validation
      .residenceNameRequired,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    code: 'TX-HCS-EP-VAL-001',
    title: 'Residence name is required',
    ruleType: 'REQUIRED',
    targetPath: 'answers.residenceName',
    severity: 'HIGH',
    errorMessage: 'Enter the residence name.',
    recommendation:
      'Use the same location name maintained in the provider workspace.',
    enabled: true,
    displayOrder: 10,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.validation
      .residenceAddressRequired,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    code: 'TX-HCS-EP-VAL-002',
    title: 'Residence address is required',
    ruleType: 'REQUIRED',
    targetPath: 'answers.residenceAddress',
    severity: 'HIGH',
    errorMessage: 'Enter the complete physical address for the residence.',
    enabled: true,
    displayOrder: 20,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.validation.coordinatorRequired,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    code: 'TX-HCS-EP-VAL-003',
    title: 'Emergency coordinator is required',
    ruleType: 'REQUIRED',
    targetPath: 'answers.emergencyCoordinatorName',
    severity: 'CRITICAL',
    errorMessage: 'Identify the emergency coordinator.',
    enabled: true,
    displayOrder: 30,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.validation
      .coordinatorPhoneRequired,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    code: 'TX-HCS-EP-VAL-004',
    title: 'Emergency coordinator phone is required',
    ruleType: 'REQUIRED',
    targetPath: 'answers.emergencyCoordinatorPhone',
    severity: 'HIGH',
    errorMessage: 'Enter a phone number for the emergency coordinator.',
    enabled: true,
    displayOrder: 40,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.validation.hazardsRequired,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    code: 'TX-HCS-EP-VAL-005',
    title: 'Emergency hazards are required',
    ruleType: 'REQUIRED',
    targetPath: 'answers.identifiedEmergencyHazards',
    severity: 'CRITICAL',
    errorMessage:
      'Identify the internal and external emergency hazards applicable to this residence.',
    enabled: true,
    displayOrder: 50,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.validation
      .supportNeedsRequired,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    code: 'TX-HCS-EP-VAL-006',
    title: 'Individual support needs are required',
    ruleType: 'REQUIRED',
    targetPath: 'answers.individualEmergencySupportNeeds',
    severity: 'CRITICAL',
    errorMessage:
      'Describe the emergency support needs of the individuals living at this residence.',
    enabled: true,
    displayOrder: 60,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.validation.evacuationRequired,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    code: 'TX-HCS-EP-VAL-007',
    title: 'Evacuation procedure is required',
    ruleType: 'REQUIRED',
    targetPath: 'answers.evacuationProcedure',
    severity: 'CRITICAL',
    errorMessage: 'Document the residence evacuation procedure.',
    enabled: true,
    displayOrder: 70,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.validation.shelterRequired,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    code: 'TX-HCS-EP-VAL-008',
    title: 'Shelter-in-place procedure is required',
    ruleType: 'REQUIRED',
    targetPath: 'answers.shelterInPlaceProcedure',
    severity: 'CRITICAL',
    errorMessage: 'Document the residence shelter-in-place procedure.',
    enabled: true,
    displayOrder: 80,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.validation
      .communicationRequired,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    code: 'TX-HCS-EP-VAL-009',
    title: 'Emergency communication procedure is required',
    ruleType: 'REQUIRED',
    targetPath: 'answers.emergencyCommunicationProcedure',
    severity: 'HIGH',
    errorMessage: 'Document the emergency communication procedure.',
    enabled: true,
    displayOrder: 90,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.validation.continuityRequired,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    code: 'TX-HCS-EP-VAL-010',
    title: 'Continuity procedure is required',
    ruleType: 'REQUIRED',
    targetPath: 'answers.continuityOfOperationsProcedure',
    severity: 'CRITICAL',
    errorMessage:
      'Document how essential services and supports will continue during an emergency.',
    enabled: true,
    displayOrder: 100,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.validation.fireSafetyRequired,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    code: 'TX-HCS-EP-VAL-011',
    title: 'Fire safety procedure is required',
    ruleType: 'REQUIRED',
    targetPath: 'answers.fireSafetyProcedure',
    severity: 'CRITICAL',
    errorMessage: 'Document the residence fire safety procedure.',
    enabled: true,
    displayOrder: 110,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.validation
      .approvalDateRequired,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    code: 'TX-HCS-EP-VAL-012',
    title: 'Plan approval date is required',
    ruleType: 'REQUIRED',
    targetPath: 'answers.emergencyPlanApprovalDate',
    severity: 'HIGH',
    errorMessage: 'Enter the emergency plan approval date.',
    enabled: true,
    displayOrder: 120,
  },
  {
    id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.validation.approvedByRequired,
    requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    code: 'TX-HCS-EP-VAL-013',
    title: 'Approving authority is required',
    ruleType: 'REQUIRED',
    targetPath: 'answers.emergencyPlanApprovedBy',
    severity: 'HIGH',
    errorMessage: 'Identify the person who approved the emergency plan.',
    enabled: true,
    displayOrder: 130,
  },
];

export const texasHcsEmergencyPlanDocumentDefinition: DocumentDefinition = {
  id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.document,
  code: 'TX-HCS-DOC-EMERGENCY-PLAN',
  title: 'Residential Emergency Preparedness Plan',
  description:
    'A location-specific emergency preparedness plan generated from provider, residence, individual-support, and emergency-response information.',
  requirementIds: [TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement],
  domains: ['RESIDENTIAL', 'ADMINISTRATION', 'QUALITY'],
  templateKey: 'texas-hcs.emergency-preparedness-plan',
  version: '1.0.0',
  outputFormats: ['PDF', 'DOCX', 'HTML'],
  sections: [
    {
      id: 'tx-hcs-emergency-document-section-location',
      key: 'location',
      title: 'Residence and Plan Information',
      template: 'emergency-plan/location',
      displayOrder: 10,
      required: true,
    },
    {
      id: 'tx-hcs-emergency-document-section-command',
      key: 'direction-and-control',
      title: 'Direction and Control',
      template: 'emergency-plan/direction-and-control',
      displayOrder: 20,
      required: true,
    },
    {
      id: 'tx-hcs-emergency-document-section-risk',
      key: 'risk-assessment',
      title: 'Risk Assessment',
      template: 'emergency-plan/risk-assessment',
      displayOrder: 30,
      required: true,
    },
    {
      id: 'tx-hcs-emergency-document-section-support-needs',
      key: 'individual-support-needs',
      title: 'Individual Support Needs',
      template: 'emergency-plan/individual-support-needs',
      displayOrder: 40,
      required: true,
    },
    {
      id: 'tx-hcs-emergency-document-section-communication',
      key: 'communication',
      title: 'Emergency Communication',
      template: 'emergency-plan/communication',
      displayOrder: 50,
      required: true,
    },
    {
      id: 'tx-hcs-emergency-document-section-evacuation',
      key: 'evacuation',
      title: 'Evacuation',
      template: 'emergency-plan/evacuation',
      displayOrder: 60,
      required: true,
    },
    {
      id: 'tx-hcs-emergency-document-section-shelter',
      key: 'shelter-in-place',
      title: 'Shelter in Place',
      template: 'emergency-plan/shelter-in-place',
      displayOrder: 70,
      required: true,
    },
    {
      id: 'tx-hcs-emergency-document-section-transportation',
      key: 'transportation',
      title: 'Emergency Transportation',
      template: 'emergency-plan/transportation',
      displayOrder: 80,
      required: true,
    },
    {
      id: 'tx-hcs-emergency-document-section-continuity',
      key: 'continuity',
      title: 'Continuity of Essential Services',
      template: 'emergency-plan/continuity',
      displayOrder: 90,
      required: true,
    },
    {
      id: 'tx-hcs-emergency-document-section-utilities',
      key: 'utilities',
      title: 'Utility Failures',
      template: 'emergency-plan/utilities',
      displayOrder: 100,
      required: true,
    },
    {
      id: 'tx-hcs-emergency-document-section-medications',
      key: 'medications',
      title: 'Medications and Medical Supports',
      template: 'emergency-plan/medications',
      displayOrder: 110,
      required: true,
    },
    {
      id: 'tx-hcs-emergency-document-section-fire',
      key: 'fire-safety',
      title: 'Fire Safety',
      template: 'emergency-plan/fire-safety',
      displayOrder: 120,
      required: true,
    },
    {
      id: 'tx-hcs-emergency-document-section-contacts',
      key: 'contacts',
      title: 'Emergency Contacts',
      template: 'emergency-plan/contacts',
      displayOrder: 130,
      required: true,
    },
    {
      id: 'tx-hcs-emergency-document-section-approval',
      key: 'approval',
      title: 'Approval and Revision History',
      template: 'emergency-plan/approval',
      displayOrder: 140,
      required: true,
    },
  ],
  requiresApproval: true,
  requiresSignature: true,
  publishToBinder: true,
  binderSectionKey: 'emergency-preparedness',
  fileNameTemplate: '{{locationCode}}-emergency-plan-{{effectiveDate}}',
  effectiveDatePath: 'answers.emergencyPlanApprovalDate',
  expirationDatePath: 'derived.nextReviewDate',
};

export const texasHcsEmergencyPlanRenewalRule: RenewalRule = {
  id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.renewal,
  requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
  interval: 1,
  unit: 'YEARS',
  reminderDaysBefore: [90, 60, 30, 7],
  autoCreateDraft: true,
  carryForwardKnownValues: true,
  requireChangeConfirmation: true,
  ownerRole: 'PROGRAM_MANAGER',
  escalationRole: 'PROVIDER_ADMIN',
  enabled: true,
};

export const texasHcsEmergencyPlanGuidance: RegulatoryGuidance = {
  id: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.guidance,
  requirementId: TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
  summary:
    'Maintain a current, location-specific emergency plan that staff can follow to protect every individual during foreseeable emergencies.',
  rationale:
    'A generic policy is not enough. Emergency planning must reflect the residence, local hazards, available resources, and the support needs of the individuals who live there.',
  implementationGuidance:
    'Complete the emergency-plan questions for each residence, attach the evacuation map and emergency contact list, obtain approval, make the plan available at the residence, and review it after material changes or emergency events.',
  commonErrors: [
    'Using one generic emergency plan for every residence.',
    'Failing to address the specific support needs of each individual.',
    'Missing alternate evacuation or transportation arrangements.',
    'Outdated staff, emergency, or legally authorized representative contacts.',
    'No documented approval or review date.',
    'The plan exists but staff cannot explain their responsibilities.',
  ],
  bestPractices: [
    'Prepopulate known provider, residence, staff, and individual information.',
    'Review the plan whenever individuals, staffing, the residence, transportation, or emergency contacts change.',
    'Maintain both electronic and immediately accessible on-site copies.',
    'Use drill results and actual events to improve the plan.',
    'Keep emergency supplies and evacuation resources consistent with the written plan.',
  ],
  examples: [
    'A residence serving an individual who uses a wheelchair identifies accessible transportation and assigns staff responsibilities before an evacuation.',
    'A residence with refrigerated medications documents backup power, insulated transport, temperature control, and an alternate storage location.',
  ],
  providerFacingExplanation:
    'The provider must maintain a usable emergency plan for each residence—not merely a general company policy.',
  staffFacingExplanation:
    'Staff must know who is in charge, how to protect and account for each individual, where to go, who to call, and how essential supports will continue.',
  executiveExplanation:
    'Emergency planning is a critical health-and-safety control. Missing, generic, outdated, or unusable plans create immediate survey and operational risk.',
};

export interface TexasHcsEmergencyPreparednessBundle {
  source: RegulatorySource;
  rule: RegulatoryRule;
  requirement: RegulatoryRequirement;
  questions: RegulatoryQuestion[];
  evidenceRequirements: EvidenceRequirement[];
  validationRules: ValidationRule[];
  documentDefinition: DocumentDefinition;
  renewalRule: RenewalRule;
  guidance: RegulatoryGuidance;
}

export const texasHcsEmergencyPreparednessBundle: TexasHcsEmergencyPreparednessBundle =
  {
    source: texasHcsEmergencyPreparednessSource,
    rule: texasHcsEmergencyPreparednessRule,
    requirement: texasHcsEmergencyPlanRequirement,
    questions: texasHcsEmergencyPreparednessQuestions,
    evidenceRequirements:
      texasHcsEmergencyPreparednessEvidenceRequirements,
    validationRules: texasHcsEmergencyPreparednessValidationRules,
    documentDefinition: texasHcsEmergencyPlanDocumentDefinition,
    renewalRule: texasHcsEmergencyPlanRenewalRule,
    guidance: texasHcsEmergencyPlanGuidance,
  };