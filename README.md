# Blu Petroleum website mock-up (concept)

A clickable concept of a refreshed blupetroleum.com, made to walk Joe through. It's plain static HTML, CSS and JS, with no build step.

## Deploy on Vercel
1. Create a GitHub repo and upload everything in this folder, keeping the folder structure.
2. In Vercel, choose **Add New → Project**, import the repo, keep the Framework Preset set to **Other**, and click Deploy.
3. `vercel.json` turns on clean URLs (`/services/tank-monitoring`). The site is marked **noindex** (meta tag, header and robots.txt) so the mock-up never competes with the real site in Google.

You can also open `index.html` locally by double-clicking it.

## Walkthrough notes
The **Walkthrough notes** toggle in the bottom-left corner shows yellow callouts that explain why each section was built the way it was. On the quote and contact pages it also shows the HubSpot property and workflow mapping. Turn it off when showing the clean design.

Orange highlighted text = placeholder facts to confirm with Joe.

## Pages
- Home, About, Products (fuels, DEF, lubricants and fluids)
- Industries: Construction, Transportation & Trucking, Logistics & Warehousing
- Services: On-site delivery, Tank monitoring, Tank installation, Site tanks, Fleet fueling, Event & project fueling, Fuel analysis
- Get a Quote: two-step mock HubSpot form that pre-fills from the URL (`?fuel=`, `?service=`, `?industry=`, `?zip=`, `?gallons=`)
- Contact: general form with inquiry routing, hours, newsletter, 5 locations
- BluLock, Blu App (placeholder copy pending Joe), Become a Customer, Privacy Policy placeholder, 404

## Images
- Logo: supplied by Blake (`assets/blu-logo.png`).
- Home/About/Contact hero: Blu's own truck photo, hot-linked from blupetroleum.com. For production, download it into `assets/`.
- All other photos are hot-linked from Unsplash (free to use under the Unsplash License, no attribution required). Photographers: Jason Mitrione, Energie-portal.sk, Bernd Dittrich, Ries Bosch, Marcin Jozwiak, Zendure, Akram Huseyn, Troy Mortier, Wolfgang Hasselmann, LOGAN WEAVER, Ruchindra Gunasekara, Nigel Tadyanehondo, Maciej Kaliszewski, Robert Laursoo.
- If any image fails to load, it falls back to a navy and green brand gradient, so the layout never breaks.

## Forms
Forms are front-end mock-ups only. Nothing is sent anywhere. In production, each one would be replaced with a HubSpot form embed.
