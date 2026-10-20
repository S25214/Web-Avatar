# WebAvatar skills for coding agents

Skills that teach an AI coding agent (Claude Code, Codex, Cursor and others) how to work with the WebAvatar widget.

## `webavatar-widget`

Embeds the WebAvatar assistant in a website and prepares the site's markup so the assistant can read it, navigate it and fill in its forms. It can also create and configure the widget through the developer API, with your confirmation before each change.

### Install

```bash
npx skills add S25214/Web-Avatar --skill webavatar-widget
```

You choose which coding agent to install it for. Useful options:

```bash
npx skills add S25214/Web-Avatar --list                                  # see what is available
npx skills add S25214/Web-Avatar --skill webavatar-widget -a claude-code # one agent, no prompt for it
npx skills add S25214/Web-Avatar --skill webavatar-widget -g             # for all your projects, not just this one
```

Requires Node.js 22.20 or later.

### Use

Ask your coding agent, in your site's project:

> Add the WebAvatar assistant to this site and make the site work well with it.

The agent will ask whether you want the production or the dev build, and for your widget ID (or offer to create a widget).
