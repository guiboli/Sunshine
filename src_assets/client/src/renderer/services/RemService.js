class $RemService {
  constructor() {
    /* @private */
    this.defaultDesignWidth_ = 1920;

    /* @private */
    this.minWidth_ = 1280;

    this.defaultFontSize = this.getDefaultFontSize_();
    this.rem2px = 100;
  }

  /* private */
  getDefaultFontSize_() {
    const div = window.document.createElement('div');
    div.style.width = '1rem';
    div.style.display = 'none';
    const head = window.document.getElementsByTagName('head')[0];
    head.appendChild(div);
    const htmlFontSize = parseFloat(
      window.getComputedStyle(div).getPropertyValue('width'),
    );
    div.remove();

    return htmlFontSize;
  }

  setRem() {
    const head = window.document.getElementsByTagName('head')[0];

    // if screen width is smaller than `this.minWidth_`, treat as `this.minWidth_`.
    const portraitWidth =
      window.innerWidth < this.minWidth_ ? this.minWidth_ : window.innerWidth;
    const fontSize =
      (portraitWidth /
        (this.defaultDesignWidth_ / this.rem2px) /
        this.defaultFontSize) *
        100 +
      '%';
    const fontSizeRatio =
      portraitWidth /
      (this.defaultDesignWidth_ / this.rem2px) /
      this.defaultFontSize;

    const htmlFontSize = `
    html {
      font-size: ${fontSize} !important;
    }
    `;

    // avoid that `body` inherit the new font-size of html
    const bodyFontSize = `
    body {
      font-size: ${this.defaultFontSize}px;
    }
    `;

    if (document.getElementById('__rem-style__')) {
      document.getElementById('__rem-style__').innerHTML =
        htmlFontSize + bodyFontSize;
    } else {
      const style =
        document.getElementById('__rem-style__') ||
        document.createElement('style');
      style.setAttribute('id', '__rem-style__');
      style.innerHTML = htmlFontSize + bodyFontSize;

      // use `insertBefore` to avoid to overwrite style of `body`
      head.insertBefore(style, head.firstChild);
    }

    return fontSizeRatio;
  }

  getRealRem2px() {
    const portraitWidth =
      window.innerWidth < this.minWidth_ ? this.minWidth_ : window.innerWidth;
    const result = (this.rem2px * portraitWidth) / this.defaultDesignWidth_;

    return result;
  }
}

const RemService = new $RemService();

export { RemService };
