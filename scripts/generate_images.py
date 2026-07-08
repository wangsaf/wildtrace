#!/usr/bin/env python3
"""Generate cute kawaii animal images for WildTrace using Pollinations.ai"""
import os, time, json, logging, requests
from pathlib import Path
from urllib.parse import quote
from PIL import Image
from io import BytesIO

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(message)s')
log = logging.getLogger(__name__)

BASE_DIR = Path.home() / "wildtrace-images"
SHEET_DIR = BASE_DIR / "sheets"
FRAME_SIZE = 1024
COLS, ROWS = 5, 4  # 20 frames per sheet

# All 24 animals
ANIMALS = [
    # Forest
    {"id": "tiger", "name": "Sumatran Tiger", "emoji": "🐅", "color": "orange with black stripes", "habitat": "forest"},
    {"id": "orangutan", "name": "Orangutan", "emoji": "🦧", "color": "reddish-brown fur", "habitat": "forest"},
    {"id": "elephant", "name": "Borneo Pygmy Elephant", "emoji": "🐘", "color": "grey with big ears", "habitat": "forest"},
    {"id": "rhino", "name": "Sumatran Rhinoceros", "emoji": "🦏", "color": "dark grey with horn", "habitat": "forest"},
    {"id": "macaw", "name": "Hyacinth Macaw", "emoji": "🦜", "color": "bright blue feathers", "habitat": "forest"},
    {"id": "monkey", "name": "Golden Snub-nosed Monkey", "emoji": "🐒", "color": "golden fur", "habitat": "forest"},
    # Ocean
    {"id": "whale", "name": "Blue Whale", "emoji": "🐋", "color": "blue-grey", "habitat": "ocean"},
    {"id": "turtle", "name": "Hawksbill Turtle", "emoji": "🐢", "color": "green shell", "habitat": "ocean"},
    {"id": "vaquita", "name": "Vaquita", "emoji": "🐬", "color": "grey with dark patches", "habitat": "ocean"},
    {"id": "shark", "name": "Whale Shark", "emoji": "🦈", "color": "grey with white spots", "habitat": "ocean"},
    {"id": "penguin", "name": "Emperor Penguin", "emoji": "🐧", "color": "black and white with yellow chest", "habitat": "ocean"},
    {"id": "octopus", "name": "Blue-ringed Octopus", "emoji": "🐙", "color": "yellow with blue rings", "habitat": "ocean"},
    # Arctic
    {"id": "leopard", "name": "Snow Leopard", "emoji": "🐆", "color": "white-grey with spots", "habitat": "arctic"},
    {"id": "fox", "name": "Arctic Fox", "emoji": "🦊", "color": "white fluffy fur", "habitat": "arctic"},
    {"id": "polar_bear", "name": "Polar Bear", "emoji": "🐻‍❄️", "color": "white fur", "habitat": "arctic"},
    {"id": "caribou", "name": "Caribou", "emoji": "🦌", "color": "brown with antlers", "habitat": "arctic"},
    {"id": "walrus", "name": "Walrus", "emoji": "🦭", "color": "brown-grey with tusks", "habitat": "arctic"},
    {"id": "wolf", "name": "Arctic Wolf", "emoji": "🐺", "color": "white fur", "habitat": "arctic"},
    # Savanna
    {"id": "giraffe", "name": "Giraffe", "emoji": "🦒", "color": "yellow with brown spots", "habitat": "savanna"},
    {"id": "lion", "name": "Lion", "emoji": "🦁", "color": "golden with mane", "habitat": "savanna"},
    {"id": "african_elephant", "name": "African Elephant", "emoji": "🐘", "color": "grey with big ears", "habitat": "savanna"},
    # Rainforest
    {"id": "chameleon", "name": "Chameleon", "emoji": "🦎", "color": "green changing colors", "habitat": "rainforest"},
    {"id": "toucan", "name": "Toucan", "emoji": "🦜", "color": "black with colorful beak", "habitat": "rainforest"},
    {"id": "spider_monkey", "name": "Spider Monkey", "emoji": "🐒", "color": "black with long tail", "habitat": "rainforest"},
]

# Frame prompts for each pose
POSES = [
    ("idle1", "standing still, looking forward, relaxed happy pose"),
    ("idle2", "standing still, slight head tilt to the right, relaxed"),
    ("idle3", "standing still, looking to the left, curious expression"),
    ("idle4", "standing still, looking to the right, relaxed"),
    ("blink1", "eyes wide open, looking forward, alert"),
    ("blink2", "eyes closed, gentle smile, peaceful"),
    ("breathe1", "chest expanded, inhaling, body slightly larger"),
    ("breathe2", "chest normal, exhaling, body slightly smaller"),
    ("breathe3", "chest expanded again, inhaling deeply"),
    ("breathe4", "chest normal, exhaling, relaxed"),
    ("tail1", "tail or body element positioned to the left"),
    ("tail2", "tail or body element positioned to the right"),
    ("eat1", "mouth wide open, ready to eat, excited"),
    ("eat2", "food entering mouth, cheeks puffing up"),
    ("eat3", "chewing with full cheeks, happy eyes"),
    ("eat4", "swallowing, licking lips, satisfied"),
    ("happy1", "eyes closed smiling, hearts floating around"),
    ("happy2", "slightly bigger, belly round, content and satisfied"),
    ("wave1", "waving with right hand/paw, friendly greeting"),
    ("wave2", "both hands/paws up, excited greeting"),
]

BASE_PROMPT = "cute kawaii cartoon {animal}, {color}, thick black outline, flat color style, big sparkly eyes, chubby rosy cheeks, simple soft shading, transparent background, children's book illustration style, high quality, detailed, 4k, centered composition"

def download_image(prompt, path, retries=3):
    """Download from Pollinations.ai"""
    encoded = quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width={FRAME_SIZE}&height={FRAME_SIZE}&seed={os.urandom(4).hex()}&nologo=true"
    
    for attempt in range(retries):
        try:
            resp = requests.get(url, timeout=180, stream=True)
            resp.raise_for_status()
            data = resp.content
            if len(data) < 5000:
                log.warning(f"  Image too small ({len(data)}B), retry {attempt+1}")
                time.sleep(2)
                continue
            with open(path, 'wb') as f:
                f.write(data)
            return True
        except Exception as e:
            log.warning(f"  Attempt {attempt+1} failed: {e}")
            time.sleep(3)
    return False

def create_sprite_sheet(animal_id, frames_dir, output_path):
    """Combine frames into sprite sheet (5 cols x 4 rows)"""
    sheet = Image.new('RGBA', (COLS * FRAME_SIZE, ROWS * FRAME_SIZE), (0, 0, 0, 0))
    
    for idx, (pose_name, _) in enumerate(POSES):
        frame_path = frames_dir / f"{pose_name}.png"
        if not frame_path.exists():
            continue
        try:
            img = Image.open(frame_path).convert('RGBA')
            img = img.resize((FRAME_SIZE, FRAME_SIZE), Image.LANCZOS)
            col = idx % COLS
            row = idx // COLS
            sheet.paste(img, (col * FRAME_SIZE, row * FRAME_SIZE), img)
        except Exception as e:
            log.warning(f"  Error processing frame {pose_name}: {e}")
    
    sheet.save(output_path, 'PNG', optimize=True)
    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    log.info(f"  Sheet saved: {output_path} ({size_mb:.1f}MB)")
    return True

def generate_animal(animal):
    """Generate all frames for one animal"""
    animal_id = animal['id']
    frames_dir = BASE_DIR / "frames" / animal_id
    frames_dir.mkdir(parents=True, exist_ok=True)
    
    log.info(f"\n{'='*50}")
    log.info(f"Generating: {animal['emoji']} {animal['name']}")
    log.info(f"{'='*50}")
    
    base = BASE_PROMPT.format(animal=animal['name'], color=animal['color'])
    completed = 0
    
    for idx, (pose_name, pose_desc) in enumerate(POSES):
        frame_path = frames_dir / f"{pose_name}.png"
        if frame_path.exists() and os.path.getsize(frame_path) > 5000:
            log.info(f"  [{idx+1}/20] {pose_name} - SKIP (exists)")
            completed += 1
            continue
        
        prompt = f"{base}, {pose_desc}"
        log.info(f"  [{idx+1}/20] {pose_name} - downloading...")
        
        if download_image(prompt, frame_path):
            log.info(f"  [{idx+1}/20] {pose_name} - OK")
            completed += 1
        else:
            log.error(f"  [{idx+1}/20] {pose_name} - FAILED")
        
        time.sleep(1.5)  # Rate limit
    
    # Create sprite sheet
    sheet_path = SHEET_DIR / f"{animal_id}_sheet.png"
    log.info(f"  Creating sprite sheet...")
    create_sprite_sheet(animal_id, frames_dir, sheet_path)
    
    return completed

def main():
    log.info("=" * 60)
    log.info("WildTrace Animal Image Generator")
    log.info(f"Total: {len(ANIMALS)} animals × 20 frames = {len(ANIMALS)*20} images")
    log.info("=" * 60)
    
    BASE_DIR.mkdir(parents=True, exist_ok=True)
    SHEET_DIR.mkdir(parents=True, exist_ok=True)
    
    # Progress tracking
    progress_file = BASE_DIR / "progress.json"
    progress = {}
    if progress_file.exists():
        progress = json.loads(progress_file.read_text())
    
    total_ok = 0
    total_fail = 0
    
    for animal in ANIMALS:
        aid = animal['id']
        if progress.get(aid, {}).get('done'):
            log.info(f"\n{animal['emoji']} {animal['name']} - ALREADY DONE")
            total_ok += 20
            continue
        
        ok = generate_animal(animal)
        total_ok += ok
        total_fail += (20 - ok)
        
        progress[aid] = {'done': ok == 20, 'frames': ok}
        progress_file.write_text(json.dumps(progress, indent=2))
    
    log.info(f"\n{'='*60}")
    log.info(f"DONE! Success: {total_ok}, Failed: {total_fail}")
    log.info(f"Sheets in: {SHEET_DIR}")
    log.info(f"{'='*60}")
    
    # Write completion marker
    (BASE_DIR / "GENERATION_COMPLETE").write_text(f"done:{total_ok}:fail:{total_fail}")

if __name__ == "__main__":
    main()
