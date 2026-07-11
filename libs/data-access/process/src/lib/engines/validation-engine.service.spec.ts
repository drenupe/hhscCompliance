import { TestBed } from '@angular/core/testing';

import {
  ImportTemplate,
  MappedImportTable,
} from '@hhsc-compliance/shared-models';

import { ValidationEngineService } from './validation-engine.service';

describe('ValidationEngineService', () => {
  let service: ValidationEngineService;

  const templates: ImportTemplate[] = [
    createTemplate('provider', 'Provider Information', 'provider.csv', 'required'),
    createTemplate('employees', 'Employees', 'employees.csv', 'required'),
    createTemplate('consumers', 'Consumers', 'consumers.csv', 'required'),
    createTemplate('locations', 'Residential Locations', 'locations.csv', 'required'),
    createTemplate('training', 'Training Records', 'training.csv', 'recommended'),
    createTemplate('authorizations', 'Authorizations', 'authorizations.csv', 'recommended'),
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationEngineService);
  });

  it('should pass when all 6 import files contain valid required data', () => {
    const result = service.evaluate(templates, validMappedTables());

    expect(result.errors).toBe(0);
    expect(result.warnings).toBe(0);
    expect(result.readyToBuild).toBe(true);
    expect(result.overallScore).toBe(100);
    expect(result.categories.length).toBe(6);
  });

  it('should validate missing provider required fields', () => {
    const tables = validMappedTables().map((table) =>
      table.id === 'provider'
        ? {
            ...table,
            records: [
              {
                agency_name: '',
                provider_number: '',
                license_number: '',
                administrator_name: 'Jane Smith',
                phone: '214-555-0100',
                email: 'admin@example.com',
                address: '123 Main St',
                city: 'Dallas',
                state: 'TX',
                zip: '75201',
              },
            ],
          }
        : table,
    );

    const result = service.evaluate(templates, tables);
    const provider = result.categories.find((item) => item.id === 'provider');

    expect(provider?.errors).toBeGreaterThan(0);
    expect(result.readyToBuild).toBe(false);
  });

  it('should validate employee missing and duplicate IDs', () => {
    const tables = validMappedTables().map((table) =>
      table.id === 'employees'
        ? {
            ...table,
            records: [
              {
                employee_id: 'EMP-001',
                first_name: 'Maria',
                last_name: 'Johnson',
                job_title: 'DSP',
                hire_date: '2026-01-15',
                phone: '214-555-0101',
                email: 'maria@example.com',
                status: 'active',
                assigned_location_id: 'LOC-001',
              },
              {
                employee_id: 'EMP-001',
                first_name: 'David',
                last_name: 'Smith',
                job_title: 'DSP',
                hire_date: '2026-01-20',
                phone: '214-555-0102',
                email: 'david@example.com',
                status: 'active',
                assigned_location_id: 'LOC-001',
              },
              {
                employee_id: '',
                first_name: 'Angela',
                last_name: 'Brown',
                job_title: '',
                hire_date: '',
                phone: '214-555-0103',
                email: 'angela@example.com',
                status: '',
                assigned_location_id: '',
              },
            ],
            recordCount: 3,
          }
        : table,
    );

    const result = service.evaluate(templates, tables);
    const employees = result.categories.find((item) => item.id === 'employees');

    expect(employees?.errors).toBeGreaterThan(0);
    expect(employees?.warnings).toBeGreaterThan(0);
    expect(result.readyToBuild).toBe(false);
  });

  it('should validate consumer required fields and warnings', () => {
    const tables = validMappedTables().map((table) =>
      table.id === 'consumers'
        ? {
            ...table,
            records: [
              {
                consumer_id: '',
                first_name: '',
                last_name: 'Harris',
                medicaid_number: '',
                date_of_birth: '',
                assigned_location_id: '',
                case_manager_name: 'Sarah Adams',
                level_of_need: '',
              },
            ],
            recordCount: 1,
          }
        : table,
    );

    const result = service.evaluate(templates, tables);
    const consumers = result.categories.find((item) => item.id === 'consumers');

    expect(consumers?.errors).toBeGreaterThan(0);
    expect(consumers?.warnings).toBeGreaterThan(0);
    expect(result.readyToBuild).toBe(false);
  });

  it('should validate location capacity and required location fields', () => {
    const tables = validMappedTables().map((table) =>
      table.id === 'locations'
        ? {
            ...table,
            records: [
              {
                location_id: '',
                location_name: '',
                location_type: '',
                address: '',
                city: '',
                state: '',
                zip: '',
                capacity: 'four',
              },
            ],
            recordCount: 1,
          }
        : table,
    );

    const result = service.evaluate(templates, tables);
    const locations = result.categories.find((item) => item.id === 'locations');

    expect(locations?.errors).toBeGreaterThan(0);
    expect(locations?.warnings).toBeGreaterThan(0);
    expect(result.readyToBuild).toBe(false);
  });

  it('should validate training records', () => {
    const tables = validMappedTables().map((table) =>
      table.id === 'training'
        ? {
            ...table,
            records: [
              {
                employee_id: '',
                training_name: '',
                completion_date: '',
                expiration_date: '',
                trainer: '',
              },
            ],
            recordCount: 1,
          }
        : table,
    );

    const result = service.evaluate(templates, tables);
    const training = result.categories.find((item) => item.id === 'training');

    expect(training?.errors).toBeGreaterThan(0);
    expect(training?.warnings).toBeGreaterThan(0);
    expect(result.readyToBuild).toBe(false);
  });

  it('should validate authorization required fields and missing authorized units', () => {
    const tables = validMappedTables().map((table) =>
      table.id === 'authorizations'
        ? {
            ...table,
            records: [
              {
                consumer_id: '',
                service_code: '',
                service_name: '',
                start_date: '',
                end_date: '',
                authorized_units: '',
              },
            ],
            recordCount: 1,
          }
        : table,
    );

    const result = service.evaluate(templates, tables);
    const authorizations = result.categories.find(
      (item) => item.id === 'authorizations',
    );

    expect(authorizations?.errors).toBeGreaterThan(0);
    expect(authorizations?.warnings).toBeGreaterThan(0);
    expect(result.readyToBuild).toBe(false);
  });

  it('should treat blank recommended file as warning when not uploaded', () => {
    const partialTemplates = templates.map((template) =>
      template.id === 'training'
        ? {
            ...template,
            uploaded: false,
          }
        : template,
    );

    const result = service.evaluate(partialTemplates, validMappedTables());
    const training = result.categories.find((item) => item.id === 'training');

    expect(training?.warnings).toBeGreaterThan(0);
  });
});

function createTemplate(
  id: string,
  name: string,
  expectedFileName: string,
  requirement: 'required' | 'recommended' | 'optional',
): ImportTemplate {
  return {
    id,
    name,
    description: '',
    requirement,
    expectedFileName,
    status: 'uploaded',
    uploaded: true,
    recordsFound: 1,
  };
}

function validMappedTables(): MappedImportTable[] {
  return [
    {
      id: 'provider',
      name: 'provider.csv',
      recordCount: 1,
      records: [
        {
          agency_name: 'ABC Residential Services',
          provider_number: '123456',
          license_number: 'HCS-123456',
          administrator_name: 'Jane Smith',
          phone: '214-555-0100',
          email: 'admin@example.com',
          address: '123 Main St',
          city: 'Dallas',
          state: 'TX',
          zip: '75201',
        },
      ],
    },
    {
      id: 'employees',
      name: 'employees.csv',
      recordCount: 1,
      records: [
        {
          employee_id: 'EMP-001',
          first_name: 'Maria',
          last_name: 'Johnson',
          job_title: 'Direct Support Professional',
          hire_date: '2026-01-15',
          phone: '214-555-0101',
          email: 'maria@example.com',
          status: 'active',
          assigned_location_id: 'LOC-001',
        },
      ],
    },
    {
      id: 'consumers',
      name: 'consumers.csv',
      recordCount: 1,
      records: [
        {
          consumer_id: 'CON-001',
          first_name: 'James',
          last_name: 'Harris',
          medicaid_number: 'MCD123456',
          date_of_birth: '1985-06-10',
          assigned_location_id: 'LOC-001',
          case_manager_name: 'Sarah Adams',
          level_of_need: 'LON 5',
        },
      ],
    },
    {
      id: 'locations',
      name: 'locations.csv',
      recordCount: 1,
      records: [
        {
          location_id: 'LOC-001',
          location_name: 'Main Street Home',
          location_type: 'Four Person Home',
          address: '456 Main St',
          city: 'Dallas',
          state: 'TX',
          zip: '75216',
          capacity: '4',
        },
      ],
    },
    {
      id: 'training',
      name: 'training.csv',
      recordCount: 1,
      records: [
        {
          employee_id: 'EMP-001',
          training_name: 'Abuse Neglect Exploitation',
          completion_date: '2026-01-20',
          expiration_date: '2027-01-20',
          trainer: 'Jane Smith',
        },
      ],
    },
    {
      id: 'authorizations',
      name: 'authorizations.csv',
      recordCount: 1,
      records: [
        {
          consumer_id: 'CON-001',
          service_code: 'HCS',
          service_name: 'Supported Home Living',
          start_date: '2026-01-01',
          end_date: '2026-12-31',
          authorized_units: '365',
        },
      ],
    },
  ];
}