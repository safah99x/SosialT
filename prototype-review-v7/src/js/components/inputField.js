/**
 * Large soft rounded input — "content in progress" feel.
 * REVIEW: callers can now pass an initial value so the review build
 * pre-fills inputs and reviewers can advance through the flow fast.
 */
export function createInputField(placeholder = 'Type here...', value = '') {
  const wrapper = document.createElement('div');
  wrapper.className = 'input-field';
  const safeValue = String(value).replace(/"/g, '&quot;');
  wrapper.innerHTML = `
    <input
      type="text"
      class="input-field__input"
      placeholder="${placeholder}"
      id="main-input"
      value="${safeValue}"
    />
  `;
  return wrapper;
}
