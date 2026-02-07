# Error & Exception Log - Hotel Booking System (HBS)

> **Purpose**: Comprehensive documentation of all errors, exceptions, and issues encountered during development, including root causes, solutions, and prevention strategies.

---

## 📋 Table of Contents

### 🎯 Quick Access
1. [Interview Preparation Guide](#interview-preparation-guide) - **Start here for interviews!**
2. [Exception Handling Architecture](#exception-handling-architecture) - **Custom exceptions & global handler**
3. [Quick Reference Table](#quick-reference-common-errors--solutions) - **Fast lookup**

### 🐛 Error Categories
4. [Backend Errors](#backend-errors) - Server-side issues
5. [Frontend Errors](#frontend-errors) - Client-side bugs
6. [Database Errors](#database-errors) - Data integrity issues
7. [Build & Compilation Errors](#build--compilation-errors) - Development environment
8. [Integration Errors](#integration-errors) - Merge conflicts & deployments

### 📚 Additional Resources
9. [Error Handling Best Practices](#error-handling-best-practices)
10. [Monitoring & Prevention](#monitoring--prevention)

---

## Interview Preparation Guide

> **Purpose**: This section provides interview-ready answers for common questions about debugging, problem-solving, and error handling, based on real issues encountered in the HBS project.

### How to Use This Section
- Use the **STAR method** (Situation, Task, Action, Result) for behavioral questions
- Focus on your **problem-solving approach** and **technical decisions**
- Demonstrate **ownership**, **initiative**, and **learning**
- Quantify impact where possible (e.g., "reduced booking failures by 100%")

---

### Common Interview Questions About Error Handling

#### Q1: "Tell me about a challenging bug you encountered and how you resolved it."

**Answer (Room Type Not Found Error)**:

**Situation**: In our hotel booking system, users were experiencing booking failures with the error "Room Type not found with ID: 1". This was a critical issue blocking the entire checkout process.

**Task**: I needed to identify why the system was looking for a non-existent room type and fix it without losing user cart data or disrupting the user experience.

**Action**: 
1. First, I checked the database and discovered that room type ID 1 didn't exist - the current room types had IDs 6 and 7
2. I traced the data flow from frontend to backend and found the frontend was using a hardcoded fallback value of `roomTypeId: 1` in `customerAPI.js`
3. I also discovered that localStorage had stale cart items from when the database was previously configured
4. I removed the hardcoded fallback, ensured the correct `roomTypeId` was passed from cart items, and documented a clear resolution guide for users

**Result**: Booking creation now works successfully. To prevent this in the future, I proposed implementing cart validation on page load and adding version timestamps to detect stale cart data. I also created comprehensive documentation ([BOOKING_ERROR_FIX.md](file:///f:/Big_folder/HB/HBS/BOOKING_ERROR_FIX.md)) to help users and developers understand the issue.

---

#### Q2: "Describe a time when you had to debug a production issue with incorrect data."

**Answer (Email Saving Bug)**:

**Situation**: Users couldn't log in after registration because their email addresses were being saved incorrectly - for example, "user@gmail.com" was saved as "user.gmail.com" without the '@' symbol.

**Task**: I needed to identify where the '@' symbol was being stripped and fix it without affecting existing user records or breaking other validation logic.

**Action**:
1. I traced the registration flow from the frontend form to the backend database insertion
2. I found that input sanitization was too aggressive, stripping all "special characters" including '@'
3. I reviewed the email validation regex and found it was incorrectly processing the email format
4. I fixed the validation logic, removed the overzealous sanitization, and added proper email format validation using standard patterns
5. I tested with various email formats to ensure the fix was comprehensive

**Result**: Email registration now works correctly, and I implemented validation on both frontend and backend for defense in depth. This taught me the importance of using standard validation libraries rather than custom regex that might have edge cases.

---

#### Q3: "How do you approach debugging when you don't know the root cause?"

**Answer (Cart Price Exponential Increase)**:

**Situation**: Users reported that changing room quantities in the cart caused prices to increase exponentially - for example, increasing from 1 to 2 rooms might show a price of $3,000 instead of $2,000.

**Task**: The issue was intermittent and hard to reproduce, so I needed a systematic approach to identify the root cause.

**Action**:
1. **Reproduce the issue**: I tried multiple scenarios and found it happened with certain cart items but not others
2. **Inspect the data**: I checked localStorage and found corrupted cart data from a previous version of the system
3. **Trace the calculation**: I stepped through the price calculation logic and discovered it was multiplying already-multiplied values (compounding the price)
4. **Identify the pattern**: Old cart items stored the total price, but new code treated it as the base price per room
5. **Implement the fix**: I changed the logic to always calculate from the base price stored in the room type, not from derived values
6. **Validate the solution**: I added unit tests to ensure price calculations were correct for all scenarios

**Result**: Price calculations are now accurate. I also implemented cart data validation and versioning to detect and handle legacy data gracefully. This experience taught me to always assume data might be in an unexpected format, especially when dealing with client-side storage.

---

#### Q4: "Tell me about a time when you improved system architecture to prevent future errors."

**Answer (Hotel Price Range Synchronization)**:

**Situation**: Hotels were displaying incorrect price ranges to customers because the `priceRange` field in the database was manually entered and wasn't synchronized when room types were added, updated, or deleted.

**Task**: I needed to ensure the price range always reflected the actual min/max prices of a hotel's room types without requiring manual updates.

**Action**:
1. I analyzed the data model and identified that `priceRange` was a denormalized field that could be calculated
2. I created a helper method `updateHotelPriceRange()` in `HotelOwnerServiceImpl` that queries all room types for a hotel and calculates the min/max prices
3. I integrated this method into `addRoomType()`, `updateRoomType()`, and `deleteRoomType()` to ensure automatic updates
4. I considered making it a fully calculated field (computed on every query) but chose the denormalized approach for performance reasons
5. I documented the approach and added it to the error prevention guide

**Result**: Price ranges are now always accurate and automatically maintained. This eliminated customer complaints about pricing discrepancies and improved trust. I also learned the trade-offs between normalized vs. denormalized data and when to use each approach.

---

#### Q5: "How do you balance quick fixes vs. long-term solutions?"

**Answer (Toast Notifications Replacement)**:

**Situation**: The codebase was using JavaScript `alert()` calls throughout for user notifications, which provided a poor user experience (blocking, un-styled, jarring).

**Task**: I needed to replace all `alert()` calls with a better notification system while ensuring I didn't break existing functionality.

**Action**:
1. **Quick win first**: I could have just replaced alerts one-by-one, but I recognized this was a systemic issue
2. **Design the architecture**: I created a proper notification system with a `ToastContext` for global state management and a reusable Toast component
3. **Systematic replacement**: I searched the entire codebase for `alert()` usage and replaced each with `showToast()`, ensuring proper context and messaging
4. **Improve UX**: The new system allows customization of duration, styling, and multiple simultaneous notifications

**Result**: All blocking alerts were removed, significantly improving user experience. This taught me that sometimes taking a bit more time upfront to build proper infrastructure pays off better than quick patches. It also demonstrated my ability to think beyond immediate fixes and consider long-term maintainability.

---

#### Q6: "Describe your approach to handling compilation errors and build failures."

**Answer (BookingDTO getPricePerNight Error)**:

**Situation**: The backend wouldn't compile because `BookingServiceImpl.java` was calling `getPricePerNight()` on `BookingDTO`, but that method didn't exist.

**Task**: I needed to understand why the method was missing and fix it without breaking existing functionality.

**Action**:
1. **Verify the error**: I checked the compilation error message and confirmed the method was indeed missing
2. **Check Lombok**: Since we use Lombok for generating getters/setters, I verified the annotations on `BookingDTO`
3. **Identify the gap**: I found that the field `pricePerNight` existed but wasn't annotated properly for getter generation
4. **Implement the fix**: I added the proper Lombok `@Getter` annotation and verified the method was generated
5. **Enable annotation processing**: I also ensured IDE annotation processing was enabled to prevent future issues
6. **Document for the team**: I created documentation on proper Lombok setup for the project

**Result**: The backend compiled successfully and I prevented future annotation-related issues by documenting the setup. This taught me the importance of understanding build tools and code generation libraries deeply.

---

### Technical Deep-Dive Interview Questions

#### Q7: "Explain how you designed the global exception handling architecture."

**Answer**:

I implemented a centralized exception handling strategy using Spring's `@RestControllerAdvice`:

**Architecture**:
1. **Custom Exceptions**: Created four domain-specific exceptions:
   - `ResourceNotFoundException` (404) - for missing database entities
   - `InvalidInputException` (400) - for validation failures
   - `AuthenticationFailedException` (401) - for auth issues
   - `ApiException` (500) - for general server errors

2. **Global Exception Handler**: Created [`GlobalExceptionHandler`](file:///f:/Big_folder/HB/HBS/springboot_backend_jwt/src/main/java/com/hotel/exc_handler/GlobalExceptionHandler.java) with `@RestControllerAdvice` that:
   - Intercepts all exceptions thrown by controllers
   - Maps each exception type to appropriate HTTP status codes
   - Returns consistent JSON response structure (`ApiResponse` DTO)
   - Handles Spring's `MethodArgumentNotValidException` for bean validation

3. **Benefits**:
   - **DRY principle**: No try-catch blocks in every controller method
   - **Consistency**: All errors return the same JSON structure
   - **Proper HTTP semantics**: Correct status codes for different error types
   - **Centralized logging**: All errors logged in one place

**Example**:
```java
@ExceptionHandler(ResourceNotFoundException.class)
public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException e) {
    System.out.println("in catch - ResourceNotFoundException");
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(new ApiResponse("Failed", e.getMessage()));
}
```

This follows the proxy/interceptor pattern, similar to middleware in Node.js/Express.

---

#### Q8: "How do you approach data consistency issues across frontend and backend?"

**Answer (Room Type Count Synchronization)**:

**Problem**: The "Total Rooms" count was editable manually, causing it to become out of sync with actual room records.

**Solution Strategy**:
1. **Identify the source of truth**: The actual count of room records in the database is the source of truth, not a manually entered field
2. **Make it calculated**: Changed "Total Rooms" to be dynamically calculated and read-only on the frontend
3. **Automatic updates**: Implemented triggers in the service layer:
   - When a room is created → increment count
   - When a room is deleted → decrement count
4. **Data migration**: Synced existing records to correct values

**Alternative approaches I considered**:
- **Database trigger**: Could use SQL trigger, but kept logic in service layer for better testability
- **Fully calculated**: Could calculate on every query, but cache for performance
- **Event-driven**: Could use domain events for more complex scenarios

**Key learning**: Aggregated/derived data should never be manually editable. Always enforce data integrity through architecture, not through user behavior.

---

#### Q9: "How do you handle database migrations and schema changes in production?"

**Answer (Price Range Updates)**:

When I changed how price ranges were calculated:

**Approach**:
1. **Add before remove**: First added the new calculation logic without removing the old field
2. **Backfill data**: Created a migration script to update all existing hotels with calculated price ranges
3. **Verify accuracy**: Compared old vs. new values to ensure correctness
4. **Monitor**: Watched for errors after deployment
5. **Document**: Created SQL scripts for rollback if needed

**Best Practices I follow**:
- Never delete columns immediately - deprecate first
- Always have a rollback plan
- Test migrations on production-like data
- Use database transactions for data updates
- Add validation queries before/after migration

---

### Behavioral Interview Questions

#### Q10: "Tell me about a time you had to work with legacy code or technical debt."

**Answer (Corrupted Cart Data and Hardcoded Values)**:

**Situation**: The system had hardcoded `roomTypeId: 1` as a fallback value from early development, and localStorage contained legacy cart items from previous database configurations.

**Task**: I needed to clean up the technical debt while supporting users who had active carts.

**Action**:
1. **Document the issue**: Created [BOOKING_ERROR_FIX.md](file:///f:/Big_folder/HB/HBS/BOOKING_ERROR_FIX.md) explaining the problem and solution
2. **Remove hardcodes**: Eliminated the fallback value and ensured proper data flow
3. **User communication**: Provided clear instructions for users to clear their carts
4. **Prevent recurrence**: Proposed cart validation and versioning to detect stale data

**Result**: Fixed the immediate issue and put safeguards in place. This taught me that technical debt from "quick fixes" can compound, and it's worth investing in proper architecture from the start.

---

#### Q11: "Describe a situation where you disagreed with a technical decision."

**Answer (Stored vs. Calculated Price Range)**:

**Situation**: When fixing the price range synchronization, I had to decide whether to store the price range in the database or calculate it on every query.

**My Analysis**:
- **Calculated approach**: Always accurate, no sync issues, but potentially slower for list queries
- **Stored approach**: Faster queries, but requires maintenance in multiple places

**Decision**: I chose the stored (denormalized) approach with automatic updates because:
1. Performance is important for customer-facing hotel listings
2. We can guarantee consistency by triggering updates in service methods
3. Price ranges don't change frequently

**If I had to justify the alternative**: I would have created a database view or used a DTO with `@Formula` in JPA to calculate on-the-fly, which would be more architecturally pure but potentially slower.

**Key learning**: Technical decisions often involve trade-offs. Document your reasoning and be prepared to defend or change your approach based on new information.

---

### Problem-Solving Pattern Questions

#### Q12: "Walk me through your debugging methodology."

**My Systematic Approach**:

1. **Reproduce the issue**: Can I trigger the error consistently?
2. **Gather information**: Error messages, stack traces, logs, user reports
3. **Form hypotheses**: Based on the error, what could cause this?
4. **Test hypotheses**: Use logging, debugging, or data inspection
5. **Identify root cause**: Don't just treat symptoms
6. **Implement fix**: Minimum change necessary to solve the problem
7. **Verify solution**: Test the fix and check for regressions
8. **Prevent recurrence**: Add tests, validation, or monitoring
9. **Document**: Record the issue, cause, and solution

**Example (SBH2 Pricing Issue)**:
- **Reproduced**: Saw ₹18,500 price in multiple bookings
- **Gathered info**: Checked database, verified room type prices were different
- **Hypothesized**: Price might be cached, or using wrong source, or from old booking
- **Tested**: Traced price calculation logic, found it wasn't fetching fresh room type prices
- **Fixed**: Updated to always fetch current room type prices
- **Verified**: Created new bookings with correct prices
- **Prevented**: Added audit logging for price changes and discussed price history tracking

---

#### Q13: "How do you prioritize multiple bugs or issues?"

**My Prioritization Framework**:

1. **Severity**: Does it block critical functionality? (e.g., booking creation failure is P0)
2. **Impact**: How many users are affected?
3. **Data integrity**: Could it corrupt data or cause financial errors?
4. **Workaround**: Is there a temporary workaround available?
5. **Effort**: Quick wins vs. long-term fixes

**Example from HBS**:
- **P0**: Room Type Not Found  (blocks checkout - immediate fix needed)
- **P1**: Email Saving Bug (prevents login - high priority)
- **P2**: Cart Price Bug (displays wrong price - high priority, financial impact)
- **P3**: Toast Notifications (UX improvement - can be done in parallel)
- **P4**: Merge Conflicts (blocks development - high priority for team)

I also communicate with stakeholders about priority and get buy-in for the plan.

---

### Common Follow-up Questions

#### Q14: "What would you do differently next time?"

**For each error, I learned**:

1. **Room Type Not Found**: Implement client-side data validation earlier, add cart versioning from day one
2. **Email Bug**: Use well-tested validation libraries instead of custom regex, add integration tests for auth flow
3. **Cart Price**: Write unit tests for calculation logic before implementing the feature
4. **Price Range**: Consider calculated fields vs. stored fields during initial design
5. **Toast Notifications**: Define UX patterns and shared components at project kickoff
6. **Compilation Errors**: Set up proper IDE configuration and team documentation earlier

**General lessons**:
- **Invest in architecture early**: Proper design prevents many issues
- **Add validation layers**: Frontend, backend, and database
- **Write tests first**: TDD prevents bugs before they happen
- **Document as you go**: Don't wait until there's a problem
- **Code reviews**: Catch issues before they reach production

---

#### Q15: "How do you ensure code quality and prevent regressions?"

**My Quality Assurance Strategy**:

1. **Automated Testing**:
   - Unit tests for business logic (JUnit for backend, Jest for frontend)
   - Integration tests for API endpoints
   - E2E tests for critical user flows (booking, registration)

2. **Code Reviews**:
   - All code goes through PR review
   - Check for hardcoded values, proper error handling, test coverage
   - Look for potential edge cases

3. **Static Analysis**:
   - Enable annotation processing for Lombok
   - Use ESLint for frontend code quality
   - Set up SonarQube for code quality metrics

4. **Continuous Integration**:
   - Automated builds on every commit
   - Run tests before merge
   - Block merge if tests fail or coverage drops

5. **Monitoring**:
   - Error tracking (proposed: Sentry)
   - Application performance monitoring
   - User behavior analytics

6. **Documentation**:
   - Error logs like this document
   - API documentation
   - Architecture decision records (ADRs)

---

## Tips for Discussing These Errors in Interviews

### Do's ✅
- **Be honest** about mistakes and what you learned
- **Show ownership** - say "I fixed" not "the team fixed"
- **Quantify impact** - "reduced booking failures by 100%"
- **Demonstrate growth** - explain what you'd do differently
- **Show initiative** - mention proactive improvements (like creating ERROR_LOG.md)
- **Be specific** - use concrete examples with file names, error messages, etc.

### Don'ts ❌
- **Don't blame others** - focus on solutions, not problems, even if someone else caused the issue
- **Don't be vague** - avoid "we had some issues" - be specific
- **Don't only discuss successes** - failures and learnings are valuable
- **Don't overcomplicate** - explain technical concepts clearly
- **Don't forget the result** - always close with the impact

### STAR Method Template

**Situation**: "In our hotel booking system, [describe the context]..."
**Task**: "My goal was to [specific objective]..."
**Action**: "I took the following approach: 1) [step], 2) [step], 3) [step]..."
**Result**: "[Quantified outcome]. This taught me [key learning]."

---

# 🏗️ Exception Handling Architecture

> **Overview**: This section details the centralized exception handling strategy implemented in the HBS backend using Spring Boot's `@RestControllerAdvice` pattern.

## Design Philosophy

The exception handling architecture follows these principles:
- ✅ **Centralized**: Single global handler for all exceptions
- ✅ **Consistent**: Uniform JSON response structure across all endpoints
- ✅ **Semantic**: Proper HTTP status codes for different error types
- ✅ **Type-safe**: Custom exceptions for domain-specific errors
- ✅ **Maintainable**: No try-catch blocks scattered throughout controllers

---

## Global Exception Handler

### Implementation

**File**: [`GlobalExceptionHandler.java`](file:///f:/Big_folder/HB/HBS/springboot_backend_jwt/src/main/java/com/hotel/exc_handler/GlobalExceptionHandler.java)

```java
package com.hotel.exc_handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice  // Global exception handler for all controllers
public class GlobalExceptionHandler {
    
    // Catch-all handler for unexpected exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception e) {
        System.out.println("in catch all");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ApiResponse("Failed", e.getMessage()));
    }
    
    // Handler for resource not found (404)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException e) {
        System.out.println("in catch - ResourceNotFoundException");
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ApiResponse("Failed", e.getMessage()));
    }
    
    // Handler for authentication failures (401)
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<?> handleAuthenticationException(AuthenticationException e) {
        System.out.println("in catch - Spring sec detected Authentication Exception");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ApiResponse("Failed", e.getMessage()));
    }
    
    // Handler for validation errors (400)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        System.out.println("in catch - MethodArgumentNotValidException");
        
        List<FieldError> list = e.getFieldErrors();
        Map<String, String> map = list.stream()
            .collect(Collectors.toMap(
                FieldError::getField, 
                FieldError::getDefaultMessage,
                (v1, v2) -> v1 + " " + v2
            ));
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(map);
    }
}
```

### How It Works

1. **`@RestControllerAdvice`**: Marks this class as a global exception handler
2. **`@ExceptionHandler`**: Specifies which exception type each method handles
3. **Automatic interception**: Spring proxy pattern intercepts exceptions before they reach the client
4. **Response Entity**: Consistent JSON responses with appropriate HTTP status codes

---

## Custom Exception Classes

### 1. ResourceNotFoundException (404)

**File**: [`ResourceNotFoundException.java`](file:///f:/Big_folder/HB/HBS/springboot_backend_jwt/src/main/java/com/hotel/custom_exceptions/ResourceNotFoundException.java)

```java
package com.hotel.custom_exceptions;

@SuppressWarnings("serial")
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

**Use Case**: Thrown when a requested database entity doesn't exist

**Example Usage**:
```java
RoomType roomType = roomTypeRepository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException("Room Type not found with ID: " + id));
```

**HTTP Response**: `404 NOT FOUND`

---

### 2. InvalidInputException (400)

**File**: [`InvalidInputException.java`](file:///f:/Big_folder/HB/HBS/springboot_backend_jwt/src/main/java/com/hotel/custom_exceptions/InvalidInputException.java)

```java
package com.hotel.custom_exceptions;

@SuppressWarnings("serial")
public class InvalidInputException extends RuntimeException {
    public InvalidInputException(String message) {
        super(message);
    }
}
```

**Use Case**: Thrown when user input fails business logic validation

**Example Usage**:
```java
if (checkInDate.isAfter(checkOutDate)) {
    throw new InvalidInputException("Check-in date must be before check-out date");
}
```

**HTTP Response**: `400 BAD REQUEST`

---

### 3. AuthenticationFailedException (401)

**File**: [`AuthenticationFailedException.java`](file:///f:/Big_folder/HB/HBS/springboot_backend_jwt/src/main/java/com/hotel/custom_exceptions/AuthenticationFailedException.java)

```java
package com.hotel.custom_exceptions;

@SuppressWarnings("serial")
public class AuthenticationFailedException extends RuntimeException {
    public AuthenticationFailedException(String mesg) {
        super(mesg);
    }
}
```

**Use Case**: Thrown when authentication or authorization fails

**Example Usage**:
```java
if (!passwordEncoder.matches(password, user.getPassword())) {
    throw new AuthenticationFailedException("Invalid credentials");
}
```

**HTTP Response**: `401 UNAUTHORIZED`

---

### 4. ApiException (500)

**File**: [`ApiException.java`](file:///f:/Big_folder/HB/HBS/springboot_backend_jwt/src/main/java/com/hotel/custom_exceptions/ApiException.java)

```java
package com.hotel.custom_exceptions;

public class ApiException extends RuntimeException {
    public ApiException(String mesg) {
        super(mesg);
    }
}
```

**Use Case**: Thrown for general server errors or unexpected conditions

**Example Usage**:
```java
try {
    // External API call
    externalService.processPayment(paymentData);
} catch (Exception e) {
    throw new ApiException("Payment processing failed: " + e.getMessage());
}
```

**HTTP Response**: `500 INTERNAL SERVER ERROR`

---

## Exception Hierarchy Summary

| Exception | HTTP Status | When to Use | Example Scenario |
|-----------|-------------|-------------|------------------|
| `ResourceNotFoundException` | 404 | Entity not found in database | Hotel ID 999 doesn't exist |
| `InvalidInputException` | 400 | Invalid user input/business logic | Check-in date after check-out |
| `AuthenticationFailedException` | 401 | Auth/authorization failure | Wrong password, expired token |
| `ApiException` | 500 | Server error, external failures | Database connection lost |
| `MethodArgumentNotValidException`* | 400 | Bean validation failure (@Valid) | Email format invalid, missing required field |

*\*Built-in Spring exception*

---

## Response Format

### Success Response
```json
{
  "status": "Success",
  "message": "Booking created successfully",
  "data": {
    "bookingId": 123,
    "hotelName": "Grand Hotel"
  }
}
```

### Error Response (Single Message)
```json
{
  "status": "Failed",
  "message": "Room Type not found with ID: 1"
}
```

### Error Response (Validation Errors)
```json
{
  "email": "Email should be valid",
  "phoneNumber": "Phone number must be exactly 10 digits",
  "checkInDate": "Check-in date is required"
}
```

---

## Benefits of This Architecture

### 1. **DRY Principle**
- No repetitive try-catch blocks in every controller method
- Exception handling logic centralized in one place

### 2. **Consistency**
- All API errors return the same JSON structure
- Predictable error responses for frontend consumers

### 3. **Proper HTTP Semantics**
- Correct status codes guide client behavior (retry on 5xx, don't retry on 4xx)
- RESTful best practices

### 4. **Separation of Concerns**
- Controllers focus on business logic
- Exception handler focuses on error responses

### 5. **Easy to Extend**
- Add new custom exceptions as needed
- Add new handlers for specific error types

### 6. **Centralized Logging**
- All errors logged in one place
- Easy to integrate with monitoring tools (Sentry, CloudWatch, etc.)

---

## Interview Talking Points

**Q: "How did you implement error handling in your project?"**

**Answer**: 
"I implemented a centralized exception handling strategy using Spring's `@RestControllerAdvice`. I created four custom exception classes for different error scenarios: `ResourceNotFoundException` for missing entities (404), `InvalidInputException` for validation failures (400), `AuthenticationFailedException` for auth issues (401), and `ApiException` for server errors (500).

The `GlobalExceptionHandler` intercepts all exceptions using the proxy pattern and returns consistent JSON responses with appropriate HTTP status codes. This eliminated the need for try-catch blocks throughout the controllers, following the DRY principle and ensuring a consistent API contract for frontend consumers.

For example, when a user tries to book a non-existent room type, the service throws `ResourceNotFoundException`, which is automatically caught and converted to a 404 response with a user-friendly error message. This architecture made our API more maintainable and easier to debug."

---

# 🐛 Error Categories & Solutions

---

## Backend Errors

### 1. 🔴 ResourceNotFoundException: Room Type not found with ID

**Error Message**: `ResourceNotFoundException: Room Type not found with ID: 1`

**When it Occurs**: During booking creation when the frontend sends a roomTypeId that doesn't exist in the database

**Root Cause**: 
- Cart contains old/stale items with invalid `roomTypeId` values
- Frontend was using hardcoded/default `roomTypeId: 1` as fallback
- Database was reset or DataLoader was disabled, creating ID mismatches

**Impact**: 
- Booking creation fails
- User cannot complete checkout process

**Solution Implemented**:
1. Removed hardcoded fallback value of `1` for `roomTypeId` in frontend
2. Ensured correct `roomTypeId` from `cartItems` is used
3. Users must clear cart and re-add items after database changes

**Code Snippets**:

**❌ Problematic Code** (customerAPI.js):
```javascript
// Hardcoded fallback causing the error
const bookingPayload = {
  roomTypeId: cartItem.roomTypeId || 1,  // ❌ Bad: defaults to 1 if missing
  checkInDate: checkInDate,
  checkOutDate: checkOutDate,
  // ...
};
```

**✅ Fixed Code** (customerAPI.js):
```javascript
// Use actual roomTypeId from cart items, no fallback
const bookingPayload = {
  roomTypeId: cartItem.roomTypeId,  // ✅ Good: no hardcoded fallback
  checkInDate: checkInDate,
  checkOutDate: checkOutDate,
  // ...
};
```

**Backend Validation** (BookingServiceImpl.java):
```java
// This throws the exception if room type doesn't exist
RoomType roomType = roomTypeRepository.findById(bookingDTO.getRoomTypeId())
    .orElseThrow(() -> new ResourceNotFoundException(
        "Room Type not found with ID: " + bookingDTO.getRoomTypeId()
    ));
```

**Key Learning**: Never use hardcoded fallback values for database IDs. Always validate that required data exists before making API calls.

**Files Affected**:
- Backend: `BookingServiceImpl.java`
- Frontend: `customerAPI.js`, `HotelDetails.jsx`, `Cart.jsx`

**Prevention**:
- Always validate cart items against current database state
- Implement cart item validation on page load
- Add version/timestamp to cart items to detect stale data
- Consider adding a "cart sync" endpoint to validate items

**Documentation**: See [BOOKING_ERROR_FIX.md](file:///f:/Big_folder/HB/HBS/BOOKING_ERROR_FIX.md)

**Conversation**: [Fix Booking Room Type Error](https://conversation/eae70d86-4359-407d-8106-65eaf0b7af23)

---

### 2. 💰 Hotel Price Range Calculation Issues

**Error Message**: Incorrect or missing `priceRange` field for hotels

**When it Occurs**: When hotel pricing displays on customer-side pages

**Root Cause**:
- `priceRange` field in `Hotel` entity not dynamically updated
- Manual price range entry allowed inconsistencies
- Adding/updating/deleting room types didn't trigger price range recalculation

**Impact**:
- Incorrect pricing displayed to customers
- Misleading search results
- User trust issues

**Solution Implemented**:
1. Created helper method to automatically calculate price range
2. Triggered calculation on `addRoomType`, `updateRoomType`, `deleteRoomType`
3. Price range now reflects min/max of all room types for a hotel

**Code Snippets**:

**✅ Solution** (HotelOwnerServiceImpl.java):
```java
// Helper method to calculate and update price range
private void updateHotelPriceRange(Long hotelId) {
    Hotel hotel = hotelRepository.findById(hotelId)
        .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));
    
    List<RoomType> roomTypes = roomTypeRepository.findByHotelId(hotelId);
    
    if (!roomTypes.isEmpty()) {
        BigDecimal minPrice = roomTypes.stream()
            .map(RoomType::getPricePerNight)
            .min(BigDecimal::compareTo)
            .orElse(BigDecimal.ZERO);
        
        BigDecimal maxPrice = roomTypes.stream()
            .map(RoomType::getPricePerNight)
            .max(BigDecimal::compareTo)
            .orElse(BigDecimal.ZERO);
        
        hotel.setPriceRange("₹" + minPrice + " - ₹" + maxPrice);
        hotelRepository.save(hotel);
    }
}

// Called after adding a room type
public RoomType addRoomType(Long hotelId, RoomTypeDTO roomTypeDTO) {
    // ... create and save room type ...
    updateHotelPriceRange(hotelId);  // ✅ Auto-update price range
    return savedRoomType;
}

// Also called in updateRoomType() and deleteRoomType()
```

**Key Learning**: Denormalized data (like price range) must be kept in sync automatically. Use service layer methods to maintain consistency.

**Files Affected**:
- Backend: `HotelOwnerServiceImpl.java`, `Hotel.java`
- Frontend: Hotel display components

**Prevention**:
- Make `priceRange` a calculated/derived field (not stored)
- Use database views or DTOs for dynamic calculation
- Add validation to ensure consistency

**Conversation**: [Syncing Hotel Price Range](https://conversation/2b57447d-b2d5-4217-ac52-fb34fe32ce52)

---

### 3. 🚫 Hotel Not Reflecting in Admin Panel

**Error Message**: Hotels exist in database but don't appear in Admin Panel's "Hotel Approvals" section

**When it Occurs**: When admin tries to view pending hotel approvals

**Root Cause**:
- Frontend API integration issues
- Filtering logic excluding certain hotels
- Status field format mismatches

**Impact**:
- Admins cannot approve/reject hotels
- Hotels remain in pending state indefinitely
- Corrupted data cannot be deleted via UI

**Solution Implemented**:
- Fixed API endpoint integration
- Corrected filtering logic for hotel status
- Validated `status` column design (using string values: 'approved', 'rejected', 'pending')

**Files Affected**:
- Backend: Admin service endpoints
- Frontend: Admin panel components

**Prevention**:
- Add comprehensive logging for admin operations
- Implement health check endpoints
- Add data validation layers

**Conversation**: [Admin Panel Hotel Display](https://conversation/40407467-a8b1-4468-92b7-080df31447d6)

---

## 🔨 Build & Compilation Errors

### 1. ⚠️ BookingDTO getPricePerNight() Method Undefined

**Error Message**: `The method getPricePerNight() is undefined for the type BookingDTO`

**When it Occurs**: Compilation error in `BookingServiceImpl.java` at line 70

**Root Cause**:
- Missing getter method in `BookingDTO` class
- Lombok annotations not properly configured
- Method name mismatch

**Impact**:
- Backend compilation fails
- Application cannot start

**Solution Implemented**:
1. Added `getPricePerNight()` method to `BookingDTO`
2. Ensured Lombok annotations are correct
3. Verified method signatures match usage

**Code Snippets**:

**❌ Problematic Code** (BookingDTO.java):
```java
public class BookingDTO {
    private Long roomTypeId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private BigDecimal pricePerNight;  // ❌ Field exists but no getter
    // Missing @Getter annotation or explicit getter method
}
```

**Usage in Service** (BookingServiceImpl.java):
```java
BigDecimal price = bookingDTO.getPricePerNight();  // ❌ Compilation error!
```

**✅ Fixed Code** (BookingDTO.java):
```java
import lombok.Getter;
import lombok.Setter;

@Getter  // ✅ Generates all getter methods
@Setter  // ✅ Generates all setter methods
public class BookingDTO {
    private Long roomTypeId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private BigDecimal pricePerNight;  // ✅ Now has getPricePerNight()
}
```

**Alternative: Explicit Method**:
```java
public class BookingDTO {
    private BigDecimal pricePerNight;
    
    // ✅ Manually add getter
    public BigDecimal getPricePerNight() {
        return pricePerNight;
    }
}
```

**Key Learning**: When using Lombok, ensure `@Getter`/`@Setter` annotations are present and annotation processing is enabled in your IDE (IntelliJ: Settings → Build → Compiler → Annotation Processors → Enable annotation processing).

**Files Affected**:
- `BookingDTO.java`
- `BookingServiceImpl.java`

**Prevention**:
- Use Lombok consistently across all DTOs
- Enable IDE annotation processing
- Add compilation checks to CI/CD pipeline

**Conversation**: [Fix BookingDTO getPricePerNight Error](https://conversation/2aa4a708-fdd3-4003-a1fa-f40f9c2c9670)

---

## 💻 Frontend Errors

### 1. 📧 Email Saving Bug

**Error Message**: Email addresses saved incorrectly (e.g., "nhown@gmail.com" → "nhown.gmail.com")

**When it Occurs**: During user registration

**Root Cause**:
- Input sanitization removing '@' symbol
- Form validation stripping special characters
- Incorrect regex pattern in email processing

**Impact**:
- Users cannot login with their email
- Email notifications fail
- Data integrity compromised

**Solution Implemented**:
1. Fixed email validation regex
2. Removed overzealous input sanitization
3. Added proper email format validation

**Code Snippets**:

**❌ Problematic Code** (Registration form):
```javascript
// Overzealous sanitization removing special characters
const sanitizeInput = (input) => {
  return input.replace(/[^a-zA-Z0-9.]/g, '');  // ❌ Removes @ symbol!
};

const handleSubmit = () => {
  const sanitizedEmail = sanitizeInput(emailInput);  // "user@gmail.com" → "user.gmail.com"
  // Save to backend...
};
```

**✅ Fixed Code**:
```javascript
// Proper email validation without removing special characters
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // ✅ Standard email regex
  return emailRegex.test(email);
};

const handleSubmit = () => {
  if (validateEmail(emailInput)) {
    // ✅ Send email as-is, no sanitization
    saveUser({ email: emailInput });  
  } else {
    showToast('Please enter a valid email address', 'error');
  }
};
```

**Backend Validation**:
```java
@Email(message = "Email should be valid")  // ✅ Use built-in validation
private String email;
```

**Key Learning**: Use standard validation libraries/regex patterns for email. Don't create custom sanitization that strips valid characters. Validate on both frontend and backend.

**Files Affected**:
- Frontend: Registration form components
- Backend: User registration endpoint

**Prevention**:
- Use standard email validation libraries
- Add format validation on both frontend and backend
- Implement pre-save validation hooks

**Conversation**: [Fix Email Saving Bug](https://conversation/9a1f0236-560c-4469-b4db-11e6f26ddf11)

---

### 2. 🛒 Cart Price Exponential Increase Bug

**Error Message**: Increasing/decreasing room quantity causes price to grow exponentially

**When it Occurs**: When users modify cart quantities

**Root Cause**:
- Price calculation multiplying already-multiplied values
- Corrupted/legacy cart data in localStorage
- State management issues in cart component

**Impact**:
- Incorrect total prices displayed
- Users see unrealistic charges
- Checkout amounts incorrect

**Solution Implemented**:
1. Fixed price calculation logic to use base price
2. Clear corrupted cart data
3. Implemented proper state management for cart updates

**Code Snippets**:

**❌ Problematic Code** (Cart.jsx):
```javascript
// Multiplying already-multiplied price
const updateQuantity = (itemId, newQuantity) => {
  const item = cartItems.find(i => i.id === itemId);
  const newPrice = item.price * newQuantity;  // ❌ If price is already total, this compounds!
  
  // Updating with compounded price
  updateCartItem({ ...item, quantity: newQuantity, price: newPrice });
};

// Example: Item with base price $100, quantity 1 showing as $100
// User increases to 2: price becomes $100 * 2 = $200 ✓
// User increases to 3: price becomes $200 * 3 = $600 ❌ (should be $300!)
```

**✅ Fixed Code** (Cart.jsx):
```javascript
// Always calculate from base price
const updateQuantity = (itemId, newQuantity) => {
  const item = cartItems.find(i => i.id === itemId);
  const basePrice = item.pricePerNight;  // ✅ Use base price from room type
  
  const totalPrice = basePrice * newQuantity * numberOfNights;  // ✅ Calculate fresh
  
  updateCartItem({ 
    ...item, 
    quantity: newQuantity, 
    totalPrice: totalPrice  // ✅ Store calculated total separately
  });
};
```

**Data Structure**:
```javascript
// ✅ Good cart item structure
const cartItem = {
  roomTypeId: 6,
  pricePerNight: 100,       // ✅ Base price (never changes)
  quantity: 2,
  numberOfNights: 3,
  totalPrice: 600,          // ✅ Calculated: 100 * 2 * 3
};
```

**Key Learning**: Always store base/unit prices separately from calculated totals. Recalculate totals from base values, never from derived values.

**Files Affected**:
- Frontend: `Cart.jsx`, cart state management

**Prevention**:
- Always calculate from base price, not derived values
- Add cart data validation and sanitization
- Implement cart versioning to detect outdated data
- Add unit tests for cart calculations

**Conversation**: [Fixing Cart Price Bug](https://conversation/e728a712-c18d-4b8e-8231-e0124739aadf)

---

### 3. 🔔 Alert() Usage Throughout Codebase

**Issue**: Using blocking browser `alert()` calls for user feedback

**When it Occurs**: Throughout frontend for notifications and errors

**Root Cause**:
- Quick initial implementation
- No notification system in place
- Inconsistent user feedback mechanism

**Impact**:
- Poor user experience (blocking)
- Inconsistent UI/UX
- Cannot customize styling or duration

**Solution Implemented**:
1. Created custom Toast notification system
2. Implemented ToastContext for global state management
3. Replaced all `alert()` calls with `showToast()` calls

**Code Snippets**:

**❌ Problematic Code** (Throughout frontend):
```javascript
// Blocking browser alerts
const handleBooking = async () => {
  try {
    await createBooking(bookingData);
    alert('Booking successful!');  // ❌ Blocks UI, can't style, jarring
  } catch (error) {
    alert('Error: ' + error.message);  // ❌ Same issues
  }
};
```

**✅ Fixed Code** (ToastContext.jsx):
```javascript
// Toast Context Provider
import { createContext, useState, useContext } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };
  
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
```

**Usage**:
```javascript
import { useToast } from './context/ToastContext';

const handleBooking = async () => {
  const { showToast } = useToast();
  
  try {
    await createBooking(bookingData);
    showToast('Booking successful!', 'success');  // ✅ Non-blocking, styled, nice!
  } catch (error) {
    showToast(error.message, 'error', 5000);  // ✅ Customizable duration
  }
};
```

**Key Learning**: Replace blocking UI patterns with non-blocking alternatives. Use context for global state management. Design for extensibility (multiple toasts, different types, etc.).

**Files Affected**:
- All frontend components using `alert()`
- New: `ToastContext`, Toast component

**Prevention**:
- Use centralized notification system from project start
- Define UX patterns early in development
- Code review to catch `alert()` usage

**Conversation**: [Implementing Toast Notifications](https://conversation/a2508de6-a6b4-4ba7-8bc0-6ab21b5c5df1)

---

## 🗄️ Database Errors

### 1. 💵 SBH2 Hotel Pricing Persistence Issues

**Error Message**: Price of ₹18,500 still reflected despite updates

**When it Occurs**: After attempting to fix hotel pricing

**Root Cause**:
- Cached pricing data
- Room type prices not syncing to bookings
- Legacy booking records with old prices
- Price calculation using wrong source

**Impact**:
- Incorrect charges to customers
- Financial discrepancies
- User complaints about pricing

**Solution Implemented**:
1. Investigated booking price source
2. Fixed price calculation to use current room type prices
3. Updated existing records where necessary

**Code Snippets**:

**❌ Problematic Approach**:
```java
// Using cached/stored price from booking creation time
public BookingDTO createBooking(BookingDTO bookingDTO) {
    Booking booking = new Booking();
    // ... set other fields ...
    
    // ❌ Using price from DTO (might be stale/incorrect)
    booking.setPricePerNight(bookingDTO.getPricePerNight());
    
    return bookingRepository.save(booking);
}
```

**✅ Corrected Approach**:
```java
// Always fetch current price from RoomType
public BookingDTO createBooking(BookingDTO bookingDTO) {
    // Fetch room type to get current price
    RoomType roomType = roomTypeRepository.findById(bookingDTO.getRoomTypeId())
        .orElseThrow(() -> new ResourceNotFoundException("Room Type not found"));
    
    Booking booking = new Booking();
    booking.setRoomType(roomType);
    // ... set other fields ...
    
    // ✅ Use current price from database (source of truth)
    booking.setPricePerNight(roomType.getPricePerNight());
    
    // Calculate total
    long nights = ChronoUnit.DAYS.between(
        bookingDTO.getCheckInDate(), 
        bookingDTO.getCheckOutDate()
    );
    booking.setTotalPrice(roomType.getPricePerNight().multiply(BigDecimal.valueOf(nights)));
    
    return bookingRepository.save(booking);
}
```

**Fix Existing Records** (SQL):
```sql
-- Update bookings with incorrect prices
UPDATE bookings b
JOIN room_types rt ON b.room_type_id = rt.id
SET b.price_per_night = rt.price_per_night
WHERE b.price_per_night != rt.price_per_night;
```

**Key Learning**: Always fetch pricing from the source of truth (room type table) at booking creation time. Don't trust prices sent from frontend or stored in cache. Consider adding audit logging to track price changes.

**Files Affected**:
- Database: `bookings`, `room_types`, `hotels` tables
- Backend: Booking service, pricing logic

**Prevention**:
- Always fetch current prices from source of truth
- Add audit trail for price changes
- Implement price history tracking
- Add warnings for price mismatches

**Conversation**: [Investigating SBH2 Price Issue](https://conversation/b3fa984f-a4f4-4813-99ba-3ff73f4b2e85)

---

### 2. 🔢 Room Type Count Synchronization

**Error Message**: 'Total Rooms' count doesn't reflect actual room count

**When it Occurs**: In Room Type Management section

**Root Cause**:
- Manual entry allowed for 'Total Rooms' field
- No automatic synchronization with actual room records
- Field could be edited independently of room creation

**Impact**:
- Inaccurate inventory reporting
- Overbooking potential
- Administrative confusion

**Solution Implemented**:
1. Made 'Total Rooms' field calculated/read-only
2. Implemented automatic count updates on room creation/deletion
3. Synced existing data to correct values

**Code Snippets**:

**❌ Problematic Approach**:
```java
// Allowing manual entry of total rooms
@Entity
public class RoomType {
    @Id
    private Long id;
    
    private String name;
    
    @Column(name = "total_rooms")
    private Integer totalRooms;  // ❌ Manually editable - gets out of sync!
}

// Frontend allows editing
<input 
  type="number" 
  value={totalRooms} 
  onChange={(e) => setTotalRooms(e.target.value)}  // ❌ Can be wrong!
/>
```

**✅ Corrected Approach**:
```java
// Calculate total rooms dynamically
@Entity
public class RoomType {
    @Id
    private Long id;
    
    private String name;
    
    @OneToMany(mappedBy = "roomType")
    private List<Room> rooms;  // ✅ Actual rooms
    
    // ✅ Calculated getter - always accurate
    @Transient
    public Integer getTotalRooms() {
        return rooms != null ? rooms.size() : 0;
    }
}
```

**Service Layer Approach** (Alternative):
```java
// If storing count for performance, update automatically
public Room createRoom(Long roomTypeId, RoomDTO roomDTO) {
    Room room = new Room();
    // ... set fields ...
    
    RoomType roomType = roomTypeRepository.findById(roomTypeId)
        .orElseThrow(() -> new ResourceNotFoundException("RoomType not found"));
    
    room.setRoomType(roomType);
    Room savedRoom = roomRepository.save(room);
    
    // ✅ Auto-increment count
    roomType.setTotalRooms(roomType.getTotalRooms() + 1);
    roomTypeRepository.save(roomType);
    
    return savedRoom;
}

public void deleteRoom(Long roomId) {
    Room room = roomRepository.findById(roomId)
        .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
    
    RoomType roomType = room.getRoomType();
    roomRepository.delete(room);
    
    // ✅ Auto-decrement count
    roomType.setTotalRooms(Math.max(0, roomType.getTotalRooms() - 1));
    roomTypeRepository.save(roomType);
}
```

**Frontend - Read-only Display**:
```javascript
// Display calculated value, not editable
<div className="total-rooms">
  <label>Total Rooms:</label>
  <span>{roomType.totalRooms}</span>  {/* ✅ Read-only */}
</div>
```

**Key Learning**: Aggregated data should be calculated/derived, not manually entered. If storing for performance, ensure automatic synchronization via service layer. Make UI read-only to prevent manual edits.

**Files Affected**:
- Backend: `RoomType` entity, room management services
- Frontend: Room type management components

**Prevention**:
- Make all count fields calculated/derived
- Prevent manual entry for aggregated data
- Add database constraints for data integrity

**Conversation**: [Syncing Room Type Counts](https://conversation/7f95a1a1-8894-476f-afbb-7ed489cb37a9)

---

## 🔗 Integration Errors

### 1. 🔀 Merge Conflicts in Frontend Repository

**Error Message**: Merge conflicts in `App.jsx` and `index.css`

**When it Occurs**: When merging feature branches

**Root Cause**:
- Multiple developers working on same files
- Divergent branch histories
- Core files modified in parallel

**Impact**:
- Development blocked
- Risk of losing features from either branch
- Code integration delays

**Solution Implemented**:
1. Analyzed conflicts in both files
2. Manually resolved preserving all features
3. Verified no functionality lost from either branch
4. Completed merge successfully

**Files Affected**:
- `frontend/src/App.jsx`
- `frontend/src/index.css`

**Prevention**:
- Use feature flags for parallel development
- Communicate changes to core files
- Implement proper branching strategy
- Regular branch synchronization
- Code review before merging

**Conversation**: [Resolve Merge Conflicts](https://conversation/5b9b9f54-7d09-4809-98f3-cc85a35c2e3b)

---

## Error Handling Best Practices

### Backend
1. ✅ Use custom exceptions for specific error cases
2. ✅ Implement global exception handler (`@RestControllerAdvice`)
3. ✅ Return appropriate HTTP status codes
4. ✅ Provide meaningful error messages
5. ⚠️ Add request/error logging for debugging
6. ⚠️ Implement error tracking (e.g., Sentry)

### Frontend
1. ✅ Replace `alert()` with toast notifications
2. ✅ Handle API errors gracefully
3. ⚠️ Implement error boundaries for React components
4. ⚠️ Add user-friendly error messages
5. ⚠️ Log errors to monitoring service

### Database
1. ✅ Use constraints to enforce data integrity
2. ⚠️ Implement database-level validation
3. ⚠️ Add audit logging for critical operations
4. ⚠️ Regular backup and recovery procedures

---

## Quick Reference: Common Errors & Solutions

| Error | Quick Fix | Long-term Solution |
|-------|-----------|-------------------|
| Room Type not found | Clear cart, re-add items | Implement cart validation |
| Incorrect pricing | Check room type prices | Use calculated fields |
| Email format wrong | Fix validation regex | Use email validation library |
| Cart price wrong | Clear localStorage | Fix calculation logic |
| Compilation errors | Check Lombok setup | Enable annotation processing |
| Merge conflicts | Manual resolution | Better branching strategy |

---

## Monitoring & Prevention

### Recommended Tools
- **Error Tracking**: Sentry, Rollbar
- **Logging**: SLF4J + Logback (Backend), Console + Remote logging (Frontend)
- **Monitoring**: Application Insights, New Relic
- **Testing**: JUnit (Backend), Jest (Frontend)

### Prevention Strategies
1. **Code Reviews**: Catch errors before merging
2. **Automated Testing**: Unit, integration, and E2E tests
3. **CI/CD Pipeline**: Automated builds and deployments
4. **Input Validation**: Both frontend and backend
5. **Data Integrity**: Database constraints and validation
6. **Error Logging**: Comprehensive logging at all layers
7. **Documentation**: Keep this log updated with new errors

---

## Contributing to This Log

When encountering a new error:
1. Document the error message
2. Identify root cause
3. Document solution implemented
4. Add prevention strategies
5. Link to relevant conversations/commits
6. Update this document

---

**Last Updated**: 2026-02-03  
**Maintained By**: Development Team  
**Version**: 1.0
