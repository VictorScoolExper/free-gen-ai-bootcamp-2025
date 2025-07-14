import random
import string

def generate_random_username(prefix="testuser", length=8):
    """
    Generate a random username with a given prefix and random string.
    """
    rand_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))
    return f"{prefix}_{rand_str}"

def generate_random_phone_number():
    """
    Generate a random phone number in the format 123-456-7890.
    """
    area_code = random.randint(100, 999)
    central_office_code = random.randint(100, 999)
    line_number = random.randint(1000, 9999)
    return f"{area_code}-{central_office_code}-{line_number}"
