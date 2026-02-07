# Google Drive Image Links Feature

## Feature Added: Manual Image Upload via Google Drive Links

### Overview
Hotel owners can now add images for both **Room Types** and **Hotels** using Google Drive share links or direct image URLs.

## Changes Made

### 1. Room Type Management (`RoomTypeManagement.jsx`)

#### New State Variables
```javascript
const [imageInput, setImageInput] = useState('');
```

#### New Functions
```javascript
const handleAddImage = () => {
  if (imageInput.trim()) {
    // Convert Google Drive link to direct image URL if needed
    let imageUrl = imageInput.trim();
    
    // Handle Google Drive share links
    if (imageUrl.includes('drive.google.com')) {
      const fileIdMatch = imageUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        imageUrl = `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageUrl]
    }));
    setImageInput('');
  }
};

const handleRemoveImage = (index) => {
  setFormData(prev => ({
    ...prev,
    images: prev.images.filter((_, i) => i !== index)
  }));
};
```

#### Updated Form Data
```javascript
const [formData, setFormData] = useState({
  name: 'Standard',
  beds: '2 Single Beds',
  capacity: 2,
  totalRooms: 0,
  amenities: ['WiFi', 'TV', 'Room Service'],
  description: '',
  images: []  // Added
});
```

#### New UI Section
Added image input section with:
- Input field for Google Drive links or image URLs
- "Add" button to add images to the list
- Image preview with thumbnails
- Remove button for each image
- Helpful tip text

## How to Use

### For Room Types

1. **Go to Room Type Management**
   - Navigate to Owner Dashboard → Room Types

2. **Add/Edit Room Type**
   - Click "Add Room Type" or "Edit" on existing room type

3. **Add Images**
   - Scroll to "Room Images (Google Drive Links)" section
   - Paste a Google Drive share link or direct image URL
   - Click "Add" button
   - Image will appear in the preview list below

4. **Remove Images**
   - Click the X button next to any image to remove it

5. **Save**
   - Click "Add Room Type" or "Update Room Type"
   - Images are saved to database as JSON array

### Google Drive Link Format

#### Option 1: Google Drive Share Link
```
https://drive.google.com/file/d/1ABC123xyz/view?usp=sharing
```
The system automatically converts this to:
```
https://drive.google.com/uc?export=view&id=1ABC123xyz
```

#### Option 2: Direct Image URL
```
https://example.com/image.jpg
https://i.imgur.com/abc123.jpg
```

### How to Get Google Drive Link

1. **Upload image to Google Drive**
2. **Right-click the image** → "Get link"
3. **Change permissions** to "Anyone with the link can view"
4. **Copy the link**
5. **Paste in the image input field**

## Database Storage

Images are stored as JSON array in the database:
```json
["https://drive.google.com/uc?export=view&id=ABC123", "https://example.com/image2.jpg"]
```

## Backend Support

The backend already supports image arrays:
- `HotelDTO.images` - List<String>
- `RoomTypeDTO.images` - List<String>
- Stored as JSON in database (TEXT/JSON column)

## Features

### ✅ Implemented
- Add multiple images per room type
- Google Drive link auto-conversion
- Image preview with thumbnails
- Remove individual images
- Edit existing images
- Images saved to database

### 🔄 To Be Implemented (Optional)
- Same functionality for Hotel images in HotelOwnerCRUD
- Image validation (check if URL is accessible)
- Image reordering (drag and drop)
- Set primary/cover image
- Image compression/optimization

## Testing

### Test Room Type Images
1. Create/edit a room type
2. Add Google Drive link: `https://drive.google.com/file/d/YOUR_FILE_ID/view`
3. Click Add
4. Verify image appears in preview
5. Save room type
6. Check database: `SELECT id, name, images FROM room_types;`
7. Verify JSON array is stored correctly

### Test Image Display
1. Go to hotel details page
2. Verify room type images display correctly
3. Check if Google Drive images load properly

## Troubleshooting

### Image Not Loading
- **Issue**: Image shows placeholder
- **Solution**: 
  - Ensure Google Drive link has public access
  - Check if file ID is correct
  - Try direct image URL instead

### Google Drive Link Not Converting
- **Issue**: Link doesn't work
- **Solution**:
  - Use format: `https://drive.google.com/file/d/FILE_ID/view`
  - Ensure FILE_ID is extracted correctly
  - Check browser console for errors

## Files Modified
- ✅ `frontend/src/pages/admin/RoomTypeManagement.jsx`

## Files To Modify (Next Steps)
- ⏳ `frontend/src/pages/admin/HotelOwnerCRUD.jsx` - Add same functionality for hotels
- ⏳ `frontend/src/pages/HotelDetails.jsx` - Display room type images
- ⏳ `frontend/src/pages/SearchResults.jsx` - Display hotel images from Drive

## Status
✅ **Room Type Images**: COMPLETE
⏳ **Hotel Images**: Pending (same implementation needed)
