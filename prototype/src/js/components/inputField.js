/**
 * Large soft rounded input — "content in progress" feel
 */
export function createInputField(placeholder = 'Type here...') {
  const wrapper = document.createElement('div');
  wrapper.className = 'input-field';
  wrapper.innerHTML = `
    <input
      type="text"
      class="input-field__input"
      placeholder="${placeholder}"
      id="main-input"
    />
  `;
  return wrapper;
}
