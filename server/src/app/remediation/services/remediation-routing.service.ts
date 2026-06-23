import { Injectable } from '@nestjs/common';

@Injectable()
export class RemediationRoutingService {
  getRoute(module: string, subcategory?: string | null) {
    if (module === 'RESIDENTIAL' && subcategory === 'FIRE_DRILLS') {
      return { routeCommands: ['/residential/fire-drills'] };
    }

    if (module === 'RESIDENTIAL' && subcategory === 'HOT_WATER') {
      return {
        routeCommands: ['/residential/home-environment'],
        queryParams: { section: 'hot-water' },
      };
    }

    if (module === 'RESIDENTIAL' && subcategory === 'EMERGENCY_PLANS') {
      return { routeCommands: ['/residential/emergency-plans'] };
    }

    return { routeCommands: ['/remediation'] };
  }
}