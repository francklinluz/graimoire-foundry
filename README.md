# Graimoire

![Foundry VTT Compatible](https://img.shields.io/badge/Foundry%20VTT-v12%2B%20%7C%20v13-informational)

## What is Graimoire?

Graimoire is a Foundry VTT module that lets you query any RPG rulebook PDF directly from the chat. Just type `/graimoire [your question]` and get an AI-generated answer with page citations — visible to everyone at the table.

Works with any RPG system that has a PDF rulebook: D&D, Pathfinder, GURPS, Call of Cthulhu, Tormenta, and more.

## Features

- **AI-powered semantic search** — finds answers even when you use different wording than the rulebook
- **In-chat responses with page citations** visible to all players
- **Works with any RPG system** that has a PDF rulebook
- **Free tier available** (20 questions/month)
- **GM and Party plans** for unlimited use
- **Access control** — GM can grant players permission to use `/graimoire` (Party plan)

## Installation

**Via Foundry Module Manager (recommended):**

1. Open Foundry VTT → Add-on Modules → Install Module
2. Paste the manifest URL:
   ```
   https://raw.githubusercontent.com/francklinluz/graimoire-foundry/main/module.json
   ```
3. Click Install

**Manual:**

1. Download the latest release zip
2. Extract it into your Foundry `Data/modules/` folder
3. Restart Foundry

## Setup

1. Enable the module in your world (**Settings → Manage Modules → Graimoire**)
2. Go to [https://graimoire-production.up.railway.app](https://graimoire-production.up.railway.app) and sign in with Google
3. Upload your rulebook PDF and wait for indexing to complete
4. Generate an API key in the app (look for the **Foundry VTT** panel)
5. In Foundry → **Module Settings → Graimoire**, paste your API key and set the server URL
6. Type `/graimoire [your question]` in chat

## Usage

```
/graimoire how does concentration work?
/graimoire what happens when I roll a critical hit?
/graimoire what are the rules for grappling?
```

> **Tip:** Use the same language as your PDF for best results.

## Plans

| Plan  | Price   | Questions/month | PDFs                  | Players      |
|-------|---------|-----------------|-----------------------|--------------|
| Free  | $0      | 20              | 1 (325 pages max)     | GM only      |
| GM    | $6/mo   | Unlimited       | Unlimited             | GM only      |
| Party | $12/mo  | Unlimited       | Unlimited             | Full table   |

Create your account and view plans at [https://graimoire-production.up.railway.app](https://graimoire-production.up.railway.app).

## Player Access (Party Plan)

With the Party plan, the GM can grant individual players permission to use `/graimoire`. Go to **Module Settings → Manage Player Access** and toggle access per player.

## Privacy

PDFs are processed entirely in your browser and are never stored on the server. See the [Privacy Policy](https://graimoire-production.up.railway.app/privacy) and [Terms of Service](https://graimoire-production.up.railway.app/terms) for details.

## Support

Found a bug or have a suggestion? [Open an issue on GitHub](https://github.com/francklinluz/graimoire-foundry/issues).
