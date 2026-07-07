#!/bin/bash
TOKEN=$(curl -s -X POST http://localhost:81/api/tokens -H "Content-Type: application/json" -d '{"identity":"admin@example.com","secret":"changeme"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# Request SSL certificate
curl -s -X POST http://localhost:81/api/nginx/certificates -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{
  "domain_names": ["wildtrace.spectriad.com"],
  "meta": {"letsencrypt_email": "admin@spectriad.com", "letsencrypt_agree": true},
  "provider": "letsencrypt"
}'

# Update proxy host with SSL
curl -s -X PUT http://localhost:81/api/nginx/proxy-hosts/10 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{
  "domain_names": ["wildtrace.spectriad.com"],
  "forward_scheme": "http",
  "forward_host": "172.19.0.1",
  "forward_port": 3010,
  "ssl_forced": true,
  "http2_support": true,
  "block_exploits": true,
  "certificate_id": 0
}'
