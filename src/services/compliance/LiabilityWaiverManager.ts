import { OffPlatformWaiver, WaiverStatus } from "@/types/compliance";

/**
 * Liability Waiver Management
 * Handles mandatory digital contracts when users leave Soul Echoes
 * to work with practitioners privately
 */
export class LiabilityWaiverManager {
  /**
   * Generate the standard off-platform waiver text
   */
  generateWaiverText(practitionerName: string): string {
    return `
OFF-PLATFORM SERVICES LIABILITY RELEASE & WAIVER

Effective Date: ${new Date().toLocaleDateString()}

IMPORTANT: By signing this waiver, you acknowledge that you are leaving the Soul Echoes platform
and entering into a private, separate agreement with ${practitionerName}.

Acknowledgments:

1. LEAVING SAFE SPACE: You explicitly acknowledge that you are departing the Soul Echoes ecosystem,
   which provides platform-governed protections, pricing oversight, and dispute resolution.

2. PRIVATE AGREEMENT: You are entering into a separate, private agreement with ${practitionerName}
   under terms negotiated outside the Soul Echoes environment. This is NOT a Soul Echoes service.

3. RELEASE OF LIABILITY: By signing this waiver, you fully and completely release Soul Echoes,
   the Rise Up Healing 501(c)(3) nonprofit, and all platform staff from ALL liability—financial,
   physical, emotional, psychological, legal, and otherwise—arising from your private engagement
   with ${practitionerName}.

4. NO PLATFORM OVERSIGHT: Soul Echoes will not:
   - Monitor the quality or safety of private sessions
   - Enforce pricing agreements
   - Resolve disputes
   - Provide refunds or recourse
   - Hold practitioners accountable to platform standards

5. YOUR RESPONSIBILITY: You assume full responsibility for:
   - Vetting the practitioner independently
   - Negotiating terms and payment directly
   - Ensuring your own safety and wellbeing
   - Seeking legal recourse separately if disputes arise

6. INDEMNIFICATION: You agree to indemnify and hold harmless Soul Echoes, the Rise Up Healing
   nonprofit, and all platform personnel from any claims, damages, or losses arising from your
   private engagement.

I confirm that I have read and fully understand this waiver, and I voluntarily release Soul Echoes
from all liability for services provided outside the platform.

Signature Required Below
    `;
  }

  /**
   * Create a new waiver for user signature
   */
  async initiateWaiver(
    userId: string,
    practitionerId: string,
    practitionerName: string
  ): Promise<OffPlatformWaiver> {
    const waiverText = this.generateWaiverText(practitionerName);

    return {
      id: `waiver-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      practitionerId,
      practitionerName,
      waiverText,
      signatureUrl: "", // To be filled after signing
      signingDate: new Date(),
      ipAddress: "", // Will be captured from browser
      userAgent: "", // Will be captured from browser
      status: WaiverStatus.PENDING,
      acknowledgesLeavingSafeSpace: false,
      acknowledgesReleasingPlatform: false,
      acknowledgesNoLiability: false,
      acknowledgesPrivateAgreement: false,
      createdAt: new Date(),
    };
  }

  /**
   * Sign the waiver digitally
   * All acknowledgments MUST be true before signing
   */
  async signWaiver(
    waiver: OffPlatformWaiver,
    signatureData: string, // Base64 or canvas data from signature pad
    ipAddress: string,
    userAgent: string,
    acknowledgments: {
      leavingSafeSpace: boolean;
      releasingPlatform: boolean;
      noLiability: boolean;
      privateAgreement: boolean;
    }
  ): Promise<OffPlatformWaiver> {
    // Validate all acknowledgments are checked
    if (
      !acknowledgments.leavingSafeSpace ||
      !acknowledgments.releasingPlatform ||
      !acknowledgments.noLiability ||
      !acknowledgments.privateAgreement
    ) {
      throw new Error(
        "All acknowledgments must be explicitly confirmed to sign the waiver"
      );
    }

    // Validate signature
    if (!signatureData || signatureData.length < 50) {
      throw new Error("Invalid signature. Please sign the waiver.");
    }

    const signedWaiver: OffPlatformWaiver = {
      ...waiver,
      signatureUrl: signatureData,
      signingDate: new Date(),
      ipAddress,
      userAgent,
      status: WaiverStatus.SIGNED,
      acknowledgesLeavingSafeSpace: acknowledgments.leavingSafeSpace,
      acknowledgesReleasingPlatform: acknowledgments.releasingPlatform,
      acknowledgesNoLiability: acknowledgments.noLiability,
      acknowledgesPrivateAgreement: acknowledgments.privateAgreement,
    };

    // Log waiver signing for audit trail
    await this.auditWaiverSigning(signedWaiver);

    return signedWaiver;
  }

  /**
   * Reject waiver (user does not agree to terms)
   */
  async rejectWaiver(waiver: OffPlatformWaiver): Promise<OffPlatformWaiver> {
    return {
      ...waiver,
      status: WaiverStatus.REJECTED,
    };
  }

  /**
   * Verify waiver was signed before allowing off-platform transition
   */
  async verifyWaiverSigned(waiverI: string): Promise<boolean> {
    // In production, query database
    // Check if waiver.status === WaiverStatus.SIGNED
    return true;
  }

  private async auditWaiverSigning(waiver: OffPlatformWaiver): Promise<void> {
    // Log to audit trail for legal compliance
    const auditEvent = {
      eventType: "waiver_signed",
      userId: waiver.userId,
      practitionerId: waiver.practitionerId,
      waiverDate: waiver.signingDate,
      ipAddress: waiver.ipAddress,
      userAgent: waiver.userAgent,
      timestamp: new Date(),
    };

    // Emit audit event
    const event = new CustomEvent("waiverAudit", { detail: auditEvent });
    document.dispatchEvent(event);
  }
}
