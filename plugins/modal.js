Element.prototype.appendAfter = function (element) {
  element.parentNode.insertBefore(this, element.nextSibling);
}

function noop () {};

function _createModalFooter(buttons = []) {
  if (buttons.length === 0) {
    return document.createElement('div');
  }

  const wrap = document.createElement('div')
  wrap.classList.add('vmodal__footer')
  buttons.forEach(btn => {
    const $btn = document.createElement('button');
    $btn.textContent = btn.text;
    $btn.classList.add('btn');
    $btn.classList.add(`btn-${btn.type || 'secondary'}`);
    $btn.onclick = btn.handler || noop;
    wrap.appendChild($btn);
  })
  return wrap;
}

function _createModal (options) {
    const { 
      title = 'Title default', 
      content = '',
      width = '600px',
      closable,
      footerButtons,
      onClose
    } = options;

    const modal = document.createElement('div');
    modal.classList.add('vmodal');
    modal.insertAdjacentHTML('afterbegin', `
      <div class="vmodal__overlay" data-close="true">
        <div class="vmodal__window" style="width: ${width};">
          <div class="vmodal__header">
            <span class="vmodal__title">${title}</span>
            ${closable ? `<span class="vmodal__close" data-close="true">&times;</span>` : ''}
          </div>
          <div class="vmodal__body" data-content>
            ${content}
          </div>
        </div>
      </div>
    `);
    const footer = _createModalFooter(footerButtons);
    footer.appendAfter(modal.querySelector('[data-content]'));
    document.body.append(modal);
    return modal;
}

$.modal = function (options) {
  const ANIMATION_SPEED = 200;
  const $modal = _createModal(options);
  let closing = false;
  let destroyed = false;

  const modal = {
    open() {
      if (destroyed) {
        return console.log('### Modal is destroyed');
      }
      !closing && $modal.classList.add('vmodal--open');
    },
    close() {
      closing = true;
      $modal.classList.remove('vmodal--open');
      $modal.classList.add('vmodal--hide');
      setTimeout(() => {
        $modal.classList.remove('vmodal--hide');
        closing = false;
        if (typeof onClose === 'function') {
          onClose();
        }
      }, ANIMATION_SPEED);
    },
  };
  
  const listener = event => {
    if (event.target.dataset.close) {
      modal.close();
    }
  };

  $modal.addEventListener('click', listener);

  return Object.assign(modal, {
    destroy() {
      $modal.parentNode.removeChild($modal);
      $modal.removeEventListener('click', listener);
      destroyed = true;
    },
    setContent(html) {
      $modal.querySelector('[data-content]').innerHTML = html;
    }
  })
}
