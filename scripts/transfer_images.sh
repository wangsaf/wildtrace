#!/bin/bash
# Transfer WildTrace images from VPS-250 to VPS-239
# Runs after generation completes

LOGFILE=~/wildtrace-images/transfer.log
MARKER=~/wildtrace-images/GENERATION_COMPLETE

echo "$(date) - Checking generation status..." >> $LOGFILE

if [ ! -f "$MARKER" ]; then
    echo "$(date) - Generation not complete yet. Skipping." >> $LOGFILE
    exit 0
fi

echo "$(date) - Generation complete! Starting transfer..." >> $LOGFILE

# Create target dir
ssh vps239 "mkdir -p ~/projects/wildtrace/public/images/sheets ~/projects/wildtrace/public/images/sounds"

# Transfer sprite sheets
echo "$(date) - Transferring sprite sheets..." >> $LOGFILE
scp ~/wildtrace-images/sheets/*.png vps239:~/projects/wildtrace/public/images/sheets/ >> $LOGFILE 2>&1

# Transfer sounds (when available)
if ls ~/wildtrace-images/sounds/*.mp3 1>/dev/null 2>&1; then
    echo "$(date) - Transferring sounds..." >> $LOGFILE
    scp ~/wildtrace-images/sounds/*.mp3 vps239:~/projects/wildtrace/public/images/sounds/ >> $LOGFILE 2>&1
fi

# Verify
COUNT=$(ssh vps239 "ls ~/projects/wildtrace/public/images/sheets/*.png 2>/dev/null | wc -l")
echo "$(date) - Transfer complete! $COUNT sheets on VPS-239" >> $LOGFILE

# Mark transfer done
touch ~/wildtrace-images/TRANSFER_COMPLETE
echo "$(date) - TRANSFER_COMPLETE marker created" >> $LOGFILE
