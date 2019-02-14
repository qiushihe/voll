import electron from "electron";
import { download } from "electron-dl";
import get from "lodash/fp/get";
import flow from "lodash/fp/flow";
import map from "lodash/fp/map";
import isEmpty from "lodash/fp/isEmpty";
import isFunction from "lodash/fp/isFunction";

const getMaybeRemoteBrowserWindow = () => electron.BrowserWindow || electron.remote.BrowserWindow;

const getMaybeRemoteApp = () => electron.app || electron.remote.app;

const getWindowWebContent = win => win.webContents || win.getWebContents();

const withSecondArg = (func) => (_, secondArg) => func(secondArg);

const contextMenuCreator = (options) => (win) => {
  const shouldShowMenu = isFunction(options.shouldShowMenu)
    ? options.shouldShowMenu
    : () => true;

  const checkSpell = get("spellChecker.checkSpell")(options);

  const windowWebContent = getWindowWebContent(win);

  getWindowWebContent(win).on("context-menu", (event, props) => {
    if (shouldShowMenu(event, props) === false) {
      return;
    }

    const { editFlags } = props;

    const misspelledWord = props.misspelledWord;
    let misspelledSuggestionItems = [];

    if (!isEmpty(misspelledWord) && checkSpell) {
      const spellCheckResult = checkSpell(misspelledWord);
      if (spellCheckResult.misspelled) {
        misspelledSuggestionItems = flow([
          map((suggestion) => ({
            label: suggestion,
            click: () => windowWebContent.replaceMisspelling(suggestion)
          })),
          (items) => (
            !isEmpty(items)
              ? [...items, { type: "separator" }]
              : items
          )
        ])(spellCheckResult.suggestions);
      }
    }

    const isEditable = props.isEditable;
    const selectedText = props.selectionText.trim().length > 0;
    let textActionItems = [];

    if (isEditable && selectedText) {
      textActionItems = [
        ...textActionItems,
        {
          label: "Cut",
          accelerator: "CommandOrControl+X",
          enabled: editFlags.canCut,
          click: () => windowWebContent.cut()
        },
        {
          label: "Copy",
          accelerator: "CommandOrControl+C",
          enabled: editFlags.canCopy,
          click: () => windowWebContent.copy()
        }
      ];
    }

    if (isEditable) {
      textActionItems = [
        ...textActionItems,
        {
          label: "Paste",
          accelerator: "CommandOrControl+V",
          enabled: editFlags.canPaste,
          click: () => windowWebContent.paste()
        }
      ];
    }

    if (!isEmpty(textActionItems)) {
      textActionItems = [
        ...textActionItems,
        { type: "separator" }
      ];
    }

    let menuTpl = [
      ...misspelledSuggestionItems,
      ...textActionItems,
    ];

    if (props.mediaType === 'image') {
      menuTpl = [
        { type: "separator" },
        {
          id: "save",
          label: "Save Image",
          click: (item, win) => download(win, props.srcURL)
        }
      ];

      if (options.showSaveImageAs) {
        menuTpl.push({
          id: "saveImageAs",
          label: "Save Image As ...",
          click: (item, win) => download(win, props.srcURL, { saveAs: true })
        });
      }

      menuTpl.push({ type: "separator" });
    }

    if (props.linkURL && props.mediaType === "none") {
      menuTpl = [
        { type: "separator" },
        {
          id: "copyLink",
          label: "Copy Link",
          click: () => electron.clipboard.write({
            bookmark: props.linkText,
            text: props.linkURL
          })
        },
        { type: "separator" }
      ];
    }

    if (options.showCopyImageAddress && props.mediaType === "image") {
      menuTpl.push(
        { type: "separator" },
        {
          id: "copyImageAddress",
          label: "Copy Image Address",
          click: () => electron.clipboard.write({
            bookmark: props.srcURL,
            text: props.srcURL
          })
        },
        { type: "separator" }
      );
    }

    if (options.prepend) {
      const result = options.prepend(props, win);

      if (Array.isArray(result)) {
        menuTpl.unshift(...result);
      }
    }

    if (options.append) {
      const result = options.append(props, win);

      if (Array.isArray(result)) {
        menuTpl.push(...result);
      }
    }

    if (options.showInspectElement) {
      menuTpl.push(
        { type: "separator" },
        {
          id: "inspect",
          label: "Inspect Element",
          click: () => {
            win.inspectElement(props.x, props.y);
            if (getWindowWebContent(win).isDevToolsOpened()) {
              getWindowWebContent(win).devToolsWebContents.focus();
            }
          }
        },
        { type: "separator" }
      );
    }

    // Apply custom labels for default menu items
    if (options.labels) {
      for (const menuItem of menuTpl) {
        if (options.labels[menuItem.id]) {
          menuItem.label = options.labels[menuItem.id];
        }
      }
    }

    // Filter out leading/trailing separators
    // TODO: https://github.com/electron/electron/issues/5869
    menuTpl = delUnusedElements(menuTpl);

    if (menuTpl.length > 0) {
      const menu = (electron.remote ? electron.remote.Menu : electron.Menu).buildFromTemplate(menuTpl);

      /*
       * When electron.remote is not available this runs in the browser process.
       * We can safely use win in this case as it refers to the window the
       * context-menu should open in.
       * When this is being called from a webView, we can't use win as this
       * would refere to the webView which is not allowed to render a popup menu.
       */
      menu.popup(electron.remote ? electron.remote.getCurrentWindow() : win);
    }
  });
};

const delUnusedElements = (menuTpl) => {
  let notDeletedPrevEl;
  return menuTpl.filter(el => el.visible !== false).filter((el, i, array) => {
    const toDelete = el.type === "separator" && (!notDeletedPrevEl || i === array.length - 1 || array[i + 1].type === "separator");
    notDeletedPrevEl = toDelete ? notDeletedPrevEl : el;
    return !toDelete;
  });
};

export default (options = {}) => {
  const createContextMenu = contextMenuCreator(options);

  if (options.window) {
    const _window = options.window;
    const webContent = getWindowWebContent(_window);

    // When window is a webview that has not yet finished loading webContents is not available
    if (webContent === undefined) {
      _window.addEventListener("dom-ready", () => createContextMenu(_window), { once: true });
    } else {
      createContextMenu(_window);
    }
  } else {
    map(createContextMenu)(getMaybeRemoteBrowserWindow().getAllWindows());

    getMaybeRemoteApp().on(
      "browser-window-created",
      // The first argument is the event and the second argument is the window.
      withSecondArg(createContextMenu)
    );
  }
};
