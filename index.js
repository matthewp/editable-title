
function editModeView() {
  const template = document.createElement('template');
  template.innerHTML = /* html */ `
    <div class="edit">
      <input type="text">
      <button type="button" class="save">Save</button>
      <button type="button" class="cancel">Cancel</button>
    </div>
  `;

  function clone() {
    return document.importNode(template.content, true).firstElementChild;
  }

  function init() {
    // DOM variables
    let frag = clone();
    let inputNode = frag.querySelector('input');
    let saveNode = frag.querySelector('.save');
    let cancelNode = frag.querySelector('.cancel');

    // State variables
    let title, saveFn, cancelFn;

    // DOM update functions
    function setInputNode(value) {
      inputNode.value = value;
    }

    function setInputNodeFocus() {
      inputNode.focus();
    }

    // State update functions
    function setTitle(value) {
      if(title !== value) {
        title = value;
        setInputNode(value);
      }
    }

    // Event dispatchers
    function dispatchClose() {
      let ev = new CustomEvent('close', {
        bubbles: true
      });
      frag.dispatchEvent(ev);
    }

    function dispatchSave() {
      let ev = new CustomEvent('save', {
        bubbles: true,
        detail: title
      });
      frag.dispatchEvent(ev);
    }

    // Event listeners
    function handleSave() {
      let newValue = inputNode.value;
      if(title !== newValue) {
        setTitle(inputNode.value);
        dispatchSave();
      }

      dispatchClose();
    }

    function onSave() {
      handleSave();
    }

    function onKeyUp(ev) {
      if(ev.keyCode === 13) {
        handleSave();
      }
    }

    function onCancel() {
      setInputNode(title);
      dispatchClose();
    }

    // Initialization
    saveNode.addEventListener('click', onSave);
    cancelNode.addEventListener('click', onCancel);
    inputNode.addEventListener('keyup', onKeyUp);

    function disconnect() {
      saveNode.removeEventListener('click', onSave);
      cancelNode.removeEventListener('click', onCancel);
      inputNode.removeEventListener('keyup', onKeyUp);
    }

    function update(data = {}) {
      if(data.title != null) setTitle(data.title);
      if(data.focus) setInputNodeFocus();
      return frag;
    }

    update.disconnect = disconnect;

    return update;
  }

  return init;
}

const editMode = editModeView();

const template = document.createElement('template');
template.innerHTML = /* html */ `
  <div>
    <style>
      :host {
        display: block;
      }

      .edit {
        display: none;
      }

      .edit.open {
        display: flex;
      }

      .edit > * {
        margin-right: 5px;
      }

      .edit button:last-of-type {
        margin-right: 0;
      }

      .title.closed {
        display: none;
      }

      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      button {
        font-size: var(--button-font-size);
        background-color: var(--button-background-color);
        border: var(--button-border);
      }

      input {
        height: var(--input-height);
        width: var(--input-width);
        font-size: var(--input-font-size);
        flex: 1;
      }

      input:focus {
        outline: var(--input-outline, -webkit-focus-ring-color auto 5px);
      }
    </style>
    <div class="title">
      <slot></slot>
      <div>
        <button type="button" class="edit-button">Edit</button>
      </div>
    </div>
  </div>
`;

function clone() {
  return document.importNode(template.content, true).firstElementChild;
}

function init(root) {
  // DOM variables
  let frag = clone();
  let titleNode = frag.querySelector('.title');
  let editNode;
  let editBtnNode = frag.querySelector('.edit-button');

  // DOM views
  let openView, updateEditMode;

  // State variables
  let open = false;
  let title = root.textContent.trim();

  // DOM update functions
  function setEditMode(value) {
    if(updateEditMode == null) {
      updateEditMode = editMode();
      editNode = updateEditMode({ title });
      titleNode.parentNode.appendChild(editNode);
    } else {
      updateEditMode({ title });
    }

    if(value) {
      editNode.classList.remove('open');
      titleNode.classList.remove('closed');
    } else {
      editNode.classList.add('open');
      titleNode.classList.add('closed');
      updateEditMode({ focus: true });
    }
  }

  function setTitleNode(value) {
    let child = root.firstElementChild;
    child.textContent = value;
  }

  // State update functions
  function setOpen(value) {
    if(value !== open) {
      open = value;
      setEditMode(!open);
    }
  }

  function setTitle(value) {
    if(title !== value) {
      title = value;
      setTitleNode(value);
    }
  }

  // Event listeners
  function onEditClick() {
    setOpen(true);
  }

  function onClose() {
    setOpen(false);
  }

  function onSave(ev) {
    setTitle(ev.detail);
    let reEv = new CustomEvent('change', {
      bubbles: true,
      detail: ev.detail
    });
    root.dispatchEvent(reEv);
  }

  // Initialization
  editBtnNode.addEventListener('click', onEditClick);
  frag.addEventListener('close', onClose);
  frag.addEventListener('save', onSave);

  function disconnect() {

  }

  function update(data = {}) {
    if(data.open != null) setOpen(data.open);
    return frag;
  }

  update.disconnect = disconnect;

  return update;
}

const view = Symbol('view');

class EditableTitle extends HTMLElement {
  static get observedAttributes() {
    return ['open'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this[view] = init(this);
    let frag = this[view]({
      open: this.open
    });
    this.shadowRoot.appendChild(frag);
  }

  disconnectedCallback() {
    this[view].disconnect();
  }

  attributeChangedCallback(name, _, value) {
    this[name] = value;
  }

  set open(value) {
    let open = typeof value === 'string' ? true : Boolean(value);
    if(open) {
      if(!this.hasAttribute('open')) {
        this.setAttribute('open', '');
      }
    } else {
      if(this.hasAttribute('open')) {
        this.removeAttribute('open');
      }
    }

    let update = this[view];
    if(update) {
      update({ open: this.open });
    }
  }

  get open() {
    return this.hasAttribute('open');
  }
}

customElements.define('editable-title', EditableTitle);
