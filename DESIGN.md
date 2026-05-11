# Design

## Theme

CloudGuard Lite is used by a small-business operator or consultant reviewing posture during business hours on a laptop. The interface should be light, quiet, and information-dense, with color reserved for severity, status, and primary actions.

## Color

Use OKLCH tokens from `app/globals.css`. The palette is a restrained light theme with tinted cool neutrals, a teal primary action color, green success, amber warning, and red destructive states.

## Typography

Use the system UI sans stack for all product surfaces. Keep type compact and predictable: small labels for metadata, medium-weight headings for panels, and no display fonts in forms, tables, navigation, or controls.

## Layout

Authenticated pages use a fixed left navigation and a content work area. Dashboards use measured grids, tables, and status lists. Cards are used for repeated records and summary panels only.

## Components

Buttons, badges, inputs, text areas, selects, cards, tables, and stat panels should use 8px radius or less, visible focus states, concise labels, and predictable spacing. Icons come from `lucide-react`.

## Motion

Use minimal transitions for hover, focus, and state changes. Avoid decorative page-load sequences.
