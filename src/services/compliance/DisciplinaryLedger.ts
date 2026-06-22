import {
  DisciplinaryRecord,
  ShadyBusinessReport,
  ReportStatus,
  PractitionerViolationType,
} from "@/types/compliance";

/**
 * Public Disciplinary Ledger & Reporting System
 * Maintains transparent record of banned/problematic practitioners
 * and manages user reports for anonymous investigations
 */
export class DisciplinaryLedger {
  /**
   * Create a new disciplinary record (public)
   * This is displayed in the community portal as a warning
   */
  async createDisciplinaryRecord(
    practitionerId: string,
    practitionerName: string,
    violation: PractitionerViolationType,
    reason: string,
    victimCount?: number,
    affectedUserIds?: string[]
  ): Promise<DisciplinaryRecord> {
    const record: DisciplinaryRecord = {
      id: `disciplinary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      practitionerId,
      practitionerName,
      violationType: violation,
      reason,
      banDate: new Date(),
      bannedPermanently: true,
      publiclyListed: true,
      victimCount,
      affectedUserIds,
      listingDate: new Date(),
    };

    return record;
  }

  /**
   * Retrieve all public disciplinary records
   * Shown in community portal warning system
   */
  async getPublicDisciplinaryLedger(): Promise<DisciplinaryRecord[]> {
    // In production, query database with filters:
    // WHERE publiclyListed = true AND bannedPermanently = true
    return [];
  }

  /**
   * Search disciplinary ledger by practitioner name
   * Users can check if a practitioner has violations
   */
  async searchDisciplinaryRecord(practitionerName: string): Promise<DisciplinaryRecord | null> {
    // Full-text search
    return null;
  }

  /**
   * Submit anonymous report of shady business practices
   */
  async submitShadyBusinessReport(
    reporterId: string,
    practitionerId: string,
    practitionerName: string,
    violationType: PractitionerViolationType,
    description: string,
    evidence: string[],
    dateOfIncident: Date,
    anonymous: boolean = true
  ): Promise<ShadyBusinessReport> {
    const report: ShadyBusinessReport = {
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      reporterId: anonymous ? "ANONYMOUS" : reporterId,
      practitionerId,
      practitionerName,
      reportType: violationType,
      description,
      evidence,
      dateOfIncident,
      submittedAt: new Date(),
      status: ReportStatus.SUBMITTED,
      anonymous,
      userConsent: true,
      followUpRequired: false,
    };

    // Automatically flag for review if critical
    if (this.isCriticalViolation(violationType)) {
      report.status = ReportStatus.UNDER_REVIEW;
      report.followUpRequired = true;
    }

    return report;
  }

  /**
   * Admin: Review submitted report
   */
  async reviewReport(
    report: ShadyBusinessReport,
    adminId: string,
    findings: string,
    verified: boolean,
    actionRecommended?: string
  ): Promise<ShadyBusinessReport> {
    const reviewedReport: ShadyBusinessReport = {
      ...report,
      status: verified ? ReportStatus.VERIFIED : ReportStatus.FALSE_REPORT,
      reviewedBy: adminId,
      reviewedAt: new Date(),
      findings,
      actionRecommended,
    };

    // If verified, trigger disciplinary action
    if (verified && actionRecommended === "ban") {
      await this.escalateToPublicListing(report, adminId);
    }

    return reviewedReport;
  }

  /**
   * Escalate verified report to public disciplinary ledger
   */
  private async escalateToPublicListing(
    report: ShadyBusinessReport,
    adminId: string
  ): Promise<DisciplinaryRecord> {
    const disciplinaryRecord = await this.createDisciplinaryRecord(
      report.practitionerId,
      report.practitionerName,
      report.reportType,
      `Verified violation: ${report.description}`,
      undefined,
      report.reporterId === "ANONYMOUS" ? undefined : [report.reporterId]
    );

    disciplinaryRecord.reportedBy = "User Report";
    disciplinaryRecord.confidentialDetails = report.description;

    return disciplinaryRecord;
  }

  /**
   * Get all reports for a specific practitioner (admin view)
   */
  async getPractitionerReports(
    practitionerId: string
  ): Promise<ShadyBusinessReport[]> {
    // In production, query database
    return [];
  }

  /**
   * Get report statistics (admin dashboard)
   */
  async getReportStatistics(): Promise<{
    totalReports: number;
    verifiedViolations: number;
    falseReports: number;
    underReview: number;
    bannedPractitioners: number;
  }> {
    return {
      totalReports: 0,
      verifiedViolations: 0,
      falseReports: 0,
      underReview: 0,
      bannedPractitioners: 0,
    };
  }

  /**
   * Notify affected users when practitioner is banned
   */
  async notifyAffectedUsers(
    disciplinaryRecord: DisciplinaryRecord
  ): Promise<void> {
    if (disciplinaryRecord.affectedUserIds) {
      // Send notifications to all users who worked with banned practitioner
      const notification = {
        type: "practitioner_banned",
        practitionerName: disciplinaryRecord.practitionerName,
        reason: disciplinaryRecord.reason,
        banDate: disciplinaryRecord.banDate,
      };

      // Emit notification event for each user
      disciplinaryRecord.affectedUserIds.forEach((userId) => {
        const event = new CustomEvent("practitionerBanned", {
          detail: { userId, ...notification },
        });
        document.dispatchEvent(event);
      });
    }
  }

  /**
   * Determine if violation is critical enough to require immediate action
   */
  private isCriticalViolation(violationType: PractitionerViolationType): boolean {
    const criticalViolations = [
      PractitionerViolationType.FRAUD,
      PractitionerViolationType.EXTERNAL_PAYMENT_LINK,
      PractitionerViolationType.PREDATORY_MESSAGING,
      PractitionerViolationType.OFF_PLATFORM_SOLICITATION,
    ];

    return criticalViolations.includes(violationType);
  }
}
