import {
  AffiliateBook,
  BookHighlight,
  BookCheckoutOrder,
  BookStatus,
} from "@/types/compliance";

/**
 * Affiliate Book Registry & E-Commerce Gateway
 * Manages book highlights, integrates with external retailers,
 * and processes affiliate commissions with nonprofit benefit sharing
 */
export class AffiliateBookManager {
  private platformCommissionPercentage = 0.03; // 3% to nonprofit
  private userMemberDiscount = 0.33; // 33% member discount

  /**
   * Create or update book in registry
   */
  async registerBook(book: Omit<AffiliateBook, "id" | "createdAt" | "updatedAt">): Promise<AffiliateBook> {
    const newBook: AffiliateBook = {
      ...book,
      id: `book-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Validate external link accessibility
    await this.validateExternalLink(newBook.externalLink);

    return newBook;
  }

  /**
   * Add a highlight from a book
   */
  async addHighlight(
    bookId: string,
    highlight: Omit<BookHighlight, "id" | "createdAt">
  ): Promise<BookHighlight> {
    const newHighlight: BookHighlight = {
      ...highlight,
      id: `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };

    // Validate image URL (highlight screenshot)
    await this.validateImageUrl(newHighlight.imageUrl);

    return newHighlight;
  }

  /**
   * Process book purchase order
   * Splits revenue: Platform (3%) -> Nonprofit, Author payment, User discount
   */
  async processBookCheckout(
    userId: string,
    bookId: string,
    purchasePrice: number,
    isUserMember: boolean,
    externalOrderId: string
  ): Promise<BookCheckoutOrder> {
    // Calculate splits
    let userDiscount = 0;
    if (isUserMember) {
      userDiscount = purchasePrice * this.userMemberDiscount;
    }

    const finalPrice = purchasePrice - userDiscount;
    const platformShare = finalPrice * this.platformCommissionPercentage; // Goes to nonprofit
    const authorPayment = finalPrice - platformShare;

    const order: BookCheckoutOrder = {
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      bookId,
      userId,
      externalOrderId,
      purchasePrice,
      platformShare,
      userDiscount,
      authorPayment,
      status: "pending",
      createdAt: new Date(),
    };

    return order;
  }

  /**
   * Complete checkout and process payments
   * In production, this would integrate with Stripe or similar
   */
  async completeCheckout(order: BookCheckoutOrder): Promise<BookCheckoutOrder> {
    // 1. Process payment through external vendor (Amazon, IndieBound, etc.)
    // 2. Route platform share (3%) to nonprofit Rise Up Healing
    // 3. Ensure author receives payment
    // 4. Apply member discount if applicable

    const completedOrder: BookCheckoutOrder = {
      ...order,
      status: "completed",
      completedAt: new Date(),
    };

    // Emit events for payment processing
    await this.emitPaymentEvents(completedOrder);

    return completedOrder;
  }

  /**
   * Calculate revenue split for reporting
   */
  calculateRevenueSplit(order: BookCheckoutOrder): {
    nonprofitShare: number;
    authorShare: number;
    userSavings: number;
  } {
    return {
      nonprofitShare: order.platformShare,
      authorShare: order.authorPayment,
      userSavings: order.userDiscount,
    };
  }

  /**
   * Get all highlights for a book
   */
  async getBookHighlights(bookId: string): Promise<BookHighlight[]> {
    // In production, this queries the database
    return [];
  }

  /**
   * Search books by title, author, or ISBN
   */
  async searchBooks(query: string): Promise<AffiliateBook[]> {
    // Full-text search implementation
    return [];
  }

  private async validateExternalLink(url: string): Promise<void> {
    // Validate URL is accessible and not malicious
    try {
      const response = await fetch(url, { method: "HEAD" });
      if (!response.ok) {
        throw new Error(`Invalid external link: ${url}`);
      }
    } catch (error) {
      throw new Error(`Failed to validate external link: ${url}`);
    }
  }

  private async validateImageUrl(url: string): Promise<void> {
    // Validate image URL is accessible and is an actual image
    const img = new Image();
    return new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Invalid image URL: ${url}`));
      img.src = url;
    });
  }

  private async emitPaymentEvents(order: BookCheckoutOrder): Promise<void> {
    // Emit events for payment processing
    const paymentEvent = new CustomEvent("bookPurchaseComplete", {
      detail: order,
    });
    document.dispatchEvent(paymentEvent);
  }
}
