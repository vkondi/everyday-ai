/**
 * Converts technical error messages to user-friendly messages
 * @param error - The technical error message
 * @param context - Optional context for more specific error messages (e.g., 'email', 'travel')
 * @returns User-friendly error message
 */
export function getUserFriendlyError(error: string, context?: string): string {
  // JSON parsing errors
  if (error.includes('Unexpected token') || error.includes('not valid JSON')) {
    return "We're experiencing technical difficulties. Please try again in a few minutes.";
  }

  // Network errors
  if (error.includes('fetch') || error.includes('network') || error.includes('Failed to fetch')) {
    return 'Unable to connect to our servers. Please check your internet connection and try again.';
  }

  // Timeout errors
  if (error.includes('timeout') || error.includes('AbortError')) {
    return 'The request took too long to complete. Please try again with a simpler request or check your connection.';
  }

  // Server error responses
  if (error.includes('Server error (500)') || error.includes('Internal Server Error')) {
    return "We're experiencing technical difficulties. Please try again in a few minutes.";
  }

  if (error.includes('Server error (429)') || error.includes('Too Many Requests')) {
    return "You've made too many requests. Please wait a moment before trying again.";
  }

  if (error.includes('Server error (400)') || error.includes('Bad Request')) {
    return 'There was an issue with your request. Please check your input and try again.';
  }

  if (error.includes('Server error (401)') || error.includes('Unauthorized')) {
    return 'Authentication failed. Please refresh the page and try again.';
  }

  if (error.includes('Server error (403)') || error.includes('Forbidden')) {
    return 'Access denied. Please check your permissions and try again.';
  }

  if (error.includes('Server error (404)') || error.includes('Not Found')) {
    return 'The requested service is currently unavailable. Please try again later.';
  }

  if (error.includes('Server error (502)') || error.includes('Bad Gateway')) {
    return 'Our servers are temporarily unavailable. Please try again in a few minutes.';
  }

  if (error.includes('Server error (503)') || error.includes('Service Unavailable')) {
    return 'Our service is temporarily down for maintenance. Please try again later.';
  }

  if (error.includes('Server error (504)') || error.includes('Gateway Timeout')) {
    return 'The request took too long to process. Please try again with a simpler request.';
  }

  // Invalid response format
  if (error.includes('invalid response format')) {
    return 'We received an unexpected response from our servers. Please try again.';
  }

  // Model-specific errors
  if (error.includes('model') || error.includes('AI') || error.includes('generation')) {
    const contextMessage =
      context === 'email'
        ? "We're having trouble processing your email. Please try again or contact support if the issue persists."
        : context === 'travel'
          ? "We're having trouble generating your itinerary. Please try again or contact support if the issue persists."
          : "We're having trouble processing your request. Please try again or contact support if the issue persists.";
    return contextMessage;
  }

  // Generic fallback
  return 'Something went wrong. Please try again or contact support if the problem continues.';
}

/**
 * Safely handles API responses and extracts error messages
 * @param response - The fetch response object
 * @param defaultError - Default error message if parsing fails
 * @returns Promise that resolves to an error message
 */
export async function handleApiError(response: Response, defaultError: string): Promise<string> {
  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      const errorData = (await response.json()) as { error?: string };
      return errorData.error || defaultError;
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      // If JSON parsing fails, throw a generic error
      return `Server error (${response.status}): ${response.statusText}`;
    }
  } else {
    // Handle non-JSON responses (like HTML error pages)
    const errorText = await response.text();
    console.error('Non-JSON error response:', errorText);
    return `Server error (${response.status}): ${response.statusText}`;
  }
}

/**
 * Validates that a successful response is JSON
 * @param response - The fetch response object
 * @throws Error if response is not JSON
 */
export function validateJsonResponse(response: Response): void {
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Server returned an invalid response format');
  }
}
