# Non-PatternFly CSS Analysis - camel-dashboard-console

## Summary

The camel-dashboard-console project follows a **minimal custom styling approach** with very limited non-PatternFly CSS. The project primarily relies on PatternFly components and design tokens.

## Custom CSS Files

### `src/camel.css`

The only custom CSS file in the project, containing 5 custom class definitions:

```css
/* Custom plugin styles */
.camel-dashboard-console__nice {
  color: var(--pf-global--palette--blue-400);
}

.co-m-resource-camel {
  padding: 1px 4px;
  background-color: transparent;
}

.co-m-resource-camel--lg {
  background-color: transparent;
  margin-right: 0;
}

.camel-icon {
  height: 18px;
  width: 18px;
  margin-bottom: -4px;
}

.camel-icon--lg {
  height: 21px;
  width: 21px;
  margin-bottom: -2px;
}
```

**Purpose:** Defines custom styles for Camel icons and resource elements.

**Imported in:**
- `src/components/camel-list-page/CamelAppList.tsx`
- `src/components/camel-list-page/CamelAppListEmpty.tsx`
- `src/components/camel-list-page/CamelNewProjectAlert.tsx`
- `src/components/camel-app-page/CamelAppTitle.tsx`

## Custom CSS Class Usage

### `.camel-icon`
Used in:
- `src/components/camel-list-page/CamelAppRow.tsx:42`

### `.camel-icon--lg`
Used in:
- `src/components/camel-app-page/CamelAppTitle.tsx:51`

### `.co-m-resource-camel`
Used in:
- `src/components/camel-list-page/CamelAppRow.tsx:41`

### `.co-m-resource-camel--lg`
Used in:
- `src/components/camel-app-page/CamelAppTitle.tsx:48`

## Inline Styles in JSX/TSX Files

### `src/components/camel-app-resources/CamelAppServices.tsx`
- **Line 84:** `style={{ color: 'var(--pf-v6-global--Color--200)' }}` - Colors "Service port:" label
- **Line 91:** `style={{ color: 'var(--pf-v6-global--Color--200)' }}` - Colors "Pod port:" label

### `src/components/camel-app-resources/CamelAppRoutes.tsx`
- **Line 79:** `style={{ color: 'var(--pf-v6-global--Color--200)' }}` - Colors "Location:" label

### `src/components/camel-list-page/CamelIcon.tsx`
- **Line 5:** `width="50px" height="50px"` - Inline sizing for Camel icon
- **Line 9:** `width="17.5px" height="17.5px"` - Inline sizing for smaller Camel icon in alerts

## Not Found

- **CSS Modules:** No `.module.css` files found
- **CSS-in-JS:** No styled-components, emotion, JSS, or other CSS-in-JS libraries are used

## Overall Styling Approach

1. **Primary Framework:** PatternFly components are used extensively throughout the application
2. **Custom CSS:** Limited to a single CSS file (`camel.css`) with only 5 custom class definitions
3. **Inline Styles:** Minimal usage - only 5 instances across the entire codebase, all using PatternFly CSS variables
4. **No CSS Modules:** The project does not use CSS modules
5. **No CSS-in-JS:** No CSS-in-JS libraries are present
6. **Naming Convention:** Custom classes follow OpenShift console conventions (prefixed with `co-m-resource-` or `camel-`)
7. **Design Tokens:** All custom styles and inline styles reference PatternFly CSS variables (e.g., `var(--pf-global--palette--blue-400)`, `var(--pf-v6-global--Color--200)`) ensuring consistency with the PatternFly design system

## Conclusion

This is a well-structured approach that maximizes the use of PatternFly while adding minimal custom styling only where necessary for plugin-specific visual elements (primarily the Camel icon).
