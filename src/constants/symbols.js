// ASCII symbols and tokens used throughout the application
// This centralizes all visual elements for easy customization

export const SYMBOLS = {
  // Primary terminal symbol
  TERMINAL: ">",

  // Bracket symbols
  BRACKET_OPEN: "[",
  BRACKET_CLOSE: "]",

  // Tree/navigation symbols
  TREE_BRANCH: "▸",
  TREE_CORNER: "└─",
  TREE_LINE: "─┘",

  // Decorative lines
  HORIZONTAL_LINE: "────────────────────────",

  // Status indicators
  LOADING: "...",
  SUCCESS: "✓",
  ERROR: "✗",

  // Command indicators
  COMMAND_PREFIX: ":",

  // File type indicators
  FILE_JSON: "json",
  FILE_TXT: "txt",
};

export const LABELS = {
  // Site branding
  SITE_INITIALS: "TC",
  SITE_NAME: "tucker craig",

  // File references
  ABOUT_FILE: "about",
  ABOUT_ME_FILE: "about_me.txt",

  // Commands and hints
  COMMAND_HINT: "type : for commands",
  FLIP_HINT: "click to flip",
  FLIP_BACK_HINT: "click to flip back",

  // Decorative text
  WELCOME_TEXT: "welcome to the terminal",
  PROFILE_CARD_TEXT: "interactive profile card",
};

// Helper function to wrap text in brackets
export const bracketed = (text) =>
  `${SYMBOLS.BRACKET_OPEN}${text}${SYMBOLS.BRACKET_CLOSE}`;

// Helper function to create terminal prompt
export const terminalPrompt = (text) => `${SYMBOLS.TERMINAL} ${text}`;

// Helper function to create tree structure
export const treeItem = (text) => `${SYMBOLS.TREE_BRANCH} ${text}`;

// Helper function to create decorative borders
export const decorativeBorder = (text) =>
  `${SYMBOLS.TREE_CORNER} ${text} ${SYMBOLS.TREE_LINE}`;

