# ASK Bagbin Education Fund — Manual Website Image System

All main website images are now organized so you can replace them manually in VS Code without searching through the HTML for every image.

## 1. Image folder

Put your website pictures here:

`assets/images/site/`

### Main image slots

| Filename | Used for |
|---|---|
| `hero-1.jpg` | Homepage hero slide 1 |
| `hero-2.jpg` | Homepage hero slide 2 |
| `hero-3.jpg` | Homepage hero slide 3 |
| `about.jpg` | About section/page |
| `founder.jpg` | Founder section/page |
| `beneficiaries.jpg` | Scholarship/beneficiary section |
| `projects.jpg` | Infrastructure/projects section |
| `advocacy.jpg` | Advocacy section |
| `partners.jpg` | Partnership section |
| `news.jpg` | News section |
| `faq.jpg` | FAQ section |
| `contact.jpg` | Contact section |

## 2. How to replace a picture

Example:

1. Prepare your real picture.
2. Rename it to `hero-1.jpg`.
3. Open `assets/images/site/` in VS Code.
4. Replace the existing `hero-1.jpg`.
5. Refresh the website.

You do not need to edit the HTML for normal image replacement.

## 3. If you want different filenames

Edit only:

`assets/js/image-config.js`

For example:

`hero1: 'assets/images/site/home-main.jpg'`

Then place `home-main.jpg` in the same folder.

## 4. Recommended image sizes

- Hero images: 1920 × 900 or larger
- Section images: 1200 × 800 or larger
- Founder/portrait images: 1000 × 1200 or larger
- Use JPG/WEBP for photographs and PNG for transparent graphics.

## 5. Backend/API setup

The frontend now has one API configuration file:

`assets/js/api-config.js`

For local development, it points to:

`http://localhost:5000/api`

When the frontend and backend are deployed on the same domain in cPanel, change it to:

`/api`

This prevents API URLs from being scattered through the frontend.
