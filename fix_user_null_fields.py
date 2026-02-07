import mysql.connector
from datetime import datetime

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root',
    'database': 'hotel_booking_db'
}

def check_and_fix_null_fields():
    """Check for users with NULL DOB or address and fix them"""
    try:
        # Connect to database
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        
        print("=" * 60)
        print("Checking for users with NULL DOB or address...")
        print("=" * 60)
        
        # Check for NULL values
        cursor.execute("""
            SELECT user_id, email, first_name, last_name, dob, address 
            FROM users 
            WHERE dob IS NULL OR address IS NULL OR address = ''
        """)
        
        users_with_null = cursor.fetchall()
        
        if not users_with_null:
            print("✅ No users found with NULL DOB or address!")
            print("All users have valid data.")
            return
        
        print(f"⚠️  Found {len(users_with_null)} user(s) with NULL values:\n")
        
        for user in users_with_null:
            print(f"User ID: {user['user_id']}")
            print(f"  Email: {user['email']}")
            print(f"  Name: {user['first_name']} {user['last_name']}")
            print(f"  DOB: {user['dob'] if user['dob'] else '❌ NULL'}")
            print(f"  Address: {user['address'] if user['address'] else '❌ NULL/EMPTY'}")
            print()
        
        # Ask for confirmation
        response = input("Do you want to fix these users? (yes/no): ").strip().lower()
        
        if response != 'yes':
            print("Operation cancelled.")
            return
        
        # Fix NULL DOB values
        cursor.execute("""
            UPDATE users 
            SET dob = '1990-01-01' 
            WHERE dob IS NULL
        """)
        dob_updated = cursor.rowcount
        
        # Fix NULL or empty address values
        cursor.execute("""
            UPDATE users 
            SET address = 'Not provided' 
            WHERE address IS NULL OR address = ''
        """)
        address_updated = cursor.rowcount
        
        # Commit changes
        conn.commit()
        
        print("\n" + "=" * 60)
        print("✅ Fix completed!")
        print("=" * 60)
        print(f"Updated {dob_updated} user(s) with NULL DOB")
        print(f"Updated {address_updated} user(s) with NULL/empty address")
        
        # Verify the fix
        cursor.execute("""
            SELECT COUNT(*) as count
            FROM users 
            WHERE dob IS NULL OR address IS NULL OR address = ''
        """)
        
        result = cursor.fetchone()
        remaining = result['count']
        
        if remaining == 0:
            print("\n✅ All users now have valid DOB and address!")
        else:
            print(f"\n⚠️  Warning: {remaining} user(s) still have NULL values")
        
    except mysql.connector.Error as err:
        print(f"❌ Database error: {err}")
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    print("\n🔧 User Fields Fix Script")
    print("This script will check and fix users with NULL DOB or address\n")
    check_and_fix_null_fields()
    print("\n✅ Script completed!")
