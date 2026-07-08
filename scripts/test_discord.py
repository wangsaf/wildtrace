import requests, json

webhook = "https://discord.com/api/webhooks/1523337123808149674/hu6_ftOEmYTLpmDinPbUIyaswzhx4PL5reI81VosAnsSH3ogbC4hRXhZrTwrIc8TkM31"

data = {
    "embeds": [{
        "title": "🐾 WildTrace Image Generator",
        "description": (
            "Image generation started on VPS-250!\n\n"
            "🐅 **24 animals** × 20 frames = 480 images\n"
            "🍎 **6 foods** × 3 variants = 18 images\n\n"
            "Total: **498 images** generating in background.\n"
            "Estimated: ~2-3 hours\n"
            "Will notify when complete! 🎨"
        ),
        "color": 5814783
    }]
}

r = requests.post(webhook, json=data)
print(f"Status: {r.status_code}")
print(f"Response: {r.text}")
