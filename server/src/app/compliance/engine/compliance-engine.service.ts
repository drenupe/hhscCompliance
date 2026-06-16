import { Injectable } from '@nestjs/common';

import { ResidentialComplianceService } from './residential/residential-compliance.service';

type EvalResult = {
  locationId: string;
  module: string;
  subcategory: string;
  wrote: Array<{
    id: string;
    ruleCode: string;
    status: string;
    severity: string;
  }>;
};

@Injectable()
export class ComplianceEngineService {
  constructor(
    private readonly residentialCompliance: ResidentialComplianceService,
  ) {}

  async evaluateLocation(
    locationId: string,
  ): Promise<{ locationId: string; results: EvalResult[] }> {
    const results: EvalResult[] = [];

    results.push(...(await this.residentialCompliance.evaluate(locationId)));

    return {
      locationId,
      results,
    };
  }

  async evaluateResidential(locationId: string): Promise<EvalResult[]> {
    return this.residentialCompliance.evaluate(locationId);
  }
}