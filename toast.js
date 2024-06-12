'use strict';

class Toast {

  /**
   * @param {String} id
   */
  constructor(id, options = {}, texts = {}) {
    if (!id || typeof id !== 'string') {
      console.error('Please set toast ID (String)');
      return;
    }

    this.id = id;

    this.options = {
      timeout: 3000,
      ...options,
    };

    this.texts = {
      close: 'close',
      ...texts,
    };

    this.htmlElements = {
      container: null,
    };

    this.classNames = {
      isOut: 'is-out',
      container: 'toast-container js-toast-container',
      toast: 'toast js-toast',
      toastClose: 'toast-close js-toast-close',
      toastTitle: 'toast-title',
      toastText: 'toast-text',
    };

    this.init();
  }

  init() {
    if (this.htmlElements.container) {
      console.error(`Toast is already initialized (ID): ${this.id}`);
      return;
    }

    const containerTemplate = `<ul id="${this.id}" class="${this.classNames.container}"></ul>`;
    document.querySelector('body').insertAdjacentHTML('beforeend', containerTemplate);

    this.htmlElements.container = document.querySelector(`#${this.id}`);
  }

  /**
   * @param {Object} options
   */
  addToast(options) {
    const toastTemplate = `
      <li class="${this.classNames.toast} ${options.type ? `is-${options.type}` : ''}">
        <button type="button" class="${this.classNames.toastClose}" aria-label="${this.texts.close}">&times;</button>
        ${options.title ? `<strong class="${this.classNames.toastTitle}">${options.title}</strong>` : ''}
        ${options.text ? `<p class="${this.classNames.toastText}">${options.text}</p>` : ''}
      </li>
    `;
    this.htmlElements.container.insertAdjacentHTML('beforeend', toastTemplate);

    const toastElement = this.htmlElements.container.lastElementChild;

    this.addTimeout(toastElement);
    this.addEvents(toastElement);
  }

  /**
   * @param {HTMLElement} toastElement
   */
  removeToast(toastElement) {
    this.removeTimeout(toastElement);
    toastElement.classList.add(this.classNames.isOut);
  }

  /**
   * @param {HTMLElement} toastElement
   */
  addTimeout(toastElement) {
    const timeout = setTimeout(() => {
      this.removeToast(toastElement);
    }, this.options.timeout);
    toastElement.dataset.timeout = timeout;
  }

  /**
   * @param {HTMLElement} toastElement
   */
  removeTimeout(toastElement) {
    clearTimeout(Number(toastElement.dataset.timeout));
  }

  /**
   * @param {HTMLElement} toastElement
   */
  addEvents(toastElement) {
    toastElement.addEventListener('mouseenter', () => {
      this.removeTimeout(toastElement);
    });
    toastElement.addEventListener('touchstart', () => {
      this.removeTimeout(toastElement);
    });
    toastElement.addEventListener('mouseleave', () => {
      this.addTimeout(toastElement);
    });
    toastElement.addEventListener('touchend', () => {
      this.addTimeout(toastElement);
    });

    toastElement.addEventListener('animationend', () => {
      if (toastElement.classList.contains(this.classNames.isOut)) {
        toastElement.remove();
      }
    });

    const closeElement = toastElement.querySelector('.js-toast-close');
    closeElement.addEventListener('click', () => {
      this.removeToast(toastElement);
    });
  }

  destroy() {
    if (!this.htmlElements.container) {
      console.error(`Toast is not initialized (ID): ${this.id}`);
      return;
    }

    const toastElements = [...this.htmlElements.container.querySelectorAll('.js-toast')];
    for (const toastElement of toastElements) {
      clearTimeout(Number(toastElement.dataset.timeout));
    }

    this.htmlElements.container.remove();
    this.htmlElements.container = null;
  }
}
