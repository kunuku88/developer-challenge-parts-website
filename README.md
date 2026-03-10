# Parts Finder — Technical Assignment

## Goal

Build a mini **Parts Finder** application that allows a mechanic or workshop to quickly locate the right part and compile a quote list — modelled after a B2B workflow rather than a traditional e-commerce checkout.

---

## Required Stack

- **Nuxt 4** + **Vue 3**
- **Tailwind CSS**
- Fully **responsive** layout
- **Testing** included

---

## Functional Scope

### 1. Overview Page

Display a list or grid of **part cards** based on data fetched from a mock API.

Each card must show at minimum:

- Name
- OEM number
- Brand
- Condition
- Price
- Stock indicator

---

### 2. Search, Filter & Sort

- **Search:** match on part name or OEM number
- **Filters:** brand (single or multi-select) and condition
- **Sorting:** price high → low / low → high

---

### 3. Detail Page

- Extended part information with a larger image (placeholder is fine)
- **Add to Quote** button

---

### 4. Quote List

- Quote list visible as a sidebar / mini drawer, or as a separate route
- Ability to remove individual items
- **Bonus:** persist the quote list in `localStorage`

---

## Mock Data

Use the following structure as your mock data:

```json
{
  "id": "2119711",
  "name": "DAF XF 106 Sideskirt set",
  "oem": "2119711",
  "brand": "DAF",
  "condition": "used",
  "price": 795,
  "inStock": true,
  "category": "Body",
  "image": "/img/placeholder-part.png"
}
```

---

## Nice to Have

- End-to-end (E2E) tests
- **"Available in colour"** badge on applicable parts
- Simple colour dropdown on the detail page that visually reflects the selected colour in the UI
- A **surprising element** of your own choosing — something not specified in the requirements that shows initiative

---
