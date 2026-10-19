// 天依蓝 · 洛天依 skin — hand-written Client (loader) bundle.
// `build.mjs` inlines the six base64 artwork constants and writes ./client.js.
// Edit THIS file, then run: node build.mjs
window.__ModuleLoader__.load({
  id: 'dsh-skin-tianyi-azure',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    // One picture per theme: the concerto key visual for the night, the cloud
    // castle for the day. Both are pre-cropped (and mirrored) so she sits
    // right of centre, where the horizontal mask is opaque.
    const WALLPAPER_DARK = '__WALLPAPER_DARK__';
    const WALLPAPER_LIGHT = '__WALLPAPER_LIGHT__';
    const AVATAR = '__AVATAR__';
    // Left-workspace decoration: a blurred blue stage glow, plus a bust that
    // fades up from the foot of the sidebar. Both stay translucent so the
    // session rows stay readable.
    const AMBIENCE = '__AMBIENCE__';
    const AMBIENCE_LIGHT = '__AMBIENCE_LIGHT__';
    const PORTRAIT_DARK = '__PORTRAIT_DARK__';
    // Must equal skin.json#bodyAttr: the skin manager uses it to tell which
    // skin is mounted, and so whether "official" is the active choice.
    const BODY_ATTR = 'data-dsh-tianyi-azure';
    // Mirrors the active theme's colorScheme onto <body> so the stylesheet can
    // keep two separate tuning profiles instead of one compromise.
    const SCHEME_ATTR = 'data-dsh-tianyi-scheme';

    // ---- styles -----------------------------------------------------------
    // Only aliases from the Theme provider are re-colored; everything else is
    // artwork. #66ccff is 天依蓝 (Luo Tianyi's signature azure).
    const CSS = `
    :root {
      --dsw-alias-brand-primary: #66ccff;
    }
    /* The illustration is a *backdrop*: the shell frame paints it in its own
       ::after at z-index -1, so it sits above the frame background and below
       every column and every glyph. The frame is addressed through the overlay
       layer it contains, which avoids any per-build class hash. */
    body[data-dsh-tianyi-azure] :has(> [data-shell-overlay]) {
      isolation: isolate;
      /* Two tuning profiles: the dark one lifts a near-black window with a
         visible wash, the light one keeps the artwork as a hint. */
      --ty-art: 0.6;
      --ty-art-sat: 1.2;
      --ty-art-contrast: 1.1;
    }
    body[data-dsh-tianyi-scheme='light'] :has(> [data-shell-overlay]) {
      --ty-art: 0.6;
      --ty-art-sat: 1.24;
      --ty-art-contrast: 1.14;
    }
    body[data-dsh-tianyi-azure] :has(> [data-shell-overlay])::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      background-image: url("${WALLPAPER_DARK}");
      background-size: cover;
      background-position: 50% 38%;
      background-repeat: no-repeat;
      /* One absolute alpha per scheme, written on <html> by the skin settings;
         the per-theme default wins while a slider was never touched. */
      opacity: var(--ty-art-user-dark, var(--ty-art));
      filter: saturate(var(--ty-art-sat)) contrast(var(--ty-art-contrast));
      /* The fade under the window chrome is baked into the asset's alpha, so a
         single horizontal mask is enough and mask-composite is not needed.
         The ramp starts at the very left edge: in the dark profile the sidebar
         is see-through, so the picture has to grow out of it instead of
         starting with a seam at the column border. */
      -webkit-mask-image: linear-gradient(100deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 38%, #000 78%);
      mask-image: linear-gradient(100deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 38%, #000 78%);
    }
    /* Daylight keeps its own picture: the night wash over white reads as dirt. */
    body[data-dsh-tianyi-scheme='light'] :has(> [data-shell-overlay])::after {
      background-image: url("${WALLPAPER_LIGHT}");
      opacity: var(--ty-art-user-light, var(--ty-art));
    }
    /* Windows paints the centre column as its own rounded surface; drop the
       fill so the backdrop shows through it. Text and cards inside the column
       still paint above the backdrop. */
    body[data-dsh-tianyi-azure] [class*='centerCol'] {
      background: transparent;
    }
    /* The conversation panel paints an opaque base of its own (the element that
       carries data-phase) — that was the last surface hiding the backdrop.
       Its header, message cards and composer keep their own fills. */
    body[data-dsh-tianyi-azure] [class*='centerCol'] [data-phase] {
      background: transparent;
    }
    /* Dark profile only: let the illustration continue behind the sidebar and
       drop the column border, so the left portrait and the right picture read
       as one scene instead of two panels with a seam between them. */
    .ty-azure-mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      position: relative;
      box-shadow: 0 0 0 1px rgba(102, 204, 255, 0.55), 0 0 12px rgba(102, 204, 255, 0.35);
      overflow: hidden;
      flex: none;
    }
    .ty-azure-mark > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% 46%;
      display: block;
      border-radius: 50%;
    }
    /* Left column decoration, inside the column so it always paints under the
       sidebar's own text: ::before is the illustration, ::after the stage glow.
       The sidebar entry paints its own fill with --dsw-specific-sidebar-fill,
       which would cover the decoration, so the token is captured on <body> and
       neutralised inside the column; the column paints that colour itself. */
    body[data-dsh-tianyi-azure] {
      --dsh-ty-sidebar-base: var(--dsw-specific-sidebar-fill);
    }
    body[data-dsh-tianyi-azure] [class*='sidebarCol'] {
      --dsw-specific-sidebar-fill: transparent;
      position: relative;
      isolation: isolate;
      background-color: var(--dsh-ty-sidebar-base);
      /* 100% is the ceiling of the sliders, so the ceiling itself has to be
         strong enough: these are the values the sliders scale from. */
      --ty-portrait: 0.48;
      --ty-glow: 0.5;
    }
    body[data-dsh-tianyi-scheme='light'] [class*='sidebarCol'] {
      --ty-portrait: 0.42;
      --ty-glow: 0.42;
    }
    body[data-dsh-tianyi-azure] [class*='sidebarCol']::before {
      content: '';
      position: absolute;
      left: -4%;
      right: -4%;
      /* Pushed 15% of the column below the foot: the figure sits lower, the
         bottom of her dress is clipped by the column edge. */
      bottom: -15%;
      height: 70%;
      z-index: -2;
      pointer-events: none;
      background-image: url("${PORTRAIT_DARK}");
      background-size: cover;
      background-position: 50% 50%;
      background-repeat: no-repeat;
      opacity: calc(var(--ty-portrait) * var(--ty-side-scale-dark, 1));
      /* A night picture over a dark column needs a lift, not more darkness. */
      filter: saturate(1.06) contrast(1.04) brightness(1.12);
      -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 38%, #000 100%);
      mask-image: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 38%, #000 100%);
    }
    body[data-dsh-tianyi-scheme='light'] [class*='sidebarCol']::before {
      opacity: calc(var(--ty-portrait) * var(--ty-side-scale-light, 1));
      filter: saturate(1) contrast(1) brightness(1);
    }
    body[data-dsh-tianyi-azure] [class*='sidebarCol']::after {
      content: '';
      position: absolute;
      inset: -6%;
      z-index: -1;
      pointer-events: none;
      background-image: url("${AMBIENCE}");
      background-size: cover;
      background-position: 42% 30%;
      opacity: calc(var(--ty-glow) * var(--ty-side-scale-dark, 1));
      filter: saturate(1.24) contrast(1.05) brightness(1.18);
      -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 26%, rgba(0,0,0,0.9) 62%, rgba(0,0,0,0.6) 100%);
      mask-image: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 26%, rgba(0,0,0,0.9) 62%, rgba(0,0,0,0.6) 100%);
    }
    body[data-dsh-tianyi-scheme='light'] [class*='sidebarCol']::after {
      background-image: url("${AMBIENCE_LIGHT}");
      opacity: calc(var(--ty-glow) * var(--ty-side-scale-light, 1));
      filter: saturate(1.05);
    }
    .ty-azure-word {
      display: inline-grid;
      gap: 1px;
      line-height: 1;
      user-select: none;
    }
    .ty-azure-word__zh {
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.14em;
      background: linear-gradient(96deg, #eaf8ff 0%, #66ccff 55%, #2f7fd6 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .ty-azure-word__en {
      font-size: 7px;
      letter-spacing: 0.3em;
      color: rgba(102, 204, 255, 0.72);
    }
    /* Light theme keeps the logotype legible on white. */
    body[data-dsh-tianyi-scheme='light'] .ty-azure-word__zh {
      background: linear-gradient(96deg, #0b4a6b 0%, #0f97cf 55%, #3aa7d8 100%);
      -webkit-background-clip: text;
      background-clip: text;
    }
    body[data-dsh-tianyi-scheme='light'] .ty-azure-word__en {
      color: rgba(15, 151, 207, 0.8);
    }
    `;

    function installStyles() {
      const el = document.createElement('style');
      el.setAttribute('data-dsh-skin', 'tianyi-azure');
      el.textContent = CSS;
      document.head.appendChild(el);
      return function dispose() {
        if (el.parentNode) el.parentNode.removeChild(el);
      };
    }

    // ---- skin settings (rendered by the skin manager) ---------------------
    // The manager owns the settings surface: a skin only announces its rows
    // through the customization protocol, and the manager draws them inside
    // the skin page (Settings -> skin management) while this skin is active.
    const CUSTOMIZATION_EVENTS = {
      register: 'dsh:skin-customization-register-v2',
      unregister: 'dsh:skin-customization-unregister-v2',
      ready: 'dsh:skin-customization-ready-v2',
    };

    const CUSTOMIZATION = {
      protocol: 2,
      skinId: 'tianyi-azure',
      title: '天依蓝 · 洛天依',
      titleEn: 'Luo Tianyi · Azure',
      settings: [
        {
          key: 'artOpacity',
          type: 'range',
          label: '亮色插画不透明度',
          labelEn: 'Light illustration opacity',
          description: '白底上右侧壁纸的浓度，0 为完全隐藏。',
          descriptionEn: 'Wallpaper strength on the light theme; 0 hides it.',
          defaultValue: 60,
          min: 0,
          max: 100,
          step: 1,
          unit: '%',
        },
        {
          key: 'darkOpacity',
          type: 'range',
          label: '暗色插画不透明度',
          labelEn: 'Dark illustration opacity',
          description: '深色底上右侧壁纸的浓度，通常比亮色低一些。',
          descriptionEn: 'Wallpaper strength on the dark theme; usually lower than the light one.',
          defaultValue: 60,
          min: 0,
          max: 100,
          step: 1,
          unit: '%',
        },
        {
          key: 'sideScaleLight',
          type: 'range',
          label: '亮色左侧装饰',
          labelEn: 'Light sidebar decoration',
          description: '亮色下侧栏光效与半身像的强度，100% 为默认。',
          descriptionEn: 'Sidebar glow and portrait strength on the light theme; 100% is the default.',
          defaultValue: 100,
          min: 0,
          max: 100,
          step: 5,
          unit: '%',
        },
        {
          key: 'sideScaleDark',
          type: 'range',
          label: '暗色左侧装饰',
          labelEn: 'Dark sidebar decoration',
          description: '暗色下侧栏光效与半身像的强度，100% 为默认。',
          descriptionEn: 'Sidebar glow and portrait strength on the dark theme; 100% is the default.',
          defaultValue: 100,
          min: 0,
          max: 100,
          step: 5,
          unit: '%',
        },
      ],
      apply(state) {
        let root = null
        try {
          root = document.documentElement
        } catch (error) {
          root = null
        }
        if (!root || !root.style) return
        if (state === null || typeof state !== 'object') {
          root.style.removeProperty('--ty-art-user-light')
          root.style.removeProperty('--ty-art-user-dark')
          root.style.removeProperty('--ty-side-scale-light')
          root.style.removeProperty('--ty-side-scale-dark')
          return
        }
        const values = state.values || {}
        const light = typeof values.artOpacity === 'number' ? values.artOpacity : 32
        const dark = typeof values.darkOpacity === 'number' ? values.darkOpacity : 22
        const sideLight = typeof values.sideScaleLight === 'number' ? values.sideScaleLight : 100
        const sideDark = typeof values.sideScaleDark === 'number' ? values.sideScaleDark : 100
        root.style.setProperty('--ty-art-user-light', String(light / 100))
        root.style.setProperty('--ty-art-user-dark', String(dark / 100))
        root.style.setProperty('--ty-side-scale-light', String(sideLight / 100))
        root.style.setProperty('--ty-side-scale-dark', String(sideDark / 100))
      },
    };

    // Announce now and again on every `ready`, so load order and a manager hot
    // reload cannot lose the handshake. Mirrors the manager's own protocol.
    function registerCustomization(definition) {
      if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return function () {}
      const token = {}
      const announce = () => window.dispatchEvent(new CustomEvent(CUSTOMIZATION_EVENTS.register, {
        detail: { token, definition },
      }))
      window.addEventListener(CUSTOMIZATION_EVENTS.ready, announce)
      announce()
      return () => {
        window.removeEventListener(CUSTOMIZATION_EVENTS.ready, announce)
        window.dispatchEvent(new CustomEvent(CUSTOMIZATION_EVENTS.unregister, {
          detail: { token, definition },
        }))
        definition.apply(null)
      }
    }

    // ---- components -------------------------------------------------------
    // Brand mark: the sidebar brand row and the blank-session hero both pass a
    // square `size`.
    function TianyiMark(props) {
      const size = typeof props.size === 'number' && props.size > 0 ? props.size : 28;
      return h('span', {
        className: 'ty-azure-mark',
        style: { width: size + 'px', height: size + 'px' },
        'aria-hidden': true,
      }, h('img', { src: AVATAR, alt: '', draggable: false }));
    }

    // The sidebar brand name becomes the skin's own logotype; the manager
    // restores the shipped wordmark as soon as this plugin unloads.
    function TianyiWordmark() {
      return h('span', { className: 'ty-azure-word' },
        h('span', { className: 'ty-azure-word__zh' }, '天依蓝'),
        h('span', { className: 'ty-azure-word__en' }, 'TIANYI AZURE'));
    }

    return {
      inject: ['slots', 'theme'],
      apply(ctx) {
        // Token layer: the documented way to recolor without touching the
        // theme registry. The CSS :root block above stays as a fallback for a
        // Harness that does not offer overrideTokens.
        ctx.effect(() => {
          let disposeTokens
          try {
            disposeTokens = ctx.theme.overrideTokens('dsh-skin-tianyi-azure', {
              '--dsw-alias-brand-primary': { light: '#0f97cf', dark: '#66ccff' },
            })
          } catch (error) {
            disposeTokens = undefined
          }
          const disposeStyles = installStyles()
          // The skin manager reads the declared body attribute to decide which
          // skin is mounted (and therefore whether "official" is active), so it
          // must exist exactly while this plugin is loaded.
          const body = document.body
          if (body !== null && typeof body.setAttribute === 'function') {
            body.setAttribute(BODY_ATTR, '')
          }
          return () => {
            if (typeof disposeTokens === 'function') disposeTokens()
            disposeStyles()
            if (body !== null && typeof body.removeAttribute === 'function') {
              body.removeAttribute(BODY_ATTR)
            }
          }
        }, 'tianyi-azure: tokens + stylesheet + body marker');
        // Mirror the active theme's colorScheme so the stylesheet can use the
        // dark or the light tuning profile, and follow later theme switches.
        ctx.effect(() => {
          const body = document.body
          const sync = (snapshot) => {
            let scheme = 'dark'
            try {
              const next = snapshot ?? ctx.theme.getTheme()
              scheme = next?.active?.colorScheme === 'light' ? 'light' : 'dark'
            } catch (error) {
              scheme = 'dark'
            }
            if (body !== null && typeof body.setAttribute === 'function') {
              body.setAttribute(SCHEME_ATTR, scheme)
            }
          }
          sync()
          const off = typeof ctx.on === 'function' ? ctx.on('theme/change', sync) : undefined
          return () => {
            if (typeof off === 'function') off()
            if (body !== null && typeof body.removeAttribute === 'function') {
              body.removeAttribute(SCHEME_ATTR)
            }
          }
        }, 'tianyi-azure: theme scheme');
        // Settings -> skin management: the manager renders these rows for the
        // currently active skin and persists the values for us.
        ctx.effect(() => registerCustomization(CUSTOMIZATION), 'tianyi-azure: skin settings');
        // A single seat holds several claimants and renders the lowest
        // priority, so take a negative one to sit in front of the shipped mark.
        const claim = (slotName, component) => () => {
          try {
            return ctx.slots.register({ name: slotName, priority: -100 }, component);
          } catch (error) {
            if (typeof console !== 'undefined') console.warn('[tianyi-azure] could not claim ' + slotName, error);
            return () => {};
          }
        };
        ctx.slots.inject('sidebar.brand.mark', claim('sidebar.brand.mark', TianyiMark));
        ctx.slots.inject('sidebar.brand.name', claim('sidebar.brand.name', TianyiWordmark));
        ctx.slots.inject('conversation.hero.brand.mark', claim('conversation.hero.brand.mark', TianyiMark));
      },
    };
  },
});
