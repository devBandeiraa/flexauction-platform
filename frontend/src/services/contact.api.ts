export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Sends a contact message. Mocked for now (resolves after ~1s); swap the body
 * for a real `apiFetch('/contact', { method: 'POST', body: payload })` when the
 * backend endpoint exists.
 */
export const contactService = {
  send(payload: ContactPayload): Promise<{ ok: true }> {
    return new Promise((resolve) => {
      void payload; // sent to the API once the /contact endpoint exists
      setTimeout(() => resolve({ ok: true }), 1000);
    });
  },
};
