# Velarix Site Structure & Cards Inventory

## Current Site Structure

### Main Pages
1. **Home Page (Index)** - `/`
   - Navigation
   - Hero Section
   - Services Section (with 5 glassmorphic cards)
   - About Section
   - Portfolio Section
   - Contact Section
   - Footer

2. **Blog** - `/blog`
3. **Blog Post** - `/blog/:slug`
4. **Login** - `/login`
5. **404 Not Found** - `/*` (catch-all)

### Individual Service Pages
- `/website-ecommerce` - Website & eCommerce Setup
- `/branding-content` - Branding & Content Strategy
- `/technical-automation` - Technical Automation
- `/web-optimization` - Web Optimization & Maintenance
- `/technical-consultation` - Freelance Technical Consultation

## Glassmorphic Cards Inventory

### Services Section (Main Page)
**Location:** `src/components/Services.tsx`
**Total Cards:** 5

1. **Website & eCommerce** 
   - Path: `/website-ecommerce`
   - Rotation: -15°
   - Icon: Code brackets (</>)
   - Description: Professional websites and online stores tailored to your business needs
   
2. **Branding & Content**
   - Path: `/branding-content`
   - Rotation: 5°
   - Icon: Search/magnifying glass
   - Description: Develop a cohesive brand identity and content plan
   
3. **Technical Automation**
   - Path: `/technical-automation`
   - Rotation: 25°
   - Icon: Settings/gear (cog)
   - Description: API integrations, hosting solutions, and domain setup
   
4. **Web Optimization**
   - Path: `/web-optimization`
   - Rotation: -10°
   - Icon: Zap/lightning (optimization)
   - Description: Keep your digital presence running smoothly
   
5. **Technical Consultation**
   - Path: `/technical-consultation`
   - Rotation: 15°
   - Icon: Question mark/info circle
   - Description: Expert guidance on technology decisions

### 404 Page
**Location:** `src/pages/NotFound.tsx`
**Total Cards:** 1

1. **Return to Velarix**
   - Path: `/`
   - Rotation: 0° (straight, no rotation)
   - Indicator Text: "Click this to return to Velarix"
   - Icon: Github icon (placeholder)

## Services Mapping (Business Plan → Site)

Based on PlentifulPower Consulting business plan:

1. ✅ **Website and eCommerce setup** → "Website & eCommerce" card → `/website-ecommerce`
2. ✅ **Branding and content strategy** → "Branding & Content" card → `/branding-content`
3. ✅ **Technical automation (API integrations, hosting, domain setup)** → "Technical Automation" card → `/technical-automation`
4. ✅ **Web optimization and maintenance** → "Web Optimization" card → `/web-optimization`
5. ✅ **Freelance technical consultation** → "Technical Consultation" card → `/technical-consultation`

## Contact Information Status

**Removed:**
- ❌ Physical address (MapPin icon removed)
- ❌ Phone number (not present in codebase)

**Kept:**
- ✅ Email: admin@velarix.digital
- ✅ Location text: "Netherlands & United States" (text only, no icon)

## Cleanup Status

- ✅ No plentifulpower links found in codebase (verified via grep)
- ✅ Old service pages (Github, Code, Earn) removed
- ✅ New service pages created matching business plan
- ✅ All routes updated in App.tsx
- ✅ Contact information simplified per requirements

