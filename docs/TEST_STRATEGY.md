# Test Strategy for Company Wiki

## Coverage Goals

| Component Type | Current Coverage | Goal Coverage | Priority |
|----------------|-----------------|--------------|----------|
| Global | 5.84% | 30% | High |
| Components | Varies (0-100%) | 40% | High |
| Lib/Utils | 0% | 60% | Highest |
| API routes | 0% | 40% | Medium |
| Pages | 0% | 20% | Medium |

## Testing Approach

### 1. Critical Path First

Focus on the most crucial user flows first:
- Content viewing and navigation
- Search functionality
- API endpoints used by many components

### 2. Component Testing Priority

1. **High Priority (test immediately)**:
   - `src/components/content/*` - Core content rendering
   - `src/components/navigation/*` - Site navigation
   - `src/lib/content/*` - Content processing logic

2. **Medium Priority (test next)**:
   - `src/components/search/*` - Search functionality
   - `src/components/sidebar/*` - Navigation sidebar
   - `src/lib/files/*` - File management utilities
   - `src/lib/api/*` - API response utilities

3. **Lower Priority**:
   - Purely visual components with minimal logic
   - Admin-only features

### 3. Testing Types

#### Unit Tests (70% of test effort)
- Test individual components and utility functions
- Focus on edge cases and error states
- Mock dependencies

#### Integration Tests (20% of test effort)
- Test interaction between components
- Test API endpoints with mock data
- Test page rendering with various content types

#### E2E Tests (10% of test effort)
- Test critical user journeys end-to-end
- Focus on core functionality (navigation, search, content viewing)

## Implementation Plan

### Phase 1: Core Component Tests (2 weeks)
- ✅ Add tests for `MDXContent` component
- ✅ Add tests for `Breadcrumb` component
- ✅ Add tests for `ThemeToggle` component
- Add tests for remaining high-priority components:
  - `src/components/search/SearchBar.tsx`
  - `src/components/sidebar/Sidebar.tsx`

### Phase 2: Utility/Library Tests (2 weeks)
- Add tests for all `src/lib/content/*` files (highest priority)
- Add tests for `src/lib/files/*` utilities
- Add tests for `src/lib/api/responses.ts`

### Phase 3: API Route Tests (1 week)
- Add tests for all API routes under `src/app/api/`

### Phase 4: Page Component Tests (2 weeks)
- Add tests for main page components
- Focus on proper rendering with different content types

## Best Practices

1. **Test Structure**
   - Name tests descriptively: `describe('Component', () => { it('should do X when Y', ...) })`
   - Group related tests logically
   - Use beforeEach for common setup

2. **Mocking**
   - Mock external services and APIs
   - Use Jest mock functions for callbacks
   - Create reusable test fixtures

3. **Test Coverage**
   - Focus on testing behavior, not implementation
   - Ensure tests cover error cases
   - Test edge cases (empty arrays, null values, etc.)

4. **CI Integration**
   - Tests must pass before merging
   - Coverage thresholds must be met
   - Run tests in both development and CI environments

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Next.js Applications](https://nextjs.org/docs/testing)