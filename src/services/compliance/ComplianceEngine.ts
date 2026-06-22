import {
  ComplianceViolation,
  ComplianceKeywords,
  PractitionerViolationType,
  CompliancePattern,
} from "@/types/compliance";

/**
 * Automated Compliance Detection Engine
 * Monitors all practitioner communications for policy violations
 */
export class ComplianceEngine {
  private keywordPatterns: ComplianceKeywords = {
    externalPaymentMethods: [
      "paypal",
      "venmo",
      "cashapp",
      "square",
      "stripe",
      "wise",
      "bank transfer",
      "wire transfer",
      "my paypal",
      "send me payment",
      "pay me directly",
      "external payment",
      "outside the platform",
    ],
    offPlatformSolicitation: [
      "off platform",
      "outside soul echoes",
      "private session",
      "external coaching",
      "independent work",
      "my own practice",
      "leave the app",
      "move our work outside",
      "direct contract",
      "personal arrangement",
      "side session",
    ],
    predatoryLanguage: [
      "exclusive access",
      "limited spots",
      "higher rate",
      "premium pricing",
      "vip treatment",
      "special deal",
      "secret rate",
      "undercut",
      "better price off platform",
      "negotiate outside",
    ],
  };

  /**
   * Scan message content for compliance violations
   * Returns violations if detected
   */
  async scanMessage(
    practitionerId: string,
    practitionerName: string,
    messageContent: string,
    messageId: string
  ): Promise<ComplianceViolation[]> {
    const violations: ComplianceViolation[] = [];
    const lowerContent = messageContent.toLowerCase();

    // Check for external payment method links/mentions
    if (this.containsExternalPaymentReference(lowerContent)) {
      violations.push({
        id: `violation-${messageId}-payment`,
        practitionerId,
        practitionerName,
        violationType: PractitionerViolationType.EXTERNAL_PAYMENT_LINK,
        severity: "critical",
        detectionMethod: "automated_keyword",
        evidence: `Message contains external payment method reference: ${messageContent.substring(0, 100)}...`,
        flaggedAt: new Date(),
        status: "flagged",
        confidential: false,
      });
    }

    // Check for off-platform solicitation
    if (this.containsOffPlatformSolicitation(lowerContent)) {
      violations.push({
        id: `violation-${messageId}-offplatform`,
        practitionerId,
        practitionerName,
        violationType: PractitionerViolationType.OFF_PLATFORM_SOLICITATION,
        severity: "critical",
        detectionMethod: "automated_keyword",
        evidence: `Message solicits off-platform work: ${messageContent.substring(0, 100)}...`,
        flaggedAt: new Date(),
        status: "flagged",
        confidential: false,
      });
    }

    // Check for predatory language
    if (this.containsPredatoryLanguage(lowerContent)) {
      violations.push({
        id: `violation-${messageId}-predatory`,
        practitionerId,
        practitionerName,
        violationType: PractitionerViolationType.PREDATORY_MESSAGING,
        severity: "warning",
        detectionMethod: "automated_keyword",
        evidence: `Message contains predatory pricing language: ${messageContent.substring(0, 100)}...`,
        flaggedAt: new Date(),
        status: "flagged",
        confidential: false,
      });
    }

    // Check for payment links (URLs)
    const paypalMatch = messageContent.match(
      /(?:https?:\/\/)?(?:www\.)?paypal\.(?:com|me)\S+/gi
    );
    const venmoMatch = messageContent.match(
      /(?:https?:\/\/)?(?:www\.)?venmo\.com\S+/gi
    );
    const cashappMatch = messageContent.match(
      /(?:https?:\/\/)?(?:www\.)?cash\.app\S+/gi
    );

    if (paypalMatch || venmoMatch || cashappMatch) {
      violations.push({
        id: `violation-${messageId}-link`,
        practitionerId,
        practitionerName,
        violationType: PractitionerViolationType.EXTERNAL_PAYMENT_LINK,
        severity: "critical",
        detectionMethod: "automated_link_detection",
        evidence: `Message contains external payment link: ${[paypalMatch, venmoMatch, cashappMatch]
          .filter(Boolean)
          .join(", ")}`,
        flaggedAt: new Date(),
        status: "flagged",
        confidential: false,
      });
    }

    return violations;
  }

  /**
   * Check for external payment method keywords
   */
  private containsExternalPaymentReference(text: string): boolean {
    return this.keywordPatterns.externalPaymentMethods.some((keyword) =>
      text.includes(keyword)
    );
  }

  /**
   * Check for off-platform solicitation keywords
   */
  private containsOffPlatformSolicitation(text: string): boolean {
    return this.keywordPatterns.offPlatformSolicitation.some((keyword) =>
      text.includes(keyword)
    );
  }

  /**
   * Check for predatory pricing language
   */
  private containsPredatoryLanguage(text: string): boolean {
    return this.keywordPatterns.predatoryLanguage.some((keyword) =>
      text.includes(keyword)
    );
  }

  /**
   * Check if hourly rate exceeds $55 cap
   */
  async validateSessionRate(
    practitionerId: string,
    ratePerHour: number
  ): Promise<ComplianceViolation | null> {
    if (ratePerHour > 55) {
      return {
        id: `violation-rate-${practitionerId}-${Date.now()}`,
        practitionerId,
        practitionerName: "", // Will be populated by caller
        violationType: PractitionerViolationType.PRICE_GOUGING,
        severity: "critical",
        detectionMethod: "automated_keyword",
        evidence: `Practitioner attempted to charge $${ratePerHour}/hour, exceeding $55/hour cap`,
        flaggedAt: new Date(),
        status: "flagged",
        confidential: false,
      };
    }
    return null;
  }

  /**
   * Escalate violation to account suspension
   * Triggered when violations are verified
   */
  async escalateToSuspension(
    violation: ComplianceViolation,
    adminId: string
  ): Promise<ComplianceViolation> {
    return {
      ...violation,
      status: "verified",
      actionTaken: "suspended",
      actionDate: new Date(),
      reviewedBy: adminId,
      reviewedAt: new Date(),
    };
  }

  /**
   * Permanent termination (after verified suspension escalation)
   */
  async escalateToTermination(
    violation: ComplianceViolation,
    adminId: string
  ): Promise<ComplianceViolation> {
    return {
      ...violation,
      status: "verified",
      actionTaken: "terminated",
      actionDate: new Date(),
      reviewedBy: adminId,
      reviewedAt: new Date(),
    };
  }
}
