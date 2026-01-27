# Lombok Compilation Errors - Fix Guide

## Problem
The IDE shows "cannot find symbol" errors for getter/setter methods because Lombok annotations haven't been processed yet.

## Root Cause
- Entities use `@Getter` and `@Setter` annotations from Lombok
- Lombok generates getters/setters at compile time
- IDE needs to process these annotations to recognize the methods

## Quick Fix (Recommended)

### Option 1: Run Maven Compile
```bash
cd springboot_backend_jwt
mvn clean compile
```

Or use the provided script:
```bash
cd springboot_backend_jwt
rebuild.bat
```

### Option 2: IDE Configuration

#### For VS Code:
1. Install "Language Support for Java" extension
2. Install "Lombok Annotations Support" extension
3. Reload window: `Ctrl+Shift+P` → "Reload Window"

#### For IntelliJ IDEA:
1. Install Lombok plugin: `File` → `Settings` → `Plugins` → Search "Lombok"
2. Enable annotation processing: `File` → `Settings` → `Build, Execution, Deployment` → `Compiler` → `Annotation Processors`
3. Check "Enable annotation processing"
4. Rebuild project: `Build` → `Rebuild Project`

#### For Eclipse:
1. Install Lombok: Download `lombok.jar` from https://projectlombok.org/download
2. Run: `java -jar lombok.jar`
3. Select Eclipse installation directory
4. Restart Eclipse
5. Clean and rebuild: `Project` → `Clean`

## Verification

After fixing, these methods should be recognized:

### Hotel Entity
```java
hotel.getName()
hotel.setName(String)
hotel.getCity()
hotel.setCity(String)
hotel.getState()
hotel.setState(String)
hotel.getDescription()
hotel.setDescription(String)
hotel.getAddress()
hotel.setAddress(String)
hotel.getStarRating()
hotel.setStarRating(Integer)
hotel.getStatus()
hotel.setStatus(String)
hotel.getRejectionReason()
hotel.setRejectionReason(String)
hotel.getPriceRange()
hotel.setPriceRange(String)
hotel.getAmenities()
hotel.setAmenities(String)
hotel.getImages()
hotel.setImages(String)
hotel.getOwner()
hotel.setOwner(User)
```

### User Entity
```java
user.getFirstName()
user.setFirstName(String)
user.getLastName()
user.setLastName(String)
user.getEmail()
user.setEmail(String)
user.getUserRole()
user.setUserRole(UserRole)
user.getAccountStatus()
user.setAccountStatus(String)
user.getSuspensionReason()
user.setSuspensionReason(String)
```

### Room Entity
```java
room.getRoomNumber()
room.setRoomNumber(String)
room.getHotel()
room.setHotel(Hotel)
room.getRoomType()
room.setRoomType(RoomType)
room.getIsActive()
room.setIsActive(Boolean)
room.getStatus()
room.setStatus(String)
```

## Additional Fixes Needed

### Fix BigDecimal to double conversion (Lines 525, 531)
Replace:
```java
.mapToDouble(Booking::getTotalPrice)
```

With:
```java
.mapToDouble(b -> b.getTotalPrice().doubleValue())
```

### Fix null safety warnings
These are warnings, not errors. They can be suppressed or fixed by adding null checks:
```java
if (hotelId != null) {
    hotelRepository.findById(hotelId)...
}
```

## Why This Happens

1. **Lombok is a compile-time annotation processor**
   - It generates code during compilation
   - IDE needs to be aware of this process

2. **Maven configuration is correct**
   - `pom.xml` has Lombok dependency
   - Annotation processor path is configured
   - But IDE might not have processed it yet

3. **Solution: Trigger compilation**
   - Running `mvn compile` forces Lombok to generate code
   - IDE then recognizes the generated methods

## Permanent Solution

Add to your IDE workspace settings to always enable Lombok:

### VS Code (settings.json)
```json
{
  "java.jdt.ls.lombokSupport.enabled": true,
  "java.compile.nullAnalysis.mode": "automatic"
}
```

### IntelliJ IDEA
- Keep "Enable annotation processing" checked
- Keep Lombok plugin installed and enabled

## Testing After Fix

Run the application:
```bash
cd springboot_backend_jwt
mvn spring-boot:run
```

If it starts successfully, Lombok is working correctly.

## Notes

- The `[cSpell]` errors about "dtos" are just spelling warnings (ignore)
- The `[Java]` null safety warnings are optional (can be suppressed)
- The main "cannot find symbol" errors will be fixed after compilation
- All entity classes use Lombok correctly - no code changes needed
